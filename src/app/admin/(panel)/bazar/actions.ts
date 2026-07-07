"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { CATEGORY_META } from "@/lib/bazarMeta";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

function revalidateBazar(productId?: string) {
  revalidatePath("/bazar");
  if (productId) revalidatePath(`/bazar/mehsul/${productId}`);
}

/** 1–12 aralığında ay və ya null. */
function parseMonth(value: FormDataEntryValue | null): number | null {
  const n = Number(String(value ?? ""));
  return Number.isInteger(n) && n >= 1 && n <= 12 ? n : null;
}

// ---------- İstehsalçılar ----------

export async function saveProducer(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isFlagship = formData.get("is_flagship") === "on";
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/bazar/istehsalci/${id}` : "/admin/bazar/istehsalci/yeni";
  if (!name || !phone) redirect(`${formPath}?xeta=bos`);

  const row = {
    name,
    phone,
    description: description || null,
    is_flagship: isFlagship,
    status,
  };

  if (id) {
    const { error } = await sb.from("producers").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    const { error } = await sb.from("producers").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidateBazar();
  redirect("/admin/bazar");
}

export async function deleteProducer(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/bazar");

  // Diqqət: cascade ilə istehsalçının bütün məhsulları da silinir
  const { error } = await sb.from("producers").delete().eq("id", id);
  if (error) redirect(`/admin/bazar/istehsalci/${id}?xeta=db`);

  revalidateBazar();
  redirect("/admin/bazar");
}

// ---------- Məhsullar ----------

export async function saveProduct(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const producerId = String(formData.get("producer_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const priceRaw = String(formData.get("price") ?? "").trim().replace(",", ".");
  const price = priceRaw ? Number(priceRaw) : null;
  const unit = String(formData.get("unit") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const seasonStart = parseMonth(formData.get("season_start"));
  const seasonEnd = parseMonth(formData.get("season_end"));
  const available = formData.get("available") === "on";
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/bazar/mehsul/${id}` : "/admin/bazar/mehsul/yeni";
  if (!name || !producerId || !Object.keys(CATEGORY_META).includes(category))
    redirect(`${formPath}?xeta=bos`);
  if (price !== null && (!Number.isFinite(price) || price < 0))
    redirect(`${formPath}?xeta=qiymet`);
  // Mövsüm ya tam (hər iki ay), ya heç — yarımçıq qalmasın
  if ((seasonStart === null) !== (seasonEnd === null))
    redirect(`${formPath}?xeta=movsum`);

  const row = {
    producer_id: producerId,
    name,
    category,
    price,
    unit: unit || null,
    description: description || null,
    season_start: seasonStart,
    season_end: seasonEnd,
    available,
    status,
  };

  if (id) {
    const { error } = await sb.from("products").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    const { error } = await sb.from("products").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidateBazar(id || undefined);
  redirect("/admin/bazar");
}

export async function deleteProduct(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/bazar");

  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) redirect(`/admin/bazar/mehsul/${id}?xeta=db`);

  revalidateBazar(id);
  redirect("/admin/bazar");
}
