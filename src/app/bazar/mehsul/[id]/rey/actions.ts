"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";

export async function submitReview(formData: FormData) {
  const productId = String(formData.get("product_id") ?? "").trim();
  const sb = await getSupabaseServer();
  const user = sb ? await getSessionUser() : null;
  if (!sb || !user) redirect(`/giris?next=/bazar/mehsul/${productId}/rey`);

  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim().slice(0, 800);
  const formPath = `/bazar/mehsul/${productId}/rey`;
  if (!productId) redirect("/bazar");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    redirect(`${formPath}?xeta=ulduz`);

  // Bir istifadəçi — bir rəy: təkrar göndərəndə köhnəsi yenilənir
  const { error } = await sb.from("product_reviews").upsert(
    {
      product_id: productId,
      author_id: user.id,
      author_name: user.fullName,
      rating,
      body: body || null,
      status: "pending",
    },
    { onConflict: "product_id,author_id" }
  );
  if (error) redirect(`${formPath}?xeta=db`);

  revalidatePath(`/bazar/mehsul/${productId}`);
  redirect(`/bazar/mehsul/${productId}?rey=ok`);
}
