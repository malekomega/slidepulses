import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://unlwrjjpfyrkhdaiufum.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_DgpKgApBJYvi1E1EKGQm_A_LSjHAu6C";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
