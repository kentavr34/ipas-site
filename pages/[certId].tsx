import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '../components/Layout';

/**
 * Обратная совместимость URL старого Wix-сайта:
 * intpas.com/032513544  →  /certificate/032513544
 *
 * Маршрут перехватывает любой путь первого уровня, который НЕ совпадает
 * с уже существующими страницами (about, programs, events и т.д.), и
 * если он похож на ID сертификата (цифры, возможно с ведущими нулями) —
 * делает redirect. Иначе — 404.
 */

const KNOWN_ROUTES = new Set([
  'about', 'programs', 'resources', 'events', 'membership',
  'news', 'contact', 'admin', 'certificate', 'verify',
]);

export default function LegacyCertRedirect() {
  const router = useRouter();
  const { certId } = router.query;

  useEffect(() => {
    if (!router.isReady || typeof certId !== 'string') return;
    if (KNOWN_ROUTES.has(certId.toLowerCase())) {
      router.replace('/' + certId.toLowerCase());
      return;
    }
    // Разрешаем любой идентификатор (цифры, буквы, дефисы)
    if (/^[A-Za-z0-9_-]+$/.test(certId)) {
      router.replace(`/certificate/${certId}`);
    }
  }, [router, certId]);

  return (
    <Layout title="Redirecting…">
      <div className="container-p py-20 text-center text-fg-muted">
        Redirecting…
      </div>
    </Layout>
  );
}

// Static export: пред-генерируем страницы для всех known cert IDs.
export const getStaticPaths: GetStaticPaths = async () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  let ids: string[] = [];
  if (url) {
    try {
      const res = await fetch(`${url}?action=listCertIds`);
      const body: any = await res.json();
      if (body && Array.isArray(body.data)) {
        ids = body.data.map((x: any) => String(x));
      }
    } catch (e) { /* ignore */ }
  }
  return {
    paths: ids.map(id => ({ params: { certId: id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => ({ props: {} });
