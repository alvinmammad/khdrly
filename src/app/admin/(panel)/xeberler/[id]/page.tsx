import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import NewsForm from "../NewsForm";
import { deleteNews } from "../actions";

export const metadata: Metadata = {
  title: "Xəbərə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const [{ id }, { xeta }] = await Promise.all([params, searchParams]);

  const { data } = await sb
    .from("news")
    .select("id, title, body, cover_emoji, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Xəbərə düzəliş</h1>

      <NewsForm
        xeta={xeta}
        defaults={{
          id: data.id,
          title: data.title,
          body: data.body,
          coverEmoji: data.cover_emoji,
          status: data.status,
        }}
      />

      {/* Silmə iki addımlıdır — təsadüfi toxunuşdan qorunmaq üçün */}
      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Xəbəri sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz. Xəbər saytdan və bazadan tam silinəcək.
          </p>
          <form action={deleteNews}>
            <input type="hidden" name="id" value={data.id} />
            <button className="min-h-12 rounded-xl bg-nar px-5 font-bold text-white">
              Bəli, sil
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
