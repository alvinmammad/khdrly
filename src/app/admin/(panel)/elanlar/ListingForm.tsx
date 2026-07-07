import { LISTING_META } from "@/lib/elanMeta";
import { toBakuLocalInput } from "@/lib/bakuTime";
import { saveListing } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Növ, başlıq və mətn boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    type: string;
    title: string;
    body: string;
    phone: string | null;
    validTo: string | null;
    status: string;
  };
};

export default function ListingForm({ xeta, defaults }: Props) {
  return (
    <form action={saveListing} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Növ</span>
          <select
            name="type"
            required
            defaultValue={defaults?.type ?? "elan"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            {Object.entries(LISTING_META).map(([v, meta]) => (
              <option key={v} value={v}>
                {meta.icon} {meta.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Əlaqə telefonu (istəyə bağlı)</span>
          <input
            type="tel"
            name="phone"
            placeholder="+994501234567"
            defaultValue={defaults?.phone ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Başlıq</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaults?.title ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Mətn</span>
        <textarea
          name="body"
          required
          rows={4}
          defaultValue={defaults?.body ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Bitmə tarixi (Bakı vaxtı, istəyə bağlı)</span>
        <input
          type="datetime-local"
          name="valid_to"
          defaultValue={toBakuLocalInput(defaults?.validTo)}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <span className="mt-1 block text-sm text-ink-soft">
          Bitəndə elan avtomatik gizlənir. Boş qalsa — siz silənə qədər qalır.
        </span>
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
