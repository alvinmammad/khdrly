"use server";

import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { sendPushToAll, vapidConfigured } from "@/lib/push";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

const NOTIF_TYPES = ["xeber", "tedbir", "novbetci", "anim"];

export async function sendNotification(formData: FormData) {
  const { sb, staff } = await requireStaff();

  if (!vapidConfigured()) redirect("/admin/bildirisler?xeta=env");

  const type = String(formData.get("type") ?? "xeber");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim() || "/";
  if (!title || !body || !NOTIF_TYPES.includes(type))
    redirect("/admin/bildirisler?xeta=bos");
  if (!url.startsWith("/")) redirect("/admin/bildirisler?xeta=url");

  // Staff sessiyalı client RLS ilə bütün abunəlikləri oxuya bilir
  const result = await sendPushToAll(sb, { title, body, url });
  if ("error" in result) redirect("/admin/bildirisler?xeta=db");

  await sb.from("notifications").insert({
    type,
    title,
    body,
    channels: ["push"],
    sent_by: staff.id,
    sent_at: new Date().toISOString(),
  });

  redirect(`/admin/bildirisler?gonderildi=${result.sent}&cemi=${result.total}`);
}
