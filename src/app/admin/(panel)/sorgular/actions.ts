"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { fromBakuLocalInput } from "@/lib/bakuTime";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function createPoll(formData: FormData) {
  const { sb } = await requireStaff();

  const question = String(formData.get("question") ?? "").trim().slice(0, 200);
  const options = String(formData.get("options") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
  const closesAt = fromBakuLocalInput(String(formData.get("closes_at") ?? ""));
  if (question.length < 5 || options.length < 2)
    redirect("/admin/sorgular?xeta=1");

  await sb.from("polls").insert({ question, options, closes_at: closesAt });

  revalidatePath("/sorgular");
  redirect("/admin/sorgular");
}

export async function closePoll(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (id)
    await sb.from("polls").update({ closes_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/sorgular");
  redirect("/admin/sorgular");
}

export async function deletePoll(formData: FormData) {
  const { sb } = await requireStaff();
  const id = String(formData.get("id") ?? "").trim();
  if (id) await sb.from("polls").delete().eq("id", id);
  revalidatePath("/sorgular");
  redirect("/admin/sorgular");
}
