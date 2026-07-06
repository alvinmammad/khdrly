// Azərbaycan dilində tarix formatlaması

const AZ_LOCALE = "az-Latn-AZ";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatWeekday(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, { weekday: "long" }).format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat(AZ_LOCALE, { day: "numeric", month: "short" }).format(
    new Date(iso)
  );
}
