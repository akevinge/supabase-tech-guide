import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseURL } from "./env.js";

export const supabase = createClient(supabaseURL, supabaseKey);
