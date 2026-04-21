import { Mail, MapPin, Globe, Phone } from 'lucide-react';
import { Layout } from '../components/Layout';

export default function Contact() {
  return (
    <Layout
      title="Contact"
      description="Get in touch with the International Psychotherapy Association."
    >
      <div className="container-p py-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-brand-gold">
            Contact
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Get in touch</h1>
          <p className="mt-3 text-fg-muted">
            Questions about programs, certificates, membership applications or
            partnerships? Send us a message — we reply within three working days.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-sm">
            <Row icon={Mail} label="Email" value="info@intpas.com" href="mailto:info@intpas.com" />
            <Row icon={Globe} label="Website" value="intpas.com" href="https://intpas.com" />
            <Row
              icon={MapPin}
              label="Address"
              value="6917 Arlington Road, Suite 204, Bethesda, MD 20814, USA"
            />
            <Row
              icon={Phone}
              label="Phone"
              value="+1 (301) 215-7377"
              href="tel:+13012157377"
            />
          </div>

          {/* Форма с отправкой через mailto: (без бэкенда пока).
              Когда подключим POST к Apps Script — заменим на fetch. */}
          <form
            action="mailto:info@intpas.com"
            method="post"
            encType="text/plain"
            className="rounded-xl border border-brand-gold/30 bg-surface-muted p-5 space-y-3"
          >
            <label className="block text-xs uppercase tracking-widest text-fg-muted">
              Your name
              <input name="name" required className="input mt-1" />
            </label>
            <label className="block text-xs uppercase tracking-widest text-fg-muted">
              Email
              <input type="email" name="email" required className="input mt-1" />
            </label>
            <label className="block text-xs uppercase tracking-widest text-fg-muted">
              Message
              <textarea name="message" rows={4} required className="input mt-1" />
            </label>
            <button type="submit" className="btn-primary w-full justify-center">
              Send message
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

function Row({
  icon: Icon, label, value, href,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 text-brand-gold" />
      <div>
        <div className="text-[10px] uppercase tracking-widest text-fg-muted">
          {label}
        </div>
        <div className="mt-0.5 font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:text-brand-gold" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
      {content}
    </a>
  ) : content;
}
