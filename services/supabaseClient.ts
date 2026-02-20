import { createClient } from '@supabase/supabase-js';

// In Vite, environment variables must be accessed via import.meta.env and prefixed with VITE_
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if keys are present
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

if (!supabase) {
  console.log("%c MindBridge: Running in Demo Mode (No Supabase Keys found)", "background: #fef3c7; color: #d97706; padding: 4px; border-radius: 4px;");
} else {
  console.log("%c MindBridge: Connected to Supabase", "background: #dcfce7; color: #166534; padding: 4px; border-radius: 4px;");
}