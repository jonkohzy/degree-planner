import type { NextConfig } from 'next';

const pagesBasePath = process.env.PAGES_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  // Vinext's current static exporter skips `/` when Next's `basePath` is set.
  // An asset prefix is sufficient here because the two views use hash routes.
  assetPrefix: pagesBasePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
