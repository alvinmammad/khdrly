import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";

export const metadata: Metadata = {
  title: "Yeni məhsul",
  robots: { index: false, follow: false },
};

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { xeta } = await searchParams;
  const { data: producers } = await sb.from("producers").select("id, name").order("name");

  if (!producers || producers.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="font-bold">Əvvəlcə istehsalçı lazımdır</p>
        <p className="mt-2 text-ink-soft">
          Məhsul bir istehsalçıya bağlanmalıdır.
        </p>
        <Link
          href="/admin/bazar/istehsalci/yeni"
          className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white"
        >
          + İstehsalçı yarat
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni məhsul</h1>
      <ProductForm xeta={xeta} producers={producers} />
    </div>
  );
}
