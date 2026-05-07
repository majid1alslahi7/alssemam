/** @type {import('next').NextConfig} */
const noStoreHeaders = [
  { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
  { key: 'CDN-Cache-Control', value: 'no-store' },
  { key: 'Surrogate-Control', value: 'no-store' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
];

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,

  // تعطيل Turbopack
  turbopack: {},
  
  // إعدادات الصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tlnitugvydqugusdxeac.supabase.co',
      },
    ],
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json; charset=utf-8' },
          ...noStoreHeaders,
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          ...noStoreHeaders,
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/:path((?!_next/static/).*)',
        headers: noStoreHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
