"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { ISSUE_STATUSES } from "@/lib/problemMeta";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function updateIssue(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const staffNote = String(formData.get("staff_note") ?? "").trim().slice(0, 500);
  if (!id || !ISSUE_STATUSES.includes(status)) redirect("/admin/problemler");

  await sb
    .from("issues")
    .update({ status, staff_note: staffNote || null })
    .eq("id", id);

  revalidatePath("/problemler");
  redirect("/admin/problemler");
}

export async function deleteIssue(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/problemler");

  const { data } = await sb
    .from("issues")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();
  if (data?.photo_path) {
    await sb.storage.from("media").remove([data.photo_path]);
  }
  await sb.from("issues").delete().eq("id", id);

  revalidatePath("/problemler");
  redirect("/admin/problemler");
}
