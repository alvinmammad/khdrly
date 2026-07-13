import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // MIME sniffing hücumlarının qarşısı
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Clickjacking qorunması — sayt başqa saytın iframe-inə salına bilməz
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Xarici keçidlərdə tam URL sızmasın
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Yalnız xəritənin geolokasiyasına icazə; kamera/mikrofon bağlı
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
