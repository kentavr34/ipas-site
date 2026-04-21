/**
 * Генерирует public/sitemap.xml.
 * Запускается как postbuild: статические страницы + все программы.
 * Сертификаты/новости/события — динамические, их не индексируем.
 */
const fs = require('fs');
const path = require('path');

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://intpas.com';

// Ленивый импорт TS-файла: читаем как текст и вытаскиваем slug'и регексом.
const programsTs = fs.readFileSync(
  path.join(__dirname, '..', 'data', 'programs.ts'),
  'utf8',
);
const slugs = Array.from(programsTs.matchAll(/slug:\s*'([a-z0-9-]+)'/g))
  .map(m => m[1]);

const staticRoutes = [
  '/', '/about', '/programs', '/resources',
  '/events', '/news', '/membership', '/contact',
];
const dynamic = slugs.map(s => `/programs/${s}`);

const all = [...staticRoutes, ...dynamic];
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(p => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`).join('\n')}
</urlset>
`;

const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(out, xml);
console.log(`sitemap.xml: ${all.length} URLs → ${out}`);
