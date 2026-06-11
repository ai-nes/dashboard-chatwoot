import {
  CalendarIcon,
  MessageSquareIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react";

import type { DashboardAccent } from "./dashboard-accents";
import { StatCard } from "./stat-card";
import { SCORE_CATEGORY_LABELS } from "./student-types";
import type { StudentDashboardData } from "./student-types";

export function StudentEngagementStats({ data }: { data: StudentDashboardData }) {
  const highIntentCount = data.intents.filter(
    (i) => i.importance === "very_high" || i.importance === "high",
  ).length;
  const attendedEvents = data.events.filter((e) => e.status === "attended").length;

  const stats: (Parameters<typeof StatCard>[0] & { accent: DashboardAccent })[] = [
    {
      label: "Tương tác",
      value: String(data.interactions.length),
      change: `+${data.interactions.filter((i) => Date.now() - i.occurredAt * 1000 < 7 * 86400000).length}`,
      changeDirection: "up",
      description: "hoạt động 7 ngày qua",
      icon: MessageSquareIcon,
      accent: "blue",
    },
    {
      label: "Sự kiện",
      value: String(attendedEvents),
      change: `${data.events.length} đăng ký`,
      changeDirection: "neutral",
      description: "đã tham dự",
      icon: CalendarIcon,
      accent: "violet",
    },
    {
      label: "Ý định quan trọng",
      value: String(highIntentCount),
      change: `${data.intents.length} tổng`,
      changeDirection: "up",
      description: "mức rất cao & cao",
      icon: TargetIcon,
      accent: "rose",
    },
    {
      label: "Điểm tiềm năng",
      value: String(data.leadScore.totalScore),
      change: data.leadScore.isPotentialCustomer ? "Tiềm năng" : "Nuôi dưỡng",
      changeDirection: data.leadScore.isPotentialCustomer ? "up" : "neutral",
      description: `${SCORE_CATEGORY_LABELS.fit} ${data.leadScore.fitScore} + ${SCORE_CATEGORY_LABELS.engagement} ${data.leadScore.engagementScore}`,
      icon: SparklesIcon,
      accent: "emerald",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
