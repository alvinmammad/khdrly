"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { MARKET_CATEGORIES } from "@/lib/alverMeta";

const PHOTO_RE = /^alver\/[\w.-]+$/;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/** Şəkil client tərəfdən Storage-ə yüklənəndən sonra elanı qeydə alır. */
export async function createMarketItem(meta: {
  category: string;
  title: string;
  body: string;
  price: string;
  phone: string;
  photoPath: string | null;
}): Promise<string | null> {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) return null;

  const category = meta.category;
  const title = meta.title.trim().slice(0, 120);
  const body = meta.body.trim().slice(0, 1500);
  const phone = meta.phone.trim().slice(0, 20);
  if (!MARKET_CATEGORIES.includes(category as never)) return null;
  if (title.length < 2 || body.length < 3 || phone.length < 7) return null;
  if (meta.photoPath && !PHOTO_RE.test(meta.photoPath)) return null;

  const priceRaw = meta.price.trim().replace(",", ".");
  const price = priceRaw ? Number(priceRaw) : null;
  if (price !== null && (!Number.isFinite(price) || price < 0)) return null;

  const { data, error } = await sb
    .from("market_items")
    .insert({
      category,
      title,
      body,
      price,
      photo_path: meta.photoPath,
      phone,
      author_id: user.id,
      author_name: user.fullName,
      valid_to: new Date(Date.now() + THIRTY_DAYS).toISOString(),
    })
    .select("id")
    .single();
  if (error || !data) return null;

  // Telefon profildə boşdursa, gələcək üçün yadda saxlanılır
  if (!user.phone) {
    await sb.from("profiles").update({ phone }).eq("id", user.id);
  }

  revalidatePath("/al-ver");
  return data.id;
}

export async function deleteMarketItem(formData: FormData) {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) redirect("/giris?next=/al-ver/menimkiler");

  const id = String(formData.get("id") ?? "").trim();
  // RLS: yalnız öz elanını (və ya staff) silə bilir
  if (id) await sb.from("market_items").delete().eq("id", id);

  revalidatePath("/al-ver");
  revalidatePath("/al-ver/menimkiler");
  redirect("/al-ver/menimkiler");
}
