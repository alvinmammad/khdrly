import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer, getSessionUser } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Forum" };

// Sessiyaya görə fərqli görünür (yaz düyməsi) — dinamik
export const dynamic = "force-dynamic";

type TopicRow = {
  id: string;
  title: string;
  author_name: string;
  created_at: string;
  forum_posts: { count: number }[];
};

export default async function ForumPage() {
  const sb = await getSupabaseServer();

  if (!sb) {
    return (
      <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
        Forum hazırda aktiv deyil.
      </p>
    );
  }

  const [user, { data }] = await Promise.all([
    getSessionUser(),
    sb
      .from("forum_topics")
      .select("id, title, author_name, created_at, forum_posts(count)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  const topics = (data ?? []) as unknown as TopicRow[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">💬 Forum</h1>
        <Link
          href={user ? "/forum/yeni" : "/giris?next=/forum/yeni"}
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni mövzu
        </Link>
      </div>
      <p className="text-ink-soft">
        Kənd icmasının müzakirə meydanı. Oxumaq sərbəstdir, yazmaq üçün giriş
        lazımdır.
      </p>

      {topics.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>💬</p>
          <p className="mt-3 text-xl font-bold">İlk mövzunu siz açın</p>
          <p className="mt-2 text-ink-soft">
            Kəndlə bağlı sual, təklif və ya müzakirə — hamısına açıqdır.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {topics.map((t) => (
            <li key={t.id}>
              <Link
                href={`/forum/${t.id}`}
                className="block rounded-2xl border border-line bg-surface p-4 active:bg-surface-2"
              >
                <p className="text-lg font-bold leading-snug">{t.title}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {t.author_name} · {formatDate(t.created_at)} · 💬{" "}
                  {t.forum_posts?.[0]?.count ?? 0} cavab
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="simple-hide rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Hörmət qaydası: kənd süfrəsindəki kimi — böyük-kiçik yeri bilinən,
        mehriban söhbət. Qaydalara zidd yazılar silinir.
      </p>
    </div>
  );
}
