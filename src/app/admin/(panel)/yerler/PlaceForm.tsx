import { PLACE_META } from "@/lib/placeMeta";
import { savePlace } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Ad və növ boş ola bilməz.",
  koordinat: "Koordinatlar yanlışdır — kənd üçün en dairəsi ~40.01, uzunluq ~46.89 olmalıdır.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    body: string | null;
    status: string;
  };
};

export default function PlaceForm({ xeta, defaults }: Props) {
  return (
    <form action={savePlace} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Ad</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaults?.name ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Növ</span>
          <select
            name="type"
            required
            defaultValue={defaults?.type ?? "bulaq"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            {Object.entries(PLACE_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.icon} {meta.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">En dairəsi (lat)</span>
          <input
            type="text"
            name="lat"
            required
            inputMode="decimal"
            placeholder="40.0156"
            defaultValue={defaults ? String(defaults.lat) : ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Uzunluq dairəsi (lng)</span>
          <input
            type="text"
            name="lng"
            required
            inputMode="decimal"
            placeholder="46.8906"
            defaultValue={defaults ? String(defaults.lng) : ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>
      <p className="text-sm text-ink-soft">
        📍 Koordinatı Google Maps-də yerə uzun basıb kopyalamaq olar
        (birinci ədəd lat, ikinci lng).
      </p>

      <label className="block">
        <span className="mb-1 block font-medium">Qısa təsvir (istəyə bağlı)</span>
        <textarea
          name="body"
          rows={3}
          defaultValue={defaults?.body ?? ""}
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
          <option value="draft">Qaralama (xəritədə görünmür)</option>
          <option value="approved">Xəritədə göstərilsin</option>
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
