import type { Metadata } from "next";
import { getStaffUser } from "@/lib/supabase/server";
import MartyrForm from "../MartyrForm";

export const metadata: Metadata = {
  title: "Yeni şəhid profili",
  robots: { index: false, follow: false },
};

export default async function NewMartyrPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const staff = await getStaffUser();
  if (!staff?.roles.includes("admin")) {
    return (
      <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
        Bu bölməni yalnız admin idarə edə bilər.
      </p>
    );
  }

  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni şəhid profili</h1>
      <p className="text-ink-soft">
        Profil <strong>qaralama</strong> kimi yaradılır — saytda görünmür.
        Dərc üçün növbəti addımda ikiqat təsdiq tələb olunacaq.
      </p>
      <MartyrForm xeta={xeta} />
    </div>
  );
}
