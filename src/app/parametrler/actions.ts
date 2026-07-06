"use server";

import { getSupabase } from "@/lib/supabase/client";

/*
  Push abunəliyi girişsiz işləyir (kənd qaydası: baxış üçün login yoxdur).
  RLS: anonim yalnız INSERT/DELETE edə bilir, SELECT yox — endpoint URL-lər
  gizli olduğundan kənar şəxs abunəlikləri oxuya/sadalaya bilməz.
*/

type PushSubscriptionJSON = {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
};

export async function savePushSubscription(sub: PushSubscriptionJSON): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const endpoint = sub?.endpoint ?? "";
  if (!endpoint.startsWith("https://") || !sub.keys?.p256dh || !sub.keys?.auth)
    return false;

  // Eyni endpoint yenidən abunə olanda köhnə açarlar təzələnsin
  await sb.from("push_subscriptions").delete().eq("fcm_token", endpoint);
  const { error } = await sb
    .from("push_subscriptions")
    .insert({ fcm_token: endpoint, subscription: sub });

  return !error;
}

export async function deletePushSubscription(endpoint: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb || !endpoint) return false;

  const { error } = await sb.from("push_subscriptions").delete().eq("fcm_token", endpoint);
  return !error;
}
