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

export async function saveFamily(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  const sortOrder = Number(String(formData.get("sort_order") ?? "0")) || 0;
  const status = formData.get("status") === "draft" ? "draft" : "approved";
  if (!name) redirect("/admin/nesiller?xeta=1");

  const row = {
    name,
    description: description || null,
    sort_order: sortOrder,
    status,
  };

  if (id) {
    await sb.from("families").update(row).eq("id", id);
  } else {
    await sb.from("families").insert(row);
  }

  revalidatePath("/haqqinda/secere");
  redirect("/admin/nesiller");
}

export async function deleteFamily(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (id) await sb.from("families").delete().eq("id", id);
  revalidatePath("/haqqinda/secere");
  redirect("/admin/nesiller");
}
