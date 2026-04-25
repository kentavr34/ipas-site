import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2, Upload, CreditCard } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { MEMBER_TIERS, tierByKey } from '../../lib/tiers';
import { api } from '../../lib/api';
import type { MemberTier } from '../../lib/types';

type Stage = 'form' | 'submitting' | 'payment' | 'done';

export default function Apply() {
  const router = useRouter();
  const initialTier = (router.query.tier as MemberTier) || 'professional';

  const [tier, setTier] = useState<MemberTier>(initialTier);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<Stage>('form');
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && router.query.tier) {
      setTier(router.query.tier as MemberTier);
    }
  }, [router.isReady, router.query.tier]);

  const tierInfo = useMemo(() => tierByKey(tier), [tier]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStage('submitting');
    try {
      // Конвертируем файлы в base64 — Apps Script принимает через JSON.
      // Для крупных файлов в следующей итерации перейдём на прямую загрузку
      // в Drive через resumable upload session.
      const docs_base64 = await Promise.all(
        files.map(f => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const [, b64] = (reader.result as string).split(',');
            resolve(`${f.name}|${f.type}|${b64}`);
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        })),
      );

      const res = await api.submitApplication({
        tier,
        full_name: fullName,
        email,
        country,
        phone,
        bio,
        docs_base64,
      });

      setInvoiceUrl(res.invoice_url);
      setStage('payment');
    } catch (err) {
      setError((err as Error).message || 'Failed to submit application');
      setStage('form');
    }
  }

  if (!tierInfo) {
    return (
      <Layout title="Apply">
        <div className="container-p py-20 text-center">
          <p>Invalid tier selected.</p>
          <Link href="/membership" className="btn-ghost mt-4 justify-center">
            <ArrowLeft size={14} /> Back to tiers
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Apply — ${tierInfo.title}`}
      description={`Apply for IPAS ${tierInfo.title} membership.`}
    >
      <div className="container-p py-10 sm:py-14">
        <Link
          href="/membership"
          className="inline-flex items-center gap-1 text-xs uppercase
                     tracking-widest text-fg-muted hover:text-brand-gold"
        >
          <ArrowLeft size={12} /> All tiers
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Форма */}
          <div className="order-2 lg:order-1">
            {stage === 'form' || stage === 'submitting' ? (
              <form onSubmit={onSubmit} className="space-y-4">
                <header>
                  <h1 className="font-display text-3xl sm:text-4xl">
                    Apply for {tierInfo.title}
                  </h1>
                  <p className="mt-1 text-sm text-fg-muted">
                    ${tierInfo.price_usd} / year — {tierInfo.tagline}
                  </p>
                </header>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-fg-muted">Membership tier</span>
                  <select
                    className="input mt-1"
                    value={tier}
                    onChange={e => setTier(e.target.value as MemberTier)}
                  >
                    {MEMBER_TIERS.map(t => (
                      <option key={t.key} value={t.key}>
                        {t.title} — ${t.price_usd}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-fg-muted">Full name</span>
                    <input
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="input mt-1"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-fg-muted">Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input mt-1"
                      autoComplete="email"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-fg-muted">Country</span>
                    <input
                      required
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="input mt-1"
                      autoComplete="country"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-widest text-fg-muted">Phone <span className="opacity-60">(optional)</span></span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="input mt-1"
                      autoComplete="tel"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-fg-muted">
                    Short professional bio
                  </span>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={4}
                    className="input mt-1"
                    placeholder="Brief summary of your education, current practice and why you want to join IPAS…"
                  />
                </label>

                <div>
                  <div className="text-xs uppercase tracking-widest text-fg-muted">
                    Required documents
                  </div>
                  <ul className="mt-1 space-y-1 text-xs text-fg-muted">
                    {tierInfo.required_docs.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                  <label className="mt-3 flex cursor-pointer items-center justify-center
                                    gap-2 rounded-md border border-dashed
                                    border-brand-gold/40 bg-surface px-4 py-6
                                    text-sm text-fg-muted hover:border-brand-gold">
                    <Upload size={16} className="text-brand-gold" />
                    {files.length === 0
                      ? 'Click or tap to attach documents (PDF, JPG, PNG)'
                      : `${files.length} file(s) selected`}
                    <input
                      type="file"
                      multiple
                      accept="application/pdf,image/*"
                      className="sr-only"
                      onChange={e => setFiles(Array.from(e.target.files || []))}
                    />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-fg-muted">
                      {files.map((f, i) => (
                        <li key={i} className="truncate">
                          📎 {f.name} — {(f.size / 1024).toFixed(0)} KB
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={stage === 'submitting' || files.length === 0}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {stage === 'submitting' ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                  ) : (
                    <>Continue to payment <CreditCard size={16} /></>
                  )}
                </button>
                <p className="text-xs text-fg-muted">
                  By submitting you agree to manual review of your credentials.
                  Payment is processed through a secure card gateway — we never
                  see your card details.
                </p>
              </form>
            ) : stage === 'payment' && invoiceUrl ? (
              <div className="space-y-4">
                <h1 className="font-display text-3xl">Secure payment</h1>
                <p className="text-sm text-fg-muted">
                  Complete the payment below to activate your application.
                  Your card will be charged ${tierInfo.price_usd}.
                </p>
                <iframe
                  src={invoiceUrl}
                  className="h-[620px] w-full rounded-xl border border-brand-gold/30"
                  title="Payment"
                />
                <button
                  type="button"
                  onClick={() => setStage('done')}
                  className="btn-ghost w-full justify-center"
                >
                  I completed the payment
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-brand-gold/30
                              bg-surface-muted p-8 text-center shadow-glow">
                <CheckCircle2 size={48} className="mx-auto text-brand-gold" />
                <h1 className="mt-4 font-display text-3xl">Application received</h1>
                <p className="mt-2 text-sm text-fg-muted">
                  Thank you. The IPAS Council will review your credentials and
                  contact you within 3–5 working days.
                </p>
                <Link href="/" className="btn-primary mt-6 justify-center">
                  Back to home
                </Link>
              </div>
            )}
          </div>

          {/* Сайдбар — краткая карточка уровня */}
          <aside className="order-1 lg:order-2">
            <div className="rounded-2xl border border-brand-gold/30 bg-surface-muted p-5 sticky top-24">
              <div className="text-xs uppercase tracking-widest text-brand-gold">
                You are applying for
              </div>
              <h2 className="mt-2 font-display text-2xl">{tierInfo.title}</h2>
              <div className="mt-2 text-3xl font-display">
                ${tierInfo.price_usd}
                <span className="text-sm text-fg-muted"> / year</span>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs">
                {tierInfo.perks.slice(0, 4).map((p, i) => (
                  <li key={i} className="flex gap-2 text-fg-muted">
                    <span className="mt-1 h-1 w-1 rounded-full bg-brand-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
