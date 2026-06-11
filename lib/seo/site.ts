export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const SITE = {
  name: "Chatwoot",
  shortName: "Chatwoot",
  defaultDescription: "Nền tảng hỗ trợ khách hàng thông minh",
  locale: "vi_VN",
} as const;
