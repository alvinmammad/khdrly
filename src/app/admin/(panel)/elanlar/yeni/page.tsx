import type { Metadata } from "next";
import ListingForm from "../ListingForm";

export const metadata: Metadata = {
  title: "Yeni elan",
  robots: { index: false, follow: false },
};

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni elan</h1>
      <ListingForm xeta={xeta} />
    </div>
  );
}
