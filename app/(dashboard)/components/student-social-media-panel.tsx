import { cn } from "@/lib/utils";
import { PanelShell } from "./panel-shell";
import { SocialMediaIcon } from "./social-media-icons";
import {
  SOCIAL_MEDIA_PLATFORM_LABELS,
  type SchoolSocialMediaInterest,
  type SocialMediaEngagementLevel,
} from "./student-types";

const ENGAGEMENT_PCT: Record<SocialMediaEngagementLevel, number> = {
  high: 100,
  medium: 60,
  low: 30,
  none: 0,
};

const PCT_COLOR: Record<SocialMediaEngagementLevel, string> = {
  high: "text-emerald-600",
  medium: "text-amber-600",
  low: "text-neutral-500",
  none: "text-neutral-400",
};

export function StudentSocialMediaPanel({ interests }: { interests: SchoolSocialMediaInterest[] }) {
  const primary = [...interests].sort(
    (a, b) => ENGAGEMENT_PCT[b.engagementLevel] - ENGAGEMENT_PCT[a.engagementLevel],
  )[0];

  return (
    <PanelShell
      title="Quan tâm trường trên mạng xã hội"
      subtitle={
        primary
          ? `Tích cực nhất: ${SOCIAL_MEDIA_PLATFORM_LABELS[primary.platform]}`
          : "Chưa có dữ liệu tương tác MXH"
      }
    >
      <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-6">
        {interests.map((item) => (
          <PlatformCard key={item.platform} item={item} />
        ))}
      </div>
    </PanelShell>
  );
}

function PlatformCard({ item }: { item: SchoolSocialMediaInterest }) {
  const pct = ENGAGEMENT_PCT[item.engagementLevel];

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-2 py-3"
      title={SOCIAL_MEDIA_PLATFORM_LABELS[item.platform]}
    >
      <SocialMediaIcon platform={item.platform} size={20} />
      <span className={cn("text-sm font-semibold tabular-nums", PCT_COLOR[item.engagementLevel])}>
        {pct}%
      </span>
    </div>
  );
}
