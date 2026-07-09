"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/*
  Sessiyalı brauzer client — YALNIZ admin panelin client komponentləri
  üçün (məs. onda-və-indi şəkil yükləmə). Auth cookie-lərini server/
  middleware ilə paylaşır, yəni daxil olmuş staff-ın hüquqları ilə
  işləyir (RLS storage siyasətləri bunu tələb edir).
*/

let cached: SupabaseClient | null | undefined;

export function getSupabaseBrowserAuth(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cached = url && anonKey ? createBrowserClient(url, anonKey) : null;
  return cached;
}
