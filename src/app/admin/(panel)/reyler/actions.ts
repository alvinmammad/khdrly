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

export async function moderateReview(formData: FormData) {
  const { sb } = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const productId = String(formData.get("product_id") ?? "").trim();
  const emel = String(formData.get("emel") ?? "");
  if (!id) redirect("/admin/reyler");

  if (emel === "sil") {
    await sb.from("product_reviews").delete().eq("id", id);
  } else {
    await sb
      .from("product_reviews")
      .update({ status: emel === "tesdiq" ? "approved" : "rejected" })
      .eq("id", id);
  }

  if (productId) revalidatePath(`/bazar/mehsul/${productId}`);
  redirect("/admin/reyler");
}
