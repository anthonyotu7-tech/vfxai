import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!REPLICATE_API_TOKEN) return res.status(500).json({ error: 'Replicate API token not configured' });
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

    const predictionId = req.query.id as string;
    if (!predictionId) return res.status(400).json({ error: 'Missing prediction ID' });

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No auth token' });

    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_SERVICE_ROLE_KEY },
    });
    if (!authResponse.ok) return res.status(401).json({ error: 'Invalid token' });
    const userData = await authResponse.json();
    const userId = userData.id;

    const genResponse = await fetch(`${SUPABASE_URL}/rest/v1/video_generations?prediction_id=eq.${predictionId}&user_id=eq.${userId}&select=*`, {
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });
    const genData = await genResponse.json();
    if (!genData || genData.length === 0) return res.status(404).json({ error: 'Generation not found' });
    const generation = genData[0];

    if (generation.status === 'succeeded' || generation.status === 'failed') return res.status(200).json(generation);

    const replicateResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` },
    });
    const replicateData = await replicateResponse.json();

    let newStatus = 'processing';
    if (replicateData.status === 'starting') newStatus = 'queued';
    else if (replicateData.status === 'succeeded') newStatus = 'succeeded';
    else if (replicateData.status === 'failed') newStatus = 'failed';

    if (newStatus !== generation.status) {
      const updateData: any = { status: newStatus };
      if (replicateData.output) updateData.video_url = replicateData.output;
      if (replicateData.error) updateData.error_message = replicateData.error;

      await fetch(`${SUPABASE_URL}/rest/v1/video_generations?id=eq.${generation.id}`, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (newStatus === 'failed' && generation.credits_deducted > 0) {
        const userRes = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=credits`, {
          headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
        });
        const userData2 = await userRes.json();
        if (userData2 && userData2.length > 0) {
          await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ credits: userData2[0].credits + generation.credits_deducted }),
          });
        }
      }
    }
    return res.status(200).json({ ...generation, status: newStatus, video_url: replicateData.output || generation.video_url });
  } catch (error: any) {
    console.error('Status error:', error);
    return res.status(500).json({ error: error.message });
  }
}