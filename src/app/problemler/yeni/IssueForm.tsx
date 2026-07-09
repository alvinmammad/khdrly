"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";
import { compressImage } from "@/lib/imageCompress";
import { createIssue } from "../actions";

type Status = "bos" | "gonderilir" | "xeta";

export default function IssueForm() {
  const [status, setStatus] = useState<Status>("bos");
  const [mesaj, setMesaj] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fileRef.current?.files?.[0];
    const sb = getSupabaseBrowserAuth();

    setStatus("gonderilir");
    try {
      let photoPath: string | null = null;
      if (file && sb) {
        if (!file.type.startsWith("image/")) throw new Error("format");
        const blob = await compressImage(file);
        photoPath = `problemler/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error } = await sb.storage
          .from("media")
          .upload(photoPath, blob, { contentType: "image/jpeg" });
        if (error) throw error;
      }

      const id = await createIssue({
        title: String(fd.get("title") ?? ""),
        body: String(fd.get("body") ?? ""),
        location: String(fd.get("location") ?? ""),
        photoPath,
      });
      if (!id) throw new Error("insert failed");

      router.push("/problemler?ok=1");
    } catch {
      setMesaj("Göndərmək alınmadı — sahələri yoxlayıb yenidən cəhd edin.");
      setStatus("xeta");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {status === "xeta" && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {mesaj}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block font-medium">Problem nədir?</span>
        <input
          type="text"
          name="title"
          required
          maxLength={120}
          placeholder="Məs: Küçə lampası yanmır"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Yer</span>
        <input
          type="text"
          name="location"
          maxLength={120}
          placeholder="Məs: məktəbin qarşısı"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Ətraflı</span>
        <textarea
          name="body"
          required
          rows={4}
          maxLength={1500}
          placeholder="Nə vaxtdan, nə vəziyyətdədir..."
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Foto (istəyə bağlı, çox kömək edir)</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <span className="mt-1 block text-sm text-ink-soft">
          Şəkil avtomatik kiçildilir — zəif internetlə də gedir.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "gonderilir"}
        className={`flex min-h-14 w-full items-center justify-center rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong ${
          status === "gonderilir" ? "opacity-60" : ""
        }`}
      >
        {status === "gonderilir" ? "Göndərilir..." : "📤 Bildir"}
      </button>
      <p className="text-sm text-ink-soft">
        Bildirişiniz adınızla açıq dərc olunur — şəffaflıq hamının xeyrinədir.
      </p>
    </form>
  );
}
