import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/resources', label: 'Resources' },
  { href: '/events', label: 'Events' },
  { href: '/membership', label: 'Membership' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-brand-gold/20
                 bg-surface/85 backdrop-blur-md"
    >
      <div className="container-p flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo size={32} />
          <span className="font-display text-lg font-semibold tracking-[0.18em] text-brand-gold">
            IPAS
          </span>
        </Link>

        {/* Desktop-меню */}
        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map(l => {
            const active = router.pathname === l.href
              || (l.href !== '/' && router.pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={clsx(
                    'text-[13px] uppercase tracking-[0.08em] transition',
                    active
                      ? 'text-brand-gold'
                      : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/membership" className="hidden btn-primary !px-4 !py-2 sm:inline-flex">
            Join
          </Link>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="inline-flex h-10 w-10 items-center justify-center
                       rounded-md border border-brand-gold/30 text-brand-gold lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <ul className="container-p space-y-1 pb-4">
            {LINKS.map(l => {
              const active = router.pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      'block rounded-md px-3 py-2 text-sm transition',
                      active
                        ? 'bg-brand-gold/10 text-brand-gold'
                        : 'text-fg hover:bg-brand-gold/5',
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
