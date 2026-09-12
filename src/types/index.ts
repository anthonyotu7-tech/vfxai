export type User = {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
};

export type Avatar = {
  id: string;
  user_id: string;
  name: string;
  voice: string;
  expression: string;
  clothing: string;
  background: string;
  style: string;
  thumbnail_url: string;
  status: 'draft' | 'ready' | 'processing';
  created_at: string;
};

export type VideoProject = {
  id: string;
  user_id: string;
  title: string;
  prompt?: string;
  avatar_id?: string;
  voice?: string;
  style: string;
  duration_sec: number;
  aspect_ratio: '16:9' | '9:16' | '1:1';
  thumbnail_url: string;
  video_url?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  credits_used: number;
  created_at: string;
};

export type CreditTransaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: 'free' | 'creator' | 'pro';
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
};

export type Template = {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string;
  aspect_ratio: '16:9' | '9:16' | '1:1';
  description: string;
};

export type ToastItem = {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
};