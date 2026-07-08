import type { Metadata } from "next";
import PersonForm from "../PersonForm";

export const metadata: Metadata = {
  title: "Yeni şəxs",
  robots: { index: false, follow: false },
};

export default async function NewPersonPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni şəxs</h1>
      <PersonForm xeta={xeta} />
    </div>
  );
}
