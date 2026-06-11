import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "./mock-data";
import type { ChatwootAppContext } from "./types";

export function ConversationMeta({ context }: { context: ChatwootAppContext }) {
  const { conversation, currentAgent } = context;
  const assignee = conversation.meta?.assignee;

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/50 bg-muted/30 px-3 py-2">
        <h3 className="text-xs font-semibold">Hội thoại #{conversation.id}</h3>
      </div>
      <div className="space-y-2 p-3 text-sm">
        <Row label="Agent" value={assignee?.available_name ?? assignee?.name ?? "Chưa gán"} />
        <Row label="Đang xem" value={currentAgent?.name ?? "—"} />
        <Row label="Bắt đầu" value={formatRelativeTime(conversation.timestamp)} />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {conversation.labels?.length ? (
            conversation.labels.map((label) => (
              <Badge key={label} variant="secondary" className="text-[11px]">
                {label}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">Chưa có nhãn</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
