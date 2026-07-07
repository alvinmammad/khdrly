import { saveRoute } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Marşrut adı və cədvəl boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    title: string;
    schedule: string;
    driverName: string | null;
    phone: string | null;
    note: string | null;
    sortOrder: number;
    status: string;
  };
};

export default function RouteForm({ xeta, defaults }: Props) {
  return (
    <form action={saveRoute} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block font-medium">Marşrut</span>
        <input
          type="text"
          name="title"
          required
          placeholder="Xıdırlı → Ağdam"
          defaultValue={defaults?.title ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Cədvəl</span>
        <textarea
          name="schedule"
          required
          rows={2}
          placeholder="Hər gün səhər 08:00 və günorta 14:00"
          defaultValue={defaults?.schedule ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block font-medium">Sürücü (istəyə bağlı)</span>
          <input
            type="text"
            name="driver_name"
            defaultValue={defaults?.driverName ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Telefon (istəyə bağlı)</span>
          <input
            type="tel"
            name="phone"
            placeholder="+994501234567"
            defaultValue={defaults?.phone ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Sıra nömrəsi</span>
          <input
            type="number"
            name="sort_order"
            defaultValue={defaults?.sortOrder ?? 0}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Qeyd (qiymət, dayanacaq...)</span>
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
