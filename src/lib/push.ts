import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";

/*
  Web Push göndərmə — admin paneli və cron (anım bildirişləri) paylaşır.
  Verilən client abunəlikləri oxuya bilməlidir: admin üçün staff sessiyalı
  client, cron üçün service-role client (abunəliklər anon oxuna bilməz).
*/

export type PushPayload = { title: string; body: string; url: string };

export function vapidConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushToAll(
  sb: SupabaseClient,
  payload: PushPayload
): Promise<{ sent: number; total: number } | { error: string }> {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return { error: "VAPID açarları qurulmayıb" };

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@example.com",
    pub,
    priv
  );

  const { data: subs, error } = await sb
    .from("push_subscriptions")
    .select("id, subscription")
    .not("subscription", "is", null);
  if (error) return { error: error.message };

  const json = JSON.stringify(payload);
  const olu: string[] = [];
  let sent = 0;

  await Promise.allSettled(
    (subs ?? []).map((row) =>
      webpush
        .sendNotification(row.subscription as webpush.PushSubscription, json)
        .then(() => {
          sent += 1;
        })
        .catch((e: { statusCode?: number }) => {
          // 404/410 — abunəlik ölüb, bazadan təmizlənir
          if (e?.statusCode === 404 || e?.statusCode === 410) olu.push(row.id);
        })
    )
  );

  if (olu.length > 0) {
    await sb.from("push_subscriptions").delete().in("id", olu);
  }

  return { sent, total: subs?.length ?? 0 };
}
