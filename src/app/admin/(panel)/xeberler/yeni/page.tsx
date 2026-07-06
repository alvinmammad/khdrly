import type { Metadata } from "next";
import NewsForm from "../NewsForm";

export const metadata: Metadata = {
  title: "Yeni xəbər",
  robots: { index: false, follow: false },
};

export default async function NewNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni xəbər</h1>
      <NewsForm xeta={xeta} />
    </div>
  );
}
