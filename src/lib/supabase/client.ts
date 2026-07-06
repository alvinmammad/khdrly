import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Supabase client — server komponentlərində (data qatında) istifadə üçün.
  Env dəyişənləri boşdursa null qaytarır və tətbiq nümunə (mock) data ilə
  işləməyə davam edir — bax: src/lib/data/index.ts.

  Auth (giriş/sessiya) admin paneli ilə birlikdə gələcək; o zaman
  @supabase/ssr ilə cookie-əsaslı ayrıca client əlavə olunacaq.
*/

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cached =
    url && anonKey
      ? createClient(url, anonKey, {
          auth: {
            // Sessiyasız, yalnız oxu üçün server client
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        })
      : null;

  return cached;
}
