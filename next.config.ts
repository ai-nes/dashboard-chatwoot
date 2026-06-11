import type { NextConfig } from "next";
import { REMOTE_IMAGE_PATTERNS } from "./lib/config/remote-image-patterns";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: REMOTE_IMAGE_PATTERNS,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors *" }],
      },
    ];
  },
};

export default nextConfig;
