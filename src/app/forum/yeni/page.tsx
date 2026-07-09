import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { createTopic } from "../actions";

export const metadata: Metadata = { title: "Yeni mövzu" };

export default async function NewTopicPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/forum");

  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/forum/yeni");

  const { xeta } = await searchParams;

  return (
    <div className="space-y-5">
      <Link href="/forum" className="inline-block font-bold text-kerpic">
        ← Forum
      </Link>
      <h1 className="font-heading text-2xl font-bold">Yeni mövzu</h1>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {xeta === "bos"
            ? "Başlıq və mətn ən azı 3 hərf olmalıdır."
            : "Göndərmək alınmadı — yenidən cəhd edin."}
        </p>
      )}

      <form action={createTopic} className="space-y-4">
        <label className="block">
          <span className="mb-1 block font-medium">Başlıq</span>
          <input
            type="text"
            name="title"
            required
            maxLength={150}
            placeholder="Məs: Su xətti ilə bağlı sual"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Mətn</span>
          <textarea
            name="body"
            required
            rows={6}
            maxLength={3000}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <p className="text-sm text-ink-soft">
          Yazı <strong>{user.fullName}</strong> adı ilə dərc olunacaq (adı
          Profil səhifəsindən dəyişmək olar).
        </p>
        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          Dərc et
        </button>
      </form>
    </div>
  );
}
