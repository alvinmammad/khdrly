"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { PLACE_META } from "@/lib/placeMeta";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

function revalidatePlaces() {
  revalidatePath("/xerite");
}

/** Ad daxilində slug avtomatik yaranır: "Şəhid bulağı" → "sehid-bulagi" */
function slugify(name: string): string {
  const map: Record<string, string> = {
    ə: "e", ö: "o", ü: "u", ı: "i", ş: "s", ç: "c", ğ: "g",
  };
  return name
    .toLowerCase()
    .replace(/[əöüışçğ]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function savePlace(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const lat = Number(String(formData.get("lat") ?? "").replace(",", "."));
  const lng = Number(String(formData.get("lng") ?? "").replace(",", "."));
  const body = String(formData.get("body") ?? "").trim();
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/yerler/${id}` : "/admin/yerler/yeni";
  const validType = Object.keys(PLACE_META).includes(type);
  const validCoords =
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= 39 && lat <= 41 && lng >= 45 && lng <= 48; // Qarabağ ətrafı ağlabatan aralıq
  if (!name || !validType) redirect(`${formPath}?xeta=bos`);
  if (!validCoords) redirect(`${formPath}?xeta=koordinat`);

  const row: Record<string, unknown> = {
    name,
    type,
    lat,
    lng,
    body: body || null,
    status,
  };

  if (id) {
    const { error } = await sb.from("places").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    row.slug = slugify(name) || `yer-${Date.now()}`;
    const { error } = await sb.from("places").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidatePlaces();
  redirect("/admin/yerler");
}

export async function deletePlace(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/yerler");

  const { error } = await sb.from("places").delete().eq("id", id);
  if (error) redirect(`/admin/yerler/${id}?xeta=db`);

  revalidatePlaces();
  redirect("/admin/yerler");
}
