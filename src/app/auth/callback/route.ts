import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/*
  Google OAuth qayıdış nöqtəsi: kodu sessiyaya çevirir (cookie yazılır)
  və istifadəçini gəldiyi səhifəyə qaytarır.
*/
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/profil";
  const safeNext = next.startsWith("/") ? next : "/profil";

  if (code) {
    const sb = await getSupabaseServer();
    if (sb) await sb.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
