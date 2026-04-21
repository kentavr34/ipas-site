import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, GraduationCap, Users, Video,
  CalendarDays, Heart, BookOpen, Globe2, Download, DollarSign,
  PlayCircle,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { CertSearch } from '../components/CertSearch';
import { HOMEPAGE } from '../data/homepage';

const HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: 'Certificate Programs',
    text: 'Structured training in clinical psychology, CBT, ABA, couples therapy and more — with internationally recognised certificates.',
    href: '/programs',
  },
  {
    icon: Users,
    title: 'Professional Membership',
    text: 'Join a community of psychologists across six tiers, from students to Country Ambassadors.',
    href: '/membership',
  },
  {
    icon: Video,
    title: 'Learning Resources',
    text: 'Open video lessons, conference recordings and a free e-book library curated for practitioners.',
    href: '/resources',
  },
];

// Форматер чисел с разделителями
const nf = new Intl.NumberFormat('en-US');
const nfUSD = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 2,
});

export default function Home() {
  return (
    <Layout description="IPAS — International Psychotherapy Association. Certificate programmes, membership and resources for psychotherapy professionals.">
      {/* ─── HERO — панорамное фото конференции во всю ширину ──── */}
      <section className="relative overflow-hidden">
        {/* Фото-фон во всю ширину и высоту секции (stretched) */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HOMEPAGE.hero_image}')` }}
          aria-hidden
        />
        {/* Лёгкий navy-оверлей поверх фото — чтобы текст читался */}
        <div
          className="pointer-events-none absolute inset-0
                     bg-gradient-to-b from-brand-navy/40 via-brand-navy/55 to-surface"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px]
                     bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.22),transparent_65%)]"
          aria-hidden
        />

        <div className="container-p relative py-14 text-center sm:py-20 lg:py-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border
                          border-brand-gold/30 bg-brand-gold/5 px-3 py-1
                          text-[10px] uppercase tracking-[0.15em] text-brand-gold
                          sm:px-4 sm:py-1.5 sm:text-xs">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-gold" />
            A Professional Learning Community
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08]
                         text-balance sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
            International
            <br />
            <span className="bg-gradient-to-b from-brand-gold2 to-brand-gold
                             bg-clip-text text-transparent">
              Psychotherapy Association
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-fg-muted text-balance
                        sm:mt-6 sm:text-lg">
            Certificate programmes, continuing training and a professional community
            for psychologists, psychotherapists and educators around the world.
          </p>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3
                          sm:mt-8 sm:flex-row sm:items-center">
            <Link href="/programs" className="btn-primary justify-center">
              Explore Programmes <ArrowRight size={16} />
            </Link>
            <Link href="/membership" className="btn-ghost justify-center">
              Become a Member
            </Link>
          </div>

          <div className="mt-12 sm:mt-16">
            <div className="mx-auto mb-3 inline-flex items-center gap-2
                            text-[10px] uppercase tracking-[0.15em] text-fg-muted
                            sm:text-xs">
              <ShieldCheck size={14} className="text-brand-gold" /> Verify a Certificate
            </div>
            <CertSearch />
          </div>
        </div>
      </section>

      {/* ─── FEATURED EVENT — April 2026 Conference ─────────────── */}
      <section className="container-p py-10 sm:py-14">
        <a
          href={HOMEPAGE.featured_event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl
                     border border-brand-gold/40 shadow-glow
                     transition hover:border-brand-gold"
        >
          {/* Фоновое фото + золотой градиент */}
          <div
            className="absolute inset-0 bg-cover bg-center transition
                       duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${HOMEPAGE.featured_event.image}')` }}
            aria-hidden
          />
          <div
            className="absolute inset-0
                       bg-gradient-to-r from-brand-navy/95 via-brand-navy/70 to-brand-navy/20"
            aria-hidden
          />

          <div className="relative grid gap-6 p-8 sm:p-12 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl text-brand-cream">
              <div className="inline-flex items-center gap-2 rounded-full
                              border border-brand-gold/60 bg-brand-gold/15 px-3 py-1
                              text-[10px] uppercase tracking-widest text-brand-gold2">
                <CalendarDays size={12} /> Featured · {HOMEPAGE.featured_event.date}
              </div>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
                {HOMEPAGE.featured_event.title}
              </h2>
              <p className="mt-3 text-base text-brand-cream/80 sm:text-lg">
                {HOMEPAGE.featured_event.subtitle}
              </p>
              {HOMEPAGE.featured_event.speaker && (
                <p className="mt-1 text-sm text-brand-gold2">
                  {HOMEPAGE.featured_event.speaker}
                </p>
              )}
            </div>
            <div className="md:text-right">
              <span className="inline-flex items-center gap-2 rounded-md
                               bg-brand-gold px-5 py-3 text-sm font-medium
                               text-brand-ink shadow-glow
                               transition group-hover:translate-y-[-2px]">
                View conference details <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </a>
      </section>

      {/* ─── HIGHLIGHTS ───────────────────────────────────────── */}
      <section className="container-p py-8 sm:py-12">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {HIGHLIGHTS.map(h => (
            <Link key={h.title} href={h.href} className="card group block">
              <h.icon
                className="text-brand-gold transition group-hover:scale-110"
                size={28}
              />
              <h3 className="mt-4 text-xl font-semibold">{h.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{h.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs
                               uppercase tracking-widest text-brand-gold">
                Learn more <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── LEARNING — 3 видео + фото ────────────────────────── */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('${HOMEPAGE.learning.image}')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/80 to-transparent"
          aria-hidden
        />

        <div className="container-p relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full
                            border border-brand-gold/30 bg-brand-gold/5 px-3 py-1
                            text-[10px] uppercase tracking-widest text-brand-gold">
              <Video size={12} /> Learning
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-balance">
              Open video lessons
            </h2>
            <p className="mt-4 text-fg-muted text-balance">
              {HOMEPAGE.learning.intro}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {HOMEPAGE.learning.videos.map((v, i) => (
              <a
                key={i}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-brand-gold/20
                           bg-surface-muted p-5 transition
                           hover:border-brand-gold/60 hover:shadow-glow"
              >
                <PlayCircle
                  size={36}
                  className="text-brand-gold transition group-hover:scale-110"
                />
                <h3 className="mt-4 font-display text-lg leading-snug">
                  {v.title}
                </h3>
                <span className="mt-auto pt-4 inline-flex items-center gap-1
                                 text-[10px] uppercase tracking-widest text-brand-gold">
                  Watch <ArrowRight size={12} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FREE EBOOKS STATS + фото ─────────────────────────── */}
      <section className="container-p py-10 sm:py-14">
        <div className="overflow-hidden rounded-2xl border border-brand-gold/30
                        bg-surface-muted shadow-glow">
          <div className="grid md:grid-cols-2">
            {/* Фото */}
            <div
              className="min-h-[260px] bg-cover bg-center md:min-h-[360px]"
              style={{ backgroundImage: `url('${HOMEPAGE.ebooks.image}')` }}
              aria-hidden
            />
            {/* Статистика */}
            <div className="p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full
                              border border-brand-gold/30 bg-brand-gold/5 px-3 py-1
                              text-[10px] uppercase tracking-widest text-brand-gold">
                <BookOpen size={12} /> Free eBooks
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Download free classic psychotherapy books
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                Readers from <strong>200 countries and territories</strong> around
                the world have saved <strong>{nfUSD.format(HOMEPAGE.ebooks.saved_usd)}</strong> on{' '}
                <strong>{nf.format(HOMEPAGE.ebooks.downloads)} free downloads</strong>{' '}
                of classic psychotherapy books.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Stat icon={Globe2} value={nf.format(HOMEPAGE.ebooks.countries)} label="Countries" />
                <Stat icon={DollarSign} value={`$${(HOMEPAGE.ebooks.saved_usd / 1_000_000).toFixed(1)}M`} label="Saved" />
                <Stat icon={Download} value={`${(HOMEPAGE.ebooks.downloads / 1_000_000).toFixed(2)}M`} label="Downloads" />
              </div>

              <a
                href={HOMEPAGE.ebooks.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 w-full justify-center sm:w-auto"
              >
                Visit the library <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DONATE ───────────────────────────────────────────── */}
      <section className="container-p py-10 sm:py-14">
        <div className="rounded-2xl border border-brand-gold/30
                        bg-gradient-to-br from-brand-gold/10 to-transparent
                        p-8 sm:p-10">
          <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full
                            bg-brand-gold/20 text-brand-gold">
              <Heart size={28} />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">
                {HOMEPAGE.donate.title}
              </h2>
              <p className="mt-2 text-sm text-fg-muted">
                {HOMEPAGE.donate.text}
              </p>
            </div>
            <a
              href={HOMEPAGE.donate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center md:w-auto"
            >
              Donate <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── CTA membership ───────────────────────────────────── */}
      <section className="container-p py-12 sm:py-16">
        <div className="rounded-2xl border border-brand-gold/30 bg-surface-muted
                        p-6 text-center shadow-glow sm:p-10">
          <h2 className="font-display text-3xl sm:text-4xl">
            Ready to join the community?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-fg-muted sm:text-base">
            Six membership tiers, from students to Country Ambassadors. Submit your
            documents online, we review them manually — secure card payment, no crypto
            details required, no spam.
          </p>
          <Link href="/membership" className="btn-primary mt-6 justify-center">
            See membership tiers <ArrowRight size={16} />
          </Link>
        </div>
      </section>
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
    <div className="rounded-lg border border-brand-gold/20 bg-surface p-3">
      <Icon size={18} className="mx-auto text-brand-gold" />
      <div className="mt-1 font-display text-lg leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-fg-muted">
        {label}
      </div>
    </div>
  );
}
