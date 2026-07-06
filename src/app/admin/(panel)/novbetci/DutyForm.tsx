import { toBakuLocalInput } from "@/lib/bakuTime";
import { saveDuty } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Növ, başlıq və mətn boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

const DUTY_OPTIONS = [
  { value: "feldser", label: "🩺 Feldşer" },
  { value: "aptek", label: "💊 Aptek" },
  { value: "elektrik", label: "⚡ Elektrik" },
  { value: "su", label: "🚰 Su" },
];

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    type: string;
    title: string;
    body: string;
    phone: string | null;
    isAlert: boolean;
    validFrom: string;
    validTo: string | null;
  };
};

export default function DutyForm({ xeta, defaults }: Props) {
  return (
    <form action={saveDuty} className="space-y-4">
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
            defaultValue={defaults?.type ?? "feldser"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            {DUTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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

      <label className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
        <input
          type="checkbox"
          name="is_alert"
          defaultChecked={defaults?.isAlert ?? false}
          className="mt-1 h-5 w-5"
        />
        <span>
          <span className="block font-medium">Xəbərdarlıq banneri</span>
          <span className="text-sm text-ink-soft">
            İşarələnsə, ana səhifədə diqqətçəkən banner kimi görünür (kəsinti və s.).
          </span>
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Başlanğıc (Bakı vaxtı)</span>
          <input
            type="datetime-local"
            name="valid_from"
            defaultValue={toBakuLocalInput(defaults?.validFrom)}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">Boş qalsa — indidən.</span>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Bitmə (Bakı vaxtı)</span>
          <input
            type="datetime-local"
            name="valid_to"
            defaultValue={toBakuLocalInput(defaults?.validTo)}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            Boş qalsa — müddətsiz aktiv qalır.
          </span>
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
