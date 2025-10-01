import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Suppress hydration warnings caused by browser extensions
    suppressHydrationWarning: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'u9a6wmr3as.ufs.sh',
        port: '',
        pathname: '/f/**',
      },
    ],
  },
};

export default nextConfig;
