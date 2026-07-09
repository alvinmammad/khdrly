import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { defaultCache } from "@serwist/next/worker";
import { CacheFirst, RangeRequestsPlugin, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Oflayn xəritə: PMTiles range sorğuları keşdəki tam fayldan dilimlənir
    {
      matcher: ({ url }) => url.pathname === "/xerite.pmtiles",
      handler: new CacheFirst({
        cacheName: "xerite-pmtiles",
        plugins: [new RangeRequestsPlugin()],
      }),
    },
    // Xəritə şrift/spraytları (Protomaps assets)
    {
      matcher: ({ url }) => url.hostname === "protomaps.github.io",
      handler: new CacheFirst({ cacheName: "xerite-assets" }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();

// Xəritə faylı quraşdırma zamanı bütöv keşə salınır — sonra oflayn işləyir.
// Alınmasa SW yenə quraşdırılır (xəritə onlayn rejimdə işləyəcək).
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("xerite-pmtiles")
      .then(async (cache) => {
        const movcud = await cache.match("/xerite.pmtiles");
        if (!movcud) await cache.add("/xerite.pmtiles");
      })
      .catch(() => {})
  );
});

/* ---------- Web Push bildirişləri ---------- */

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload: { title?: string; body?: string; url?: string };
  try {
    payload = event.data.json();
  } catch {
    payload = { body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Xıdırlı", {
      body: payload.body ?? "",
      icon: "/icon.svg",
      badge: "/icon.svg",
      lang: "az",
      data: { url: payload.url ?? "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data?.url as string) ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
