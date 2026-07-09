"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";

/** Xatirə sancağı — pending düşür, staff təsdiqindən sonra görünür. */
export async function createMemoryPin(meta: {
  title: string;
  body: string;
  authorName: string;
  lat: number;
  lng: number;
}): Promise<boolean> {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) return false;

  const title = meta.title.trim().slice(0, 100);
  const body = meta.body.trim().slice(0, 1000);
  if (title.length < 2 || body.length < 3) return false;
  // Yalnız kənd bölgəsi daxilində (PMTiles bbox-u ilə üst-üstə)
  if (meta.lat < 39.9 || meta.lat > 40.15 || meta.lng < 46.7 || meta.lng > 47.1)
    return false;

  const { error } = await sb.from("memory_pins").insert({
    title,
    body,
    lat: meta.lat,
    lng: meta.lng,
    author_name: meta.authorName.trim().slice(0, 80) || null,
    submitted_by: user.id,
    status: "pending",
  });
  if (error) return false;

  revalidatePath("/haqqinda/xatire-xeritesi");
  return true;
}
