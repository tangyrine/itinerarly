import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle .geojson files as JSON
    config.module.rules.push({
      test: /\.geojson$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });

    // Ensure large JSON files are handled properly
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
