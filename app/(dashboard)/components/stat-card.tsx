import { cn } from "@/lib/utils";
import type { ContactStat } from "./types";

export function StatCard({
  label,
  value,
  change,
  changeDirection = "neutral",
  description,
  icon: Icon,
}: ContactStat) {
  const changeColor =
    changeDirection === "up"
      ? "text-primary"
      : changeDirection === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="rounded-xl border border-border/60 bg-card px-4 py-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 shrink-0 text-primary/80" aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {(change || description) && (
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
          {change ? <span className={cn("font-semibold", changeColor)}>{change}</span> : null}
          {change && description ? " " : null}
          {description}
        </p>
      )}
    </div>
  );
}
