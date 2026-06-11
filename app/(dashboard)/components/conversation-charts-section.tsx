"use client";

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
import { ConversationMessagesChart } from "./conversation-messages-chart";
import { PanelShell } from "./panel-shell";
import { getMockConversationInsights } from "./mock-data";
import type { ChatwootAppContext } from "./types";

const CHART_H = "aspect-auto h-[140px] w-full min-h-0";

const responseConfig = {
  minutes: { label: "Phút", color: "#8b5cf6" },
} satisfies ChartConfig;

const volumeConfig = {
  messages: { label: "Tin nhắn", color: "#06b6d4" },
} satisfies ChartConfig;

const axisTick = { fontSize: 10, fill: "var(--muted-foreground)" };

export function ConversationChartsSection({ context }: { context: ChatwootAppContext }) {
  const insights = getMockConversationInsights(context);

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <PanelShell
        title="Tin nhắn trong hội thoại"
        subtitle={`#${context.conversation.id} · Khách hàng vs Nhân viên`}
      >
        <div className="p-3">
          <ConversationMessagesChart data={insights.messagesByPeriod} />
        </div>
      </PanelShell>

      <PanelShell title="Thời gian phản hồi" subtitle="Từng lượt trao đổi (phút)">
        <div className="p-3">
          <ChartContainer config={responseConfig} className={CHART_H}>
            <LineChart data={insights.responseTimePerTurn} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="turn" tickLine={false} axisLine={false} tick={axisTick} />
              <YAxis tickLine={false} axisLine={false} width={24} tick={axisTick} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </PanelShell>

      <PanelShell title="Hoạt động" subtitle="7 ngày gần nhất">
        <div className="p-3">
          <ChartContainer config={volumeConfig} className={CHART_H}>
            <AreaChart data={insights.activityVolume} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="convVolumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={axisTick} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} tick={axisTick} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#convVolumeFill)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </PanelShell>
    </div>
  );
}
