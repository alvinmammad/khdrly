"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";
import { compressImage } from "@/lib/imageCompress";
import { removeMartyrPhoto, setMartyrPhoto } from "../actions";

/*
  Şəhid portreti yükləmə — staff sessiyası ilə media bucket-inin
  sehidler/ qovluğuna (şəkil brauzerdə sıxılır), sonra server action
  photo_url-u yazır. Ailənin razılığı olmadan şəkil yükləməyin!
*/
export default function PhotoUpload({
  martyrId,
  currentUrl,
}: {
  martyrId: string;
  currentUrl: string | null;
}) {
  const [status, setStatus] = useState<"bos" | "gonderilir" | "xeta">("bos");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function onUpload() {
    const file = fileRef.current?.files?.[0];
    const sb = getSupabaseBrowserAuth();
    if (!file || !sb) return;
    if (!file.type.startsWith("image/")) {
      setStatus("xeta");
      return;
    }

    setStatus("gonderilir");
    try {
      const blob = await compressImage(file);
      const path = `sehidler/${martyrId}-${Date.now()}.jpg`;
      const { error } = await sb.storage
        .from("media")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (error) throw error;

      const ok = await setMartyrPhoto({ martyrId, path });
      if (!ok) throw new Error("update failed");

      if (fileRef.current) fileRef.current.value = "";
      setStatus("bos");
      router.refresh();
    } catch {
      setStatus("xeta");
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-heading text-lg font-bold">🖼️ Portret</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Şəkil yalnız ailənin razılığı ilə yüklənməlidir. Avtomatik kiçildilir.
      </p>

      {status === "xeta" && (
        <p role="alert" className="mt-2 rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Yükləmək alınmadı — şəkil faylı seçdiyinizi yoxlayıb təkrar edin.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-start gap-4">
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt="Hazırkı portret"
            className="h-36 w-28 rounded-xl border border-line object-cover"
          />
        ) : (
          <span className="flex h-36 w-28 items-center justify-center rounded-xl bg-surface-2 text-3xl" aria-hidden>
            🎗️
          </span>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
          <button
            type="button"
            onClick={onUpload}
            disabled={status === "gonderilir"}
            className={`min-h-11 w-full rounded-xl bg-kerpic px-4 font-bold text-white active:bg-kerpic-strong ${
              status === "gonderilir" ? "opacity-60" : ""
            }`}
          >
            {status === "gonderilir"
              ? "Yüklənir..."
              : currentUrl
                ? "Şəkli dəyişdir"
                : "Şəkli yüklə"}
          </button>
          {currentUrl && (
            <form action={removeMartyrPhoto}>
              <input type="hidden" name="id" value={martyrId} />
              <button className="min-h-11 w-full rounded-xl border border-nar px-4 font-medium text-nar">
                Şəkli sil
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
