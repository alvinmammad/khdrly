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

/** Yersiz elanı silir; foto varsa storage-dən də təmizlənir. */
export async function removeMarketItem(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/al-ver");

  const { data } = await sb
    .from("market_items")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();
  if (data?.photo_path) {
    await sb.storage.from("media").remove([data.photo_path]);
  }
  await sb.from("market_items").delete().eq("id", id);

  revalidatePath("/al-ver");
  redirect("/admin/al-ver");
}
