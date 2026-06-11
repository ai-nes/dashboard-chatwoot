import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PanelShell } from "./panel-shell";
import { formatRelativeTime } from "./mock-data-utils";
import {
  INTENT_IMPORTANCE_LABELS,
  INTENT_TYPE_LABELS,
  type DetectedIntent,
  type IntentType,
} from "./student-types";

const IMPORTANCE_STYLE: Record<DetectedIntent["importance"], string> = {
  very_high: "border-red-300 bg-red-50 text-red-800",
  high: "border-amber-300 bg-amber-50 text-amber-800",
  medium: "border-neutral-300 bg-neutral-50 text-neutral-600",
};

export function StudentIntentsPanel({ intents }: { intents: DetectedIntent[] }) {
  const byType = groupByIntentType(intents);

  return (
    <PanelShell
      title="Ý định theo loại"
      subtitle={`Hội thoại → Ý định · ${intents.length} ý định phát hiện`}
      className="h-full"
      bodyClassName="min-h-0"
    >
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {byType.map(([type, items]) => (
          <div key={type}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
              {INTENT_TYPE_LABELS[type]}
            </p>
            <div className="space-y-1.5">
              {items.map((intent, i) => (
                <div
                  key={`${intent.key}-${intent.detectedAt}-${i}`}
                  className="flex items-start justify-between gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium">{intent.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(intent.detectedAt)}
                      {intent.confidence ? ` · ${Math.round(intent.confidence * 100)}%` : ""}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("shrink-0 text-[9px] font-medium", IMPORTANCE_STYLE[intent.importance])}
                  >
                    {INTENT_IMPORTANCE_LABELS[intent.importance]}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function groupByIntentType(intents: DetectedIntent[]): [IntentType, DetectedIntent[]][] {
  const map = new Map<IntentType, DetectedIntent[]>();
  const seen = new Set<string>();

  for (const intent of intents) {
    const dedupeKey = `${intent.key}-${intent.intentType}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    const list = map.get(intent.intentType) ?? [];
    list.push(intent);
    map.set(intent.intentType, list);
  }

  const order: IntentType[] = ["admission", "financial", "academic", "career", "campus_life", "support"];
  return order.filter((t) => map.has(t)).map((t) => [t, map.get(t)!]);
}
