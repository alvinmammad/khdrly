import type { Metadata } from "next";
import StayForm from "../StayForm";

export const metadata: Metadata = {
  title: "Yeni qalma yeri",
  robots: { index: false, follow: false },
};

export default async function NewStayPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni qalma yeri</h1>
      <StayForm xeta={xeta} />
    </div>
  );
}
