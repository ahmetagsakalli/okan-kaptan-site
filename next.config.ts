import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
    qualities: [60, 68, 72, 78, 86, 92],
  },
  outputFileTracingIncludes: {
    "/api/admin/upload": [
      "./node_modules/.pnpm/@img+sharp-linux-x64@0.35.3/node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.3.2/node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    const securityHeaders = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self)",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    const immutableAssetHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: immutableAssetHeaders,
      },
      {
        source: "/audio/:path*",
        headers: immutableAssetHeaders,
      },
      {
        source: "/icon.png",
        headers: immutableAssetHeaders,
      },
      {
        source: "/apple-icon.png",
        headers: immutableAssetHeaders,
      },
      {
        source: "/og.png",
        headers: immutableAssetHeaders,
      },
    ];
  },
};

export default nextConfig;
