"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { PERSON_META } from "@/lib/personMeta";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function savePerson(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const yearsDisplay = String(formData.get("years_display") ?? "").trim();
  const field = String(formData.get("field") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const sources = String(formData.get("sources") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/meshurlar/${id}` : "/admin/meshurlar/yeni";
  if (!fullName || !description || !Object.keys(PERSON_META).includes(field))
    redirect(`${formPath}?xeta=bos`);
  // Real şəxs haqqında yazı mənbəsiz dərc oluna bilməz
  if (status === "approved" && sources.length === 0)
    redirect(`${formPath}?xeta=menbe`);

  const row = {
    full_name: fullName,
    years_display: yearsDisplay || null,
    field,
    description,
    sources,
    status,
  };

  if (id) {
    const { error } = await sb.from("notable_people").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    const { error } = await sb.from("notable_people").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidatePath("/haqqinda/meshurlar");
  redirect("/admin/meshurlar");
}

export async function deletePerson(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/meshurlar");

  const { error } = await sb.from("notable_people").delete().eq("id", id);
  if (error) redirect(`/admin/meshurlar/${id}?xeta=db`);

  revalidatePath("/haqqinda/meshurlar");
  redirect("/admin/meshurlar");
}
