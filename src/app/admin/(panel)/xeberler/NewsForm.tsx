import { saveNews } from "./actions";

const XETALAR: Record<string, string> = {
  bos: "Başlıq və mətn boş ola bilməz.",
  db: "Yadda saxlamaq alınmadı — yenidən cəhd edin.",
};

type Props = {
  xeta?: string;
  defaults?: {
    id: string;
    title: string;
    body: string;
    coverEmoji: string | null;
    status: string;
  };
};

export default function NewsForm({ xeta, defaults }: Props) {
  return (
    <form action={saveNews} className="space-y-4">
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
        <span className="mb-1 block font-medium">Mətn</span>
        <textarea
          name="body"
          required
          rows={10}
          defaultValue={defaults?.body ?? ""}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <span className="mt-1 block text-sm text-ink-soft">
          Boş sətirlə ayrılan hissələr saytda ayrıca abzas kimi görünür.
        </span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block font-medium">Emoji (üz qabığı)</span>
          <input
            type="text"
            name="cover_emoji"
            maxLength={4}
            defaultValue={defaults?.coverEmoji ?? ""}
            placeholder="🧺"
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
