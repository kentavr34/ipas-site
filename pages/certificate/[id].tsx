import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck, ShieldAlert, Calendar, Clock, GraduationCap,
  User, Languages, ArrowLeft, Printer,
} from 'lucide-react';
import { Layout } from '../../components/Layout';
import { api, formatCertId } from '../../lib/api';
import type { Certificate } from '../../lib/types';

// Используем client-side fetch, а не getStaticProps/getStaticPaths —
// так любой ID (включая будущие) будет работать без ребилда.
// Для SEO главных сертификатов можно будет позже добавить prerender.

export default function CertPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cert, setCert] = useState<Certificate | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // У одного студента может быть несколько курсов — все на одной странице
  // профиля /student/[id]. Этот URL оставлен для обратной совместимости
  // (старые QR-коды, входящие ссылки) и теперь делает редирект.
  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    router.replace(`/student/${id}`);
  }, [id, router]);

  // ─── Loading / Not found ──────────────────────────────────────
  if (cert === undefined && !error) {
    return (
      <Layout title="Loading certificate">
        <div className="container-p py-20 text-center text-fg-muted">
          Loading certificate…
        </div>
      </Layout>
    );
  }

  if (error || cert === null) {
    return (
      <Layout title="Certificate not found">
        <div className="container-p py-20 text-center">
          <ShieldAlert size={48} className="mx-auto text-red-400" />
          <h1 className="mt-4 font-display text-3xl">Certificate not found</h1>
          <p className="mt-2 text-fg-muted">
            No certificate with ID <span className="font-mono">{String(id)}</span>{' '}
            exists in the IPAS registry.
          </p>
          <Link href="/" className="btn-ghost mt-6 justify-center">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </Layout>
    );
  }

  const c = cert as Certificate;
  const certUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${formatCertId(c.id)}`
    : `https://intpas.com/${formatCertId(c.id)}`;

  const issueDate = c.issue_date
    ? new Date(c.issue_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—';

  const isValid = c.status === 'valid';

  return (
    <Layout
      title={`${c.full_name} — Certificate ${formatCertId(c.id)}`}
      description={`Verified IPAS certificate for ${c.full_name} — ${c.program} (${c.hours}h).`}
    >
      <article className="container-p py-10 sm:py-14">
        {/* Шапка: статус + ID + печать */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs uppercase
                         tracking-widest text-fg-muted hover:text-brand-gold"
            >
              <ArrowLeft size={12} /> IPAS Registry
            </Link>
            <h1 className="mt-3 font-display text-3xl sm:text-5xl">{c.full_name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-brand-gold">
                #{formatCertId(c.id)}
              </span>
              {isValid ? (
                <span className="badge-valid">
                  <ShieldCheck size={12} /> Verified · {c.status}
                </span>
              ) : (
                <span className="badge-revoked">
                  <ShieldAlert size={12} /> {c.status}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn-ghost self-start print:hidden"
          >
            <Printer size={16} /> Print
          </button>
        </div>

        <hr className="gold" />

        {/* Сетка: детали + QR */}
        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-5">
            <Field icon={GraduationCap} label="Program">
              {c.program}
              {c.courses_count && c.courses_count > 1 && (
                <span className="ml-2 text-xs text-fg-muted">
                  ({c.courses_count} courses)
                </span>
              )}
            </Field>

            {c.courses_raw && (
              <Field icon={GraduationCap} label="Courses">
                <div className="space-y-1">
                  {c.courses_raw.split(' | ').map((course, i) => (
                    <div key={i} className="text-sm">• {course}</div>
                  ))}
                </div>
              </Field>
            )}

            <Field icon={Clock} label="Total Hours">
              {c.hours}&nbsp;hours
            </Field>

            <Field icon={Calendar} label="Issued">
              {issueDate}
              {c.valid_period && (
                <span className="ml-2 text-xs text-fg-muted">
                  · valid {c.valid_period}
                </span>
              )}
            </Field>

            {c.membership_type && (
              <Field icon={User} label="Membership">
                {c.membership_type}
              </Field>
            )}

            {c.language && (
              <Field icon={Languages} label="Language of instruction">
                <span className="capitalize">{c.language}</span>
              </Field>
            )}

            {c.teacher && (
              <Field icon={User} label="Teacher">{c.teacher}</Field>
            )}
            {c.director && (
              <Field icon={User} label="Director">{c.director}</Field>
            )}

            <Field icon={ShieldCheck} label="Issued by">
              International Psychotherapy Association (IPAS)
              <div className="mt-1 text-xs text-fg-muted">
                Signed by Robin Mackay, President of the Council
              </div>
            </Field>
          </div>

          {/* QR */}
          <aside className="flex flex-col items-center justify-start gap-3
                            rounded-xl border border-brand-gold/30 bg-white p-5">
            <QRCodeSVG
              value={certUrl}
              size={180}
              level="H"
              fgColor="#0A0F1E"
              bgColor="#FFFFFF"
              imageSettings={undefined}
            />
            <div className="text-center text-[10px] uppercase tracking-widest text-neutral-500">
              scan to verify
            </div>
            <div className="break-all text-center text-[10px] text-neutral-400">
              {certUrl}
            </div>
          </aside>
        </div>

        <hr className="gold" />

        <p className="text-sm text-fg-muted">
          The awardee has complied with the evaluation standards of the Association
          and has met the requirements of our Academic Partners and Accreditation bodies.
        </p>
      </article>
    </Layout>
  );
}

// ─────────────────────────────────────────────────────────────────
// Static export (output: 'export') требует getStaticPaths для динамики.
// Тянем все ID из Apps Script во время билда, чтобы каждая страница
// получила свой статический HTML на github.io / в CDN.
// ─────────────────────────────────────────────────────────────────
export const getStaticPaths: GetStaticPaths = async () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  let ids: string[] = [];
  if (url) {
    try {
      const res = await fetch(`${url}?action=listCertIds`);
      const body: any = await res.json();
      if (body && Array.isArray(body.data)) {
        ids = body.data.map((x: any) => String(x));
      }
    } catch (e) { /* билд не должен падать из-за бэкенда */ }
  }
  // Если бэкенд недоступен, генерируем хотя бы пустую заглушку — она же
  // используется как фолбэк-роут (404.html копией).
  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

function Field({
  icon: Icon, label, children,
}: {
  icon: React.ComponentType<any>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-brand-gold" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-fg-muted">
          {label}
        </div>
        <div className="mt-0.5 break-words">{children}</div>
      </div>
    </div>
  );
}
