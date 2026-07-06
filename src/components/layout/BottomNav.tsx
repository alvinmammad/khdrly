"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", icon: "🏠", label: "Ana səhifə" },
  { href: "/xeberler", icon: "📰", label: "Xəbərlər" },
  { href: "/bazar", icon: "🛒", label: "Bazar" },
  { href: "/xerite", icon: "🗺️", label: "Xəritə" },
  { href: "/bolmeler", icon: "☰", label: "Bölmələr" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
      aria-label="Əsas naviqasiya"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-16 flex-col items-center justify-center gap-0.5 py-1.5 ${
                active ? "text-kerpic" : "text-ink-soft"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-2xl leading-none" aria-hidden>
                {item.icon}
              </span>
              <span className={`text-xs ${active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
