import type { Metadata } from "next";
import TimelineForm from "../TimelineForm";

export const metadata: Metadata = {
  title: "Yeni tarix hadisəsi",
  robots: { index: false, follow: false },
};

export default async function NewTimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni tarix hadisəsi</h1>
      <TimelineForm xeta={xeta} />
    </div>
  );
}
