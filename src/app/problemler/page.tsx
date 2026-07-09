import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import { mediaPublicUrl } from "@/lib/data";
import { ISSUE_STATUS_META } from "@/lib/problemMeta";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Problemlər" };

export const revalidate = 120;

type Row = {
  id: string;
  title: string;
  location: string | null;
  photo_path: string | null;
  reporter_name: string;
  status: string;
  staff_note: string | null;
  created_at: string;
};

async function getIssues(): Promise<Row[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("issues")
    .select("id, title, location, photo_path, reporter_name, status, staff_note, created_at")
    .neq("status", "redd")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as Row[];
}

export default async function IssuesPage() {
  const issues = await getIssues();
  const open = issues.filter((i) => ISSUE_STATUS_META[i.status]?.open);
  const closed = issues.filter((i) => !ISSUE_STATUS_META[i.status]?.open);

  const IssueCard = ({ item }: { item: Row }) => {
    const meta = ISSUE_STATUS_META[item.status];
    return (
      <li className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-bold leading-snug">{item.title}</p>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
              meta?.open ? "bg-gunebaxan/20" : "bg-zeytun/15 text-zeytun"
            }`}
          >
            {meta?.icon} {meta?.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {item.location ? `📍 ${item.location} · ` : ""}
          {item.reporter_name} · {formatDate(item.created_at)}
        </p>
        {item.photo_path && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaPublicUrl(item.photo_path)}
            alt={item.title}
            loading="lazy"
            className="mt-2 max-h-48 rounded-xl object-cover"
          />
        )}
        {item.staff_note && (
          <p className="mt-2 rounded-xl bg-surface-2 p-3 text-sm">
            🏛 <strong>İcra nümayəndəliyi:</strong> {item.staff_note}
          </p>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">🛠️ Problemlər</h1>
        <Link
          href="/problemler/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Bildir
        </Link>
      </div>
      <p className="text-ink-soft">
        Kənddə gördüyünüz problemi bildirin — icra nümayəndəliyi baxır,
        gedişat hamıya açıq görünür.
      </p>

      {issues.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>👍</p>
          <p className="mt-3 text-xl font-bold">Aktiv problem bildirilməyib</p>
          <p className="mt-2 text-ink-soft">
            Nəsə görsəniz — lampa yanmır, yol çuxuru, su sızması —
            buradan bildirin.
          </p>
        </div>
      )}

      {open.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">Açıq ({open.length})</h2>
          <ul className="space-y-3">
            {open.map((i) => (
              <IssueCard key={i.id} item={i} />
            ))}
          </ul>
        </section>
      )}

      {closed.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">
            Həll olunmuşlar ({closed.length})
          </h2>
          <ul className="space-y-3">
            {closed.map((i) => (
              <IssueCard key={i.id} item={i} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
