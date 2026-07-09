"use client";

export default function PrintButton({ label = "🖨️ Çap et" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex min-h-12 items-center gap-2 rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong print:hidden"
    >
      {label}
    </button>
  );
}
