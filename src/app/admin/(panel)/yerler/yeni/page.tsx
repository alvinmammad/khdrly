import type { Metadata } from "next";
import PlaceForm from "../PlaceForm";

export const metadata: Metadata = {
  title: "Yeni yer",
  robots: { index: false, follow: false },
};

export default async function NewPlacePage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni yer</h1>
      <PlaceForm xeta={xeta} />
    </div>
  );
}
