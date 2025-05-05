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
};

export default nextConfig;
