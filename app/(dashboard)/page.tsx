import type { Metadata } from "next";
import { DashboardContent } from "./components/dashboard-content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard App",
  description: "Thông tin khách hàng và hội thoại theo context Chatwoot.",
  path: "/",
  noindex: true,
});

export default function HomePage() {
  return <DashboardContent />;
}
