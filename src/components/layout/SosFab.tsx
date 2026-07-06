"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Hər səhifədə görünən sabit SOS düyməsi — təcili nömrələrə maks. 2 toxunuş */
export default function SosFab() {
  const pathname = usePathname();
  if (pathname === "/sos") return null;

  return (
    <Link
      href="/sos"
      className="fixed bottom-24 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-sos text-lg font-extrabold text-white shadow-lg shadow-black/25 active:scale-95"
      aria-label="SOS — təcili yardım nömrələri"
    >
      SOS
    </Link>
  );
}
