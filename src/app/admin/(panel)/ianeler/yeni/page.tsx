import type { Metadata } from "next";
import DonationForm from "../DonationForm";

export const metadata: Metadata = {
  title: "Yeni ianə",
  robots: { index: false, follow: false },
};

export default async function NewDonationPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni ianə qeydi</h1>
      <DonationForm xeta={xeta} />
    </div>
  );
}
