import { ExternalLink, BookOpen, Video, Users } from 'lucide-react';
import { Layout } from '../components/Layout';

interface Resource {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  href: string;
  source?: string;
  external: boolean;
}

const RESOURCES: Resource[] = [
  {
    icon: BookOpen,
    title: 'Free Psychotherapy Books',
    description:
      'An open library of over 200 classic and contemporary psychotherapy texts — more than a million free downloads to date.',
    href: 'https://freepsychotherapybooks.org',
    source: 'IPI',
    external: true,
  },
  {
    icon: Video,
    title: 'Master Speaker Series',
    description:
      'Monthly live videoconferences with internationally renowned psychoanalysts and psychotherapists. CE credits available.',
    href: 'https://theipi.org/clinical-training/2025-2026-master-speaker-series/',
    source: 'IPI',
    external: true,
  },
  {
    icon: Users,
    title: 'Weekend Conferences',
    description:
      'Hybrid weekend conferences on focused clinical themes — from psychoanalytic technique to cutting-edge research.',
    href: 'https://theipi.org/clinical-training/weekend-conferences/',
    source: 'IPI',
    external: true,
  },
  {
    icon: Video,
    title: 'Special Topics — Guest Lectures',
    description:
      'Standalone online lectures from visiting faculty on specific clinical and theoretical topics.',
    href: 'https://theipi.org/clinical-training/special-conferences/',
    source: 'IPI',
    external: true,
  },
  {
    icon: BookOpen,
    title: 'Town Hall & Crisis Resources',
    description:
      'Open discussions and practical resources for clinicians working with acute crises and vulnerable populations.',
    href: 'https://theipi.org/town-hall/crisis-resources/',
    source: 'IPI',
    external: true,
  },
  {
    icon: Video,
    title: 'Psychoanalytic Psychotherapy in Everyday Terms',
    description:
      'Accessible video course demystifying core concepts of psychoanalytic practice for a broader professional audience.',
    href: 'https://theipi.org/clinical-training/psychoanalytic-psychotherapy-in-everyday-terms/',
    source: 'IPI',
    external: true,
  },
];

export default function Resources() {
  return (
    <Layout
      title="Resources"
      description="Open video lessons, free e-book library and clinical resources for psychotherapy practitioners."
    >
      <div className="container-p py-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-brand-gold">
            Resources
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">
            Learning library
          </h1>
          <p className="mt-3 text-fg-muted">
            Curated educational resources — video lessons, free books and open
            conferences — drawn from IPAS and from our partners across the
            international psychotherapy community. Source is shown on each card.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map(r => {
            const Wrap: React.ElementType = r.external ? 'a' : 'div';
            const extraProps = r.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Wrap
                key={r.title}
                href={r.href}
                {...extraProps}
                className="card group block"
              >
                <r.icon size={28} className="text-brand-gold" />
                <div className="mt-4 flex items-start gap-2">
                  <h3 className="flex-1 font-display text-lg leading-snug
                                 group-hover:text-brand-gold">
                    {r.title}
                  </h3>
                  {r.external && (
                    <ExternalLink size={14} className="mt-1 text-fg-muted" />
                  )}
                </div>
                <p className="mt-2 text-sm text-fg-muted">{r.description}</p>
                {r.source && (
                  <div className="mt-4 text-[10px] uppercase tracking-widest text-fg-muted">
                    Source · {r.source}
                  </div>
                )}
              </Wrap>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
