import { Badge } from "@/components/ui/badge";
import { Building2Icon, MailIcon, PhoneIcon } from "lucide-react";

import { formatChannel, formatRelativeTime, getMockConversationInsights } from "./mock-data";
import type { ChatwootAppContext } from "./types";

const SHARE_COLORS: Record<string, string> = {
  contact: "#2781f6",
  agent: "#12b981",
  text: "#2781f6",
  note: "#f59e0b",
  auto: "#8b5cf6",
};

function DistributionList({
  title,
  items,
}: {
  title: string;
  items: { key: string; label: string; value: number }[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/50 px-3 py-2.5">
        <h3 className="text-xs font-semibold">{title}</h3>
      </div>
      <div className="space-y-3 p-3">
        {items.map((item) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium">{item.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {item.value} · {pct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: SHARE_COLORS[item.key] ?? "#2781f6",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ConversationSidePanel({ context }: { context: ChatwootAppContext }) {
  const { contact, conversation, currentAgent } = context;
  const insights = getMockConversationInsights(context);
  const assignee = conversation.meta?.assignee;
  const company = contact.additional_attributes?.company_name;

  const statusLabel =
    conversation.status === "open"
      ? "Đang mở"
      : conversation.status === "pending"
        ? "Chờ xử lý"
        : conversation.status === "resolved"
          ? "Đã đóng"
          : conversation.status;

  return (
    <div className="space-y-3">
      <DistributionList title="Phân bổ tin nhắn" items={insights.messageShare} />

      <div className="rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="border-b border-border/50 px-3 py-2.5">
          <h3 className="text-xs font-semibold">Thông tin hội thoại</h3>
        </div>
        <div className="space-y-2 p-3 text-xs">
          <MetaRow label="Trạng thái" value={statusLabel} />
          <MetaRow label="Kênh" value={formatChannel(conversation.meta?.channel)} />
          <MetaRow label="Agent" value={assignee?.available_name ?? assignee?.name ?? "Chưa gán"} />
          <MetaRow label="Đang xem" value={currentAgent?.name ?? "—"} />
          <MetaRow label="Bắt đầu" value={formatRelativeTime(conversation.timestamp)} />
          <div className="flex flex-wrap gap-1 pt-1">
            {conversation.labels?.length ? (
              conversation.labels.map((label) => (
                <Badge key={label} variant="secondary" className="text-[10px]">
                  {label}
                </Badge>
              ))
            ) : (
              <span className="text-[10px] text-muted-foreground">Chưa có nhãn</span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="border-b border-border/50 px-3 py-2.5">
          <h3 className="text-xs font-semibold">Liên hệ</h3>
        </div>
        <div className="space-y-2 p-3">
          <ContactRow icon={MailIcon} label="Email" value={contact.email ?? "—"} />
          <ContactRow icon={PhoneIcon} label="SĐT" value={contact.phone_number ?? "—"} />
          {company ? <ContactRow icon={Building2Icon} label="Công ty" value={company} /> : null}
        </div>
      </div>

      {insights.orders.length > 0 ? (
        <div className="rounded-xl border border-border/60 bg-card shadow-sm">
          <div className="border-b border-border/50 px-3 py-2.5">
            <h3 className="text-xs font-semibold">Đơn hàng liên quan</h3>
          </div>
          <div className="space-y-2 p-3">
            {insights.orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-2.5 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium">{order.title}</p>
                  <p className="text-[10px] text-muted-foreground">{order.id}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-semibold text-primary">{order.amount}</p>
                  <Badge
                    variant={order.status === "completed" ? "outline" : "secondary"}
                    className="mt-0.5 text-[9px]"
                  >
                    {order.status === "completed" ? "Hoàn tất" : "Chờ xử lý"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MailIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="size-3.5 shrink-0 text-primary/70" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}
