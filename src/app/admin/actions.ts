"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/admin/login?xeta=env");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?xeta=giris");

  redirect("/admin");
}

export async function logout() {
  const sb = await getSupabaseServer();
  if (sb) await sb.auth.signOut();
  redirect("/admin/login");
}
