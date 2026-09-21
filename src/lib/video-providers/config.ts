import { IVideoProvider } from './types';
import { ReplicateProvider } from './replicate';

export interface VideoModelConfig {
  id: string;
  displayName: string;
  provider: IVideoProvider;
  maxDuration: number;
  supportedResolutions: string[];
  supportsImageToVideo: boolean;
}

// Initialize provider with server-side env var
const replicateProvider = new ReplicateProvider(process.env.REPLICATE_API_TOKEN || '');

export const VIDEO_MODELS: Record<string, VideoModelConfig> = {
  'runway-gen4-turbo': {
    id: 'runway-gen4-turbo',
    displayName: 'Runway Gen-4 Turbo',
    provider: replicateProvider,
    maxDuration: 10,
    supportedResolutions: ['720p'],
    supportsImageToVideo: true,
  },
  // Add PixVerse or others here later without changing the API routes
};

export const DEFAULT_MODEL_ID = 'runway-gen4-turbo';