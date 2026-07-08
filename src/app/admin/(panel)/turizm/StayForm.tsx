import { saveStay } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Ad, növ və telefon boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    name: string;
    type: string;
    phone: string;
    description: string | null;
    priceNote: string | null;
    status: string;
  };
};

export default function StayForm({ xeta, defaults }: Props) {
  return (
    <form action={saveStay} className="space-y-4">
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
            placeholder="Məs: Qonaq evi — kənd mərkəzi"
            defaultValue={defaults?.name ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Növ</span>
          <select
            name="type"
            required
            defaultValue={defaults?.type ?? "qonaq_evi"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            <option value="qonaq_evi">🏡 Qonaq evi</option>
            <option value="kiraye_ev">🔑 Kirayə ev</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
          <span className="mb-1 block font-medium">Qiymət qeydi (istəyə bağlı)</span>
          <input
            type="text"
            name="price_note"
            placeholder="Gecəsi 30 AZN / razılaşma ilə"
            defaultValue={defaults?.priceNote ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Təsvir (istəyə bağlı)</span>
        <textarea
          name="description"
          rows={3}
          placeholder="Otaq sayı, şərait, yerləşmə..."
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
