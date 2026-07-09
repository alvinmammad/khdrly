import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { sendPushToAll, vapidConfigured, type PushPayload } from "@/lib/push";
import { getWeather } from "@/lib/weather";

/*
  Gündəlik cron (Vercel, 05:00 UTC = 09:00 Bakı — bax: vercel.json).
  Bir işə düşmədə üç yoxlama:
    1) Anım günləri  — bu gün anım günü olan şəhidlər üçün bildiriş
    2) Hava xəbərdarlığı — sabah şaxta / güclü isti / güclü külək
    3) Mövsüm açılışı — ayın 1-də həmin ay mövsümü başlayan məhsullar

  Abunəlikləri anonim açar OXUYA BİLMƏZ (RLS), ona görə YALNIZ burada
  server-only SUPABASE_SERVICE_ROLE_KEY işlədilir.
*/

async function pushAndLog(
  sb: SupabaseClient,
  type: string,
  payload: PushPayload
) {
  const result = await sendPushToAll(sb, payload);
  await sb.from("notifications").insert({
    type,
    title: payload.title,
    body: payload.body,
    channels: ["push"],
    sent_at: new Date().toISOString(),
  });
  return result;
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "icazə yoxdur" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || !vapidConfigured()) {
    return NextResponse.json(
      { error: "env natamamdır (SUPABASE_SERVICE_ROLE_KEY / VAPID)" },
      { status: 500 }
    );
  }

  const sb = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const nowBaku = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const month = nowBaku.getUTCMonth() + 1;
  const day = nowBaku.getUTCDate();
  const netice: Record<string, unknown> = { ok: true };

  // ---------- 1) Anım günləri ----------
  const { data: martyrs } = await sb
    .from("martyrs")
    .select("id, full_name, death_date")
    .eq("status", "approved")
    .eq("anniversary_notify", true)
    .not("death_date", "is", null);

  const todays = (martyrs ?? []).filter((m) => {
    const d = new Date(`${m.death_date}T12:00:00Z`);
    return d.getUTCMonth() + 1 === month && d.getUTCDate() === day;
  });

  if (todays.length > 0) {
    const names = todays.map((m) => m.full_name).join(", ");
    netice.anim = await pushAndLog(sb, "anim", {
      title: "🕯️ Anım günü",
      body:
        todays.length === 1
          ? `Bu gün şəhidimiz ${names} anılır. Ruhu şad olsun.`
          : `Bu gün şəhidlərimiz anılır: ${names}. Ruhları şad olsun.`,
      url: todays.length === 1 ? `/sehidler/${todays[0].id}` : "/sehidler",
    });
  }

  // ---------- 2) Hava xəbərdarlığı (sabah üçün) ----------
  const weather = await getWeather();
  const sabah = weather?.daily?.[1];
  if (sabah) {
    const xeberdarliqlar: string[] = [];
    if (sabah.tempMin <= 0)
      xeberdarliqlar.push(
        `❄️ Şaxta gözlənilir (${sabah.tempMin}°) — bostan bitkilərini örtün, suları boşaldın.`
      );
    if (sabah.tempMax >= 38)
      xeberdarliqlar.push(
        `🔥 Güclü isti (${sabah.tempMax}°) — heyvanları kölgəyə çəkin, suvarmanı axşama saxlayın.`
      );
    if (sabah.windMaxKmh >= 60)
      xeberdarliqlar.push(
        `💨 Güclü külək (${Math.round(sabah.windMaxKmh)} km/s) — istixana örtüklərini bərkidin.`
      );

    if (xeberdarliqlar.length > 0) {
      netice.hava = await pushAndLog(sb, "hava", {
        title: "⚠️ Sabah üçün hava xəbərdarlığı",
        body: xeberdarliqlar.join(" "),
        url: "/hava",
      });
    }
  }

  // ---------- 3) Mövsüm açılışı (ayın 1-i) ----------
  if (day === 1) {
    const { data: products } = await sb
      .from("products")
      .select("name")
      .eq("status", "approved")
      .eq("available", true)
      .eq("season_start", month);

    if (products && products.length > 0) {
      const adlar = products.slice(0, 3).map((p) => p.name).join(", ");
      netice.movsum = await pushAndLog(sb, "movsum", {
        title: "🌱 Mövsüm başladı!",
        body: `Bazarda mövsümü açılan məhsullar: ${adlar}${products.length > 3 ? " və s." : ""}`,
        url: "/bazar",
      });
    }
  }

  return NextResponse.json(netice);
}
