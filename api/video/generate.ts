import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { VIDEO_MODELS } from '../../src/lib/video-providers/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No auth token' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const body = req.body;
    const modelConfig = VIDEO_MODELS[body.modelId];

    if (!modelConfig) {
      return res.status(400).json({ error: 'Invalid model' });
    }

    const totalCostCredits = Math.ceil(body.duration * 5);

    const { data: userData } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userData.credits < totalCostCredits) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    const predictionResult = await modelConfig.provider.startGeneration(body);

    await supabase
      .from('users')
      .update({ credits: userData.credits - totalCostCredits })
      .eq('id', user.id);

    await supabase.from('video_generations').insert({
      user_id: user.id,
      model_id: body.modelId,
      prompt: body.prompt,
      duration: body.duration,
      aspect_ratio: body.aspectRatio,
      prediction_id: predictionResult.predictionId,
      status: predictionResult.status,
      credits_deducted: totalCostCredits,
    });

    return res.status(200).json({
      success: true,
      predictionId: predictionResult.predictionId,
    });

  } catch (error: any) {
    console.error('Generate error:', error);
    return res.status(500).json({ error: error.message });
  }
}