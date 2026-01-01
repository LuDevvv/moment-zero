import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // optimizeCss: true, // Only if 'critters' is installed, otherwise it errors. keeping it safe.
    optimizePackageImports: ["lucide-react", "framer-motion", "canvas-confetti"],
  },
};

export default nextConfig;
