import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { mediaPublicUrl } from "@/lib/data";
import { ISSUE_STATUS_META, ISSUE_STATUSES } from "@/lib/problemMeta";
import { formatDateTime } from "@/lib/format";
import { deleteIssue, updateIssue } from "./actions";

export const metadata: Metadata = {
  title: "Problemlər — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  title: string;
  body: string;
  location: string | null;
  photo_path: string | null;
  reporter_name: string;
  status: string;
  staff_note: string | null;
  created_at: string;
};

function IssueCard({ item }: { item: Row }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <p className="font-bold">{item.title}</p>
      <p className="text-sm text-ink-soft">
        {item.location ? `📍 ${item.location} · ` : ""}
        {item.reporter_name} · {formatDateTime(item.created_at)}
      </p>
      <p className="mt-1">{item.body}</p>
      {item.photo_path && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaPublicUrl(item.photo_path)}
          alt={item.title}
          loading="lazy"
          className="mt-2 max-h-56 rounded-xl object-cover"
        />
      )}
      <form action={updateIssue} className="mt-3 space-y-2">
        <input type="hidden" name="id" value={item.id} />
        <div className="flex flex-wrap gap-2">
          <select
            name="status"
            defaultValue={item.status}
            className="rounded-xl border border-line bg-surface p-2.5"
          >
            {ISSUE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ISSUE_STATUS_META[s].icon} {ISSUE_STATUS_META[s].label}
              </option>
            ))}
          </select>
          <button className="min-h-11 rounded-xl bg-kerpic px-4 font-bold text-white active:bg-kerpic-strong">
            Yadda saxla
          </button>
        </div>
        <input
          type="text"
          name="staff_note"
          defaultValue={item.staff_note ?? ""}
          maxLength={500}
          placeholder="Rəsmi qeyd (hamıya görünür): məs. 'Material sifariş olunub'"
          className="w-full rounded-xl border border-line bg-surface p-2.5"
        />
      </form>
      <form action={deleteIssue} className="mt-2">
        <input type="hidden" name="id" value={item.id} />
        <button className="text-sm font-medium text-nar">Sil</button>
      </form>
    </li>
  );
}

export default async function AdminIssuesPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data } = await sb
    .from("issues")
    .select("id, title, body, location, photo_path, reporter_name, status, staff_note, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as Row[];
  const open = rows.filter((r) => ISSUE_STATUS_META[r.status]?.open);
  const closed = rows.filter((r) => !ISSUE_STATUS_META[r.status]?.open);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">🛠️ Problemlər</h1>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">Açıq ({open.length})</h2>
        {open.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-5 text-center text-ink-soft">
            Açıq problem yoxdur. 👏
          </p>
        ) : (
          <ul className="space-y-3">
            {open.map((r) => (
              <IssueCard key={r.id} item={r} />
            ))}
          </ul>
        )}
      </section>

      {closed.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">
            Bağlanmışlar ({closed.length})
          </h2>
          <ul className="space-y-3">
            {closed.map((r) => (
              <IssueCard key={r.id} item={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
