"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";

const PHOTO_RE = /^problemler\/[\w.-]+$/;

/** Foto client tərəfdən Storage-ə yüklənəndən sonra problemi qeydə alır. */
export async function createIssue(meta: {
  title: string;
  body: string;
  location: string;
  photoPath: string | null;
}): Promise<string | null> {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) return null;

  const title = meta.title.trim().slice(0, 120);
  const body = meta.body.trim().slice(0, 1500);
  if (title.length < 3 || body.length < 3) return null;
  if (meta.photoPath && !PHOTO_RE.test(meta.photoPath)) return null;

  const { data, error } = await sb
    .from("issues")
    .insert({
      title,
      body,
      location: meta.location.trim().slice(0, 120) || null,
      photo_path: meta.photoPath,
      reporter_id: user.id,
      reporter_name: user.fullName,
    })
    .select("id")
    .single();
  if (error || !data) return null;

  revalidatePath("/problemler");
  return data.id;
}

export async function withdrawIssue(formData: FormData) {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) redirect("/giris?next=/problemler");

  const id = String(formData.get("id") ?? "").trim();
  // RLS: yalnız öz "yeni" problemini silmək mümkündür
  if (id) await sb.from("issues").delete().eq("id", id);

  revalidatePath("/problemler");
  redirect("/problemler");
}
