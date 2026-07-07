"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

function revalidateMedia() {
  revalidatePath("/haqqinda/kohne-sekiller");
}

export async function approveMedia(formData: FormData) {
  const { sb, staff } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/media");

  const { error } = await sb
    .from("media_items")
    .update({ status: "approved", approved_by: staff.id })
    .eq("id", id);
  if (error) redirect("/admin/media?xeta=db");

  revalidateMedia();
  redirect("/admin/media");
}

export async function rejectMedia(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/media");

  const { error } = await sb
    .from("media_items")
    .update({ status: "rejected" })
    .eq("id", id);
  if (error) redirect("/admin/media?xeta=db");

  revalidateMedia();
  redirect("/admin/media");
}

/** Yazını və storage-dəki faylı birlikdə silir. */
export async function deleteMedia(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  const storagePath = String(formData.get("storage_path") ?? "").trim();
  if (!id) redirect("/admin/media");

  if (storagePath) {
    await sb.storage.from("media").remove([storagePath]);
  }
  const { error } = await sb.from("media_items").delete().eq("id", id);
  if (error) redirect("/admin/media?xeta=db");

  revalidateMedia();
  redirect("/admin/media");
}
