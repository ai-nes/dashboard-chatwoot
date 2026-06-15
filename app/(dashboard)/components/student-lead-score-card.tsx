"use client";

import { Line, LineChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { PanelShell } from "./panel-shell";
import { formatRelativeTime } from "./mock-data-utils";
import {
  LEAD_TIER_LABELS,
  SCORE_CATEGORY_LABELS,
  type LeadScore,
  type ScoreBreakdownItem,
} from "./student-types";

const trendConfig = {
  score: { label: "Điểm", color: "#2781f6" },
} satisfies ChartConfig;

const TIER_SCORE_COLOR: Record<LeadScore["tier"], string> = {
  hot: "text-emerald-600",
  warm: "text-amber-600",
  cold: "text-neutral-600",
};

const TIER_BADGE: Record<LeadScore["tier"], string> = {
  hot: "border-emerald-300 bg-emerald-50 text-emerald-800",
  warm: "border-amber-300 bg-amber-50 text-amber-800",
  cold: "border-neutral-300 bg-neutral-50 text-neutral-600",
};

export function StudentLeadScoreCard({ leadScore }: { leadScore: LeadScore }) {
  const maxScore = leadScore.maxScore || 100;
  const pct = Math.max(0, Math.min(100, Math.round((leadScore.totalScore / maxScore) * 100)));

  return (
    <PanelShell
      title="Điểm tiềm năng"
      subtitle={`Fit + engagement + intent · Cập nhật ${formatRelativeTime(leadScore.lastUpdated)}`}
      className="h-full"
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-lg border border-neutral-300 bg-neutral-50/50 px-4 py-5 text-center">
          <div className={cn("text-4xl font-bold tabular-nums tracking-tight", TIER_SCORE_COLOR[leadScore.tier])}>
            {leadScore.totalScore}
            <span className="text-lg font-medium text-muted-foreground">/{maxScore}</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{pct}% mức độ quan tâm</p>
          <Badge variant="outline" className={cn("mt-2 text-[10px] font-medium", TIER_BADGE[leadScore.tier])}>
            {LEAD_TIER_LABELS[leadScore.tier]}
          </Badge>
          <p className="mt-2 text-[11px] font-medium">
            {leadScore.isPotentialCustomer ? (
              <span className="text-emerald-700">✓ Khách hàng tiềm năng</span>
            ) : (
              <span className="text-muted-foreground">Chưa đủ tiêu chí tiềm năng</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ScorePill label={SCORE_CATEGORY_LABELS.fit} score={leadScore.fitScore} color="violet" />
          <ScorePill
            label={SCORE_CATEGORY_LABELS.engagement}
            score={leadScore.engagementScore}
            color="emerald"
          />
          <ScorePill label={SCORE_CATEGORY_LABELS.intent} score={leadScore.intentScore} color="blue" />
          <ScorePill
            label="Điểm trừ"
            score={leadScore.timeDecayScore + leadScore.negativeScore}
            color="neutral"
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Xu hướng điểm (28 ngày)
          </p>
          <ChartContainer config={trendConfig} className="aspect-auto h-[72px] w-full">
            <LineChart data={leadScore.trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, maxScore]} hide />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2781f6"
                strokeWidth={2}
                dot={{ r: 2, fill: "#2781f6" }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Đóng góp điểm
          </p>
          <ul className="max-h-[140px] space-y-1 overflow-y-auto rounded-md border border-neutral-200 p-2">
            {leadScore.breakdown.slice(0, 6).map((item, i) => (
              <BreakdownRow key={`${item.label}-${i}`} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </PanelShell>
  );
}

function ScorePill({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: "violet" | "emerald" | "blue" | "neutral";
}) {
  const pct = Math.max(0, Math.min(100, Math.abs(score)));
  const barColor =
    color === "violet"
      ? "bg-violet-500"
      : color === "emerald"
        ? "bg-emerald-500"
        : color === "blue"
          ? "bg-blue-500"
          : "bg-neutral-400";
  const border =
    color === "violet"
      ? "border-violet-200"
      : color === "emerald"
        ? "border-emerald-200"
        : color === "blue"
          ? "border-blue-200"
          : "border-neutral-200";
  const text =
    color === "violet"
      ? "text-violet-700"
      : color === "emerald"
        ? "text-emerald-700"
        : color === "blue"
          ? "text-blue-700"
          : "text-neutral-600";

  return (
    <div className={cn("rounded-lg border bg-white px-2.5 py-2 text-center", border)}>
      <p className={cn("text-[10px] font-medium", text)}>{label}</p>
      <p className="text-sm font-semibold tabular-nums">
        {score}
      </p>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-neutral-100">
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BreakdownRow({ item }: { item: ScoreBreakdownItem }) {
  const categoryLabel = SCORE_CATEGORY_LABELS[item.category] ?? item.category;
  const signedPoints = item.points > 0 ? `+${item.points}` : String(item.points);

  return (
    <li className="flex items-center justify-between gap-2 text-[10px]">
      <span className="min-w-0 truncate text-muted-foreground">
        {item.label}
        <span className="ml-1 text-neutral-400">({categoryLabel})</span>
      </span>
      <span
        className={cn(
          "shrink-0 font-semibold tabular-nums",
          item.points < 0
            ? "text-red-600"
            : item.category === "fit"
              ? "text-violet-600"
              : item.category === "intent"
                ? "text-blue-600"
                : "text-emerald-600",
        )}
      >
        {signedPoints}
      </span>
    </li>
  );
}
