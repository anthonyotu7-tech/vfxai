import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseEnabled = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseEnabled) {
  console.warn('⚠️ Supabase environment variables not configured. Using demo mode.');
}

// Only create client if we have valid values
export const supabase = isSupabaseEnabled 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;