import { saveProducer } from "../actions";

const XETALAR: Record<string, string> = {
  bos: "Ad və telefon boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    name: string;
    phone: string;
    description: string | null;
    isFlagship: boolean;
    status: string;
  };
};

export default function ProducerForm({ xeta, defaults }: Props) {
  return (
    <form action={saveProducer} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Təsərrüfatın / istehsalçının adı</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaults?.name ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Telefon (zəng düyməsi bura gedir)</span>
          <input
            type="tel"
            name="phone"
            required
            placeholder="+994501234567"
            defaultValue={defaults?.phone ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Qısa təsvir (istəyə bağlı)</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
        <input
          type="checkbox"
          name="is_flagship"
          defaultChecked={defaults?.isFlagship ?? false}
          className="mt-1 h-5 w-5"
        />
        <span>
          <span className="block font-medium">🐃 Qaymaq brendi istehsalçısı</span>
          <span className="text-sm text-ink-soft">
            İşarələnsə, Bazar səhifəsinin yuxarısındakı "Kəndimizin brendi"
            bölməsində zəng düyməsi ilə göstərilir.
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
          <option value="approved">Aktiv</option>
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
