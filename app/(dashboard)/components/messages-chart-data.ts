import type { ChatwootMessage } from "./types";

export type MessagesByPeriod = { period: string; contact: number; agent: number };

export function buildMessagesByPeriod(messages: ChatwootMessage[]): MessagesByPeriod[] {
  if (messages.length === 0) return [];

  const sorted = [...messages].sort((a, b) => a.created_at - b.created_at);
  const buckets = new Map<string, { contact: number; agent: number; sortKey: number }>();

  for (const message of sorted) {
    const date = new Date(message.created_at * 1000);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const bucketMinute = Math.floor(minute / 15) * 15;
    const sortKey = hour * 60 + bucketMinute;
    const period = `${String(hour).padStart(2, "0")}:${String(bucketMinute).padStart(2, "0")}`;

    const bucket = buckets.get(period) ?? { contact: 0, agent: 0, sortKey };
    if (message.message_type === 1) bucket.agent += 1;
    else bucket.contact += 1;
    buckets.set(period, bucket);
  }

  return Array.from(buckets.entries())
    .sort(([, a], [, b]) => a.sortKey - b.sortKey)
    .map(([period, counts]) => ({
      period,
      contact: counts.contact,
      agent: counts.agent,
    }));
}

export function formatHourLabel(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
