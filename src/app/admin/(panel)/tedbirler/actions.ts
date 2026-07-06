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

function revalidateEvents() {
  revalidatePath("/");
  revalidatePath("/tedbirler");
}

export async function saveEvent(formData: FormData) {
  const { sb, staff } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = fromBakuLocalInput(String(formData.get("starts_at") ?? ""));
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/tedbirler/${id}` : "/admin/tedbirler/yeni";
  if (!title || !startsAt) redirect(`${formPath}?xeta=bos`);

  const row: Record<string, unknown> = {
    title,
    body: body || null,
    location: location || null,
    starts_at: startsAt,
    status,
  };

  if (id) {
    const { error } = await sb.from("events").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    row.created_by = staff.id;
    const { error } = await sb.from("events").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidateEvents();
  redirect("/admin/tedbirler");
}

export async function deleteEvent(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/tedbirler");

  const { error } = await sb.from("events").delete().eq("id", id);
  if (error) redirect(`/admin/tedbirler/${id}?xeta=db`);

  revalidateEvents();
  redirect("/admin/tedbirler");
}
