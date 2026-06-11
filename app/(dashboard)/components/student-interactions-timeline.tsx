import {
  CalendarIcon,
  CreditCardIcon,
  FileTextIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  SendIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { INTERACTION_BAR_COLORS } from "./dashboard-accents";
import { PanelShell } from "./panel-shell";
import { formatRelativeTime } from "./mock-data-utils";
import { getIntentDefinition } from "./student-intents";
import { INTERACTION_TYPE_LABELS, type InteractionType, type StudentInteraction } from "./student-types";

const TYPE_ICON: Record<InteractionType, typeof MessageCircleIcon> = {
  conversation: MessageCircleIcon,
  event_attendance: CalendarIcon,
  form_submission: FileTextIcon,
  phone_call: PhoneIcon,
  email: MailIcon,
  application_submission: SendIcon,
  payment: CreditCardIcon,
};

export function StudentInteractionsTimeline({ interactions }: { interactions: StudentInteraction[] }) {
  const sorted = [...interactions].sort((a, b) => b.occurredAt - a.occurredAt);

  return (
    <PanelShell
      title="Lịch sử tương tác"
      subtitle="Toàn bộ điểm chạm — hội thoại hiện tại là một loại tương tác"
    >
      <div className="p-4">
        <ol className="space-y-0">
          {sorted.map((item, index) => (
            <TimelineItem key={item.id} item={item} isLast={index === sorted.length - 1} />
          ))}
        </ol>
      </div>
    </PanelShell>
  );
}

function TimelineItem({ item, isLast }: { item: StudentInteraction; isLast: boolean }) {
  const Icon = TYPE_ICON[item.type];
  const color = INTERACTION_BAR_COLORS[item.type];

  return (
    <li className="grid grid-cols-[2rem_1fr] gap-3">
      <div className="flex flex-col items-center">
        <span
          className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white"
          style={{ color, boxShadow: `0 0 0 1px ${color}` }}
        >
          <Icon className="size-3.5" />
        </span>
        {!isLast ? <div className="w-0.5 flex-1 bg-neutral-300" aria-hidden /> : null}
      </div>

      <div className={cn("min-w-0 rounded-md border border-neutral-300 bg-white p-2.5", !isLast && "mb-4")}>
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[11px] font-semibold">{item.title}</p>
          <Badge
            variant="outline"
            className="border-0 text-[9px] font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {INTERACTION_TYPE_LABELS[item.type]}
          </Badge>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {formatRelativeTime(item.occurredAt)}
          {item.channel ? ` · ${item.channel}` : ""}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed">{item.summary}</p>
        {item.intents && item.intents.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.intents.map((key) => {
              const def = getIntentDefinition(key);
              const isHigh = def.importance === "very_high" || def.importance === "high";
              return (
                <Badge
                  key={key}
                  variant="outline"
                  className={cn(
                    "text-[9px] font-normal",
                    isHigh
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-neutral-200 bg-neutral-50 text-neutral-600",
                  )}
                >
                  {def.label}
                </Badge>
              );
            })}
          </div>
        ) : null}
      </div>
    </li>
  );
}
