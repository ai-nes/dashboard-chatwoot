"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  type SuggestedEvent,
} from "./student-types";

const STATUS_STYLE: Record<StudentEvent["status"], string> = {
  attended: "border-emerald-300 bg-emerald-50 text-emerald-800",
  registered: "border-amber-300 bg-amber-50 text-amber-800",
  no_show: "border-neutral-300 bg-neutral-50 text-neutral-600",
};

function matchScoreStyle(score: number): string {
  if (score >= 85) return "border-violet-300 bg-violet-50 text-violet-800";
  if (score >= 70) return "border-blue-300 bg-blue-50 text-blue-800";
  return "border-neutral-300 bg-neutral-50 text-neutral-700";
}

export function StudentEventsPanel({ data }: { data: StudentDashboardData }) {
  const typeCounts = countInteractionTypes(data.interactions);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PanelShell title="Sự kiện" className="min-h-0 flex-1" bodyClassName="min-h-0 flex flex-1 flex-col">
        <Tabs defaultValue="participated" className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-neutral-200 bg-neutral-50/60 px-3 py-2.5">
            <TabsList className="grid h-9 w-full grid-cols-2 gap-1 rounded-lg bg-neutral-200/60 p-1">
              <TabsTrigger
                value="participated"
                className="h-full rounded-md px-2 text-[11px] font-medium text-muted-foreground after:hidden data-active:bg-white data-active:text-foreground data-active:shadow-sm data-active:[&_span]:bg-violet-100 data-active:[&_span]:text-violet-800"
              >
                Đã tham gia
                <TabCount count={data.events.length} />
              </TabsTrigger>
              <TabsTrigger
                value="suggested"
                className="h-full rounded-md px-2 text-[11px] font-medium text-muted-foreground after:hidden data-active:bg-white data-active:text-foreground data-active:shadow-sm data-active:[&_span]:bg-violet-100 data-active:[&_span]:text-violet-800"
              >
                Phù hợp
                <TabCount count={data.suggestedEvents.length} />
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="participated" className="mt-0 min-h-0 flex-1 overflow-hidden">
            <EventScrollList count={data.events.length} emptyText="Chưa có sự kiện nào">
              {data.events.map((event) => (
                <ParticipatedEventRow key={event.id} event={event} />
              ))}
            </EventScrollList>
          </TabsContent>

          <TabsContent value="suggested" className="mt-0 min-h-0 flex-1 overflow-hidden">
            <EventScrollList
              count={data.suggestedEvents.length}
              emptyText="Chưa có gợi ý sự kiện phù hợp"
            >
              {data.suggestedEvents.map((event) => (
                <SuggestedEventRow key={event.id} event={event} />
              ))}
            </EventScrollList>
          </TabsContent>
        </Tabs>
      </PanelShell>

      <PanelShell
        title="Phân bổ tương tác"
        subtitle="Học sinh → nhiều loại tương tác"
        className="min-h-0 flex-1"
      >
        <div className="space-y-2.5 p-4">
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

function TabCount({ count }: { count: number }) {
  return (
    <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-neutral-300/50 px-1.5 py-px text-[9px] font-semibold tabular-nums">
      {count}
    </span>
  );
}

function EventScrollList({
  count,
  children,
  emptyText,
}: {
  count: number;
  children: ReactNode;
  emptyText: string;
}) {
  return (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-3">
      {count === 0 ? (
        <p className="py-6 text-center text-[11px] text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}

function ParticipatedEventRow({ event }: { event: StudentEvent }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-2">
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
  );
}

function SuggestedEventRow({ event }: { event: SuggestedEvent }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-2">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium">{event.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {EVENT_TYPE_LABELS[event.type]} · {formatUpcomingTime(event.startsAt)}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-violet-700">{event.matchReason}</p>
      </div>
      <Badge
        variant="outline"
        className={cn("shrink-0 text-[9px] font-medium", matchScoreStyle(event.matchScore))}
      >
        {event.matchScore}%
      </Badge>
    </div>
  );
}

function formatUpcomingTime(timestamp: number): string {
  const diffSec = timestamp - Math.floor(Date.now() / 1000);
  if (diffSec <= 0) return "Đang diễn ra";
  const days = Math.floor(diffSec / 86400);
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Ngày mai";
  if (days < 30) return `${days} ngày nữa`;
  const weeks = Math.floor(days / 7);
  return `${weeks} tuần nữa`;
}

function countInteractionTypes(
  interactions: StudentDashboardData["interactions"],
): [InteractionType, number][] {
  const map = new Map<InteractionType, number>();
  for (const item of interactions) {
    map.set(item.type, (map.get(item.type) ?? 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}
