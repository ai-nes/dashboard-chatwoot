export function formatChannel(channel?: string): string {
  if (!channel) return "Unknown";
  if (channel.includes("WebWidget")) return "Trò chuyện trực tuyến";
  if (channel.includes("Email")) return "Thư điện tử";
  if (channel.includes("Facebook")) return "Facebook";
  if (channel.includes("WhatsApp")) return "WhatsApp";
  if (channel.includes("Telegram")) return "Telegram";
  return channel.replace("Channel::", "");
}

export function formatRelativeTime(unixSeconds?: number): string {
  if (!unixSeconds) return "—";
  const diff = Math.floor(Date.now() / 1000) - unixSeconds;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}
