import type { Metadata } from "next";
import { getSiteUrl, SITE } from "./site";

interface BuildPageMetadataOptions {
  title: string;
  description?: string;
  path: string;
  noindex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noindex = false,
}: BuildPageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${cleanPath}`;
  const desc = description || SITE.defaultDescription;
  const ogTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

  return {
    title,
    description: desc,
    alternates: { canonical: canonicalUrl },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url: canonicalUrl,
      title: ogTitle,
      description: desc,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
    },
  };
}
