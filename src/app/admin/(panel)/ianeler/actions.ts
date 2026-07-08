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

export async function saveDonation(formData: FormData) {
  const { sb, staff } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const donorDisplay = String(formData.get("donor_display") ?? "").trim() || "Anonim";
  const amountRaw = String(formData.get("amount") ?? "").trim().replace(",", ".");
  const amount = amountRaw ? Number(amountRaw) : null;
  const inKind = String(formData.get("in_kind") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();
  const donatedAt = String(formData.get("donated_at") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const status = formData.get("status") === "approved" ? "approved" : "draft";

  const formPath = id ? `/admin/ianeler/${id}` : "/admin/ianeler/yeni";
  if (!purpose) redirect(`${formPath}?xeta=bos`);
  if (amount !== null && (!Number.isFinite(amount) || amount <= 0))
    redirect(`${formPath}?xeta=mebleg`);
  if (amount === null && !inKind) redirect(`${formPath}?xeta=deyer`);

  const row: Record<string, unknown> = {
    donor_display: donorDisplay,
    amount,
    in_kind: inKind || null,
    purpose,
    donated_at: donatedAt || new Date().toISOString().slice(0, 10),
    note: note || null,
    status,
  };

  if (id) {
    const { error } = await sb.from("donations").update(row).eq("id", id);
    if (error) redirect(`${formPath}?xeta=db`);
  } else {
    row.created_by = staff.id;
    const { error } = await sb.from("donations").insert(row);
    if (error) redirect(`${formPath}?xeta=db`);
  }

  revalidatePath("/ianeler");
  redirect("/admin/ianeler");
}

export async function deleteDonation(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/ianeler");

  const { error } = await sb.from("donations").delete().eq("id", id);
  if (error) redirect(`/admin/ianeler/${id}?xeta=db`);

  revalidatePath("/ianeler");
  redirect("/admin/ianeler");
}
