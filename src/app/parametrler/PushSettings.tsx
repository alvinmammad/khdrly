"use client";

import { useEffect, useState } from "react";
import { deletePushSubscription, savePushSubscription } from "./actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type Status = "yoxlanir" | "deste-yox" | "bagli" | "acilir" | "acig" | "qadagan";

export default function PushSettings() {
  const [status, setStatus] = useState<Status>("yoxlanir");
  const [mesaj, setMesaj] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (
        !VAPID_PUBLIC_KEY ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        setStatus("deste-yox");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("qadagan");
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      setStatus(sub ? "acig" : "bagli");
    })();
  }, []);

  async function subscribe() {
    setStatus("acilir");
    setMesaj(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "qadagan" : "bagli");
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        // Dev rejimində SW qeydə alınmır; istehsalda quraşdırılmış PWA-da işləyir
        setMesaj("Bildirişlər yalnız quraşdırılmış tətbiqdə işləyir.");
        setStatus("bagli");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!) as BufferSource,
      });
      const ok = await savePushSubscription(sub.toJSON());
      if (!ok) {
        await sub.unsubscribe();
        setMesaj("Abunəlik alınmadı — bir azdan yenidən yoxlayın.");
        setStatus("bagli");
        return;
      }
      setStatus("acig");
    } catch {
      setMesaj("Abunəlik alınmadı — bir azdan yenidən yoxlayın.");
      setStatus("bagli");
    }
  }

  async function unsubscribe() {
    setStatus("acilir");
    setMesaj(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await deletePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("bagli");
    } catch {
      setStatus("acig");
    }
  }

  if (status === "yoxlanir" || status === "deste-yox") return null;

  const acig = status === "acig";

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold">🔔 Bildirişlər</p>
          <p className="text-ink-soft">
            Vacib xəbərlər və kəsinti xəbərdarlıqları telefona gəlsin
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={acig}
          disabled={status === "acilir" || status === "qadagan"}
          onClick={acig ? unsubscribe : subscribe}
          className={`h-9 w-16 shrink-0 rounded-full p-1 transition-colors ${
            acig ? "bg-kerpic" : "bg-surface-2 border border-line"
          } ${status === "acilir" ? "opacity-60" : ""}`}
        >
          <span
            className={`block h-7 w-7 rounded-full bg-white shadow transition-transform ${
              acig ? "translate-x-7" : ""
            }`}
          />
        </button>
      </div>
      {status === "qadagan" && (
        <p className="mt-2 text-sm text-ink-soft">
          Bildirişlər brauzer tərəfindən qadağan edilib — icazəni brauzerin sayt
          parametrlərindən açmaq lazımdır.
        </p>
      )}
      {mesaj && <p className="mt-2 text-sm text-ink-soft">{mesaj}</p>}
    </section>
  );
}
