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

const PATH_RE = /^onda-indi\/[\w.-]+$/;

/** Şəkillər client tərəfdən Storage-ə yüklənəndən sonra yazını qeydə alır. */
export async function createThenNow(meta: {
  title: string;
  note: string;
  beforePath: string;
  afterPath: string;
}): Promise<boolean> {
  const { sb } = await requireStaff();

  const title = meta.title.trim();
  if (!title || !PATH_RE.test(meta.beforePath) || !PATH_RE.test(meta.afterPath))
    return false;

  const { error } = await sb.from("then_now").insert({
    title,
    note: meta.note.trim() || null,
    before_path: meta.beforePath,
    after_path: meta.afterPath,
    status: "approved",
  });
  if (error) return false;

  revalidatePath("/haqqinda/kohne-sekiller");
  return true;
}

export async function toggleThenNow(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const to = formData.get("to") === "approved" ? "approved" : "draft";
  if (!id) redirect("/admin/onda-indi");

  await sb.from("then_now").update({ status: to }).eq("id", id);
  revalidatePath("/haqqinda/kohne-sekiller");
  redirect("/admin/onda-indi");
}

export async function deleteThenNow(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/onda-indi");

  const { data } = await sb
    .from("then_now")
    .select("before_path, after_path")
    .eq("id", id)
    .maybeSingle();
  if (data) {
    await sb.storage.from("media").remove([data.before_path, data.after_path]);
  }
  await sb.from("then_now").delete().eq("id", id);

  revalidatePath("/haqqinda/kohne-sekiller");
  redirect("/admin/onda-indi");
}
