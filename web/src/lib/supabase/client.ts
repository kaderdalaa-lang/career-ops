import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Création différée : un build sans .env.local ne casse pas.
export function getSupabase(): SupabaseClient {
  if (client) return client;

  // Les valeurs viennent de web/.env.local (jamais commité).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase: définis NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans web/.env.local",
    );
  }

  // Clé publique uniquement. Ne jamais utiliser la clé service_role ici.
  client = createClient(url, anonKey);
  return client;
}
