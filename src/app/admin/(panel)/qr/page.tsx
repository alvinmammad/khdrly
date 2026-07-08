import type { Metadata } from "next";
import QRCode from "qrcode";
import { getSupabaseServer } from "@/lib/supabase/server";
import { PLACE_META } from "@/lib/placeMeta";
import type { PlaceType } from "@/lib/data/types";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "QR posterlər — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = { id: string; slug: string; name: string; type: string };

export default async function AdminQrPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

  const { data } = await sb
    .from("places")
    .select("id, slug, name, type")
    .eq("status", "approved")
    .order("name");
  const places = (data ?? []) as Row[];

  // Hər yer üçün QR kodu server tərəfdə data-URL kimi yaradılır
  const posters = await Promise.all(
    places.map(async (p) => ({
      ...p,
      qr: await QRCode.toDataURL(`${siteUrl}/q/${p.slug}`, {
        width: 480,
        margin: 1,
        color: { dark: "#3d2b1f", light: "#ffffff" },
      }),
    }))
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <h1 className="font-heading text-2xl font-bold">QR posterlər</h1>
        <PrintButton />
      </div>

      {!siteUrl && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium print:hidden">
          <code>NEXT_PUBLIC_SITE_URL</code> təyin olunmayıb — QR kodlar natamam
          ünvan daşıyır. <code>.env.local</code>-a saytın ünvanını əlavə edib
          yenidən build edin.
        </p>
      )}

      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm print:hidden">
        Posterləri çap edib laminasiya ilə yerlərə vurun. QR skan edilən kimi
        ziyarətçi həmin yerin səhifəsinə düşür. Yerin adı/təsviri dəyişsə,
        QR-i yenidən çap etmək LAZIM DEYİL — kod dəyişməz qalır.
      </p>

      {posters.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft print:hidden">
          Təsdiqlənmiş yer yoxdur — əvvəlcə Xəritə bölməsində yer əlavə edin.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2 print:gap-4">
          {posters.map((p) => {
            const meta = PLACE_META[p.type as PlaceType];
            return (
              <div
                key={p.id}
                className="break-inside-avoid rounded-2xl border-2 border-kerpic bg-white p-6 text-center print:rounded-none"
                style={{ pageBreakInside: "avoid" }}
              >
                <p className="text-4xl" aria-hidden>{meta?.icon}</p>
                <p className="mt-1 font-heading text-2xl font-bold text-[#3d2b1f]">
                  {p.name}
                </p>
                <p className="text-sm text-[#7a6a5c]">Xıdırlı kəndi</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.qr}
                  alt={`${p.name} üçün QR kod`}
                  className="mx-auto mt-3 w-56"
                />
                <p className="mt-2 text-sm font-bold text-[#3d2b1f]">
                  📱 Skan edin — yerin tarixçəsini oxuyun
                </p>
                <p className="text-xs text-[#7a6a5c]">{siteUrl}/q/{p.slug}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
