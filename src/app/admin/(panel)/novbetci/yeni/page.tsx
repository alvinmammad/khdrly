import type { Metadata } from "next";
import DutyForm from "../DutyForm";

export const metadata: Metadata = {
  title: "Yeni növbətçi məlumatı",
  robots: { index: false, follow: false },
};

export default async function NewDutyPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni növbətçi məlumatı</h1>
      <DutyForm xeta={xeta} />
    </div>
  );
}
