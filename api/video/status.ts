import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { VIDEO_MODELS } from '../lib/video-providers/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const predictionId = req.query.id as string;
    if (!predictionId) {
      return res.status(400).json({ error: 'Missing ID' });
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: generation } = await supabase
      .from('video_generations')
      .select('*')
      .eq('prediction_id', predictionId)
      .eq('user_id', user.id)
      .single();

    if (!generation) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (generation.status === 'succeeded' || generation.status === 'failed') {
      return res.status(200).json(generation);
    }

    const modelConfig = VIDEO_MODELS[generation.model_id];
    const result = await modelConfig.provider.checkStatus(predictionId);

    if (result.status !== generation.status) {
      await supabase.from('video_generations').update({
        status: result.status,
        video_url: result.videoUrl,
        error_message: result.errorMessage,
      }).eq('id', generation.id);

      if (result.status === 'failed' && generation.credits_deducted > 0) {
        const { data: userData } = await supabase
          .from('users')
          .select('credits')
          .eq('id', user.id)
          .single();
        if (userData) {
          await supabase.from('users').update({
            credits: userData.credits + generation.credits_deducted,
          }).eq('id', user.id);
        }
      }
    }

    return res.status(200).json({
      ...generation,
      status: result.status,
      video_url: result.videoUrl,
    });

  } catch (error: any) {
    console.error('Status error:', error);
    return res.status(500).json({ error: error.message });
  }
}