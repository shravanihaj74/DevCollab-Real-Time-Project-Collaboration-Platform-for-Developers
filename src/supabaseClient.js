import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;
try {
  const parsedUrl = supabaseUrl && supabaseUrl.startsWith("http")
    ? supabaseUrl
    : "https://placeholder.supabase.co";

  client = createClient(parsedUrl, supabaseAnonKey || "placeholder");
} catch (err) {
  console.error("Failed to initialize Supabase client:", err);
}

export const supabase = client;
