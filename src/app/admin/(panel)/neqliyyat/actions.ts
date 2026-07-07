"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function saveRoute(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const schedule = String(formData.get("schedule") ?? "").trim();
  const driverName = String(formData.get("driver_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const sortOrder = Number(String(formData.get("sort_order") ?? "0")) || 0;
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/neqliyyat/${id}` : "/admin/neqliyyat/yeni";
  if (!title || !schedule) redirect(`${formPath}?xeta=bos`);

  const row = {
    title,
    schedule,
    driver_name: driverName || null,
    phone: phone || null,
    note: note || null,
    sort_order: sortOrder,
    status,
  };

  if (id) {
    const { error } = await sb.from("transport_routes").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    const { error } = await sb.from("transport_routes").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidatePath("/neqliyyat");
  redirect("/admin/neqliyyat");
}

export async function deleteRoute(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/neqliyyat");

  const { error } = await sb.from("transport_routes").delete().eq("id", id);
  if (error) redirect(`/admin/neqliyyat/${id}?xeta=db`);

  revalidatePath("/neqliyyat");
  redirect("/admin/neqliyyat");
}
