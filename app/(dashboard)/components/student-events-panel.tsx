import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { INTERACTION_BAR_COLORS } from "./dashboard-accents";
import { PanelShell } from "./panel-shell";
import { formatRelativeTime } from "./mock-data-utils";
import {
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
  INTERACTION_TYPE_LABELS,
  type StudentDashboardData,
  type InteractionType,
  type StudentEvent,
} from "./student-types";

const STATUS_STYLE: Record<StudentEvent["status"], string> = {
  attended: "border-emerald-300 bg-emerald-50 text-emerald-800",
  registered: "border-amber-300 bg-amber-50 text-amber-800",
  no_show: "border-neutral-300 bg-neutral-50 text-neutral-600",
};

export function StudentEventsPanel({ data }: { data: StudentDashboardData }) {
  const typeCounts = countInteractionTypes(data.interactions);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PanelShell title="Sự kiện tham gia" className="min-h-0 flex-1">
        <div className="flex flex-1 flex-col justify-center space-y-2 p-4">
          {data.events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium">{event.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {EVENT_TYPE_LABELS[event.type]} · {formatRelativeTime(event.attendedAt)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("shrink-0 text-[9px] font-medium", STATUS_STYLE[event.status])}
              >
                {EVENT_STATUS_LABELS[event.status]}
              </Badge>
            </div>
          ))}
        </div>
      </PanelShell>

      <PanelShell
        title="Phân bổ tương tác"
        subtitle="Học sinh → nhiều loại tương tác"
        className="min-h-0 flex-1"
      >
        <div className="flex flex-1 flex-col justify-center space-y-2.5 p-4">
          {typeCounts.map(([type, count]) => {
            const pct = Math.round((count / data.interactions.length) * 100);
            const color = INTERACTION_BAR_COLORS[type];
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-medium">{INTERACTION_TYPE_LABELS[type]}</span>
                  <span className="text-muted-foreground">
                    {count} · {pct}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </PanelShell>
    </div>
  );
}

function countInteractionTypes(interactions: StudentDashboardData["interactions"]): [InteractionType, number][] {
  const map = new Map<InteractionType, number>();
  for (const item of interactions) {
    map.set(item.type, (map.get(item.type) ?? 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}
