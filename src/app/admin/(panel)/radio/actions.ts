"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { youtubeId, youtubePlaylistId } from "@/lib/data";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function saveRadio(formData: FormData) {
  const { sb } = await requireStaff();

  const kind = String(formData.get("kind") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 150);
  const url = String(formData.get("url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim().slice(0, 300);
  const sortOrder = Number(String(formData.get("sort_order") ?? "0")) || 0;

  if (!title || (kind !== "youtube" && kind !== "stream"))
    redirect("/admin/radio?xeta=bos");

  if (kind === "youtube") {
    if (!youtubePlaylistId(url) && !youtubeId(url))
      redirect("/admin/radio?xeta=youtube");
  } else {
    // Canlı yayım yalnız https ola bilər (sayt https-dədir — mixed content bloklanır)
    if (!/^https:\/\//i.test(url)) redirect("/admin/radio?xeta=stream");
  }

  await sb.from("radio_items").insert({
    kind,
    title,
    url,
    description: description || null,
    sort_order: sortOrder,
  });

  revalidatePath("/radio");
  redirect("/admin/radio");
}

export async function deleteRadio(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (id) await sb.from("radio_items").delete().eq("id", id);
  revalidatePath("/radio");
  redirect("/admin/radio");
}
