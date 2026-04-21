/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Keep all old Wix certificate URLs working
  // e.g. /032523122 → dynamic [certId] page
};

module.exports = nextConfig;
