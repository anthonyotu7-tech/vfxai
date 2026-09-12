import type { Avatar, VideoProject, Template } from '@/types';

export const MOCK_AVATARS: Avatar[] = [
  {
    id: 'a1', user_id: 'u1', name: 'Nova', voice: 'Female — Warm',
    expression: 'Friendly', clothing: 'Business', background: 'Studio',
    style: 'Realistic', 
    thumbnail_url: 'https://ui-avatars.com/api/?name=Nova&background=a855f7&color=fff&size=400',
    status: 'ready', created_at: '2026-08-12',
  },
  {
    id: 'a2', user_id: 'u1', name: 'Orion', voice: 'Male — Deep',
    expression: 'Confident', clothing: 'Casual', background: 'Neon City',
    style: 'Cinematic', 
    thumbnail_url: 'https://ui-avatars.com/api/?name=Orion&background=3b82f6&color=fff&size=400',
    status: 'ready', created_at: '2026-08-20',
  },
  {
    id: 'a3', user_id: 'u1', name: 'Lyra', voice: 'Female — Bright',
    expression: 'Playful', clothing: 'Streetwear', background: 'Abstract',
    style: 'Social Media', 
    thumbnail_url: 'https://ui-avatars.com/api/?name=Lyra&background=ec4899&color=fff&size=400',
    status: 'ready', created_at: '2026-09-01',
  },
];

export const MOCK_PROJECTS: VideoProject[] = [
  {
    id: 'p1', user_id: 'u1', title: 'Product Advertisement',
    prompt: 'Cinematic ad for a new smartphone', style: 'Advertisement',
    duration_sec: 15, aspect_ratio: '16:9',
    thumbnail_url: 'https://ui-avatars.com/api/?name=Product&background=3b82f6&color=fff&size=400',
    status: 'completed', credits_used: 20, created_at: '2026-09-02',
  },
  {
    id: 'p2', user_id: 'u1', title: 'AI News Presenter',
    prompt: 'News anchor introducing weekly tech digest', style: 'News',
    duration_sec: 30, aspect_ratio: '16:9',
    thumbnail_url: 'https://ui-avatars.com/api/?name=News&background=8b5cf6&color=fff&size=400',
    status: 'completed', credits_used: 20, created_at: '2026-09-04',
  },
  {
    id: 'p3', user_id: 'u1', title: 'Gaming Intro',
    prompt: 'High-energy gaming channel intro', style: 'Gaming',
    duration_sec: 10, aspect_ratio: '16:9',
    thumbnail_url: 'https://ui-avatars.com/api/?name=Gaming&background=ec4899&color=fff&size=400',
    status: 'processing', credits_used: 20, created_at: '2026-09-09',
  },
  {
    id: 'p4', user_id: 'u1', title: 'Social Media Promo',
    prompt: 'Vertical promo for a fashion drop', style: 'Social Media',
    duration_sec: 15, aspect_ratio: '9:16',
    thumbnail_url: 'https://ui-avatars.com/api/?name=Social&background=22d3ee&color=fff&size=400',
    status: 'completed', credits_used: 20, created_at: '2026-09-08',
  },
];

export const MOCK_TEMPLATES: Template[] = [
  { id: 't1', title: 'TikTok Promo', category: 'Social', thumbnail_url: 'https://ui-avatars.com/api/?name=TikTok&background=ec4899&color=fff&size=400', aspect_ratio: '9:16', description: 'Vertical promo optimized for TikTok.' },
  { id: 't2', title: 'YouTube Intro', category: 'Intro', thumbnail_url: 'https://ui-avatars.com/api/?name=YouTube&background=ef4444&color=fff&size=400', aspect_ratio: '16:9', description: 'Channel intro with dynamic transitions.' },
  { id: 't3', title: 'Product Advertisement', category: 'Ads', thumbnail_url: 'https://ui-avatars.com/api/?name=Ads&background=3b82f6&color=fff&size=400', aspect_ratio: '16:9', description: 'Cinematic product showcase.' },
  { id: 't4', title: 'AI News Presenter', category: 'News', thumbnail_url: 'https://ui-avatars.com/api/?name=News&background=8b5cf6&color=fff&size=400', aspect_ratio: '16:9', description: 'Professional AI news anchor.' },
  { id: 't5', title: 'Gaming Video', category: 'Gaming', thumbnail_url: 'https://ui-avatars.com/api/?name=Gaming&background=ec4899&color=fff&size=400', aspect_ratio: '16:9', description: 'High-energy gaming content.' },
  { id: 't6', title: 'Instagram Reel', category: 'Social', thumbnail_url: 'https://ui-avatars.com/api/?name=Reel&background=f59e0b&color=fff&size=400', aspect_ratio: '9:16', description: 'Trendy reel with music cues.' },
  { id: 't7', title: 'Business Presentation', category: 'Corporate', thumbnail_url: 'https://ui-avatars.com/api/?name=Biz&background=10b981&color=fff&size=400', aspect_ratio: '16:9', description: 'Clean corporate explainer.' },
];