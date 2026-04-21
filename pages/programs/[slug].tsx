import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, ArrowRight, Users, Target, BookOpen } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { PROGRAMS, Program } from '../../data/programs';

interface Props { program: Program }

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PROGRAMS.map(p => ({ params: { slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const program = PROGRAMS.find(p => p.slug === params!.slug) as Program;
  return { props: { program } };
};

export default function ProgramDetail({ program }: Props) {
  return (
    <Layout
      title={program.title}
      description={program.summary}
    >
      <article className="container-p py-10 sm:py-14">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1 text-xs uppercase
                     tracking-widest text-fg-muted hover:text-brand-gold"
        >
          <ArrowLeft size={12} /> All programs
        </Link>

        <header className="mt-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-brand-gold/30 px-2.5 py-0.5
                             uppercase tracking-widest text-brand-gold">
              {program.level}
            </span>
            <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-fg-muted">
              {program.format}
            </span>
            {program.hours && (
              <span className="inline-flex items-center gap-1 text-fg-muted">
                <Clock size={12} /> {program.hours}h
              </span>
            )}
            {program.duration && (
              <span className="inline-flex items-center gap-1 text-fg-muted">
                · {program.duration}
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl">{program.title}</h1>
          <p className="mt-4 text-lg text-fg-muted">{program.summary}</p>
        </header>

        <hr className="gold" />

        <section className="grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="max-w-3xl">
            {/* Развёрнутое описание */}
            <div className="prose prose-invert prose-p:text-fg-muted
                            prose-p:leading-relaxed prose-headings:font-display
                            prose-a:text-brand-gold max-w-none">
              {program.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Ключевые темы */}
            <h2 className="mt-10 flex items-center gap-2 font-display text-2xl">
              <BookOpen size={20} className="text-brand-gold" /> What you will study
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {program.topics.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            {/* Модули */}
            {program.modules && program.modules.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-2xl">Programme structure</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {program.modules.map((m, i) => (
                    <div key={i} className="rounded-xl border border-brand-gold/20
                                            bg-surface-muted p-4">
                      <div className="font-display text-lg">{m.title}</div>
                      <ul className="mt-2 space-y-1 text-xs text-fg-muted">
                        {m.items.map((it, j) => (
                          <li key={j}>• {it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Аудитория */}
            <h2 className="mt-10 flex items-center gap-2 font-display text-2xl">
              <Users size={20} className="text-brand-gold" /> Who is it for
            </h2>
            <p className="mt-3 text-sm text-fg-muted">{program.audience}</p>

            {/* Результаты */}
            <h2 className="mt-10 flex items-center gap-2 font-display text-2xl">
              <Target size={20} className="text-brand-gold" /> Learning outcomes
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {program.outcomes.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl">Certification</h2>
            <p className="mt-3 text-sm text-fg-muted">
              Upon successful completion, graduates receive the{' '}
              <strong>IPAS Certificate of Achievement</strong>, signed by
              Robin Mackay, President of the Council. Each certificate is
              verifiable online at intpas.com/&lt;certificate-id&gt;.
            </p>

            {program.source && (
              <p className="mt-6 rounded-lg border border-brand-gold/20
                            bg-surface-muted p-4 text-xs text-fg-muted">
                Curriculum content base ·{' '}
                <a
                  href={program.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:underline"
                >
                  {program.source.name}
                </a>
              </p>
            )}
          </div>

          <aside className="md:sticky md:top-24 md:self-start
                            rounded-xl border border-brand-gold/30
                            bg-surface-muted p-6 h-fit">
            <div className="text-xs uppercase tracking-widest text-brand-gold">
              Enrollment
            </div>
            <h3 className="mt-2 font-display text-xl">Ready to start?</h3>
            <p className="mt-2 text-sm text-fg-muted">
              Membership gives you discounts and priority enrollment in all
              IPAS programmes. Contact us for current cohort dates.
            </p>
            <Link href="/membership" className="btn-primary mt-4 w-full justify-center">
              Become a Member <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="btn-ghost mt-2 w-full justify-center">
              Contact us
            </Link>
          </aside>
        </section>
      </article>
    </Layout>
  );
}
