import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import { signGuestBook } from "./actions";

export const metadata: Metadata = { title: "Qonaq kitabı" };

// Forma cavabı (?ok/?xeta) dərhal görünsün deyə dinamik; siyahı onsuz da yüngüldür
export const dynamic = "force-dynamic";

type Entry = { id: string; name: string | null; message: string; created_at: string };

async function getEntries(): Promise<Entry[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("guest_entries")
    .select("id, name, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as Entry[];
}

export default async function GuestBookPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; xeta?: string }>;
}) {
  const [{ ok, xeta }, entries] = await Promise.all([searchParams, getEntries()]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">📖 Qonaq kitabı</h1>
        <p className="mt-2 text-ink-soft">
          Kəndimizə gələn qonaqların və həmyerlilərimizin təəssüratları.
        </p>
      </header>

      {ok && (
        <p className="rounded-xl border-2 border-zeytun bg-zeytun/10 p-4 text-center font-medium">
          🙏 Təşəkkür edirik! Yazınız yoxlanıldıqdan sonra burada görünəcək.
        </p>
      )}
      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Göndərmək alınmadı — mesaj 3–400 hərf olmalıdır. Yenidən cəhd edin.
        </p>
      )}

      <form
        action={signGuestBook}
        className="space-y-4 rounded-2xl border border-line bg-surface p-5"
      >
        <p className="font-bold">✍️ Siz də yazın</p>
        <label className="block">
          <span className="mb-1 block font-medium">Adınız / haradan gəlmisiniz (istəyə bağlı)</span>
          <input
            type="text"
            name="name"
            maxLength={80}
            placeholder="Məs: Rəşad, Bakı"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Təəssüratınız</span>
          <textarea
            name="message"
            required
            minLength={3}
            maxLength={400}
            rows={3}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong"
        >
          Göndər
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          İlk təəssüratı siz yaza bilərsiniz.
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="rounded-2xl border border-line bg-surface p-4">
              <p className="leading-relaxed">"{e.message}"</p>
              <p className="mt-2 text-sm text-ink-soft">
                — {e.name || "Qonaq"} · {formatDate(e.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
