import { saveDonation } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Təyinat (nəyə yönəlib) boş ola bilməz.",
  mebleg: "Məbləğ müsbət ədəd olmalıdır.",
  deyer: "Ya məbləğ, ya da əşya/əmək təsviri daxil edilməlidir.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    donorDisplay: string;
    amount: number | null;
    inKind: string | null;
    purpose: string;
    donatedAt: string;
    note: string | null;
    status: string;
  };
};

export default function DonationForm({ xeta, defaults }: Props) {
  return (
    <form action={saveDonation} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">İanəçinin göstərilən adı</span>
          <input
            type="text"
            name="donor_display"
            placeholder="Boş qalsa: Anonim"
            defaultValue={defaults?.donorDisplay ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            İanəçi adının açıqlanmasına razı olmalıdır.
          </span>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Tarix</span>
          <input
            type="date"
            name="donated_at"
            defaultValue={defaults?.donatedAt ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Məbləğ (AZN)</span>
          <input
            type="text"
            name="amount"
            inputMode="decimal"
            placeholder="Pul ianəsi deyilsə boş saxlayın"
            defaultValue={defaults?.amount ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Əşya / əmək ianəsi</span>
          <input
            type="text"
            name="in_kind"
            placeholder="Məs: 10 torba sement"
            defaultValue={defaults?.inKind ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Təyinat (nəyə yönəlib)</span>
        <input
          type="text"
          name="purpose"
          required
          placeholder="Məs: Bulağın təmiri"
          defaultValue={defaults?.purpose ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Qeyd (istəyə bağlı)</span>
        <input
          type="text"
          name="note"
          defaultValue={defaults?.note ?? ""}
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
          <option value="draft">Qaralama (reyestrdə görünmür)</option>
          <option value="approved">Reyestrdə göstərilsin</option>
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
