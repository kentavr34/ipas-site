import { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { Layout } from '../components/Layout';
import { api } from '../lib/api';
import type { IpasEvent } from '../lib/types';

export default function Events() {
  const [events, setEvents] = useState<IpasEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.events().then(setEvents).catch(e => setError(e.message));
  }, []);

  return (
    <Layout
      title="Events"
      description="Upcoming IPAS conferences, workshops and video sessions."
    >
      <div className="container-p py-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-brand-gold">
            Calendar
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">
            Upcoming events
          </h1>
          <p className="mt-3 text-fg-muted">
            Conferences, workshops and live video sessions from IPAS and from
            our partners. Click an event to register on the source site.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {events === null && !error && (
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <Loader2 size={16} className="animate-spin" /> Loading calendar…
            </div>
          )}
          {error && (
            <p className="text-sm text-red-400">Failed to load events: {error}</p>
          )}
          {events && events.length === 0 && (
            <div className="rounded-lg border border-brand-gold/20 bg-surface-muted p-8 text-center">
              <Calendar size={32} className="mx-auto text-brand-gold" />
              <p className="mt-3 text-fg-muted">
                No upcoming events are scheduled. Check back soon — we publish
                new sessions weekly.
              </p>
            </div>
          )}
          {events?.map(e => (
            <EventRow key={e.id} event={e} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

function EventRow({ event }: { event: IpasEvent }) {
  const d = new Date(event.starts_at);
  const past = isPast(d);
  const sourceLabel = event.source === 'ipi' ? 'IPI' : 'IPAS';

  const Wrap: React.ElementType = event.register_url || event.source_url ? 'a' : 'div';
  const href = event.register_url || event.source_url;
  const external = Boolean(event.source_url && !event.register_url);

  return (
    <Wrap
      href={href}
      {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group block rounded-xl border border-brand-gold/20
                 bg-surface-muted p-5 transition hover:border-brand-gold/60
                 hover:shadow-glow"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {/* Дата-плашка */}
          <div className="shrink-0 rounded-lg border border-brand-gold/30
                          bg-surface px-3 py-2 text-center">
            <div className="text-[10px] uppercase tracking-widest text-brand-gold">
              {format(d, 'MMM')}
            </div>
            <div className="font-display text-2xl leading-none">
              {format(d, 'd')}
            </div>
            <div className="text-[10px] text-fg-muted">
              {format(d, 'yyyy')}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-lg leading-snug group-hover:text-brand-gold">
              {event.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
              <span>{format(d, 'EEEE · HH:mm')}</span>
              {event.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={11} /> {event.location}
                </span>
              )}
              <span className="rounded-full bg-brand-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-brand-gold">
                Source · {sourceLabel}
              </span>
              {past && (
                <span className="rounded-full bg-fg-muted/15 px-2 py-0.5 text-[10px] uppercase text-fg-muted">
                  Past
                </span>
              )}
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-fg-muted line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        </div>

        {href && (
          <div className="shrink-0 self-start text-xs uppercase tracking-widest text-brand-gold">
            {external ? (
              <span className="inline-flex items-center gap-1">
                View <ExternalLink size={11} />
              </span>
            ) : 'Register'}
          </div>
        )}
      </div>
    </Wrap>
  );
}
