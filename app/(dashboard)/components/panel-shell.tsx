import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { cardClass, cardHeaderClass } from "./dashboard-ui";

export function PanelShell({
  title,
  subtitle,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn(cardClass, "flex flex-col overflow-hidden", className)}>
      <div className={cardHeaderClass}>
        <h2 className="text-xs font-semibold text-foreground">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-[10px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className={cn("flex flex-1 flex-col", bodyClassName)}>{children}</div>
    </div>
  );
}
