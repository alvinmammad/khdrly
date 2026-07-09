"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";
import { compressImage } from "@/lib/imageCompress";
import { createThenNow } from "./actions";

type Status = "bos" | "gonderilir" | "xeta";

export default function UploadThenNow() {
  const [status, setStatus] = useState<Status>("bos");
  const [mesaj, setMesaj] = useState("");
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const before = beforeRef.current?.files?.[0];
    const after = afterRef.current?.files?.[0];
    const sb = getSupabaseBrowserAuth();

    if (!sb || !before || !after) {
      setMesaj("Hər iki şəkil seçilməlidir.");
      setStatus("xeta");
      return;
    }

    setStatus("gonderilir");
    try {
      const ts = Date.now();
      const paths = { before: `onda-indi/${ts}-onda.jpg`, after: `onda-indi/${ts}-indi.jpg` };

      for (const [file, path] of [
        [before, paths.before],
        [after, paths.after],
      ] as const) {
        const blob = await compressImage(file);
        const { error } = await sb.storage
          .from("media")
          .upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw error;
      }

      const ok = await createThenNow({
        title: String(fd.get("title") ?? ""),
        note: String(fd.get("note") ?? ""),
        beforePath: paths.before,
        afterPath: paths.after,
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
      <p className="font-bold">+ Yeni müqayisə</p>

      {status === "xeta" && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {mesaj}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block font-medium">Başlıq</span>
        <input
          type="text"
          name="title"
          required
          placeholder="Kənd məktəbi"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">"Onda" şəkli (dağıntı/köhnə)</span>
          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            required
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">"İndi" şəkli (bərpadan sonra)</span>
          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            required
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      </div>
      <p className="text-sm text-ink-soft">
        Ən yaxşı nəticə üçün hər iki şəkil eyni bucaqdan çəkilməlidir.
        Şəkillər avtomatik kiçildilir.
      </p>

      <label className="block">
        <span className="mb-1 block font-medium">Qeyd (istəyə bağlı)</span>
        <input
          type="text"
          name="note"
          placeholder="1993 → 2024"
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
