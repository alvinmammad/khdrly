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

const PATH_RE = /^sesli-tarix\/[\w.-]+$/;

export async function registerOralHistory(meta: {
  title: string;
  narrator: string;
  narratorInfo: string;
  transcript: string;
  audioPath: string;
}): Promise<boolean> {
  const { sb } = await requireStaff();

  const title = meta.title.trim();
  const narrator = meta.narrator.trim();
  if (!title || !narrator || !PATH_RE.test(meta.audioPath)) return false;

  const { error } = await sb.from("oral_histories").insert({
    title,
    narrator,
    narrator_info: meta.narratorInfo.trim() || null,
    transcript: meta.transcript.trim() || null,
    audio_path: meta.audioPath,
    status: "approved",
  });
  if (error) return false;

  revalidatePath("/haqqinda/sesli-tarix");
  return true;
}

export async function deleteOralHistory(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/sesli-tarix");

  const { data } = await sb
    .from("oral_histories")
    .select("audio_path")
    .eq("id", id)
    .maybeSingle();
  if (data) await sb.storage.from("media").remove([data.audio_path]);
  await sb.from("oral_histories").delete().eq("id", id);

  revalidatePath("/haqqinda/sesli-tarix");
  redirect("/admin/sesli-tarix");
}

export async function updateTranscript(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  const transcript = String(formData.get("transcript") ?? "").trim();
  if (!id) redirect("/admin/sesli-tarix");

  await sb
    .from("oral_histories")
    .update({ transcript: transcript || null })
    .eq("id", id);

  revalidatePath("/haqqinda/sesli-tarix");
  redirect("/admin/sesli-tarix");
}
