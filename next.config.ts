import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config.js";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  i18n,
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/KrishiSagar' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/KrishiSagar/' : '',
  trailingSlash: true,
};

export default nextConfig;
