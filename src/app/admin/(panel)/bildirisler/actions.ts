"use server";

import { redirect } from "next/navigation";
import webpush from "web-push";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

const NOTIF_TYPES = ["xeber", "tedbir", "novbetci", "anim"];

export async function sendNotification(formData: FormData) {
  const { sb, staff } = await requireStaff();

  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) redirect("/admin/bildirisler?xeta=env");

  const type = String(formData.get("type") ?? "xeber");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim() || "/";
  if (!title || !body || !NOTIF_TYPES.includes(type))
    redirect("/admin/bildirisler?xeta=bos");
  if (!url.startsWith("/")) redirect("/admin/bildirisler?xeta=url");

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@example.com",
    pub,
    priv
  );

  // Staff RLS ilə bütün abunəlikləri oxuyur
  const { data: subs, error } = await sb
    .from("push_subscriptions")
    .select("id, subscription")
    .not("subscription", "is", null);
  if (error) redirect("/admin/bildirisler?xeta=db");

  const payload = JSON.stringify({ title, body, url });
  const olu: string[] = [];
  let ugurlu = 0;

  const results = await Promise.allSettled(
    (subs ?? []).map((row) =>
      webpush
        .sendNotification(row.subscription as webpush.PushSubscription, payload)
        .then(() => {
          ugurlu += 1;
        })
        .catch((e: { statusCode?: number }) => {
          // 404/410 — abunəlik ölüb (tətbiq silinib və s.), bazadan təmizlənir
          if (e?.statusCode === 404 || e?.statusCode === 410) olu.push(row.id);
          throw e;
        })
    )
  );
  void results;

  if (olu.length > 0) {
    await sb.from("push_subscriptions").delete().in("id", olu);
  }

  // Göndəriş tarixçəyə yazılır
  await sb.from("notifications").insert({
    type,
    title,
    body,
    channels: ["push"],
    sent_by: staff.id,
    sent_at: new Date().toISOString(),
  });

  redirect(`/admin/bildirisler?gonderildi=${ugurlu}&cemi=${subs?.length ?? 0}`);
}
