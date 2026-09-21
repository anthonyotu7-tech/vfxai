import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { VIDEO_MODELS } from '@/lib/video-providers/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: generation, error: fetchError } = await supabase
      .from('video_generations')
      .select('*')
      .eq('prediction_id', predictionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
    }

    if (generation.status === 'succeeded' || generation.status === 'failed') {
      return NextResponse.json(generation);
    }

    const modelConfig = VIDEO_MODELS[generation.model_id];
    if (!modelConfig) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    const result = await modelConfig.provider.checkStatus(predictionId);

    if (result.status !== generation.status) {
      const updateData: any = { 
        status: result.status, 
        updated_at: new Date().toISOString() 
      };
      
      if (result.videoUrl) updateData.video_url = result.videoUrl;
      if (result.errorMessage) updateData.error_message = result.errorMessage;

      await supabase.from('video_generations').update(updateData).eq('id', generation.id);

      // CRITICAL: If Replicate failed AFTER we deducted credits, REFUND the user
      if (result.status === 'failed' && generation.credits_deducted > 0) {
        const { data: userData } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (userData) {
          await supabase.from('users').update({ 
            credits: userData.credits + generation.credits_deducted 
          }).eq('id', user.id);
        }
      }
    }

    return NextResponse.json({
      ...generation,
      status: result.status,
      video_url: result.videoUrl || generation.video_url,
    });

  } catch (error) {
    console.error('Status route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}