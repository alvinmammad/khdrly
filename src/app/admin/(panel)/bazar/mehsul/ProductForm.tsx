import { CATEGORY_META } from "@/lib/bazarMeta";
import { saveProduct } from "../actions";

const XETALAR: Record<string, string> = {
  bos: "Ad, istehsalçı və kateqoriya boş ola bilməz.",
  qiymet: "Qiymət mənfi ola bilməz — boş buraxsanız “razılaşma ilə” göstərilir.",
  movsum: "Mövsüm üçün başlanğıc və son ayın hər ikisini seçin (və ya heç birini).",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
  "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

type Props = {
  xeta?: string;
  producers: { id: string; name: string }[];
  defaults?: {
    id: string;
    producerId: string;
    name: string;
    category: string;
    price: number | null;
    unit: string | null;
    description: string | null;
    seasonStart: number | null;
    seasonEnd: number | null;
    available: boolean;
    status: string;
  };
};

export default function ProductForm({ xeta, producers, defaults }: Props) {
  return (
    <form action={saveProduct} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Məhsulun adı</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaults?.name ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">İstehsalçı</span>
          <select
            name="producer_id"
            required
            defaultValue={defaults?.producerId ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            <option value="" disabled>
              Seçin...
            </option>
            {producers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block font-medium">Kateqoriya</span>
          <select
            name="category"
            required
            defaultValue={defaults?.category ?? "sud"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            {Object.entries(CATEGORY_META).map(([v, meta]) => (
              <option key={v} value={v}>
                {meta.icon} {meta.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Qiymət (AZN)</span>
          <input
            type="text"
            name="price"
            inputMode="decimal"
            placeholder="boş = razılaşma ilə"
            defaultValue={defaults?.price ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Vahid</span>
          <input
            type="text"
            name="unit"
            placeholder="kq / litr / ədəd"
            defaultValue={defaults?.unit ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Təsvir (istəyə bağlı)</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <fieldset className="rounded-xl border border-line bg-surface p-3">
        <legend className="px-1 font-medium">🌱 Mövsüm (istəyə bağlı)</legend>
        <p className="mb-2 text-sm text-ink-soft">
          Seçilsə, məhsul yalnız bu aylar arasında bazarda görünür. Boş qalsa —
          bütün il.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Başlanğıc ay</span>
            <select
              name="season_start"
              defaultValue={defaults?.seasonStart ?? ""}
              className="w-full rounded-xl border border-line bg-surface p-3"
            >
              <option value="">—</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Son ay</span>
            <select
              name="season_end"
              defaultValue={defaults?.seasonEnd ?? ""}
              className="w-full rounded-xl border border-line bg-surface p-3"
            >
              <option value="">—</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
          <input
            type="checkbox"
            name="available"
            defaultChecked={defaults?.available ?? true}
            className="mt-1 h-5 w-5"
          />
          <span>
            <span className="block font-medium">Satışdadır</span>
            <span className="text-sm text-ink-soft">
              Müvəqqəti bitəndə işarəni götürün — kataloqdan gizlənir.
            </span>
          </span>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Vəziyyət</span>
          <select
            name="status"
            defaultValue={defaults?.status === "approved" ? "approved" : "draft"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            <option value="draft">Qaralama (bazarda görünmür)</option>
            <option value="approved">Bazarda göstərilsin</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
      >
        Yadda saxla
      </button>
    </form>
  );
}
