import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import AccessibilityBar from "./AccessibilityBar";
import WeatherChip from "./WeatherChip";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Ana səhifə">
          <Image src="/icon.svg" alt="" width={40} height={40} priority />
          <span className="truncate font-heading text-2xl font-bold tracking-tight">
            Xıdırlı
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Suspense fallback={<div className="h-11 w-16 rounded-xl bg-surface-2" aria-hidden />}>
            <WeatherChip />
          </Suspense>
          <AccessibilityBar />
        </div>
      </div>
    </header>
  );
}
