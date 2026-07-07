import { SERVICE_META } from "@/lib/xidmetMeta";
import { saveService } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Ad, kateqoriya və telefon boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    name: string;
    category: string;
    phone: string;
    description: string | null;
    status: string;
  };
};

export default function ServiceForm({ xeta, defaults }: Props) {
  return (
    <form action={saveService} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Ad (şəxs / biznes)</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaults?.name ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Kateqoriya</span>
          <select
            name="category"
            required
            defaultValue={defaults?.category ?? "usta"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            {Object.entries(SERVICE_META).map(([v, meta]) => (
              <option key={v} value={v}>
                {meta.icon} {meta.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Telefon</span>
        <input
          type="tel"
          name="phone"
          required
          placeholder="+994501234567"
          defaultValue={defaults?.phone ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Qısa təsvir (istəyə bağlı)</span>
        <textarea
          name="description"
          rows={2}
          defaultValue={defaults?.description ?? ""}
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
          <option value="approved">Kataloqda göstərilsin</option>
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
