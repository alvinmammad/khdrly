"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";
import { compressImage } from "@/lib/imageCompress";
import { MARKET_CATEGORY_META, MARKET_CATEGORIES } from "@/lib/alverMeta";
import { createMarketItem } from "../actions";

type Status = "bos" | "gonderilir" | "xeta";

export default function AlVerForm({ defaultPhone }: { defaultPhone: string }) {
  const [status, setStatus] = useState<Status>("bos");
  const [mesaj, setMesaj] = useState("");
  const [category, setCategory] = useState(MARKET_CATEGORIES[0]);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hasPrice = MARKET_CATEGORY_META[category].hasPrice;

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
        photoPath = `alver/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error } = await sb.storage
          .from("media")
          .upload(photoPath, blob, { contentType: "image/jpeg" });
        if (error) throw error;
      }

      const id = await createMarketItem({
        category: String(fd.get("category") ?? ""),
        title: String(fd.get("title") ?? ""),
        body: String(fd.get("body") ?? ""),
        price: String(fd.get("price") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        photoPath,
      });
      if (!id) throw new Error("insert failed");

      router.push("/al-ver");
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
        <span className="mb-1 block font-medium">Növ</span>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="w-full rounded-xl border border-line bg-surface p-3"
        >
          {MARKET_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {MARKET_CATEGORY_META[c].icon} {MARKET_CATEGORY_META[c].label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block font-medium">Başlıq</span>
        <input
          type="text"
          name="title"
          required
          maxLength={120}
          placeholder="Məs: İşlənmiş taxta qapı satılır"
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
          placeholder="Vəziyyəti, ölçüsü, əlavə məlumat..."
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
      </label>

      {hasPrice && (
        <label className="block">
          <span className="mb-1 block font-medium">Qiymət (AZN, istəyə bağlı)</span>
          <input
            type="text"
            name="price"
            inputMode="decimal"
            placeholder="Boş = razılaşma ilə"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-1 block font-medium">Əlaqə telefonu</span>
        <input
          type="tel"
          name="phone"
          required
          defaultValue={defaultPhone}
          placeholder="+994501234567"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <span className="mt-1 block text-sm text-ink-soft">
          Zəng düyməsi bu nömrəyə gedəcək.
        </span>
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
        {status === "gonderilir" ? "Yerləşdirilir..." : "📤 Elanı yerləşdir"}
      </button>
      <p className="text-sm text-ink-soft">
        Elan adınızla dərhal dərc olunur. 30 gün sonra avtomatik silinir.
      </p>
    </form>
  );
}
