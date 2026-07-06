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

/** Dərcdən sonra ictimai səhifələr dərhal yenilənsin (ISR gözləmədən). */
function revalidateNews(id?: string) {
  revalidatePath("/");
  revalidatePath("/xeberler");
  if (id) revalidatePath(`/xeberler/${id}`);
}

export async function saveNews(formData: FormData) {
  const { sb, staff } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverEmoji = String(formData.get("cover_emoji") ?? "").trim();
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/xeberler/${id}` : "/admin/xeberler/yeni";
  if (!title || !body) redirect(`${formPath}?xeta=bos`);

  const row: Record<string, unknown> = {
    title,
    body,
    cover_emoji: coverEmoji || null,
    status,
  };

  if (id) {
    // Dərc tarixi: ilk dəfə təsdiqlənəndə qoyulur, sonra dəyişmir
    const { data: existing } = await sb
      .from("news")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    row.published_at =
      status === "approved" ? existing?.published_at ?? new Date().toISOString() : null;

    const { error } = await sb.from("news").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    row.author_id = staff.id;
    row.published_at = status === "approved" ? new Date().toISOString() : null;

    const { error } = await sb.from("news").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidateNews(id || undefined);
  redirect("/admin/xeberler");
}

export async function deleteNews(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/xeberler");

  const { error } = await sb.from("news").delete().eq("id", id);
  if (error) redirect(`/admin/xeberler/${id}?xeta=db`);

  revalidateNews(id);
  redirect("/admin/xeberler");
}
