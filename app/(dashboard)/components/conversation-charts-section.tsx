"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ConversationMessagesChart } from "./conversation-messages-chart";
import { getMockConversationInsights } from "./mock-data";
import type { ChatwootAppContext } from "./types";

const CHART_H = "aspect-auto h-[140px] w-full min-h-0";

const responseConfig = {
  minutes: { label: "Phút", color: "#2781f6" },
} satisfies ChartConfig;

const volumeConfig = {
  messages: { label: "Tin nhắn", color: "#2781f6" },
} satisfies ChartConfig;

function ChartPanel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm", className)}>
      <div className="border-b border-border/50 px-3 py-2.5">
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-[10px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

const axisTick = { fontSize: 10, fill: "var(--muted-foreground)" };

export function ConversationChartsSection({ context }: { context: ChatwootAppContext }) {
  const insights = getMockConversationInsights(context);

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <ChartPanel
        title="Tin nhắn trong hội thoại"
        subtitle={`#${context.conversation.id} · Khách hàng vs Agent`}
      >
        <ConversationMessagesChart data={insights.messagesByPeriod} />
      </ChartPanel>

      <ChartPanel title="Thời gian phản hồi" subtitle="Từng lượt trao đổi (phút)">
        <ChartContainer config={responseConfig} className={CHART_H}>
          <LineChart data={insights.responseTimePerTurn} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="turn" tickLine={false} axisLine={false} tick={axisTick} />
            <YAxis tickLine={false} axisLine={false} width={24} tick={axisTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#2781f6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2781f6", strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </ChartPanel>

      <ChartPanel title="Hoạt động" subtitle="7 ngày gần nhất">
        <ChartContainer config={volumeConfig} className={CHART_H}>
          <AreaChart data={insights.activityVolume} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="convVolumeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2781f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2781f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={axisTick} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} tick={axisTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="messages"
              stroke="#2781f6"
              strokeWidth={2}
              fill="url(#convVolumeFill)"
            />
          </AreaChart>
        </ChartContainer>
      </ChartPanel>
    </div>
  );
}
