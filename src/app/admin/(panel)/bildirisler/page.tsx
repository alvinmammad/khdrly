import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { sendNotification } from "./actions";

export const metadata: Metadata = {
  title: "Bildirişlər — idarəetmə",
  robots: { index: false, follow: false },
};

const XETALAR: Record<string, string> = {
  bos: "Başlıq və mətn boş ola bilməz.",
  url: "Keçid daxili olmalıdır — “/” ilə başlamalıdır (məs. /xeberler).",
  env: "VAPID açarları qurulmayıb — .env.local faylını yoxlayın.",
  db: "Abunəlikləri oxumaq alınmadı — yenidən cəhd edin.",
};

const TYPE_LABEL: Record<string, string> = {
  xeber: "Xəbər",
  tedbir: "Tədbir",
  novbetci: "Növbətçi",
  anim: "Anım günü",
};

type NotifRow = {
  id: string;
  type: string;
  title: string;
  sent_at: string | null;
};

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string; gonderildi?: string; cemi?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { xeta, gonderildi, cemi } = await searchParams;

  const [{ count: abuneSayi }, { data: sonGonderisler }] = await Promise.all([
    sb.from("push_subscriptions").select("id", { count: "exact", head: true }),
    sb
      .from("notifications")
      .select("id, type, title, sent_at")
      .order("sent_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Push bildirişlər</h1>

      <p className="rounded-xl border border-line bg-surface-2 p-3">
        📱 Hazırda <strong>{abuneSayi ?? 0}</strong> cihaz bildirişlərə abunədir.
        Göndərilən bildiriş bütün abunə cihazlara çatır — az və yerində istifadə
        edin ki, sakinlər bildirişləri söndürməsin.
      </p>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}
      {gonderildi !== undefined && (
        <p className="rounded-xl border border-line bg-zeytun/10 p-3 font-medium">
          ✅ Bildiriş {cemi} cihazdan {gonderildi}-nə uğurla göndərildi.
        </p>
      )}

      <form action={sendNotification} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-medium">Növ</span>
            <select
              name="type"
              defaultValue="xeber"
              className="w-full rounded-xl border border-line bg-surface p-3"
            >
              {Object.entries(TYPE_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block font-medium">Keçid (toxununca açılır)</span>
            <input
              type="text"
              name="url"
              placeholder="/xeberler"
              className="w-full rounded-xl border border-line bg-surface p-3"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block font-medium">Başlıq</span>
          <input
            type="text"
            name="title"
            required
            maxLength={80}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">Mətn</span>
          <textarea
            name="body"
            required
            rows={3}
            maxLength={200}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            Qısa yazın — telefonda 1–2 sətir görünür.
          </span>
        </label>

        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          📤 Hamıya göndər
        </button>
      </form>

      {sonGonderisler && sonGonderisler.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-bold">Son göndərişlər</h2>
          <ul className="space-y-2">
            {(sonGonderisler as NotifRow[]).map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3"
              >
                <span className="font-medium">{n.title}</span>
                <span className="shrink-0 text-sm text-ink-soft">
                  {TYPE_LABEL[n.type] ?? n.type}
                  {n.sent_at ? ` · ${formatDateTime(n.sent_at)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
