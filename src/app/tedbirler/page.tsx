import type { Metadata } from "next";
import { getUpcomingEvents } from "@/lib/data";
import { formatDateTime, formatWeekday } from "@/lib/format";

export const metadata: Metadata = { title: "Tədbirlər" };

export const revalidate = 300;

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Tədbirlər</h1>
      <p className="text-ink-soft">Kənddə qarşıdan gələn tədbirlər.</p>

      {events.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-4xl" aria-hidden>📅</p>
          <p className="mt-2 font-bold">Yaxın vaxtda tədbir planlaşdırılmayıb</p>
        </div>
      )}

      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-kerpic">
              {formatWeekday(e.startsAt)}
            </p>
            <p className="mt-1 text-lg font-bold leading-snug">{e.title}</p>
            <p className="mt-1 text-ink-soft">
              📅 {formatDateTime(e.startsAt)}
              {e.location ? ` · 📍 ${e.location}` : ""}
            </p>
            {e.body && <p className="mt-2 text-ink-soft">{e.body}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
