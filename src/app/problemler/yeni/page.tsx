import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import IssueForm from "./IssueForm";

export const metadata: Metadata = {
  title: "Problemi bildir",
  robots: { index: false, follow: false },
};

export default async function NewIssuePage() {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/problemler");

  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/problemler/yeni");

  return (
    <div className="space-y-5">
      <Link href="/problemler" className="inline-block font-bold text-kerpic">
        ← Problemlər
      </Link>
      <h1 className="font-heading text-2xl font-bold">🛠️ Problemi bildir</h1>
      <IssueForm />
    </div>
  );
}
