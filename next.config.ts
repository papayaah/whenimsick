import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
  // Handle client-side routing properly
  trailingSlash: false,
};

export default nextConfig;
