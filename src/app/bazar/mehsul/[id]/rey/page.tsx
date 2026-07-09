import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProduct } from "@/lib/data";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { submitReview } from "./actions";

export const metadata: Metadata = {
  title: "Rəy yaz",
  robots: { index: false, follow: false },
};

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ xeta?: string }>;
}) {
  const [{ id }, { xeta }] = await Promise.all([params, searchParams]);

  const sb = await getSupabaseServer();
  if (!sb) redirect(`/bazar/mehsul/${id}`);

  const user = await getSessionUser();
  if (!user) redirect(`/giris?next=/bazar/mehsul/${id}/rey`);

  const product = await getProduct(id);
  if (!product) notFound();

  // Əvvəlki rəyi varsa forma onunla dolur
  const { data: existing } = await sb
    .from("product_reviews")
    .select("rating, body")
    .eq("product_id", id)
    .eq("author_id", user.id)
    .maybeSingle();

  return (
    <div className="space-y-5">
      <Link href={`/bazar/mehsul/${id}`} className="inline-block font-bold text-kerpic">
        ← {product.name}
      </Link>
      <h1 className="font-heading text-2xl font-bold">⭐ Rəy yaz</h1>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {xeta === "ulduz"
            ? "Qiymətləndirmə seçin (1–5 ulduz)."
            : "Göndərmək alınmadı — yenidən cəhd edin."}
        </p>
      )}

      <form action={submitReview} className="space-y-4">
        <input type="hidden" name="product_id" value={product.id} />

        <fieldset className="rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 font-medium">Qiymətiniz</legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <label
                key={n}
                className="flex min-h-14 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-line bg-surface-2 px-2 font-bold has-[:checked]:border-kerpic has-[:checked]:bg-kerpic/10"
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  required
                  defaultChecked={existing?.rating === n}
                  className="sr-only"
                />
                <span aria-hidden>{"⭐".repeat(n)}</span>
                <span className="text-xs">{n}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 block font-medium">Fikriniz (istəyə bağlı)</span>
          <textarea
            name="body"
            rows={4}
            maxLength={800}
            defaultValue={existing?.body ?? ""}
            placeholder="Məhsul necə idi?"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>

        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          {existing ? "Rəyimi yenilə" : "Rəyi göndər"}
        </button>
        <p className="text-sm text-ink-soft">
          Rəylər yoxlanıldıqdan sonra dərc olunur. Yazı{" "}
          <strong>{user.fullName}</strong> adı ilə görünəcək.
        </p>
      </form>
    </div>
  );
}
