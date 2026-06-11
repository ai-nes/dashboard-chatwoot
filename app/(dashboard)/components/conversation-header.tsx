import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatChannel } from "./mock-data";
import type { ChatwootAppContext } from "./types";

export function ConversationHeader({ context }: { context: ChatwootAppContext }) {
  const { contact, conversation } = context;
  const initials = contact.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusLabel =
    conversation.status === "open"
      ? "Đang mở"
      : conversation.status === "pending"
        ? "Chờ xử lý"
        : conversation.status === "resolved"
          ? "Đã đóng"
          : conversation.status;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9 ring-2 ring-primary/15">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground">
            Hội thoại #{conversation.id} — {contact.name}
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Dashboard cuộc hội thoại · {formatChannel(conversation.meta?.channel)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
        <Badge variant="outline" className="text-[10px]">
          {formatChannel(conversation.meta?.channel)}
        </Badge>
        <Badge className="text-[10px]">{statusLabel}</Badge>
        {(conversation.unread_count ?? 0) > 0 ? (
          <Badge variant="secondary" className="text-[10px]">
            {conversation.unread_count} chưa đọc
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
