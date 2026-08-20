import { createClient } from '@supabase/supabase-js'

// Not wired into the app yet - authStore.js still uses mock login. This client is prepared
// so real Supabase auth can be wired in later without a from-scratch setup. Needs a real anon
// key (Supabase dashboard -> Connect -> API Keys -> anon/public) in .env before it's usable;
// see .env.example.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
