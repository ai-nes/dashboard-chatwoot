import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cardClass } from "./dashboard-ui";
import { formatChannel } from "./mock-data-utils";
import type { ChatwootAppContext } from "./types";
import type { LeadScore, Student } from "./student-types";
import { LEAD_TIER_LABELS } from "./student-types";

const TIER_BADGE: Record<LeadScore["tier"], string> = {
  hot: "border-emerald-300 bg-emerald-50 text-emerald-800",
  warm: "border-amber-300 bg-amber-50 text-amber-800",
  cold: "border-neutral-300 bg-neutral-50 text-neutral-600",
};

export function StudentHeader({
  student,
  context,
  leadScore,
}: {
  student: Student;
  context: ChatwootAppContext;
  leadScore: LeadScore;
}) {
  const initials = student.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(-2)
    .toUpperCase();

  const statusLabel =
    context.conversation.status === "open"
      ? "Đang mở"
      : context.conversation.status === "pending"
        ? "Chờ xử lý"
        : context.conversation.status === "resolved"
          ? "Đã đóng"
          : context.conversation.status;

  const isOpen = context.conversation.status === "open";

  return (
    <div className={cn(cardClass, "flex flex-wrap items-center justify-between gap-3 px-4 py-3")}>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9 border border-neutral-300">
          <AvatarFallback className="bg-neutral-100 text-xs font-semibold text-neutral-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">{student.fullName}</h1>
          <p className="text-[11px] text-muted-foreground">
            Hồ sơ học sinh · Hội thoại #{context.conversation.id}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={cn("text-[10px] font-medium", TIER_BADGE[leadScore.tier])}>
          {LEAD_TIER_LABELS[leadScore.tier]}
        </Badge>
        <Badge variant="outline" className="border-neutral-300 text-[10px] font-normal">
          {formatChannel(context.conversation.meta?.channel)}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-medium",
            isOpen
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-neutral-300 bg-neutral-50 text-neutral-600",
          )}
        >
          {statusLabel}
        </Badge>
      </div>
    </div>
  );
}
