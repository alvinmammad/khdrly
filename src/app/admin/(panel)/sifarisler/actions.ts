"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { ORDER_STATUSES } from "@/lib/sifarisMeta";

async function requireStaff() {
  const sb = await getSupabaseServer();
  const staff = sb ? await getStaffUser() : null;
  if (!sb || !staff?.isStaff) redirect("/admin/login");
  return { sb, staff };
}

export async function setOrderStatus(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (!id || !ORDER_STATUSES.includes(status)) redirect("/admin/sifarisler");

  await sb.from("orders").update({ status }).eq("id", id);

  revalidatePath("/admin/sifarisler");
  revalidatePath(`/sifarislerim/${id}`);
  revalidatePath("/sifarislerim");
  redirect(`/admin/sifarisler/${id}`);
}
