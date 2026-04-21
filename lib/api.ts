import type {
  ApiResponse,
  Certificate,
  IpasEvent,
  MembershipApplication,
  NewsPost,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

if (!API_URL && typeof window !== 'undefined') {
  // Предупреждение в dev-режиме, если забыли .env.local
  console.warn('[IPAS] NEXT_PUBLIC_API_URL is not set');
}

// ─── Низкоуровневые обёртки ──────────────────────────────────────

async function getJson<T>(
  action: string,
  params: Record<string, string | number | undefined> = {},
  opts?: { signal?: AbortSignal },
): Promise<T> {
  const q = new URLSearchParams({ action });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) q.set(k, String(v));
  }
  const res = await fetch(`${API_URL}?${q.toString()}`, {
    method: 'GET',
    signal: opts?.signal,
    // Apps Script отдаёт text/plain в JSON, fetch всё равно прочитает
  });
  const body: ApiResponse<T> = await res.json();
  if (!body.ok) throw new Error(body.error || 'API error');
  return body.data as T;
}

async function postJson<T>(
  action: string,
  payload: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    // text/plain, чтобы избежать CORS preflight для Apps Script
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, token, ...payload }),
  });
  const body: ApiResponse<T> = await res.json();
  if (!body.ok) throw new Error(body.error || 'API error');
  return body.data as T;
}

// ─── Публичные методы ────────────────────────────────────────────

export const api = {
  ping: () =>
    getJson<{ pong: string }>('ping'),

  // Сертификат по ID — обратная совместимость со старыми ссылками
  // (ведущие нули игнорируются бэком).
  getCert: (id: string, meta?: { ref?: string; ua?: string }) =>
    getJson<Certificate | null>('cert', { id, ...(meta || {}) }),

  searchCerts: (q: string, signal?: AbortSignal) =>
    getJson<Certificate[]>('search', { q }, { signal }),

  posts: () =>
    getJson<NewsPost[]>('posts'),

  post: (slug: string) =>
    getJson<NewsPost | null>('post', { slug }),

  events: () =>
    getJson<IpasEvent[]>('events'),

  // ─── Админские методы (нужен token) ────────────────────────────

  createCert: (cert: Partial<Certificate>, sendEmail: boolean, token: string) =>
    postJson<Certificate>('createCert', { cert, sendEmail }, token),

  updateCert: (cert: Partial<Certificate>, token: string) =>
    postJson<Certificate>('updateCert', { cert }, token),

  revokeCert: (id: string, reason: string, token: string) =>
    postJson<{ ok: true }>('revokeCert', { id, reason }, token),

  resendCert: (id: string, token: string) =>
    postJson<{ ok: true }>('resendCert', { id }, token),

  bulkCreate: (
    rows: Partial<Certificate>[],
    sendEmail: boolean,
    token: string,
  ) => postJson<{ created: number }>('bulkCreate', { rows, sendEmail }, token),

  upsertPost: (post: Partial<NewsPost>, token: string) =>
    postJson<NewsPost>('upsertPost', { post }, token),

  deletePost: (id: string, token: string) =>
    postJson<{ ok: true }>('deletePost', { id }, token),

  // ─── Членство (клиент → бэк) ───────────────────────────────────

  submitApplication: (
    app: Partial<MembershipApplication> & { docs_base64?: string[] },
  ) => postJson<{ application_id: string; invoice_url: string }>(
    'submitApplication',
    app,
  ),
};

// ─── Хелпер: нормализация ID для сохранения ведущих нулей в UI ──
export function formatCertId(id: string | number): string {
  const s = String(id);
  // Старые напечатанные ID были 9-значные с ведущим нулём.
  // Если длина 8 и всё цифры — дополняем одним нулём слева для показа.
  if (/^\d{8}$/.test(s)) return '0' + s;
  return s;
}
