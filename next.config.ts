import type { NextConfig } from "next";
import { REMOTE_IMAGE_PATTERNS } from "./lib/config/remote-image-patterns";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: REMOTE_IMAGE_PATTERNS,
  },
};

export default nextConfig;
