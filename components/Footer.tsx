import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-brand-gold/20 bg-surface-muted py-12">
      <div className="container-p grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <div className="font-display text-lg tracking-wider text-brand-gold">
                IPAS
              </div>
              <div className="text-xs text-fg-muted">
                International Psychotherapy Association
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-fg-muted">
            A professional community advancing psychotherapy education through
            certificate programs, continuing training and resources in collaboration
            with the international psychotherapy community.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-brand-gold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-brand-gold">About</Link></li>
            <li><Link href="/programs" className="hover:text-brand-gold">Programs</Link></li>
            <li><Link href="/resources" className="hover:text-brand-gold">Resources</Link></li>
            <li><Link href="/events" className="hover:text-brand-gold">Events</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-brand-gold">Community</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/membership" className="hover:text-brand-gold">Become a Member</Link></li>
            <li><Link href="/news" className="hover:text-brand-gold">News</Link></li>
            <li><Link href="/contact" className="hover:text-brand-gold">Contact</Link></li>
            <li>
              <a
                href="https://theipi.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold"
              >
                IPI Resources ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-p mt-10 flex flex-col items-center justify-between gap-2 border-t border-brand-gold/15 pt-6 text-xs text-fg-muted sm:flex-row">
        <div>© {year} International Psychotherapy Association. All rights reserved.</div>
        <div>
          Robin Mackay — President of the Council
        </div>
      </div>
    </footer>
  );
}
