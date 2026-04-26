/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
