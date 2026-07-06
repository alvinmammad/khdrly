import { toBakuLocalInput } from "@/lib/bakuTime";
import { saveEvent } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Başlıq və başlama vaxtı boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    title: string;
    body: string | null;
    location: string | null;
    startsAt: string;
    status: string;
  };
};

export default function EventForm({ xeta, defaults }: Props) {
  return (
    <form action={saveEvent} className="space-y-4">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.db}
        </p>
      )}

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
        <span className="mb-1 block font-medium">Təsvir (istəyə bağlı)</span>
        <textarea
          name="body"
          rows={4}
          defaultValue={defaults?.body ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Yer (istəyə bağlı)</span>
          <input
            type="text"
            name="location"
            placeholder="Kənd meydanı"
            defaultValue={defaults?.location ?? ""}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Başlama vaxtı (Bakı vaxtı)</span>
          <input
            type="datetime-local"
            name="starts_at"
            required
            defaultValue={toBakuLocalInput(defaults?.startsAt)}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

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
