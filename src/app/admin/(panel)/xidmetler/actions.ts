"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { SERVICE_META } from "@/lib/xidmetMeta";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function saveService(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/xidmetler/${id}` : "/admin/xidmetler/yeni";
  if (!name || !phone || !Object.keys(SERVICE_META).includes(category))
    redirect(`${formPath}?xeta=bos`);

  const row = { name, category, phone, description: description || null, status };

  if (id) {
    const { error } = await sb.from("service_providers").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    const { error } = await sb.from("service_providers").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidatePath("/xidmetler");
  redirect("/admin/xidmetler");
}

export async function deleteService(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/xidmetler");

  const { error } = await sb.from("service_providers").delete().eq("id", id);
  if (error) redirect(`/admin/xidmetler/${id}?xeta=db`);

  revalidatePath("/xidmetler");
  redirect("/admin/xidmetler");
}
