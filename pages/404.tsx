import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';

/**
 * Страница 404 — GitHub Pages отдаёт её на любой неизвестный URL.
 * Здесь мы сами разбираем путь и редиректим:
 *   /<8-9 digit ID>      → /student/<ID>
 *   /student/<code>      → пытаемся подгрузить профиль; нет — 404
 *   /certificate/<id>    → /student/<id>
 *
 * Это позволяет публичным страницам сертификатов работать даже для
 * только что добавленных в БД студентов, без пересборки сайта.
 */
export default function Custom404() {
  const [stage, setStage] = useState<'loading' | 'notfound'>('loading');
  const [studentCode, setStudentCode] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.replace(/\/$/, ''); // strip trailing /

    // /student/<code>  →  пытаемся показать профиль на этой же странице
    const studentMatch = path.match(/\/student\/([A-Za-z0-9_-]+)$/);
    if (studentMatch) {
      setStudentCode(studentMatch[1]);
      return;
    }

    // /certificate/<id>  →  редирект на /student/<id>
    const certMatch = path.match(/\/certificate\/([A-Za-z0-9_-]+)$/);
    if (certMatch) {
      window.location.replace('/student/' + certMatch[1]);
      return;
    }

    // /<8-9 digit number>  →  редирект на /student/<число>
    const idMatch = path.match(/^\/0?(\d{8,9})$/);
    if (idMatch) {
      window.location.replace('/student/' + idMatch[0].slice(1));
      return;
    }

    setStage('notfound');
  }, []);

  // Если URL похож на /student/<X> — рендерим профиль через тот же
  // компонент, что и на статической странице
  if (studentCode) {
    return <StudentProfileFallback code={studentCode} />;
  }

  if (stage === 'loading') {
    return (
      <Layout title="Loading…">
        <div className="container-p py-20 text-center text-fg-muted">
          Loading…
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Page not found">
      <div className="container-p py-20 text-center">
        <ShieldAlert size={48} className="mx-auto text-red-400" />
        <h1 className="mt-4 font-display text-3xl">Page not found</h1>
        <p className="mt-2 text-fg-muted">
          The page you requested does not exist on intpas.com.
        </p>
        <Link href="/" className="btn-ghost mt-6 justify-center">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    </Layout>
  );
}

// ─── Компонент профиля студента (упрощённый, для fallback) ──────────
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck, Calendar, Clock, GraduationCap, Printer,
} from 'lucide-react';
import type { Certificate } from '../lib/types';

interface StudentProfile {
  student_code: string;
  full_name: string;
  total_hours: number;
  courses_count: number;
  last_issue_date: string | null;
  certificates: Certificate[];
}

function StudentProfileFallback({ code }: { code: string }) {
  const [profile, setProfile] = useState<StudentProfile | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) { setError('API not configured'); return; }
    fetch(`${url}?action=student&code=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(b => {
        if (!b.ok) throw new Error(b.error);
        setProfile(b.data);
      })
      .catch(e => setError(e.message));
  }, [code]);

  if (profile === undefined && !error) {
    return <Layout title="Loading…"><div className="container-p py-20 text-center text-fg-muted">Loading student profile…</div></Layout>;
  }
  if (error || profile === null) {
    return (
      <Layout title="Student not found">
        <div className="container-p py-20 text-center">
          <ShieldAlert size={48} className="mx-auto text-red-400" />
          <h1 className="mt-4 font-display text-3xl">Student not found</h1>
          <p className="mt-2 text-fg-muted">
            No student with code <span className="font-mono">{code}</span>.
          </p>
          <Link href="/" className="btn-ghost mt-6 justify-center">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </Layout>
    );
  }

  const p = profile as StudentProfile;
  const studentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/student/${p.student_code}`
    : `https://intpas.com/student/${p.student_code}`;
  const lastDate = p.last_issue_date
    ? new Date(p.last_issue_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—';

  return (
    <Layout
      title={`${p.full_name} — IPAS Student Profile`}
      description={`Verified IPAS profile for ${p.full_name}.`}
    >
      <article className="container-p py-10 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-fg-muted hover:text-brand-gold">
              <ArrowLeft size={12} /> IPAS Registry
            </Link>
            <h1 className="mt-3 font-display text-3xl sm:text-5xl">{p.full_name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-brand-gold">#{p.student_code}</span>
              <span className="badge-valid"><ShieldCheck size={12} /> Verified</span>
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

        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-brand-gold/20 bg-surface-muted p-4 text-center">
                <GraduationCap size={20} className="mx-auto text-brand-gold" />
                <div className="mt-2 font-display text-xl">{p.courses_count}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-fg-muted">Programs</div>
              </div>
              <div className="rounded-lg border border-brand-gold/20 bg-surface-muted p-4 text-center">
                <Clock size={20} className="mx-auto text-brand-gold" />
                <div className="mt-2 font-display text-xl">{p.total_hours}h</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-fg-muted">Total hours</div>
              </div>
              <div className="rounded-lg border border-brand-gold/20 bg-surface-muted p-4 text-center">
                <Calendar size={20} className="mx-auto text-brand-gold" />
                <div className="mt-2 font-display text-xl">{lastDate}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-fg-muted">Last issued</div>
              </div>
            </div>

            <h2 className="mt-8 font-display text-xl text-brand-gold">
              Certificates ({p.certificates.length})
            </h2>

            <div className="space-y-3">
              {p.certificates.map(c => {
                const issue = c.issue_date
                  ? new Date(c.issue_date).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })
                  : '—';
                return (
                  <div key={String(c.id)} className="rounded-xl border border-brand-gold/30 bg-surface-muted p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-lg">{c.program}</div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
                          <span>#{String(c.display_id || c.id)}</span>
                          <span>·</span>
                          <span>{c.hours}h</span>
                          <span>·</span>
                          <span>{issue}</span>
                          {c.teacher && (<><span>·</span><span>Teacher: {c.teacher}</span></>)}
                        </div>
                      </div>
                      <span className={c.status === 'valid' ? 'badge-valid' : 'badge-revoked'}>
                        <ShieldCheck size={12} /> {c.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="flex flex-col items-center justify-start gap-3 rounded-xl border border-brand-gold/30 bg-white p-5">
            <QRCodeSVG value={studentUrl} size={180} level="H" fgColor="#0A0F1E" bgColor="#FFFFFF" />
            <div className="text-center text-[10px] uppercase tracking-widest text-neutral-500">scan to verify</div>
            <div className="break-all text-center text-[10px] text-neutral-400">{studentUrl}</div>
          </aside>
        </div>
      </article>
    </Layout>
  );
}
