import Link from "next/link";
import { getActiveAlerts } from "@/lib/data";

/** Aktiv kəsinti/xəbərdarlıq varsa ana səhifənin üstündə banner — "0 klik" prinsipi */
export default async function DutyBanner() {
  const alerts = await getActiveAlerts();
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((a) => (
        <Link
          key={a.id}
          href="/novbetci"
          className="block rounded-2xl border-2 border-gunebaxan bg-gunebaxan/15 p-4"
        >
          <p className="flex items-start gap-2 font-bold">
            <span className="text-xl" aria-hidden>⚠️</span>
            {a.title}
          </p>
          <p className="mt-1 text-ink-soft">{a.body}</p>
        </Link>
      ))}
    </div>
  );
}
