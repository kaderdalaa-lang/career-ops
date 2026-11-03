import { createClient } from "@supabase/supabase-js";

// Les valeurs viennent de web/.env.local (jamais commité).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase: définis NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans web/.env.local",
  );
}

// Clé publique uniquement. Ne jamais utiliser la clé service_role ici.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
