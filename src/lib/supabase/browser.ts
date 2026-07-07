"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Brauzer client — yalnız anonim əməliyyatlar üçün (media yükləmə).
  Sessiya saxlamır; admin auth ayrıca cookie-əsaslı client-lə işləyir
  (bax: ./server.ts). Env boşdursa null — funksiya gizlədilir.
*/

let cached: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cached =
    url && anonKey
      ? createClient(url, anonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        })
      : null;

  return cached;
}
