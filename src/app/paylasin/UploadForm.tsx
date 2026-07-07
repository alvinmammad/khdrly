"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { compressImage } from "@/lib/imageCompress";
import { registerMediaUpload } from "./actions";

type Status = "bos" | "gonderilir" | "ugur" | "xeta";

export default function UploadForm() {
  const [status, setStatus] = useState<Status>("bos");
  const [xetaMesaji, setXetaMesaji] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sb = getSupabaseBrowser();
  if (!sb) {
    return (
      <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
        Yükləmə funksiyası hazırda aktiv deyil.
      </p>
    );
  }

  function onFileChange() {
    const file = fileRef.current?.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fileRef.current?.files?.[0];

    if (!file) {
      setXetaMesaji("Şəkil seçilməyib.");
      setStatus("xeta");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setXetaMesaji("Yalnız şəkil faylı yükləmək olar.");
      setStatus("xeta");
      return;
    }

    setStatus("gonderilir");
    try {
      // 1) Brauzerdə sıxma (zəif internet + pulsuz tier)
      const blob = await compressImage(file);

      // 2) Storage-ə yükləmə — yalnız paylasilan/ qovluğuna icazə var
      const path = `paylasilan/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error: upErr } = await sb!.storage
        .from("media")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (upErr) throw upErr;

      // 3) Yazının qeydiyyatı (pending — moderasiyadan sonra görünür)
      const ok = await registerMediaUpload({
        title: String(fd.get("title") ?? ""),
        description: String(fd.get("description") ?? ""),
        takenPeriod: String(fd.get("taken_period") ?? ""),
        uploaderName: String(fd.get("uploader_name") ?? ""),
        storagePath: path,
        consent: fd.get("consent") === "on",
      });
      if (!ok) throw new Error("register failed");

      form.reset();
      setPreview(null);
      setStatus("ugur");
    } catch {
      setXetaMesaji("Yükləmə alınmadı — internetinizi yoxlayıb yenidən cəhd edin.");
      setStatus("xeta");
    }
  }

  if (status === "ugur") {
    return (
      <div className="rounded-2xl border-2 border-zeytun bg-zeytun/10 p-6 text-center">
        <p className="text-4xl" aria-hidden>🙏</p>
        <p className="mt-2 text-xl font-bold">Təşəkkür edirik!</p>
        <p className="mt-2 text-ink-soft">
          Şəkliniz qəbul olundu. Yoxlanıldıqdan sonra media arxivində dərc
          olunacaq.
        </p>
        <button
          type="button"
          onClick={() => setStatus("bos")}
          className="mt-4 min-h-12 rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          Daha bir şəkil paylaş
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {status === "xeta" && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {xetaMesaji}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block font-medium">Şəkil</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          required
          onChange={onFileChange}
          className="w-full rounded-xl border border-line bg-surface p-3 file:mr-3 file:rounded-lg file:border-0 file:bg-kerpic file:px-4 file:py-2 file:font-bold file:text-white"
        />
        <span className="mt-1 block text-sm text-ink-soft">
          Şəkil avtomatik kiçildilir — zəif internetlə də yüklənir.
        </span>
      </label>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Seçilmiş şəklin önizləməsi"
          className="max-h-64 w-full rounded-2xl border border-line object-contain"
        />
      )}

      <label className="block">
        <span className="mb-1 block font-medium">Şəklin təsviri (başlıq)</span>
        <input
          type="text"
          name="title"
          required
          maxLength={120}
          placeholder="Məs: Kənd məktəbinin köhnə binası"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Dövr / il (bilirsinizsə)</span>
          <input
            type="text"
            name="taken_period"
            maxLength={60}
            placeholder="Məs: 1980-ci illər"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Adınız (istəyə bağlı)</span>
          <input
            type="text"
            name="uploader_name"
            maxLength={80}
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Əlavə qeyd (istəyə bağlı)</span>
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          placeholder="Şəkildə kimlər/nə var, harada çəkilib..."
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
        <input type="checkbox" name="consent" required className="mt-1 h-5 w-5" />
        <span className="text-sm">
          Bu şəkli kəndin ictimai arxivində dərc etməyə razıyam. Şəkildə başqa
          şəxslər varsa, onların (və ya ailələrinin) razılığını almışam.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "gonderilir"}
        className={`flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong ${
          status === "gonderilir" ? "opacity-60" : ""
        }`}
      >
        {status === "gonderilir" ? "Yüklənir..." : "📤 Göndər"}
      </button>

      <p className="text-sm text-ink-soft">
        Göndərilən şəkillər dərhal görünmür — kənd icması adına yoxlanıldıqdan
        sonra arxivə əlavə olunur.
      </p>
    </form>
  );
}
