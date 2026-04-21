/** @type {import('next').NextConfig} */
// basePath нужен только когда сайт живёт в подпапке (github.io/ipas-site/).
// Когда привяжем intpas.com к GitHub Pages — в секрет NEXT_PUBLIC_BASE_PATH
// кладём пустую строку, и basePath снимается автоматически.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
