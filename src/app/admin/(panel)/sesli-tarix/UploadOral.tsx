"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";
import { registerOralHistory } from "./actions";

type Status = "bos" | "gonderilir" | "xeta";

export default function UploadOral() {
  const [status, setStatus] = useState<Status>("bos");
  const [mesaj, setMesaj] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fileRef.current?.files?.[0];
    const sb = getSupabaseBrowserAuth();

    if (!sb || !file) {
      setMesaj("Səs faylı seçilməlidir.");
      setStatus("xeta");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setMesaj("Fayl 25 MB-dan böyükdür — telefonda daha qısa hissələrə bölün.");
      setStatus("xeta");
      return;
    }

    setStatus("gonderilir");
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "m4a";
      const path = `sesli-tarix/${Date.now()}.${ext}`;
      const { error } = await sb.storage
        .from("media")
        .upload(path, file, { contentType: file.type || "audio/mpeg" });
      if (error) throw error;

      const ok = await registerOralHistory({
        title: String(fd.get("title") ?? ""),
        narrator: String(fd.get("narrator") ?? ""),
        narratorInfo: String(fd.get("narrator_info") ?? ""),
        transcript: String(fd.get("transcript") ?? ""),
        audioPath: path,
      });
      if (!ok) throw new Error("insert failed");

      form.reset();
      setStatus("bos");
      router.refresh();
    } catch {
      setMesaj("Yükləmə alınmadı — giriş və interneti yoxlayıb təkrar edin.");
      setStatus("xeta");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <p className="font-bold">+ Yeni söhbət</p>

      {status === "xeta" && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {mesaj}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Başlıq</span>
          <input
            type="text"
            name="title"
            required
            placeholder="1993-cü ilin yayı"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Səs faylı (maks 25 MB)</span>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            required
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Danışan (razılığı ilə)</span>
          <input
            type="text"
            name="narrator"
            required
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Haqqında (istəyə bağlı)</span>
          <input
            type="text"
            name="narrator_info"
            placeholder="1941-ci il təvəllüdlü"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-medium">Mətn / transkripsiya (istəyə bağlı)</span>
        <textarea
          name="transcript"
          rows={4}
          placeholder="scripts/stt.mjs ilə avtomatik çıxarıb bura yapışdırın, və ya boş saxlayın"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <button
        type="submit"
        disabled={status === "gonderilir"}
        className={`flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong ${
          status === "gonderilir" ? "opacity-60" : ""
        }`}
      >
        {status === "gonderilir" ? "Yüklənir..." : "Yadda saxla və dərc et"}
      </button>
    </form>
  );
}
