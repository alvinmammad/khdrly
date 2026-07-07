import type { Metadata } from "next";
import ServiceForm from "../ServiceForm";

export const metadata: Metadata = {
  title: "Yeni xidmətçi",
  robots: { index: false, follow: false },
};

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni xidmətçi</h1>
      <ServiceForm xeta={xeta} />
    </div>
  );
}
