"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";

const STAY_TYPES = ["qonaq_evi", "kiraye_ev"];

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function saveStay(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceNote = String(formData.get("price_note") ?? "").trim();
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/turizm/${id}` : "/admin/turizm/yeni";
  if (!name || !phone || !STAY_TYPES.includes(type))
    redirect(`${formPath}?xeta=bos`);

  const row = {
    name,
    type,
    phone,
    description: description || null,
    price_note: priceNote || null,
    status,
  };

  if (id) {
    const { error } = await sb.from("stays").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    const { error } = await sb.from("stays").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidatePath("/turizm");
  redirect("/admin/turizm");
}

export async function deleteStay(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/turizm");

  const { error } = await sb.from("stays").delete().eq("id", id);
  if (error) redirect(`/admin/turizm/${id}?xeta=db`);

  revalidatePath("/turizm");
  redirect("/admin/turizm");
}
