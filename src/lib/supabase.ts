import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = (envUrl && envUrl !== 'YOUR_SUPABASE_URL') ? envUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = (envKey && envKey !== 'YOUR_SUPABASE_ANON_KEY') ? envKey : 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
