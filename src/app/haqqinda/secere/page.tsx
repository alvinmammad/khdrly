import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";

export const metadata: Metadata = { title: "Şəcərə və Diaspora" };

export const revalidate = 300;

type Family = { id: string; name: string; description: string | null };
type DiasporaStat = { country: string; city: string; say: number };

async function getData() {
  const sb = getSupabase();
  if (!sb)
    return { families: [] as Family[], stats: [] as DiasporaStat[], residents: 0 };

  const [{ data: families }, { data: stats }, { data: residents }] =
    await Promise.all([
      sb
        .from("families")
        .select("id, name, description")
        .eq("status", "approved")
        .order("sort_order")
        .order("name"),
      sb.rpc("diaspora_stats"),
      sb.rpc("resident_count"),
    ]);

  return {
    families: (families ?? []) as Family[],
    stats: (stats ?? []) as DiasporaStat[],
    residents: Number(residents ?? 0),
  };
}

export default async function GenealogyPage() {
  const { families, stats, residents } = await getData();
  const diasporaTotal = stats.reduce((s, r) => s + Number(r.say), 0);

  return (
    <div className="space-y-6">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">🌳 Şəcərə və Diaspora</h1>
        <p className="mt-2 text-ink-soft">
          Kəndin nəsilləri və dünyaya səpələnmiş xıdırlılılar.
        </p>
      </header>

      {/* Diaspora */}
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">✈️ Harada yaşayırıq?</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line bg-surface p-4 text-center">
            <p className="font-heading text-3xl font-bold text-kerpic">
              {residents}
            </p>
            <p className="text-sm text-ink-soft">qeydiyyatlı sakin 🏡</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4 text-center">
            <p className="font-heading text-3xl font-bold text-kerpic">
              {diasporaTotal}
            </p>
            <p className="text-sm text-ink-soft">diasporada ✈️</p>
          </div>
        </div>
        {stats.length > 0 && (
          <ul className="space-y-1.5">
            {stats.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-2.5"
              >
                <span className="font-medium">
                  {s.city ? `${s.city}${s.country !== "Digər" ? `, ${s.country}` : ""}` : s.country}
                </span>
                <span className="font-bold text-kerpic">{s.say} nəfər</span>
              </li>
            ))}
          </ul>
        )}
        <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
          Siz də sayılın:{" "}
          <Link href="/profil" className="font-bold text-kerpic">
            Profilinizdə
          </Link>{" "}
          harada yaşadığınızı qeyd edin — yalnız saylar görünür, adlar yox.
        </p>
      </section>

      <div className="carpet-divider" aria-hidden />

      {/* Nəsillər */}
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">🌳 Nəsillərimiz</h2>
        {families.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
            Kəndin nəsilləri ağsaqqalların bilgiləri əsasında toplanır və
            tezliklə burada dərc olunacaq. Nəsliniz haqqında məlumatınız
            varsa, kənd icra nümayəndəliyinə müraciət edin.
          </p>
        ) : (
          <ul className="space-y-2">
            {families.map((f) => (
              <li key={f.id} className="rounded-2xl border border-line bg-surface p-4">
                <p className="text-lg font-bold">{f.name}</p>
                {f.description && (
                  <p className="mt-1 leading-relaxed text-ink-soft">
                    {f.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
