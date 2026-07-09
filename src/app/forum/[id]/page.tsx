import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { createReply, deleteReply, deleteTopic } from "../actions";

export const metadata: Metadata = { title: "Forum mövzusu" };

export const dynamic = "force-dynamic";

type Topic = {
  id: string;
  title: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
};

type Post = {
  id: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
};

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) notFound();

  const [{ id }, { xeta }, user] = await Promise.all([
    params,
    searchParams,
    getSessionUser(),
  ]);

  const [{ data: topic }, { data: posts }] = await Promise.all([
    sb
      .from("forum_topics")
      .select("id, title, body, author_id, author_name, created_at")
      .eq("id", id)
      .maybeSingle(),
    sb
      .from("forum_posts")
      .select("id, body, author_id, author_name, created_at")
      .eq("topic_id", id)
      .eq("status", "approved")
      .order("created_at", { ascending: true }),
  ]);
  if (!topic) notFound();

  const t = topic as Topic;
  const replies = (posts ?? []) as Post[];
  const canDeleteTopic = user && (user.id === t.author_id || user.isStaff);

  return (
    <div className="space-y-5">
      <Link href="/forum" className="inline-block font-bold text-kerpic">
        ← Forum
      </Link>

      <article className="rounded-2xl border border-line bg-surface p-5">
        <h1 className="font-heading text-2xl font-bold">{t.title}</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {t.author_name} · {formatDateTime(t.created_at)}
        </p>
        <p className="mt-3 whitespace-pre-line leading-relaxed">{t.body}</p>
        {canDeleteTopic && (
          <form action={deleteTopic} className="mt-3">
            <input type="hidden" name="id" value={t.id} />
            <button className="min-h-11 rounded-xl border border-nar px-4 text-sm font-medium text-nar">
              Mövzunu sil
            </button>
          </form>
        )}
      </article>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-bold">
          Cavablar ({replies.length})
        </h2>
        {replies.length === 0 && (
          <p className="text-ink-soft">Hələ cavab yoxdur — birinci siz yazın.</p>
        )}
        <ul className="space-y-2">
          {replies.map((p) => {
            const canDelete = user && (user.id === p.author_id || user.isStaff);
            return (
              <li key={p.id} className="rounded-2xl border border-line bg-surface p-4">
                <p className="whitespace-pre-line leading-relaxed">{p.body}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm text-ink-soft">
                    {p.author_name} · {formatDateTime(p.created_at)}
                  </p>
                  {canDelete && (
                    <form action={deleteReply}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="topic_id" value={t.id} />
                      <button className="text-sm font-medium text-nar">Sil</button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Cavab göndərilmədi — mətni yoxlayıb yenidən cəhd edin.
        </p>
      )}

      {user ? (
        <form
          action={createReply}
          className="space-y-3 rounded-2xl border border-line bg-surface p-4"
        >
          <input type="hidden" name="topic_id" value={t.id} />
          <label className="block">
            <span className="mb-1 block font-medium">Cavabınız</span>
            <textarea
              name="body"
              required
              rows={3}
              maxLength={2000}
              className="w-full rounded-xl border border-line bg-surface p-3"
            />
          </label>
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong"
          >
            Cavab yaz
          </button>
        </form>
      ) : (
        <Link
          href={`/giris?next=/forum/${t.id}`}
          className="block rounded-2xl border-2 border-line bg-surface p-4 text-center font-bold active:bg-surface-2"
        >
          Cavab yazmaq üçün daxil olun →
        </Link>
      )}
    </div>
  );
}
