"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";

async function requireUser() {
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) redirect("/giris?next=/sifarislerim");
  return { sb, user };
}

export async function cancelOrder(formData: FormData) {
  const { sb } = await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/sifarislerim");

  // RLS: yalnız öz "yeni" sifarişini ləğv etmək mümkündür
  await sb.from("orders").update({ status: "legv" }).eq("id", id);

  revalidatePath(`/sifarislerim/${id}`);
  revalidatePath("/sifarislerim");
  redirect(`/sifarislerim/${id}`);
}

export async function sendOrderMessage(formData: FormData) {
  const { sb, user } = await requireUser();
  const orderId = String(formData.get("order_id") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim().slice(0, 1000);
  const back = String(formData.get("back") ?? `/sifarislerim/${orderId}`);
  if (!orderId) redirect("/sifarislerim");
  if (body.length < 1) redirect(back);

  // RLS: yalnız sifarişin sahibi və ya staff yaza bilər
  await sb.from("order_messages").insert({
    order_id: orderId,
    sender_id: user.id,
    sender_name: user.fullName,
    is_staff: user.isStaff,
    body,
  });

  revalidatePath(back);
  redirect(back);
}
