import { getSupabase } from "@/lib/supabase/client";
import { mockDuty, mockEvents, mockMartyrs, mockNews, mockPlaces } from "./mock";
import type { DutyInfo, EventItem, Martyr, NewsItem, Place } from "./types";

/*
  Məlumat qatı. Supabase env dəyişənləri (.env.local) doludursa real
  bazadan oxuyur; boşdursa nümunə (mock) data qaytarır — beləliklə layihə
  açarsız da işlək qalır (dev, CI, ilk baxış).

  Real rejimdə sorğu xətası mock-a YOX, boş nəticəyə düşür — istehsalda
  saxta məlumat görünməsin deyə. Səhifələr onsuz da boş halı göstərir.
*/

function logError(fn: string, message: string) {
  console.error(`[data] ${fn}: Supabase xətası — ${message}`);
}

// ---------- Xəbərlər ----------

interface NewsRow {
  id: string;
  title: string;
  body: string;
  cover_emoji: string | null;
  published_at: string | null;
}

function newsFromRow(r: NewsRow): NewsItem {
  return {
    id: r.id,
    title: r.title,
    body: r.body,
    coverEmoji: r.cover_emoji ?? undefined,
    publishedAt: r.published_at ?? "",
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const sb = getSupabase();
  if (!sb) {
    return [...mockNews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
  const { data, error } = await sb
    .from("news")
    .select("id, title, body, cover_emoji, published_at")
    .eq("status", "approved")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (error) {
    logError("getNews", error.message);
    return [];
  }
  return (data as NewsRow[]).map(newsFromRow);
}

export async function getNewsItem(id: string): Promise<NewsItem | undefined> {
  const sb = getSupabase();
  if (!sb) return mockNews.find((n) => n.id === id);
  const { data, error } = await sb
    .from("news")
    .select("id, title, body, cover_emoji, published_at")
    .eq("status", "approved")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    // uuid olmayan id də bura düşür — səhifə notFound() göstərir
    logError("getNewsItem", error.message);
    return undefined;
  }
  return data ? newsFromRow(data as NewsRow) : undefined;
}

// ---------- Tədbirlər ----------

interface EventRow {
  id: string;
  title: string;
  body: string | null;
  location: string | null;
  starts_at: string;
}

function eventFromRow(r: EventRow): EventItem {
  return {
    id: r.id,
    title: r.title,
    body: r.body ?? undefined,
    location: r.location ?? undefined,
    startsAt: r.starts_at,
  };
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const sb = getSupabase();
  if (!sb) {
    return [...mockEvents].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }
  // Başlamış tədbir dərhal itməsin deyə 12 saatlıq pəncərə saxlanılır
  const since = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  const { data, error } = await sb
    .from("events")
    .select("id, title, body, location, starts_at")
    .eq("status", "approved")
    .gte("starts_at", since)
    .order("starts_at", { ascending: true });
  if (error) {
    logError("getUpcomingEvents", error.message);
    return [];
  }
  return (data as EventRow[]).map(eventFromRow);
}

// ---------- Növbətçi məlumatlar ----------

interface DutyRow {
  id: string;
  type: DutyInfo["type"];
  title: string;
  body: string;
  phone: string | null;
  is_alert: boolean;
  valid_from: string;
  valid_to: string | null;
}

function dutyFromRow(r: DutyRow): DutyInfo {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body,
    phone: r.phone ?? undefined,
    isAlert: r.is_alert,
    validFrom: r.valid_from,
    validTo: r.valid_to ?? undefined,
  };
}

export async function getDutyInfo(): Promise<DutyInfo[]> {
  const sb = getSupabase();
  if (!sb) return mockDuty;
  const now = new Date().toISOString();
  const { data, error } = await sb
    .from("duty_info")
    .select("id, type, title, body, phone, is_alert, valid_from, valid_to")
    .lte("valid_from", now)
    .or(`valid_to.is.null,valid_to.gte.${now}`)
    .order("is_alert", { ascending: false })
    .order("valid_from", { ascending: false });
  if (error) {
    logError("getDutyInfo", error.message);
    return [];
  }
  return (data as DutyRow[]).map(dutyFromRow);
}

export async function getActiveAlerts(): Promise<DutyInfo[]> {
  const sb = getSupabase();
  if (!sb) {
    const now = new Date().toISOString();
    return mockDuty.filter(
      (d) => d.isAlert && d.validFrom <= now && (!d.validTo || d.validTo >= now)
    );
  }
  const items = await getDutyInfo();
  return items.filter((d) => d.isAlert);
}

// ---------- Xəritə ----------

interface PlaceRow {
  id: string;
  slug: string;
  name: string;
  type: Place["type"];
  lat: number;
  lng: number;
  body: string | null;
}

export async function getPlaces(): Promise<Place[]> {
  const sb = getSupabase();
  if (!sb) return mockPlaces;
  const { data, error } = await sb
    .from("places")
    .select("id, slug, name, type, lat, lng, body")
    .eq("status", "approved")
    .order("name", { ascending: true });
  if (error) {
    logError("getPlaces", error.message);
    return [];
  }
  return (data as PlaceRow[]).map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.type,
    lat: r.lat,
    lng: r.lng,
    body: r.body ?? undefined,
  }));
}

// ---------- Şəhidlər (həssas bölmə) ----------

interface MartyrRow {
  id: string;
  full_name: string;
  birth_date: string | null;
  death_date: string | null;
  bio: string | null;
  awards: string[] | null;
}

function martyrFromRow(r: MartyrRow): Martyr {
  return {
    id: r.id,
    fullName: r.full_name,
    // Siyahıda yalnız illər göstərilir (məs. "1975 — 2020")
    birthYear: r.birth_date?.slice(0, 4),
    deathDate: r.death_date?.slice(0, 4),
    bio: r.bio ?? "",
    awards: r.awards ?? undefined,
    isSample: false,
  };
}

export async function getMartyrs(): Promise<Martyr[]> {
  const sb = getSupabase();
  if (!sb) return mockMartyrs;
  // RLS onsuz da yalnız approved qaytarır; filtr burada da açıq yazılır
  const { data, error } = await sb
    .from("martyrs")
    .select("id, full_name, birth_date, death_date, bio, awards")
    .eq("status", "approved")
    .order("death_date", { ascending: true });
  if (error) {
    logError("getMartyrs", error.message);
    return [];
  }
  return (data as MartyrRow[]).map(martyrFromRow);
}

export async function getMartyr(id: string): Promise<Martyr | undefined> {
  const sb = getSupabase();
  if (!sb) return mockMartyrs.find((m) => m.id === id);
  const { data, error } = await sb
    .from("martyrs")
    .select("id, full_name, birth_date, death_date, bio, awards")
    .eq("status", "approved")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logError("getMartyr", error.message);
    return undefined;
  }
  return data ? martyrFromRow(data as MartyrRow) : undefined;
}
