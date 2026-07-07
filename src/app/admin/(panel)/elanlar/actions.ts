"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { fromBakuLocalInput } from "@/lib/bakuTime";

const LISTING_TYPES = ["elan", "itmis", "tapilmis"];

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function saveListing(formData: FormData) {
  const { sb, staff } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const type = String(formData.get("type") ?? "elan");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const validTo = fromBakuLocalInput(String(formData.get("valid_to") ?? ""));
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/elanlar/${id}` : "/admin/elanlar/yeni";
  if (!title || !body || !LISTING_TYPES.includes(type))
    redirect(`${formPath}?xeta=bos`);

  const row: Record<string, unknown> = {
    type,
    title,
    body,
    phone: phone || null,
    valid_to: validTo,
    status,
  };

  if (id) {
    const { error } = await sb.from("listings").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    row.created_by = staff.id;
    const { error } = await sb.from("listings").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidatePath("/elanlar");
  redirect("/admin/elanlar");
}

export async function deleteListing(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/elanlar");

  const { error } = await sb.from("listings").delete().eq("id", id);
  if (error) redirect(`/admin/elanlar/${id}?xeta=db`);

  revalidatePath("/elanlar");
  redirect("/admin/elanlar");
}
