import { saveTimelineEntry } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Dövr, tarix, başlıq və mətn boş ola bilməz.",
  menbe: "İşğal dövrünə aid fakt mənbəsiz dərc oluna bilməz — ən azı bir mənbə yazın.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

export const ERA_LABEL: Record<string, string> = {
  isgal: "🕯️ İşğal dövrü (1993–2020)",
  azadliq: "🇦🇿 Azadlıq (2020)",
  berpa: "🏗️ Bərpa / Böyük Qayıdış",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    era: string;
    eventDate: string;
    dateDisplay: string | null;
    title: string;
    body: string;
    sources: string[];
    status: string;
  };
};

export default function TimelineForm({ xeta, defaults }: Props) {
  return (
    <form action={saveTimelineEntry} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block font-medium">Dövr</span>
          <select
            name="era"
            required
            defaultValue={defaults?.era ?? "berpa"}
            className="w-full rounded-xl border border-line bg-surface p-3"
          >
            {Object.entries(ERA_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Tarix (sıralama üçün)</span>
          <input
            type="date"
            name="event_date"
            required
            defaultValue={defaults?.eventDate ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Ekranda görünən tarix</span>
          <input
            type="text"
            name="date_display"
            placeholder={'məs. "1993, iyul"'}
            defaultValue={defaults?.dateDisplay ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <span className="mt-1 block text-sm text-ink-soft">
            Boş qalsa tam tarix göstərilir.
          </span>
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
          rows={5}
          defaultValue={defaults?.body ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">
          Mənbə istinadları (hər sətirdə bir) — işğal dövrü üçün məcburidir
        </span>
        <textarea
          name="sources"
          rows={2}
          defaultValue={(defaults?.sources ?? []).join("\n")}
          placeholder="AZERTAC reportajı, https://..."
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
