export interface GenerationProgress {
  stage: 'preparing' | 'processing' | 'complete' | 'failed';
  percent: number;
  message: string;
}

export interface GenerateAvatarParams {
  name: string;
  voice: string;
  expression: string;
  clothing: string;
  background: string;
  style: string;
  sourceImage?: File;
}

export interface TextToVideoParams {
  prompt: string;
  style: string;
  durationSec: number;
  aspectRatio: string;
  avatarId?: string;
  voice?: string;
}

// Check if real API keys are configured
const REPLICATE_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;
const USE_REAL_AI = REPLICATE_TOKEN && REPLICATE_TOKEN !== 'your_replicate_token_here';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const AI = {
  async generateAvatar(
    params: GenerateAvatarParams,
    onProgress: (p: GenerationProgress) => void,
  ): Promise<{ avatarUrl: string }> {
    if (!USE_REAL_AI) {
      // Mock fallback for demo mode
      const stages = [
        { percent: 20, message: 'Analyzing facial features...' },
        { percent: 50, message: 'Synthesizing 3D mesh...' },
        { percent: 80, message: 'Applying textures and lighting...' },
        { percent: 100, message: 'Finalizing render...' },
      ];
      for (const stage of stages) {
        await sleep(800);
        onProgress({ stage: 'processing', ...stage });
      }
      await sleep(500);
      onProgress({ stage: 'complete', percent: 100, message: 'Done!' });
      
      // Return a high-quality placeholder from Unsplash based on style
      const keywords = params.style.toLowerCase().replace(' ', ',');
      return { avatarUrl: `https://source.unsplash.com/400x400/?portrait,${keywords}` };
    }

    // REAL AI INTEGRATION (Replicate)
    try {
      onProgress({ stage: 'preparing', percent: 10, message: 'Sending to AI model...' });
      
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          input: {
            prompt: `A professional ${params.style} portrait of a person named ${params.name}, wearing ${params.clothing}, ${params.expression} expression, ${params.background} background, high quality, 8k`,
            width: 1024,
            height: 1024,
          }
        }),
      });

      if (!response.ok) throw new Error('Replicate API failed');
      const prediction = await response.json();

      // Poll for result
      let status = prediction.status;
      while (status !== 'succeeded' && status !== 'failed') {
        await sleep(2000);
        const poll = await fetch(prediction.urls.get, {
          headers: { 'Authorization': `Token ${REPLICATE_TOKEN}` }
        });
        const data = await poll.json();
        status = data.status;
        onProgress({ stage: 'processing', percent: 60, message: 'AI is generating...' });
      }

      if (status === 'failed') throw new Error('Generation failed');

      onProgress({ stage: 'complete', percent: 100, message: 'Done!' });
      return { avatarUrl: data.output[0] };

    } catch (error) {
      console.error('Real AI Error:', error);
      throw error;
    }
  },

  async textToVideo(
    params: TextToVideoParams,
    onProgress: (p: GenerationProgress) => void,
  ): Promise<{ videoUrl: string; thumbnailUrl: string }> {
    // Mock fallback for video (Real video APIs are very expensive/slow for demos)
    const stages = [
      { percent: 15, message: 'Generating keyframes...' },
      { percent: 40, message: 'Rendering motion vectors...' },
      { percent: 70, message: 'Encoding video stream...' },
      { percent: 95, message: 'Finalizing output...' },
    ];
    for (const stage of stages) {
      await sleep(1000);
      onProgress({ stage: 'processing', ...stage });
    }
    onProgress({ stage: 'complete', percent: 100, message: 'Done!' });
    
    return { 
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample MP4
      thumbnailUrl: `https://source.unsplash.com/640x360/?cinematic,${params.style}` 
    };
  }
};