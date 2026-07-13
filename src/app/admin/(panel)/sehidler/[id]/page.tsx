import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import MartyrForm, { MARTYR_XETALAR } from "../MartyrForm";
import PhotoUpload from "./PhotoUpload";
import {
  approveAsAdmin,
  approveFamily,
  deleteMartyr,
  publishMartyr,
  revokeApprovals,
  unpublishMartyr,
} from "../actions";

export const metadata: Metadata = {
  title: "Şəhid profilinə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditMartyrPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const staff = await getStaffUser();
  if (!staff?.roles.includes("admin")) {
    return (
      <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
        Bu bölməni yalnız admin idarə edə bilər.
      </p>
    );
  }

  const [{ id }, { xeta }] = await Promise.all([params, searchParams]);

  const { data } = await sb
    .from("martyrs")
    .select(
      "id, full_name, birth_date, death_date, bio, military_unit, awards, sources, photo_url, anniversary_notify, status, family_rep_approved_at, admin_approved_at"
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const familyOk = !!data.family_rep_approved_at;
  const adminOk = !!data.admin_approved_at;
  const sourcesOk = (data.sources ?? []).length > 0;
  const isPublished = data.status === "approved";
  const canPublish = familyOk && adminOk && sourcesOk;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{data.full_name}</h1>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {MARTYR_XETALAR[xeta] ?? MARTYR_XETALAR.db}
        </p>
      )}

      {/* Dərc vəziyyəti və ikiqat təsdiq paneli */}
      <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold">Dərc vəziyyəti</h2>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              isPublished ? "bg-zeytun/15 text-zeytun" : "bg-surface-2 text-ink-soft"
            }`}
          >
            {isPublished ? "Saytda dərcdədir" : "Qaralama — saytda görünmür"}
          </span>
        </div>

        <ul className="space-y-2">
          <li className="flex items-center justify-between gap-3 rounded-xl border border-line p-3">
            <span>
              <span className="block font-medium">
                {familyOk ? "✅" : "⬜"} Ailənin razılığı
              </span>
              <span className="text-sm text-ink-soft">
                {familyOk
                  ? `Qeydə alınıb: ${formatDate(data.family_rep_approved_at!)}`
                  : "Razılıq ailədən şəxsən/rəsmi qaydada alınmalı və burada qeydə alınmalıdır."}
              </span>
            </span>
            {!familyOk && (
              <form action={approveFamily}>
                <input type="hidden" name="id" value={data.id} />
                <button className="min-h-11 shrink-0 rounded-xl border border-line bg-surface-2 px-4 font-bold">
                  Qeydə al
                </button>
              </form>
            )}
          </li>

          <li className="flex items-center justify-between gap-3 rounded-xl border border-line p-3">
            <span>
              <span className="block font-medium">
                {adminOk ? "✅" : "⬜"} Admin təsdiqi
              </span>
              <span className="text-sm text-ink-soft">
                {adminOk
                  ? `Təsdiqlənib: ${formatDate(data.admin_approved_at!)}`
                  : "Məlumatların mənbələrlə üst-üstə düşdüyünü yoxlayıb təsdiqləyin."}
              </span>
            </span>
            {!adminOk && (
              <form action={approveAsAdmin}>
                <input type="hidden" name="id" value={data.id} />
                <button className="min-h-11 shrink-0 rounded-xl border border-line bg-surface-2 px-4 font-bold">
                  Təsdiqlə
                </button>
              </form>
            )}
          </li>

          <li className="flex items-center justify-between gap-3 rounded-xl border border-line p-3">
            <span>
              <span className="block font-medium">
                {sourcesOk ? "✅" : "⬜"} Mənbə istinadı
              </span>
              <span className="text-sm text-ink-soft">
                {sourcesOk
                  ? `${data.sources.length} mənbə daxil edilib.`
                  : "Aşağıdakı formada ən azı bir rəsmi mənbə əlavə edin."}
              </span>
            </span>
          </li>
        </ul>

        <div className="flex flex-wrap gap-3">
          {!isPublished && canPublish && (
            <form action={publishMartyr}>
              <input type="hidden" name="id" value={data.id} />
              <button className="min-h-12 rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong">
                Sayta dərc et
              </button>
            </form>
          )}
          {!isPublished && !canPublish && (
            <p className="text-sm text-ink-soft">
              Dərc düyməsi hər üç şərt ödənəndə görünəcək.
            </p>
          )}
          {isPublished && (
            <form action={unpublishMartyr}>
              <input type="hidden" name="id" value={data.id} />
              <button className="min-h-12 rounded-xl border border-line bg-surface-2 px-5 font-bold">
                Dərcdən çıxar
              </button>
            </form>
          )}
          {(familyOk || adminOk) && (
            <form action={revokeApprovals}>
              <input type="hidden" name="id" value={data.id} />
              <button className="min-h-12 rounded-xl border border-line px-5 font-medium text-ink-soft">
                Təsdiqləri sıfırla
              </button>
            </form>
          )}
        </div>
      </section>

      <PhotoUpload martyrId={data.id} currentUrl={data.photo_url} />

      <MartyrForm
        defaults={{
          id: data.id,
          fullName: data.full_name,
          birthDate: data.birth_date,
          deathDate: data.death_date,
          bio: data.bio,
          militaryUnit: data.military_unit,
          awards: data.awards,
          sources: data.sources ?? [],
          anniversaryNotify: data.anniversary_notify,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Profili sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz. Silmək əvəzinə profili dərcdən
            çıxarıb qaralamada saxlamaq da olar.
          </p>
          <form action={deleteMartyr}>
            <input type="hidden" name="id" value={data.id} />
            <button className="min-h-12 rounded-xl bg-nar px-5 font-bold text-white">
              Bəli, sil
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
