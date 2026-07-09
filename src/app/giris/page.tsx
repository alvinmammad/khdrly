import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import GoogleButton from "./GoogleButton";

export const metadata: Metadata = { title: "Daxil ol" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/") ? next : "/profil";

  const sb = await getSupabaseServer();
  if (sb) {
    const user = await getSessionUser();
    if (user) redirect(safeNext);
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 py-8">
      <header className="text-center">
        <p className="text-4xl" aria-hidden>👋</p>
        <h1 className="mt-2 font-heading text-2xl font-bold">Daxil ol</h1>
        <p className="mt-2 text-ink-soft">
          Saytı oxumaq üçün giriş lazım deyil. Giriş yalnız forumda yazmaq və
          gələcək imkanlar (sifariş, elan) üçündür.
        </p>
      </header>

      <GoogleButton next={safeNext} />

      <p className="text-center text-sm text-ink-soft">
        Davam etməklə adınızın yazılarınızın yanında görünməsinə razılıq
        verirsiniz. Telefon nömrəniz heç vaxt açıq göstərilmir.
      </p>
    </div>
  );
}
