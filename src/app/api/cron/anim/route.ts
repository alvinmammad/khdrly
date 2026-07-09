import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPushToAll, vapidConfigured } from "@/lib/push";

/*
  Anım günü bildirişləri — Vercel Cron hər gün 05:00 UTC (09:00 Bakı)
  bu ünvanı çağırır (bax: vercel.json). Vercel CRON_SECRET env dəyişəni
  olanda sorğuya "Authorization: Bearer <secret>" başlığını özü qoşur.

  Abunəlikləri anonim açar OXUYA BİLMƏZ (RLS — endpoint-lər gizlidir),
  ona görə YALNIZ burada server-only SUPABASE_SERVICE_ROLE_KEY işlədilir.
  Bu açar heç vaxt NEXT_PUBLIC_ olmamalı və brauzerə düşməməlidir.
*/

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

  // Bakı vaxtı ilə bugünkü ay/gün
  const nowBaku = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const month = nowBaku.getUTCMonth() + 1;
  const day = nowBaku.getUTCDate();

  const { data: martyrs, error } = await sb
    .from("martyrs")
    .select("id, full_name, death_date")
    .eq("status", "approved")
    .eq("anniversary_notify", true)
    .not("death_date", "is", null);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const todays = (martyrs ?? []).filter((m) => {
    const d = new Date(`${m.death_date}T12:00:00Z`);
    return d.getUTCMonth() + 1 === month && d.getUTCDate() === day;
  });

  if (todays.length === 0) {
    return NextResponse.json({ ok: true, anim: 0 });
  }

  // Bir gündə bir bildiriş — bir neçə şəhid varsa adlar birləşdirilir
  const names = todays.map((m) => m.full_name).join(", ");
  const payload = {
    title: "🕯️ Anım günü",
    body:
      todays.length === 1
        ? `Bu gün şəhidimiz ${names} anılır. Ruhu şad olsun.`
        : `Bu gün şəhidlərimiz anılır: ${names}. Ruhları şad olsun.`,
    url: todays.length === 1 ? `/sehidler/${todays[0].id}` : "/sehidler",
  };

  const result = await sendPushToAll(sb, payload);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await sb.from("notifications").insert({
    type: "anim",
    title: payload.title,
    body: payload.body,
    channels: ["push"],
    sent_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, anim: todays.length, ...result });
}
