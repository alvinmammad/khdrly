import { getSupabase } from "@/lib/supabase/client";
import { inSeason } from "@/lib/bazarMeta";
import {
  mockDuty,
  mockEvents,
  mockMartyrs,
  mockListings,
  mockNews,
  mockPlaces,
  mockProducers,
  mockProducts,
  mockServices,
  mockStays,
  mockTimeline,
  mockTransport,
} from "./mock";
import type {
  DutyInfo,
  EventItem,
  Listing,
  Martyr,
  NewsItem,
  Place,
  Producer,
  Product,
  MediaItem,
  ServiceProvider,
  Stay,
  TimelineEntry,
  TimelineEra,
  TransportRoute,
} from "./types";

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

// ---------- Bazar (Modul 11 v1) ----------

interface ProducerRow {
  id: string;
  name: string;
  phone: string;
  description: string | null;
  is_flagship: boolean;
}

interface ProductRow {
  id: string;
  name: string;
  category: Product["category"];
  price: number | null;
  unit: string | null;
  description: string | null;
  photo_url: string | null;
  season_start: number | null;
  season_end: number | null;
  available: boolean;
  producer: ProducerRow;
}

function producerFromRow(r: ProducerRow): Producer {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    description: r.description ?? undefined,
    isFlagship: r.is_flagship,
  };
}

function productFromRow(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    price: r.price ?? undefined,
    unit: r.unit ?? undefined,
    description: r.description ?? undefined,
    photoUrl: r.photo_url ?? undefined,
    seasonStart: r.season_start ?? undefined,
    seasonEnd: r.season_end ?? undefined,
    available: r.available,
    producer: producerFromRow(r.producer),
  };
}

/** Bakı vaxtı ilə cari ay (1–12) — mövsümi avtomatika üçün. */
function currentBakuMonth(): number {
  return new Date(Date.now() + 4 * 60 * 60 * 1000).getUTCMonth() + 1;
}

const PRODUCT_SELECT =
  "id, name, category, price, unit, description, photo_url, season_start, season_end, available, producer:producers!inner(id, name, phone, description, is_flagship)";

/** Satışda olan və mövsümündə olan məhsullar (kataloq). */
export async function getProducts(): Promise<Product[]> {
  const month = currentBakuMonth();
  const sb = getSupabase();
  if (!sb) {
    return mockProducts.filter(
      (p) => p.available && inSeason(p.seasonStart, p.seasonEnd, month)
    );
  }
  const { data, error } = await sb
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "approved")
    .eq("available", true)
    .eq("producer.status", "approved")
    .order("category")
    .order("name");
  if (error) {
    logError("getProducts", error.message);
    return [];
  }
  return (data as unknown as ProductRow[])
    .map(productFromRow)
    .filter((p) => inSeason(p.seasonStart, p.seasonEnd, month));
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const sb = getSupabase();
  if (!sb) return mockProducts.find((p) => p.id === id);
  const { data, error } = await sb
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "approved")
    .eq("producer.status", "approved")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logError("getProduct", error.message);
    return undefined;
  }
  return data ? productFromRow(data as unknown as ProductRow) : undefined;
}

/** Qaymaq brendi bölməsi üçün flaqman istehsalçılar. */
export async function getFlagshipProducers(): Promise<Producer[]> {
  const sb = getSupabase();
  if (!sb) return mockProducers.filter((p) => p.isFlagship);
  const { data, error } = await sb
    .from("producers")
    .select("id, name, phone, description, is_flagship")
    .eq("status", "approved")
    .eq("is_flagship", true)
    .order("name");
  if (error) {
    logError("getFlagshipProducers", error.message);
    return [];
  }
  return (data as ProducerRow[]).map(producerFromRow);
}

// ---------- Elanlar ----------

interface ListingRow {
  id: string;
  type: Listing["type"];
  title: string;
  body: string;
  phone: string | null;
  created_at: string;
}

export async function getListings(): Promise<Listing[]> {
  const sb = getSupabase();
  if (!sb) {
    return [...mockListings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const now = new Date().toISOString();
  const { data, error } = await sb
    .from("listings")
    .select("id, type, title, body, phone, created_at")
    .eq("status", "approved")
    .or(`valid_to.is.null,valid_to.gte.${now}`)
    .order("created_at", { ascending: false });
  if (error) {
    logError("getListings", error.message);
    return [];
  }
  return (data as ListingRow[]).map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body,
    phone: r.phone ?? undefined,
    createdAt: r.created_at,
  }));
}

