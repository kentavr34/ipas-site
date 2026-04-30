import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Loader2 } from 'lucide-react';
import { api, formatCertId } from '../lib/api';
import type { Certificate } from '../lib/types';

export function CertSearch({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    // debounce 300мс
    const t = setTimeout(() => runSearch(q.trim()), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function runSearch(needle: string) {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    try {
      const data = await api.searchCerts(needle, ctrl.signal);
      setResults(data);
      setHasSearched(true);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={compact ? '' : 'mx-auto w-full max-w-2xl px-1 sm:px-0'}>
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted"
        />
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Name or certificate ID"
          className="input !py-4 pl-11 pr-12 text-base sm:text-sm
                     text-left placeholder:text-fg-muted"
          autoComplete="off"
          spellCheck={false}
        />
        {loading && (
          <Loader2
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-gold"
          />
        )}
      </div>

      {hasSearched && (
        <div className="mt-4 space-y-2">
          {results.length === 0 && !loading && (
            <p className="text-sm text-fg-muted">
              No certificates matching “{q}”.
            </p>
          )}
          {results.slice(0, 6).map(cert => (
            <Link
              key={String(cert.id)}
              href={`/certificate/${cert.id}`}
              className="flex items-center justify-between gap-4 rounded-lg
                         border border-brand-gold/20 bg-surface-muted px-4 py-3
                         text-left transition hover:border-brand-gold/60
                         hover:shadow-glow"
            >
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate font-medium">{cert.full_name}</div>
                <div className="truncate text-xs text-fg-muted">
                  {cert.program} · {cert.hours}h
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden font-mono text-xs text-brand-gold sm:inline">
                  {formatCertId(cert.id)}
                </span>
                <span className="badge-valid">
                  <ShieldCheck size={12} /> Valid
                </span>
              </div>
            </Link>
          ))}
          {results.length > 6 && (
            <p className="pt-1 text-xs text-fg-muted">
              +{results.length - 6} more — refine your search
            </p>
          )}
        </div>
      )}
    </div>
  );
}
