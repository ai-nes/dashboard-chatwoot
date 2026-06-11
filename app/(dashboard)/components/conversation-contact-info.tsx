import { Building2Icon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";

import { formatRelativeTime } from "./mock-data";
import type { ChatwootAppContext } from "./types";

export function ConversationContactInfo({ context }: { context: ChatwootAppContext }) {
  const { contact } = context;
  const company = contact.additional_attributes?.company_name;

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/50 bg-muted/30 px-3 py-2">
        <h3 className="text-xs font-semibold">Thông tin liên hệ</h3>
      </div>
      <div className="grid gap-2 p-3 sm:grid-cols-2">
        <InfoRow icon={MailIcon} label="Email" value={contact.email ?? "—"} />
        <InfoRow icon={PhoneIcon} label="SĐT" value={contact.phone_number ?? "—"} />
        {company ? <InfoRow icon={Building2Icon} label="Công ty" value={company} /> : null}
        <InfoRow icon={UserIcon} label="Hoạt động" value={formatRelativeTime(contact.last_activity_at)} />
      </div>
      {contact.additional_attributes?.description ? (
        <p className="border-t border-border/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {contact.additional_attributes.description}
        </p>
      ) : null}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MailIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 px-2.5 py-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-3.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm">{value}</p>
      </div>
    </div>
  );
}
