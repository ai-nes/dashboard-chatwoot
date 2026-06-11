import type { RemotePattern } from "next/dist/shared/lib/image-config";

export const REMOTE_IMAGE_PATTERNS: RemotePattern[] = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "utfs.io" },
  { protocol: "https", hostname: "github.com" },
  { protocol: "https", hostname: "*.cloudfront.net" },
  { protocol: "https", hostname: "avatars.githubusercontent.com" },
];

function hostnameMatches(pattern: string, hostname: string): boolean {
  if (pattern.startsWith("*.")) {
    const base = pattern.slice(2);
    return hostname === base || hostname.endsWith(`.${base}`);
  }
  return hostname === pattern;
}

export function isRemoteImageUrlAllowed(src: string): boolean {
  if (src.startsWith("/")) return true;

  try {
    const { protocol, hostname } = new URL(src);
    const normalizedProtocol = protocol.replace(":", "") as RemotePattern["protocol"];

    return REMOTE_IMAGE_PATTERNS.some(
      (pattern) =>
        (!pattern.protocol || pattern.protocol === normalizedProtocol) &&
        hostnameMatches(pattern.hostname, hostname),
    );
  } catch {
    return false;
  }
}
