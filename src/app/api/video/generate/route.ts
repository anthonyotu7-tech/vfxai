import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Adjust path to your server client
import { VIDEO_MODELS } from '@/lib/video-providers/config';
import { VideoGenerationInput } from '@/lib/video-providers/types';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: VideoGenerationInput = await request.json();
    const modelConfig = VIDEO_MODELS[body.modelId];

    if (!modelConfig) {
      return NextResponse.json({ error: 'Invalid model selected' }, { status: 400 });
    }

    // 1. Calculate Cost (Assuming 1 Credit = $0.01 USD. Runway is $0.05/sec = 5 credits/sec)
    const CREDIT_VALUE = 0.01; 
    const costPerSecondCredits = modelConfig.provider.getCostPerSecond() / CREDIT_VALUE;
    const totalCostCredits = Math.ceil(body.duration * costPerSecondCredits);

    // 2. Check User Balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (userData.credits < totalCostCredits) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // 3. Call Replicate API (Do NOT deduct credits yet)
    let predictionResult;
    try {
      predictionResult = await modelConfig.provider.startGeneration(body);
    } catch (apiError: any) {
      // If Replicate rejects the job immediately, DO NOT deduct credits
      return NextResponse.json({ error: apiError.message || 'Video generation failed to start' }, { status: 500 });
    }

    // 4. Deduct Credits
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        credits: userData.credits - totalCostCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }

    // 5. Insert Generation Record
    const { error: insertError } = await supabase
      .from('video_generations')
      .insert({
        user_id: user.id,
        model_id: body.modelId,
        prompt: body.prompt,
        image_url: body.imageUrl,
        duration: body.duration,
        aspect_ratio: body.aspectRatio,
        prediction_id: predictionResult.predictionId,
        status: predictionResult.status,
        credits_deducted: totalCostCredits,
      });

    if (insertError) {
      // Rollback credits if DB insert fails
      await supabase.from('users').update({ credits: userData.credits }).eq('id', user.id);
      return NextResponse.json({ error: 'Failed to save generation record' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      predictionId: predictionResult.predictionId,
      creditsDeducted: totalCostCredits 
    });

  } catch (error) {
    console.error('Generation route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}