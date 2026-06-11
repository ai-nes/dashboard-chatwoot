import { cn } from "@/lib/utils";
import { ACCENT_STYLES, type DashboardAccent } from "./dashboard-accents";
import { cardClass } from "./dashboard-ui";
import type { ContactStat } from "./types";

export function StatCard({
  label,
  value,
  change,
  changeDirection = "neutral",
  description,
  icon: Icon,
  accent = "blue",
}: ContactStat & { accent?: DashboardAccent }) {
  const styles = ACCENT_STYLES[accent];

  const changeColor =
    changeDirection === "up"
      ? styles.change
      : changeDirection === "down"
        ? "text-red-600"
        : "text-muted-foreground";

  return (
    <div className={cn(cardClass, "px-4 py-3.5")}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-md", styles.icon)}>
          <Icon className="size-3.5" aria-hidden />
        </span>
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
