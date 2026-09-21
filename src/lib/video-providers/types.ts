// Strictly for Asynchronous Video Generation. 
// NOT for AI Video Calls or Live Studio.

export type AspectRatio = '16:9' | '9:16' | '1:1';
export type GenerationStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

export interface VideoGenerationInput {
  modelId: string;
  prompt: string;
  duration: number; // 5 or 10
  aspectRatio: AspectRatio;
  imageUrl?: string; // Optional for Image-to-Video
}

export interface VideoGenerationResult {
  predictionId: string;
  status: GenerationStatus;
  videoUrl?: string;
  errorMessage?: string;
}

export interface IVideoProvider {
  startGeneration(input: VideoGenerationInput): Promise<VideoGenerationResult>;
  checkStatus(predictionId: string): Promise<VideoGenerationResult>;
  getCostPerSecond(): number;
}