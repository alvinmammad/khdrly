import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "İdarəetmə — giriş",
  robots: { index: false, follow: false },
};

const XETALAR: Record<string, string> = {
  giris: "E-poçt və ya şifrə yanlışdır.",
  env: "Supabase qoşulmayıb — .env.local faylını yoxlayın.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (sb) {
    const staff = await getStaffUser();
    if (staff) redirect("/admin");
  }

  const { xeta } = await searchParams;
  const xetaMesaji = xeta ? XETALAR[xeta] ?? XETALAR.giris : null;

  return (
    <div className="mx-auto max-w-sm space-y-6 py-8">
      <header className="text-center">
        <p className="text-4xl" aria-hidden>🔑</p>
        <h1 className="mt-2 font-heading text-2xl font-bold">İdarəetmə paneli</h1>
        <p className="mt-1 text-ink-soft">
          Bu bölmə kənd icması adına məzmunu idarə edənlər üçündür.
        </p>
      </header>

      {xetaMesaji && (
        <p
          role="alert"
          className="rounded-xl border border-nar bg-nar/10 p-3 text-center font-medium"
        >
          {xetaMesaji}
        </p>
      )}

      <form action={login} className="space-y-4">
        <label className="block">
          <span className="mb-1 block font-medium">E-poçt</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Şifrə</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          Daxil ol
        </button>
      </form>

      <p className="text-center text-sm text-ink-soft">
        Hesablar yalnız kənd icra nümayəndəliyi tərəfindən yaradılır —
        burada qeydiyyat yoxdur.
      </p>
    </div>
  );
}
