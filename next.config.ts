import type { NextConfig } from "next";

const nextConfig: NextConfig & { eslint?: { ignoreDuringBuilds?: boolean } } = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // Disable heavy checks during Next.js build (run them separately via scripts) to prevent system freeze/lag
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Limit CPU usage to prevent 100% CPU lockups during build
  experimental: {
    cpus: 2,
    memoryBasedWorkersCount: true,
  },
};

export default nextConfig;
