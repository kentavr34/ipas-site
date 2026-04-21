import Link from 'next/link';
import { Clock, GraduationCap, Monitor, Users as UsersIcon } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { PROGRAMS } from '../../data/programs';

const FORMAT_ICON = {
  'in-person': UsersIcon,
  'online': Monitor,
  'hybrid': Monitor,
  'videoconference': Monitor,
  'distance': Monitor,
};

export default function ProgramsList() {
  return (
    <Layout
      title="Programs"
      description="IPAS training programs — from foundational courses to advanced certificates and faculty training."
    >
      <div className="container-p py-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-brand-gold">
            Training
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Programs</h1>
          <p className="mt-3 text-fg-muted">
            All IPAS training tracks. Programs run through the year in online,
            hybrid and in-person formats. Graduates receive an IPAS Certificate
            of Achievement signed by the President of the Council.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PROGRAMS.map(p => {
            const Icon = FORMAT_ICON[p.format] ?? GraduationCap;
            return (
              <Link key={p.slug} href={`/programs/${p.slug}`} className="card group block">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl leading-snug group-hover:text-brand-gold">
                    {p.title}
                  </h2>
                  <span className="shrink-0 rounded-full border border-brand-gold/30
                                   px-2.5 py-0.5 text-[10px] uppercase tracking-widest
                                   text-brand-gold">
                    {p.level}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3
                                text-xs text-fg-muted">
                  <span className="inline-flex items-center gap-1">
                    <Icon size={12} /> {p.format}
                  </span>
                  {p.hours && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {p.hours}h
                    </span>
                  )}
                  {p.duration && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {p.duration}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-fg-muted line-clamp-3">
                  {p.summary}
                </p>

                {p.source && (
                  <div className="mt-3 text-[10px] uppercase tracking-widest text-fg-muted">
                    Content base · {p.source.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
