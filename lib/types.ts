// ─── Типы данных, общие для фронта и бэка ────────────────────────

export type CertStatus = 'valid' | 'revoked' | 'expired';

export interface Certificate {
  id: string | number;
  display_id: string | number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  program: string;          // «Child Psychology / CBT» (склеено ' / ')
  module?: string;
  hours: number;            // суммарные часы
  courses_count?: number;
  courses_raw?: string;     // детализация «Child Psychology (36 hours) | …»
  issue_date: string;       // ISO
  issued_by: string;        // 'IPAS / IPI' или полное название
  status: CertStatus;
  membership_type?: string;
  valid_period?: string;    // «03/04/2024 - 05/04/2025»
  language?: string;
  director?: string;
  teacher?: string;
  source_url?: string;
  created_at?: string;
}

export interface NewsPost {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  cover_url?: string;
  published_at?: string;
  published?: boolean;
}

export type EventSource = 'ipas' | 'ipi';

export interface IpasEvent {
  id: string;
  title: string;
  starts_at: string;         // ISO
  ends_at?: string;
  location?: string;
  description?: string;
  source?: EventSource;
  source_url?: string;       // для IPI-событий ссылка на theipi.org
  register_url?: string;
  url?: string;
  price?: string;
}

// ─── Членство ─────────────────────────────────────────────────────

export type MemberTier =
  | 'community'
  | 'professional'
  | 'faculty'
  | 'verified_professional'
  | 'society_ambassador'
  | 'country_ambassador';

export interface MemberTierInfo {
  key: MemberTier;
  title: string;
  price_usd: number;
  tagline: string;
  perks: string[];
  required_docs: string[];
}

export type ApplicationStatus =
  | 'pending_payment'
  | 'pending_review'
  | 'approved'
  | 'rejected';

export interface MembershipApplication {
  id: string;
  tier: MemberTier;
  full_name: string;
  email: string;
  country: string;
  phone?: string;
  bio?: string;
  doc_urls: string[];     // ссылки на загруженные в Drive файлы
  status: ApplicationStatus;
  created_at: string;
  payment_id?: string;
}

// ─── API-ответ Apps Script ───────────────────────────────────────

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
