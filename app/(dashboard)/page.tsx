import type { Metadata } from "next";
import { DashboardContent } from "./components/dashboard-content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Bảng điều khiển",
  description: "Tổng quan hội thoại, hiệu suất agent và phân bổ kênh hỗ trợ.",
  path: "/",
  noindex: true,
});

export default function HomePage() {
  return <DashboardContent />;
}
