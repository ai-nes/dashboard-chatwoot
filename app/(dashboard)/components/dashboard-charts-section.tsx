"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DASHBOARD_AGENT_PERFORMANCE,
  DASHBOARD_CHANNEL_SHARE,
  DASHBOARD_CONVERSATIONS_BY_MONTH,
  DASHBOARD_RESPONSE_TIME_TREND,
  DASHBOARD_WEEKLY_VOLUME,
} from "./mock-data";

const conversationsConfig = {
  conversations: { label: "Hội thoại", color: "var(--color-primary)" },
  resolved: { label: "Đã giải quyết", color: "hsl(142 71% 45%)" },
} satisfies ChartConfig;

const responseTimeConfig = {
  minutes: { label: "Phút", color: "var(--color-primary)" },
} satisfies ChartConfig;

const weeklyVolumeConfig = {
  open: { label: "Đang mở", color: "var(--color-primary)" },
  resolved: { label: "Đã đóng", color: "hsl(199 89% 48%)" },
} satisfies ChartConfig;

const channelShareConfig = {
  livechat: { label: "Live chat", color: "var(--color-primary)" },
  email: { label: "Email", color: "hsl(199 89% 48%)" },
  facebook: { label: "Facebook", color: "hsl(262 83% 58%)" },
  whatsapp: { label: "WhatsApp", color: "hsl(142 71% 45%)" },
} satisfies ChartConfig;

const agentPerformanceConfig = {
  resolved: { label: "Đã giải quyết", color: "hsl(142 71% 45%)" },
  pending: { label: "Chờ xử lý", color: "hsl(38 92% 50%)" },
} satisfies ChartConfig;

const chartHeight = "aspect-auto h-44 w-full";

export function DashboardChartsSection() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Hội thoại theo tháng</CardTitle>
            <CardDescription className="text-xs">Tổng và đã giải quyết (6 tháng)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={conversationsConfig} className={chartHeight}>
              <BarChart data={DASHBOARD_CONVERSATIONS_BY_MONTH} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="conversations" fill="var(--color-conversations)" radius={4} />
                <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Thời gian phản hồi TB</CardTitle>
            <CardDescription className="text-xs">Xu hướng theo tháng (phút)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={responseTimeConfig} className={chartHeight}>
              <LineChart data={DASHBOARD_RESPONSE_TIME_TREND} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="var(--color-minutes)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card size="sm" className="sm:col-span-2 xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Khối lượng 7 ngày</CardTitle>
            <CardDescription className="text-xs">Mở vs đóng trong tuần</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={weeklyVolumeConfig} className={chartHeight}>
              <AreaChart data={DASHBOARD_WEEKLY_VOLUME} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="open"
                  stackId="1"
                  stroke="var(--color-open)"
                  fill="var(--color-open)"
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stackId="1"
                  stroke="var(--color-resolved)"
                  fill="var(--color-resolved)"
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Phân bổ kênh</CardTitle>
            <CardDescription className="text-xs">Hội thoại đang mở theo kênh</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={channelShareConfig} className={`${chartHeight} mx-auto max-w-48`}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="channel" />} />
                <Pie
                  data={DASHBOARD_CHANNEL_SHARE}
                  dataKey="value"
                  nameKey="channel"
                  innerRadius={40}
                  outerRadius={64}
                  paddingAngle={2}
                >
                  {DASHBOARD_CHANNEL_SHARE.map((entry) => (
                    <Cell key={entry.channel} fill={`var(--color-${entry.channel})`} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="channel" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card size="sm" className="sm:col-span-1 xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Hiệu suất agent</CardTitle>
            <CardDescription className="text-xs">Đã giải quyết và chờ xử lý theo agent</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={agentPerformanceConfig} className={chartHeight}>
              <BarChart
                data={DASHBOARD_AGENT_PERFORMANCE}
                layout="vertical"
                margin={{ left: 8, right: 8 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="agent"
                  tickLine={false}
                  axisLine={false}
                  width={96}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="resolved" stackId="a" fill="var(--color-resolved)" radius={4} />
                <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
