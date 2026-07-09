import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProduct } from "@/lib/data";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { CATEGORY_META } from "@/lib/bazarMeta";
import { createOrder } from "./actions";

export const metadata: Metadata = {
  title: "Sifariş ver",
  robots: { index: false, follow: false },
};

const XETALAR: Record<string, string> = {
  telefon: "Əlaqə telefonu düzgün deyil — sifariş üçün vacibdir.",
  db: "Sifariş göndərilmədi — yenidən cəhd edin.",
};

export default async function OrderPage({
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
  if (!user) redirect(`/giris?next=/bazar/mehsul/${id}/sifaris`);

  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="space-y-5">
      <Link
        href={`/bazar/mehsul/${id}`}
        className="inline-block font-bold text-kerpic"
      >
        ← {product.name}
      </Link>
      <h1 className="font-heading text-2xl font-bold">🛒 Sifariş ver</h1>

      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <span className="text-3xl" aria-hidden>
          {CATEGORY_META[product.category].icon}
        </span>
        <div>
          <p className="font-bold">{product.name}</p>
          <p className="text-sm text-ink-soft">
            {product.producer.name} ·{" "}
            {product.price !== undefined
              ? `${product.price} AZN${product.unit ? ` / ${product.unit}` : ""}`
              : "Qiymət razılaşma ilə"}
          </p>
        </div>
      </div>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <form action={createOrder} className="space-y-4">
        <input type="hidden" name="product_id" value={product.id} />

        <label className="block">
          <span className="mb-1 block font-medium">Nə qədər?</span>
          <input
            type="text"
            name="quantity_note"
            placeholder={`Məs: 2 ${product.unit ?? "ədəd"}`}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">Əlaqə telefonu</span>
          <input
            type="tel"
            name="phone"
            required
            defaultValue={user.phone ?? ""}
            placeholder="+994501234567"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            Sifarişi dəqiqləşdirmək üçün sizinlə bu nömrədə əlaqə saxlanılacaq.
          </span>
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">Qeyd (istəyə bağlı)</span>
          <textarea
            name="note"
            rows={2}
            maxLength={500}
            placeholder="Nə vaxt lazımdır, xüsusi istək..."
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>

        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          Sifarişi göndər
        </button>
        <p className="text-sm text-ink-soft">
          Ödəniş yoxdur — məhsulu təhvil alanda istehsalçı ilə hesablaşırsınız.
        </p>
      </form>
    </div>
  );
}
