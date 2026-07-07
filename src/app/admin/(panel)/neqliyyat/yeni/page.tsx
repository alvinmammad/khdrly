import type { Metadata } from "next";
import RouteForm from "../RouteForm";

export const metadata: Metadata = {
  title: "Yeni marşrut",
  robots: { index: false, follow: false },
};

export default async function NewRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Yeni marşrut</h1>
      <RouteForm xeta={xeta} />
    </div>
  );
}
