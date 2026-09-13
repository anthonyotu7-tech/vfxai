import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export this so useAuth.tsx doesn't crash
export const isSupabaseEnabled = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseEnabled) {
  console.error('❌ Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');