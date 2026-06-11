"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MessagesByPeriod } from "./messages-chart-data";

const config = {
  contact: { label: "Khách hàng", color: "#2781f6" },
  agent: { label: "Agent", color: "#12b981" },
} satisfies ChartConfig;

const axisTick = { fontSize: 10, fill: "var(--muted-foreground)" };

export function ConversationMessagesChart({ data }: { data: MessagesByPeriod[] }) {
  const maxTotal = Math.max(...data.map((d) => d.contact + d.agent), 1);

  return (
    <ChartContainer config={config} className="aspect-auto h-[168px] w-full min-h-0">
      <BarChart
        data={data}
        margin={{ top: 4, right: 6, left: -8, bottom: 0 }}
        barCategoryGap="22%"
        barGap={6}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
        <XAxis
          dataKey="period"
          tickLine={false}
          axisLine={false}
          tick={axisTick}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          domain={[0, Math.max(maxTotal + 1, 4)]}
          tickCount={5}
          tickLine={false}
          axisLine={false}
          width={20}
          tick={axisTick}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.35 }}
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Lúc ${label}`}
              formatter={(value, name) => [
                `${value} tin`,
                name === "contact" ? "Khách hàng" : "Agent",
              ]}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="contact"
          fill="var(--color-contact)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="agent"
          fill="var(--color-agent)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ChartContainer>
  );
}
