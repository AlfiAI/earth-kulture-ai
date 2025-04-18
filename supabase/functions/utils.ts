
import { createClient as createSupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Create Supabase client for storing data
export const createClient = (supabaseUrl: string, supabaseKey: string) => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};
