import { saveMartyr } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Ad, soyad boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
  tesdiq: "Dərc üçün hər iki təsdiq (ailə + admin) olmalıdır.",
  menbe: "Dərc üçün ən azı bir rəsmi mənbə istinadı daxil edilməlidir.",
};

export const MARTYR_XETALAR = XETALAR;

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    fullName: string;
    birthDate: string | null;
    deathDate: string | null;
    bio: string | null;
    militaryUnit: string | null;
    awards: string[] | null;
    sources: string[];
    photoUrl: string | null;
    anniversaryNotify: boolean;
  };
};

export default function MartyrForm({ xeta, defaults }: Props) {
  return (
    <form action={saveMartyr} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Bütün məlumatlar ailənin razılığı ilə və yalnız rəsmi mənbələrə
        əsasən daxil edilməlidir. Təxmini və ya yoxlanılmamış məlumat yazmayın.
      </p>

      <label className="block">
        <span className="mb-1 block font-medium">Ad, soyad (ata adı ilə)</span>
        <input
          type="text"
          name="full_name"
          required
          defaultValue={defaults?.fullName ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Doğum tarixi</span>
          <input
            type="date"
            name="birth_date"
            defaultValue={defaults?.birthDate ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Şəhidlik tarixi</span>
          <input
            type="date"
            name="death_date"
            defaultValue={defaults?.deathDate ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Həyat hekayəsi</span>
        <textarea
          name="bio"
          rows={8}
          defaultValue={defaults?.bio ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <span className="mt-1 block text-sm text-ink-soft">
          Ailənin təqdim etdiyi və rəsmi mənbələrlə üst-üstə düşən məlumatlar.
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Hərbi hissə (istəyə bağlı)</span>
          <input
            type="text"
            name="military_unit"
            defaultValue={defaults?.militaryUnit ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            Yalnız açıq/ictimai mənbədə dərc olunubsa.
          </span>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Foto URL (istəyə bağlı)</span>
          <input
            type="url"
            name="photo_url"
            placeholder="https://…"
            defaultValue={defaults?.photoUrl ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Təltiflər (hər sətirdə bir)</span>
        <textarea
          name="awards"
          rows={3}
          defaultValue={(defaults?.awards ?? []).join("\n")}
          placeholder={'"Vətən uğrunda" medalı'}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <span className="mt-1 block text-sm text-ink-soft">
          Yalnız rəsmi təltiflər — fərman/mənbə mövcud olmalıdır.
        </span>
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">
          Mənbə istinadları (hər sətirdə bir) — dərc üçün məcburidir
        </span>
        <textarea
          name="sources"
          rows={3}
          defaultValue={(defaults?.sources ?? []).join("\n")}
          placeholder="https://mod.gov.az/... və ya rəsmi sənədin adı"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
        <input
          type="checkbox"
          name="anniversary_notify"
          defaultChecked={defaults?.anniversaryNotify ?? false}
          className="mt-1 h-5 w-5"
        />
        <span>
          <span className="block font-medium">Anım günü bildirişi</span>
          <span className="text-sm text-ink-soft">
            Şəhidlik günündə icmaya xatırlatma göndərilsin (push bildirişlər
            hazır olanda işə düşəcək).
          </span>
        </span>
      </label>

      <button
        type="submit"
        className="flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
      >
        Yadda saxla
      </button>
    </form>
  );
}
