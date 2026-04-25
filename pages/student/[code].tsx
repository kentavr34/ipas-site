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
import type { Certificate } from '../../lib/types';

interface StudentProfile {
  student_code: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  total_hours: number;
  courses_count: number;
  last_issue_date: string | null;
  certificates: Certificate[];
}

export default function StudentPage() {
  const router = useRouter();
  const { code } = router.query;
  const [profile, setProfile] = useState<StudentProfile | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || typeof code !== 'string') return;
    const url = process.env.NEXT_PUBLIC_API_URL;
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
            No student with code <span className="font-mono">{String(code)}</span>.
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

  const hasRevoked = p.certificates.some(c => c.status !== 'valid');

  return (
    <Layout
      title={`${p.full_name} — IPAS Student Profile`}
      description={`Verified IPAS profile for ${p.full_name}. Total ${p.total_hours} hours across ${p.courses_count} programs.`}
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
              {hasRevoked ? (
                <span className="badge-revoked"><ShieldAlert size={12} /> some certificates revoked</span>
              ) : (
                <span className="badge-valid"><ShieldCheck size={12} /> Verified</span>
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

        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          {/* Левая колонка: агрегаты + список сертификатов */}
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={GraduationCap} value={String(p.courses_count)} label="Programs" />
              <Stat icon={Clock} value={`${p.total_hours}h`} label="Total hours" />
              <Stat icon={Calendar} value={lastDate} label="Last issued" />
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
                const isValid = c.status === 'valid';
                return (
                  <Link
                    key={String(c.id)}
                    href={`/certificate/${c.display_id || c.id}`}
                    className="block rounded-xl border border-brand-gold/30 bg-surface-muted p-5 transition hover:border-brand-gold hover:shadow-glow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-lg">{c.program}</div>
                        {c.module && (
                          <div className="text-sm text-fg-muted">{c.module}</div>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
                          <span>#{String(c.display_id || c.id)}</span>
                          <span>·</span>
                          <span>{c.hours}h</span>
                          <span>·</span>
                          <span>{issue}</span>
                          {c.teacher && (<><span>·</span><span>Teacher: {c.teacher}</span></>)}
                        </div>
                      </div>
                      <span className={isValid ? 'badge-valid' : 'badge-revoked'}>
                        {isValid
                          ? <><ShieldCheck size={12} /> {c.status}</>
                          : <><ShieldAlert size={12} /> {c.status}</>}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* QR */}
          <aside className="flex flex-col items-center justify-start gap-3 rounded-xl border border-brand-gold/30 bg-white p-5">
            <QRCodeSVG value={studentUrl} size={180} level="H" fgColor="#0A0F1E" bgColor="#FFFFFF" />
            <div className="text-center text-[10px] uppercase tracking-widest text-neutral-500">scan to verify</div>
            <div className="break-all text-center text-[10px] text-neutral-400">{studentUrl}</div>
          </aside>
        </div>

        <hr className="gold" />

        <p className="text-sm text-fg-muted">
          The awardee has complied with the evaluation standards of the
          International Psychotherapy Association and has met the requirements of
          our Academic Partners and Accreditation bodies.
        </p>
      </article>
    </Layout>
  );
}

function Stat({
  icon: Icon, value, label,
}: {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-brand-gold/20 bg-surface-muted p-4 text-center">
      <Icon size={20} className="mx-auto text-brand-gold" />
      <div className="mt-2 font-display text-xl">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-fg-muted">{label}</div>
    </div>
  );
}

// Static export: пред-генерируем страницы для всех known student codes.
export const getStaticPaths: GetStaticPaths = async () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  let codes: string[] = [];
  if (url) {
    try {
      const res = await fetch(`${url}?action=listStudentCodes`);
      const body: any = await res.json();
      if (body && Array.isArray(body.data)) {
        codes = body.data.map((x: any) => String(x));
      }
    } catch (e) { /* ignore */ }
  }
  return {
    paths: codes.map(code => ({ params: { code } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => ({ props: {} });
