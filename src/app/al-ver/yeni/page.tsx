import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import AlVerForm from "./AlVerForm";

export const metadata: Metadata = {
  title: "Yeni elan",
  robots: { index: false, follow: false },
};

export default async function NewMarketItemPage() {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/al-ver");

  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/al-ver/yeni");

  return (
    <div className="space-y-5">
      <Link href="/al-ver" className="inline-block font-bold text-kerpic">
        ← Al-ver
      </Link>
      <h1 className="font-heading text-2xl font-bold">🏷️ Yeni elan</h1>
      <AlVerForm defaultPhone={user.phone ?? ""} />
    </div>
  );
}
