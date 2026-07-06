"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { fromBakuLocalInput } from "@/lib/bakuTime";

const DUTY_TYPES = ["aptek", "feldser", "elektrik", "su"];

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

function revalidateDuty() {
  revalidatePath("/");
  revalidatePath("/novbetci");
}

export async function saveDuty(formData: FormData) {
  const { sb, staff } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const isAlert = formData.get("is_alert") === "on";
  const validFrom = fromBakuLocalInput(String(formData.get("valid_from") ?? ""));
  const validTo = fromBakuLocalInput(String(formData.get("valid_to") ?? ""));

  const formPath = id ? `/admin/novbetci/${id}` : "/admin/novbetci/yeni";
  if (!title || !body || !DUTY_TYPES.includes(type)) redirect(`${formPath}?xeta=bos`);

  const row: Record<string, unknown> = {
    type,
    title,
    body,
    phone: phone || null,
    is_alert: isAlert,
    valid_from: validFrom ?? new Date().toISOString(),
    valid_to: validTo,
  };

  if (id) {
    const { error } = await sb.from("duty_info").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    row.created_by = staff.id;
    const { error } = await sb.from("duty_info").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidateDuty();
  redirect("/admin/novbetci");
}

export async function deleteDuty(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/novbetci");

  const { error } = await sb.from("duty_info").delete().eq("id", id);
  if (error) redirect(`/admin/novbetci/${id}?xeta=db`);

  revalidateDuty();
  redirect("/admin/novbetci");
}
