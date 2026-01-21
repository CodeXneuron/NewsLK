import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hirunews.lk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Increase cache time for external images
    minimumCacheTTL: 60,
    // Handle large images better
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Disable image optimization for problematic sources (optional)
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    // Increase chunk load timeout to prevent timeout errors
    config.output = {
      ...config.output,
      chunkLoadTimeout: 120000, // 2 minutes instead of default 120 seconds
    };

    return config;
  },
  // Optimize production builds
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
