import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Suppress hydration warnings caused by browser extensions
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
