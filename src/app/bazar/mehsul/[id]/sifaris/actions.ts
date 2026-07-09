"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";

export async function createOrder(formData: FormData) {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  const productId = String(formData.get("product_id") ?? "").trim();
  if (!sb || !user) redirect(`/giris?next=/bazar/mehsul/${productId}/sifaris`);

  const phone = String(formData.get("phone") ?? "").trim().slice(0, 20);
  const quantityNote = String(formData.get("quantity_note") ?? "").trim().slice(0, 100);
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);

  const formPath = `/bazar/mehsul/${productId}/sifaris`;
  if (!productId) redirect("/bazar");
  if (phone.length < 7) redirect(`${formPath}?xeta=telefon`);

  const { error } = await sb.from("orders").insert({
    product_id: productId,
    buyer_id: user.id,
    buyer_name: user.fullName,
    buyer_phone: phone,
    quantity_note: quantityNote || null,
    note: note || null,
  });
  if (error) redirect(`${formPath}?xeta=db`);

  // Telefon profildə boşdursa, gələcək sifarişlər üçün yadda saxlanılır
  if (!user.phone) {
    await sb.from("profiles").update({ phone }).eq("id", user.id);
  }

  revalidatePath("/sifarislerim");
  redirect("/sifarislerim?ok=1");
}