// ---------- Timeline (işğal / azadlıq / bərpa) ----------

interface TimelineRow {
  id: string;
  era: TimelineEra;
  event_date: string;
  date_display: string | null;
  title: string;
  body: string;
  photo_url: string | null;
  sources: string[];
}

function timelineFromRow(r: TimelineRow): TimelineEntry {
  return {
    id: r.id,
    era: r.era,
    eventDate: r.event_date,
    dateDisplay: r.date_display ?? undefined,
    title: r.title,
    body: r.body,
    photoUrl: r.photo_url ?? undefined,
    sources: r.sources ?? [],
  };
}

export async function getTimeline(eras: TimelineEra[]): Promise<TimelineEntry[]> {
  const sb = getSupabase();
  if (!sb) {
    return mockTimeline
      .filter((t) => eras.includes(t.era))
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  }
  const { data, error } = await sb
    .from("timeline_entries")
    .select("id, era, event_date, date_display, title, body, photo_url, sources")
    .eq("status", "approved")
    .in("era", eras)
    .order("event_date", { ascending: true });
  if (error) {
    logError("getTimeline", error.message);
    return [];
  }
  return (data as TimelineRow[]).map(timelineFromRow);
}

// ---------- Media arxivi ----------

interface MediaRow {
  id: string;
  title: string;
  description: string | null;
  taken_period: string | null;
  storage_path: string;
  uploader_name: string | null;
}

/** Storage yolundan tam public URL qurur. */
export function mediaPublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/media/${storagePath}`;
}

export async function getMediaItems(): Promise<MediaItem[]> {
  const sb = getSupabase();
  if (!sb) return []; // mock rejimdə qalereya boş görünür (real şəkil yoxdur)
  const { data, error } = await sb
    .from("media_items")
    .select("id, title, description, taken_period, storage_path, uploader_name")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) {
    logError("getMediaItems", error.message);
    return [];
  }
  return (data as MediaRow[]).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? undefined,
    takenPeriod: r.taken_period ?? undefined,
    url: mediaPublicUrl(r.storage_path),
    uploaderName: r.uploader_name ?? undefined,
  }));
}

// ---------- Xidmətlər ----------

interface ServiceRow {
  id: string;
  name: string;
  category: ServiceProvider["category"];
  phone: string;
  description: string | null;
}

export async function getServices(): Promise<ServiceProvider[]> {
  const sb = getSupabase();
  if (!sb) return mockServices;
  const { data, error } = await sb
    .from("service_providers")
    .select("id, name, category, phone, description")
    .eq("status", "approved")
    .order("category")
    .order("name");
  if (error) {
    logError("getServices", error.message);
    return [];
  }
  return (data as ServiceRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    phone: r.phone,
    description: r.description ?? undefined,
  }));
}

// ---------- Nəqliyyat ----------

interface TransportRow {
  id: string;
  title: string;
  schedule: string;
  driver_name: string | null;
  phone: string | null;
  note: string | null;
}

export async function getTransportRoutes(): Promise<TransportRoute[]> {
  const sb = getSupabase();
  if (!sb) return mockTransport;
  const { data, error } = await sb
    .from("transport_routes")
    .select("id, title, schedule, driver_name, phone, note")
    .eq("status", "approved")
    .order("sort_order")
    .order("title");
  if (error) {
    logError("getTransportRoutes", error.message);
    return [];
  }
  return (data as TransportRow[]).map((r) => ({
    id: r.id,
    title: r.title,
    schedule: r.schedule,
    driverName: r.driver_name ?? undefined,
    phone: r.phone ?? undefined,
    note: r.note ?? undefined,
  }));
}

// ---------- Turizm / kirayə ----------

interface StayRow {
  id: string;
  name: string;
  type: Stay["type"];
  description: string | null;
  phone: string;
  price_note: string | null;
}

export async function getStays(): Promise<Stay[]> {
  const sb = getSupabase();
  if (!sb) return mockStays;
  const { data, error } = await sb
    .from("stays")
    .select("id, name, type, description, phone, price_note")
    .eq("status", "approved")
    .order("type")
    .order("name");
  if (error) {
    logError("getStays", error.message);
    return [];
  }
  return (data as StayRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    description: r.description ?? undefined,
    phone: r.phone,
    priceNote: r.price_note ?? undefined,
  }));
}
