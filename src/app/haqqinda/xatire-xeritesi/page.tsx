import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { VILLAGE_CENTER } from "@/lib/data/mock";
import MemoryMap, { type MemoryPin } from "./MemoryMap";

export const metadata: Metadata = { title: "Xatirə xəritəsi" };

// Giriş vəziyyətinə görə fərqli görünür — dinamik
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  body: string;
  lat: number;
  lng: number;
  author_name: string | null;
};

async function getPins(): Promise<MemoryPin[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("memory_pins")
    .select("id, title, body, lat, lng, author_name")
    .eq("status", "approved")
    .limit(300);
  return ((data ?? []) as Row[]).map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    lat: r.lat,
    lng: r.lng,
    authorName: r.author_name,
  }));
}

export default async function MemoryMapPage() {
  const sbServer = await getSupabaseServer();
  const [pins, user] = await Promise.all([
    getPins(),
    sbServer ? getSessionUser() : null,
  ]);
  const hasPmtiles = existsSync(path.join(process.cwd(), "public", "xerite.pmtiles"));

  return (
    <div className="space-y-4">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">💭 Xatirə xəritəsi</h1>
        <p className="mt-2 text-ink-soft">
          Köhnə kəndi birlikdə xəritəyə qaytarırıq: hansı evdə kim yaşayırdı,
          dəyirman harada idi, toylar harada olardı. Sancaqlara toxunun —
          xatirələri oxuyun.
        </p>
      </header>

      <MemoryMap
        center={VILLAGE_CENTER}
        pins={pins}
        pmtilesUrl={hasPmtiles ? "/xerite.pmtiles" : undefined}
        canAdd={Boolean(user)}
      />

      {!user && (
        <Link
          href="/giris?next=/haqqinda/xatire-xeritesi"
          className="block rounded-2xl border-2 border-line bg-surface p-4 text-center font-bold active:bg-surface-2"
        >
          💭 Xatirə əlavə etmək üçün daxil olun →
        </Link>
      )}

      <p className="simple-hide rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Xatirələr yoxlanıldıqdan sonra xəritəyə düşür. Yaşlı qohumlarınızın
        xatirələrini onların adından siz əlavə edə bilərsiniz — adı qeyd
        etməyi unutmayın.
      </p>
    </div>
  );
}
