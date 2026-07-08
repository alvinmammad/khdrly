"use server";

import { getSupabase } from "@/lib/supabase/client";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/*
  Girişsiz şam yandırma. RLS yalnız dərc olunmuş (approved) profillər
  üçün buraxır; heç bir şəxsi məlumat yazılmır.
*/
export async function lightCandle(martyrId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb || !UUID_RE.test(martyrId)) return false;

  const { error } = await sb
    .from("memorial_candles")
    .insert({ martyr_id: martyrId });
  return !error;
}
