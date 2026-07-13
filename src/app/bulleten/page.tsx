import type { Metadata } from "next";
import QRCode from "qrcode";
import {
  getDutyInfo,
  getListings,
  getNews,
  getUpcomingEvents,
} from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/format";
import PrintButton from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "Kənd bülleteni",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

/*
  Kağız körpüsü: smartfonu olmayan sakinlər üçün həftəlik bülleten.
  Səhifə saytdakı aktual məzmunu özü A4-ə yığır — icra nümayəndəliyi
  yalnız "Çap et" basıb elan lövhəsinə vurur. Sağ küncdəki QR isə
  smartfonu olanları sayta gətirir.
*/
export default async function BulletinPage() {
  const [news, duty, events, listings] = await Promise.all([
    getNews(),
    getDutyInfo(),
    getUpcomingEvents(),
    getListings(),
  ]);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekNews = news
    .filter((n) => new Date(n.publishedAt).getTime() >= weekAgo)
    .slice(0, 5);
  const showNews = weekNews.length > 0 ? weekNews : news.slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xidirli.vercel.app";
  const qr = await QRCode.toDataURL(siteUrl, {
    width: 240,
    margin: 1,
    color: { dark: "#3d2b1f", light: "#ffffff" },
  });

  const today = new Intl.DateTimeFormat("az-Latn-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Baku", // server UTC-dədir
  }).format(new Date());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <h1 className="font-heading text-2xl font-bold">🖨️ Kənd bülleteni</h1>
        <PrintButton />
      </div>
      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm print:hidden">
        Bu səhifə saytdakı aktual məzmunu avtomatik A4-ə yığır. Çap edib
        kəndin elan lövhəsinə vurun — interneti olmayan sakinlər də
        xəbərdar olsun. Həftədə bir dəfə kifayətdir.
      </p>

      {/* ==== A4 bülleten ==== */}
      <div className="rounded-2xl border-2 border-kerpic bg-white p-6 text-[#3d2b1f] print:rounded-none print:border-0 print:p-0">
        <header className="flex items-start justify-between gap-4 border-b-4 border-[#b5542d] pb-3">
          <div>
            <p className="font-heading text-3xl font-extrabold">XIDIRLI</p>
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a5c]">
              Kənd bülleteni · {today}
            </p>
          </div>
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Saytın QR kodu" className="h-24 w-24" />
            <p className="text-[10px] font-bold text-[#7a6a5c]">
              📱 Skan et — hamısı telefonunda
            </p>
          </div>
        </header>

        {/* Növbətçi / xəbərdarlıqlar */}
        {duty.length > 0 && (
          <section className="mt-4">
            <h2 className="font-heading text-lg font-extrabold uppercase">
              🔔 Vacib məlumatlar
            </h2>
            <ul className="mt-1 space-y-1.5">
              {duty.slice(0, 4).map((d) => (
                <li key={d.id} className="text-sm leading-snug">
                  <strong>
                    {d.isAlert ? "⚠️ " : ""}
                    {d.title}:
                  </strong>{" "}
                  {d.body}
                  {d.phone ? ` — Tel: ${d.phone}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Xəbərlər */}
        {showNews.length > 0 && (
          <section className="mt-4">
            <h2 className="font-heading text-lg font-extrabold uppercase">
              📰 Xəbərlər
            </h2>
            <ul className="mt-1 space-y-2">
              {showNews.map((n) => (
                <li key={n.id} className="text-sm leading-snug">
                  <strong>{n.title}</strong> ({formatDate(n.publishedAt)})
                  <br />
                  {n.body.split("\n")[0].slice(0, 220)}
                  {n.body.length > 220 ? "…" : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tədbirlər */}
        {events.length > 0 && (
          <section className="mt-4">
            <h2 className="font-heading text-lg font-extrabold uppercase">
              📅 Qarşıdan gələnlər
            </h2>
            <ul className="mt-1 space-y-1">
              {events.slice(0, 4).map((e) => (
                <li key={e.id} className="text-sm">
                  <strong>{e.title}</strong> — {formatDateTime(e.startsAt)}
                  {e.location ? ` · ${e.location}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Elanlar */}
        {listings.length > 0 && (
          <section className="mt-4">
            <h2 className="font-heading text-lg font-extrabold uppercase">
              📢 Elanlar
            </h2>
            <ul className="mt-1 space-y-1">
              {listings.slice(0, 4).map((l) => (
                <li key={l.id} className="text-sm">
                  <strong>{l.title}</strong>
                  {l.phone ? ` — Tel: ${l.phone}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-5 border-t-2 border-[#b5542d] pt-2 text-center text-sm font-bold">
          🆘 Təcili: 103 Təcili yardım · 101 Yanğın · 102 Polis · 112 FHN
          <span className="block text-[11px] font-medium text-[#7a6a5c]">
            Ətraflı məlumat: {siteUrl.replace("https://", "")} · Bülleteni
            saxlayın, qonşunuza göstərin
          </span>
        </footer>
      </div>
    </div>
  );
}
