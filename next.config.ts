import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true, // Enable full PPR for better performance
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-tp1.mozu.com',
        port: '',
        pathname: '/9046-m1/cms/files/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-tp1.mozu.com',
        port: '',
        pathname: '/9046-11441/cms/files/**',
      },
    ],
  },
};

export default nextConfig;
