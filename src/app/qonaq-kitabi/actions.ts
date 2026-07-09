"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export async function signGuestBook(formData: FormData) {
  const sb = getSupabase();
  if (!sb) redirect("/qonaq-kitabi?xeta=1");

  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const message = String(formData.get("message") ?? "").trim();
  if (message.length < 3 || message.length > 400)
    redirect("/qonaq-kitabi?xeta=1");

  const { error } = await sb.from("guest_entries").insert({
    name: name || null,
    message,
    status: "pending",
  });
  if (error) redirect("/qonaq-kitabi?xeta=1");

  redirect("/qonaq-kitabi?ok=1");
}
