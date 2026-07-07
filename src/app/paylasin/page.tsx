import type { Metadata } from "next";
import Link from "next/link";
import UploadForm from "./UploadForm";

export const metadata: Metadata = { title: "Siz də paylaşın" };

export default function SharePage() {
  return (
    <div className="space-y-5">
      <Link
        href="/haqqinda/kohne-sekiller"
        className="inline-block font-bold text-kerpic"
      >
        ← Media arxivi
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">📤 Siz də paylaşın</h1>
        <p className="mt-2 text-ink-soft">
          Köhnə fotolar, qayıdış anları, kənd həyatından şəkillər — hamısı
          kəndin rəqəmsal yaddaşına çevrilir.
        </p>
      </header>
      <UploadForm />
    </div>
  );
}
