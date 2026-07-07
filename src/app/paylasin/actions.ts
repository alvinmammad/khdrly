"use server";

import { getSupabase } from "@/lib/supabase/client";

/*
  "Siz də paylaşın" — anonim yükləmə qeydiyyatı. Şəkil brauzerdən birbaşa
  Storage-ə gedir (RLS: yalnız paylasilan/ qovluğu); bu action isə yazını
  media_items-ə salır. RLS yalnız pending + consent=true halda buraxır,
  yəni heç nə moderasiyasız dərc oluna bilməz.
*/

type UploadMeta = {
  title: string;
  description: string;
  takenPeriod: string;
  uploaderName: string;
  storagePath: string;
  consent: boolean;
};

export async function registerMediaUpload(meta: UploadMeta): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const title = meta.title.trim();
  const storagePath = meta.storagePath.trim();
  if (!title || !meta.consent) return false;
  // Yol yalnız bizim yükləmə qovluğuna işarə edə bilər
  if (!/^paylasilan\/[\w.-]+$/.test(storagePath)) return false;

  const { error } = await sb.from("media_items").insert({
    title,
    description: meta.description.trim() || null,
    taken_period: meta.takenPeriod.trim() || null,
    uploader_name: meta.uploaderName.trim() || null,
    storage_path: storagePath,
    consent: true,
    status: "pending",
  });

  return !error;
}
