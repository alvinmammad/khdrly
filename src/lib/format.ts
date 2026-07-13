// Azərbaycan dilində tarix formatlaması.
// timeZone məcburidir: Vercel serverləri UTC-də işləyir — onsuz tədbir
// saatları 4 saat geri, gecə tarixləri isə bir gün geri görünərdi.

const AZ_LOCALE = "az-Latn-AZ";
const BAKU_TZ = "Asia/Baku";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: BAKU_TZ,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BAKU_TZ,
  }).format(new Date(iso));
}

export function formatWeekday(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, {
    weekday: "long",
    timeZone: BAKU_TZ,
  }).format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: BAKU_TZ,
  }).format(new Date(iso));
}
