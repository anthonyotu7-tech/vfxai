import type { VercelRequest, VercelResponse } from '@vercel/node';

// ⚠️ TEMPORARY: Replace with your actual user ID from Supabase
const TEST_USER_ID = '7ad026ce-d69f-44a0-a016-b137526d0d9a';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!REPLICATE_API_TOKEN) return res.status(500).json({ error: 'Replicate API token not configured' });
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

    // ⚠️ TEMPORARY: Use test user ID instead of validating token
    const userId = TEST_USER_ID;

    const body = req.body;
    const { prompt, duration = 5, aspectRatio = '16:9' } = body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const totalCostCredits = Math.ceil(duration * 5);

    const creditsResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=credits`, {
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });
    const creditsData = await creditsResponse.json();
    if (!creditsData || creditsData.length === 0) return res.status(404).json({ error: 'User not found' });

    const userCredits = creditsData[0].credits;
    if (userCredits < totalCostCredits) return res.status(400).json({ error: `Insufficient credits. Need ${totalCostCredits}, have ${userCredits}` });

    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'runwayml/gen4-turbo', input: { prompt, duration, aspect_ratio: aspectRatio } })
    });

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text();
      return res.status(500).json({ error: `Replicate error: ${errorText}` });
    }
    const replicateData = await replicateResponse.json();

    await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ credits: userCredits - totalCostCredits }),
    });

    await fetch(`${SUPABASE_URL}/rest/v1/video_generations`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, model_id: 'runway-gen4-turbo', prompt, duration, aspect_ratio: aspectRatio, prediction_id: replicateData.id, status: 'queued', credits_deducted: totalCostCredits }),
    });

    return res.status(200).json({ success: true, predictionId: replicateData.id });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}