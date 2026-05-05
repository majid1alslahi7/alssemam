/** @type {import('next').NextConfig} */
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
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path((?!_next/static/).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, proxy-revalidate' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
