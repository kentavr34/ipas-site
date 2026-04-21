import Head from 'next/head';
import { ReactNode } from 'react';
import Nav from './Nav';
import { Footer } from './Footer';

interface LayoutProps {
  title?: string;
  description?: string;
  ogImage?: string;
  children: ReactNode;
}

export function Layout({ title, description, ogImage, children }: LayoutProps) {
  const fullTitle = title
    ? `${title} · IPAS — International Psychotherapy Association`
    : 'IPAS — International Psychotherapy Association';

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>{fullTitle}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={fullTitle} />
        {description && <meta property="og:description" content={description} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Nav />
      <main className="flex-1 fade-up">{children}</main>
      <Footer />
    </div>
  );
}
