import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { signOut, updateProfile } from "./actions";

export const metadata: Metadata = {
  title: "Profilim",
  robots: { index: false, follow: false },
};

const XETALAR: Record<string, string> = {
  ad: "Ad boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) {
    return (
      <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
        Giriş sistemi hazırda aktiv deyil.
      </p>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/profil");

  const { ok, xeta } = await searchParams;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="text-center">
        <p className="text-4xl" aria-hidden>👤</p>
        <h1 className="mt-2 font-heading text-2xl font-bold">Profilim</h1>
        {user.email && <p className="text-ink-soft">{user.email}</p>}
      </header>

      {ok && (
        <p className="rounded-xl border-2 border-zeytun bg-zeytun/10 p-3 text-center font-medium">
          ✅ Yadda saxlanıldı.
        </p>
      )}
      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <form action={updateProfile} className="space-y-4">
        <label className="block">
          <span className="mb-1 block font-medium">Ad, soyad</span>
          <input
            type="text"
            name="full_name"
            required
            defaultValue={user.fullName}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            Forumdakı yazılarınızın yanında bu ad görünür.
          </span>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Telefon (istəyə bağlı)</span>
          <input
            type="tel"
            name="phone"
            placeholder="+994501234567"
            defaultValue={user.phone ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            Yalnız icra nümayəndəliyi görür (gələcəkdə sifarişlər üçün) —
            saytda heç vaxt açıq göstərilmir.
          </span>
        </label>
        <fieldset className="rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 font-medium">🌍 Harada yaşayırsınız?</legend>
          <div className="space-y-2">
            <label className="flex items-center gap-3 rounded-xl border border-line p-3 has-[:checked]:border-kerpic has-[:checked]:bg-kerpic/10">
              <input
                type="radio"
                name="is_resident"
                value="kend"
                defaultChecked={user.isResident}
                className="h-5 w-5"
              />
              <span className="font-medium">🏡 Kənddə / Azərbaycanda</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-line p-3 has-[:checked]:border-kerpic has-[:checked]:bg-kerpic/10">
              <input
                type="radio"
                name="is_resident"
                value="diaspora"
                defaultChecked={!user.isResident}
                className="h-5 w-5"
              />
              <span className="font-medium">✈️ Kənddən kənarda (diaspora)</span>
            </label>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              type="text"
              name="city"
              placeholder="Şəhər (məs. Moskva)"
              defaultValue={user.city ?? ""}
              className="w-full rounded-xl border border-line bg-surface p-3"
            />
            <input
              type="text"
              name="country"
              placeholder="Ölkə (məs. Rusiya)"
              defaultValue={user.country ?? ""}
              className="w-full rounded-xl border border-line bg-surface p-3"
            />
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Diaspora xəritəsində yalnız <strong>saylar</strong> görünür
            (məs. "Moskva — 5 nəfər") — adınız göstərilmir.
          </p>
        </fieldset>

        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong"
        >
          Yadda saxla
        </button>
      </form>

      <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
        <Link href="/forum" className="block font-bold text-kerpic">
          💬 Forum — icma müzakirələri →
        </Link>
        <Link href="/sifarislerim" className="block font-bold text-kerpic">
          🛒 Sifarişlərim →
        </Link>
        {user.isStaff && (
          <Link href="/admin" className="block font-bold text-kerpic">
            🛠️ İdarəetmə paneli →
          </Link>
        )}
      </div>

      <form action={signOut} className="text-center">
        <button className="min-h-12 rounded-xl border border-line px-6 font-medium text-ink-soft">
          Hesabdan çıx
        </button>
      </form>
    </div>
  );
}
