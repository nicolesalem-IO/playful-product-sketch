import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The publishable key is meant to ship in browser code: every table is protected
// by row-level security, so a signed-in person can only read and write their own row.
const url = import.meta.env["VITE_SUPABASE_URL"] ?? "https://okkhlbglwyqfjwpincee.supabase.co";
const key =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? "sb_publishable_28g3M3Y81GB5yNrpCuS-_A_dVUTahWD";

let client: SupabaseClient | null = null;

/** Browser-only client. Returns null during server rendering, where there is no session. */
export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  client ??= createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
  return client;
}
