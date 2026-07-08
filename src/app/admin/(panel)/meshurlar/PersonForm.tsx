import { PERSON_META } from "@/lib/personMeta";
import { savePerson } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Ad, sahə və təsvir boş ola bilməz.",
  menbe: "Real şəxs haqqında yazı mənbəsiz dərc oluna bilməz — ən azı bir mənbə yazın.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    fullName: string;
    yearsDisplay: string | null;
    field: string;
    description: string;
    sources: string[];
    status: string;
  };
};

export default function PersonForm({ xeta, defaults }: Props) {
  return (
    <form action={savePerson} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Sağ olan şəxslər üçün özünün, vəfat etmiş şəxslər üçün ailəsinin
        razılığını almaq tövsiyə olunur. Məlumatlar yoxlanıla bilən mənbəyə
        əsaslanmalıdır.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block sm:col-span-2">
          <span className="mb-1 block font-medium">Ad, soyad</span>
          <input
            type="text"
            name="full_name"
            required
            defaultValue={defaults?.fullName ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">İllər</span>
          <input
            type="text"
            name="years_display"
            placeholder="1935–2001"
            defaultValue={defaults?.yearsDisplay ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Sahə</span>
        <select
          name="field"
          required
          defaultValue={defaults?.field ?? "elm"}
          className="w-full rounded-xl border border-line bg-surface p-3"
        >
          {Object.entries(PERSON_META).map(([v, meta]) => (
            <option key={v} value={v}>
              {meta.icon} {meta.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Haqqında</span>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={defaults?.description ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">
          Mənbə istinadları (hər sətirdə bir) — dərc üçün məcburidir
        </span>
        <textarea
          name="sources"
          rows={2}
          defaultValue={(defaults?.sources ?? []).join("\n")}
          placeholder="Kitab, qəzet məqaləsi, rəsmi sayt linki..."
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Vəziyyət</span>
        <select
          name="status"
          defaultValue={defaults?.status === "approved" ? "approved" : "draft"}
          className="w-full rounded-xl border border-line bg-surface p-3"
        >
          <option value="draft">Qaralama (saytda görünmür)</option>
          <option value="approved">Dərc olunsun</option>
        </select>
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
