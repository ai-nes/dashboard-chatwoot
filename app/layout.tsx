import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RootJsonLd } from "@/lib/seo/root-json-ld";
import { getSiteUrl, SITE } from "@/lib/seo/site";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.defaultDescription}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.defaultDescription,
  keywords: ["chatwoot", "customer support", "live chat", "helpdesk"],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: getSiteUrl(),
    title: SITE.name,
    description: SITE.defaultDescription,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.defaultDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-center" richColors closeButton />
          </TooltipProvider>
        </Providers>
        <RootJsonLd />
      </body>
    </html>
  );
}
