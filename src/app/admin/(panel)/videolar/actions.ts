"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { youtubeId } from "@/lib/data";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function saveVideo(formData: FormData) {
  const { sb } = await requireStaff();

  const title = String(formData.get("title") ?? "").trim().slice(0, 150);
  const url = String(formData.get("youtube_url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim().slice(0, 300);
  if (!title || !youtubeId(url)) redirect("/admin/videolar?xeta=1");

  await sb.from("video_items").insert({
    title,
    youtube_url: url,
    description: description || null,
  });

  revalidatePath("/haqqinda/kohne-sekiller");
  redirect("/admin/videolar");
}

export async function deleteVideo(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (id) await sb.from("video_items").delete().eq("id", id);
  revalidatePath("/haqqinda/kohne-sekiller");
  redirect("/admin/videolar");
}
