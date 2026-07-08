// Əsas domen tipləri — Supabase sxemi ilə eyni adlanma (bax: supabase/migrations)

export type ModerationStatus = "draft" | "pending" | "approved" | "rejected";

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  coverEmoji?: string;
  publishedAt: string; // ISO
}

export interface EventItem {
  id: string;
  title: string;
  body?: string;
  location?: string;
  startsAt: string; // ISO
}

export type DutyType = "aptek" | "feldser" | "elektrik" | "su";

export interface DutyInfo {
  id: string;
  type: DutyType;
  title: string;
  body: string;
  phone?: string;
  isAlert: boolean; // true → ana səhifədə banner kimi çıxır (kəsinti və s.)
  validFrom: string;
  validTo?: string;
}

export type PlaceType =
  | "mekteb"
  | "mescid"
  | "bulaq"
  | "abide"
  | "qebiristanliq"
  | "saglamliq"
  | "magaza"
  | "tarixi_ev"
  | "tesserrufat"
  | "turizm";

export interface Place {
  id: string;
  slug: string;
  name: string;
  type: PlaceType;
  lat: number;
  lng: number;
  body?: string;
}

export type ProductCategory =
  | "sud"
  | "terevez"
  | "meyve"
  | "corek"
  | "et"
  | "bal"
  | "el_isi"
  | "diger";

export interface Producer {
  id: string;
  name: string;
  phone: string;
  description?: string;
  isFlagship: boolean; // qaymaq brendi bölməsində göstərilir
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price?: number; // yoxdursa "qiymət razılaşma ilə"
  unit?: string;
  description?: string;
  photoUrl?: string;
  seasonStart?: number; // 1–12; yoxdursa bütün il
  seasonEnd?: number;
  available: boolean;
  producer: Producer;
}

export type ListingType = "elan" | "itmis" | "tapilmis";

export interface Listing {
  id: string;
  type: ListingType;
  title: string;
  body: string;
  phone?: string;
  createdAt: string; // ISO
}

export type TimelineEra = "isgal" | "azadliq" | "berpa";

export interface TimelineEntry {
  id: string;
  era: TimelineEra;
  eventDate: string; // ISO date (sıralama)
  dateDisplay?: string; // ekran üçün (məs. "1993, iyul")
  title: string;
  body: string;
  photoUrl?: string;
  sources: string[];
}

export type ServiceCategory =
  | "usta"
  | "elektrik"
  | "santexnik"
  | "berber"
  | "taksi"
  | "toy"
  | "texnika"
  | "diger";

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  phone: string;
  description?: string;
}

export interface TransportRoute {
  id: string;
  title: string;
  schedule: string;
  driverName?: string;
  phone?: string;
  note?: string;
}

export type StayType = "qonaq_evi" | "kiraye_ev";

export interface Stay {
  id: string;
  name: string;
  type: StayType;
  description?: string;
  phone: string;
  priceNote?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  takenPeriod?: string; // "1980-ci illər" kimi sərbəst mətn
  url: string; // tam public URL
  uploaderName?: string;
}

export interface Martyr {
  id: string;
  fullName: string;
  birthYear?: string;
  deathDate?: string;
  bio: string;
  awards?: string[];
  isSample: boolean; // nümunə məlumat — real profillər yalnız ikiqat təsdiqdən sonra
}
