import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "./mock-data";
import type { ChatwootAppContext } from "./types";

export function ConversationMessages({ context }: { context: ChatwootAppContext }) {
  const messages = [...(context.conversation.messages ?? [])].sort(
    (a, b) => b.created_at - a.created_at,
  );

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/50 bg-muted/30 px-3 py-2">
        <h3 className="text-xs font-semibold">Tin nhắn gần đây</h3>
        <p className="text-[11px] text-muted-foreground">{messages.length} tin nhắn</p>
      </div>
      <ScrollArea className="h-52 p-3">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <p className="text-xs text-muted-foreground">Chưa có tin nhắn</p>
          ) : (
            messages.map((message) => {
              const isAgent = message.message_type === 1;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    isAgent
                      ? "ml-4 border border-primary/15 bg-primary/5"
                      : "mr-4 border border-border/60 bg-muted/30",
                  )}
                >
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold">{message.sender?.name ?? "Unknown"}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(message.created_at)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">{message.content}</p>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
