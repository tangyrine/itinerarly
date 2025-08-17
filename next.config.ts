import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.geojson$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });

    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    return config;
  },
  turbopack: {
    rules: {
      '*.geojson': {
        loaders: ['raw-loader'],
        as: '*.json',
      },
    },
  },
};

export default nextConfig;
