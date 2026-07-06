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

export interface Martyr {
  id: string;
  fullName: string;
  birthYear?: string;
  deathDate?: string;
  bio: string;
  awards?: string[];
  isSample: boolean; // nümunə məlumat — real profillər yalnız ikiqat təsdiqdən sonra
}
