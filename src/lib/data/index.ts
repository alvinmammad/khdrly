import { mockDuty, mockEvents, mockMartyrs, mockNews, mockPlaces } from "./mock";
import type { DutyInfo, EventItem, Martyr, NewsItem, Place } from "./types";

/*
  Məlumat qatı. Hazırda nümunə (mock) data qaytarır; Supabase qoşulanda
  bu funksiyaların içi supabase sorğuları ilə əvəz olunacaq — imzalar
  dəyişməyəcək, səhifələr olduğu kimi qalacaq.
*/

export async function getNews(): Promise<NewsItem[]> {
  return [...mockNews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getNewsItem(id: string): Promise<NewsItem | undefined> {
  return mockNews.find((n) => n.id === id);
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  return [...mockEvents].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export async function getDutyInfo(): Promise<DutyInfo[]> {
  return mockDuty;
}

export async function getActiveAlerts(): Promise<DutyInfo[]> {
  const now = new Date().toISOString();
  return mockDuty.filter(
    (d) => d.isAlert && d.validFrom <= now && (!d.validTo || d.validTo >= now)
  );
}

export async function getPlaces(): Promise<Place[]> {
  return mockPlaces;
}

export async function getMartyrs(): Promise<Martyr[]> {
  return mockMartyrs;
}

export async function getMartyr(id: string): Promise<Martyr | undefined> {
  return mockMartyrs.find((m) => m.id === id);
}
