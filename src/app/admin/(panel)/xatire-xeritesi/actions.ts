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

export async function moderateMemoryPin(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const emel = String(formData.get("emel") ?? "");
  if (!id) redirect("/admin/xatire-xeritesi");

  if (emel === "sil") {
    await sb.from("memory_pins").delete().eq("id", id);
  } else {
    await sb
      .from("memory_pins")
      .update({ status: emel === "tesdiq" ? "approved" : "rejected" })
      .eq("id", id);
  }

  revalidatePath("/haqqinda/xatire-xeritesi");
  redirect("/admin/xatire-xeritesi");
}
