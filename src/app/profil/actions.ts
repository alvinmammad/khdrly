"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/giris");

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/giris");

  const fullName = String(formData.get("full_name") ?? "").trim().slice(0, 80);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 20);
  const isResident = formData.get("is_resident") !== "diaspora";
  const city = String(formData.get("city") ?? "").trim().slice(0, 60);
  const country = String(formData.get("country") ?? "").trim().slice(0, 60);
  if (!fullName) redirect("/profil?xeta=ad");

  // RLS: istifadəçi yalnız öz profilini yeniləyə bilir
  const { error } = await sb
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      is_resident: isResident,
      city: isResident ? null : city || null,
      country: isResident ? null : country || null,
    })
    .eq("id", user.id);
  if (error) redirect("/profil?xeta=db");

  redirect("/profil?ok=1");
}

export async function signOut() {
  const sb = await getSupabaseServer();
  if (sb) await sb.auth.signOut();
  redirect("/");
}
