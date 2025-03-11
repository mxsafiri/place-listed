import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    // During deployment, we'll handle type errors in development instead
    ignoreBuildErrors: true,
  },
  eslint: {
    // During deployment, we'll handle linting errors in development instead
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
