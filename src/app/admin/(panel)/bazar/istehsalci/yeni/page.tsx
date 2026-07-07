import type { Metadata } from "next";
import ProducerForm from "../ProducerForm";

export const metadata: Metadata = {
  title: "Yeni istehsalçı",
  robots: { index: false, follow: false },
};

export default async function NewProducerPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni istehsalçı</h1>
      <ProducerForm xeta={xeta} />
    </div>
  );
}
