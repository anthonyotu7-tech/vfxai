import { IVideoProvider, VideoGenerationInput, VideoGenerationResult } from './types';

export class ReplicateProvider implements IVideoProvider {
  private apiKey: string;
  private readonly COST_PER_SECOND = 0.05;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getCostPerSecond(): number {
    return this.COST_PER_SECOND;
  }

  async startGeneration(input: VideoGenerationInput): Promise<VideoGenerationResult> {
    if (!this.apiKey) throw new Error('Replicate API token not configured');

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({
        model: 'runwayml/gen4-turbo',
        input: {
          prompt: input.prompt,
          image: input.imageUrl || undefined,
          duration: input.duration,
          aspect_ratio: input.aspectRatio,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Replicate API Error: ${errorData}`);
    }

    const data = await response.json();
    return {
      predictionId: data.id,
      status: data.status === 'starting' ? 'queued' : 'processing',
    };
  }

  async checkStatus(predictionId: string): Promise<VideoGenerationResult> {
    if (!this.apiKey) throw new Error('Replicate API token not configured');

    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Token ${this.apiKey}` }
    });

    if (!response.ok) throw new Error('Failed to fetch prediction status');
    
    const data = await response.json();
    
    let status: 'queued' | 'processing' | 'succeeded' | 'failed' = 'processing';
    if (data.status === 'starting') status = 'queued';
    else if (data.status === 'succeeded') status = 'succeeded';
    else if (data.status === 'failed') status = 'failed';

    return {
      predictionId,
      status,
      videoUrl: data.output || undefined,
      errorMessage: data.error || undefined,
    };
  }
}