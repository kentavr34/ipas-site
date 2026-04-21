import Link from 'next/link';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { MEMBER_TIERS } from '../../lib/tiers';

export default function Membership() {
  return (
    <Layout
      title="Membership"
      description="Six IPAS membership tiers — from students to Country Ambassadors."
    >
      <div className="container-p py-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs uppercase tracking-widest text-brand-gold">
            Join the Community
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl text-balance">
            Membership tiers
          </h1>
          <p className="mt-4 text-fg-muted text-balance">
            Choose the tier that matches your current stage. Applications are
            reviewed manually, so please attach the required documents honestly —
            our Council verifies credentials before approval.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full
                          border border-brand-gold/30 bg-brand-gold/5 px-4 py-1.5
                          text-xs uppercase tracking-widest text-brand-gold">
            <ShieldCheck size={14} />
            Secure card payment · No crypto setup required
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {MEMBER_TIERS.map((t, idx) => {
            const featured = t.key === 'professional';
            return (
              <div
                key={t.key}
                className={
                  'relative flex flex-col rounded-2xl border p-6 transition ' +
                  (featured
                    ? 'border-brand-gold/70 bg-gradient-to-br from-brand-gold/10 to-transparent shadow-glow'
                    : 'border-brand-gold/20 bg-surface-muted hover:border-brand-gold/50')
                }
              >
                {featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-gold
                                   px-3 py-0.5 text-[10px] uppercase tracking-widest
                                   text-brand-ink">
                    Most popular
                  </span>
                )}
                <div className="text-xs uppercase tracking-widest text-brand-gold">
                  Tier {idx + 1}
                </div>
                <h2 className="mt-2 font-display text-2xl">{t.title}</h2>
                <p className="mt-1 text-sm text-fg-muted">{t.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl">${t.price_usd}</span>
                  <span className="text-sm text-fg-muted">/ year</span>
                </div>

                <ul className="mt-5 space-y-2 text-sm">
                  {t.perks.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <Check size={14} className="mt-0.5 shrink-0 text-brand-gold" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 text-[10px] uppercase tracking-widest text-fg-muted">
                  Required documents
                </div>
                <ul className="mt-1 text-xs text-fg-muted space-y-1">
                  {t.required_docs.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>

                <div className="mt-auto pt-6">
                  <Link
                    href={`/membership/apply?tier=${t.key}`}
                    className={featured ? 'btn-primary w-full justify-center' : 'btn-ghost w-full justify-center'}
                  >
                    Apply for {t.title.split(' ')[0]} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <section className="mt-16 rounded-2xl border border-brand-gold/20
                            bg-surface-muted p-6 sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl">How it works</h2>
          <ol className="mt-5 grid gap-4 text-sm md:grid-cols-3">
            <Step n={1} title="Submit documents">
              Fill in the application form and attach proof of qualification.
            </Step>
            <Step n={2} title="Pay securely by card">
              One-time card payment in USD. Annual renewal is optional.
            </Step>
            <Step n={3} title="Review & approval">
              The Council reviews your credentials within 3–5 working days
              and issues your Membership Certificate.
            </Step>
          </ol>
        </section>
      </div>
    </Layout>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-brand-gold/20 bg-surface p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full
                      bg-brand-gold text-sm font-semibold text-brand-ink">
        {n}
      </div>
      <div className="mt-3 font-display text-lg">{title}</div>
      <div className="mt-1 text-sm text-fg-muted">{children}</div>
    </div>
  );
}
