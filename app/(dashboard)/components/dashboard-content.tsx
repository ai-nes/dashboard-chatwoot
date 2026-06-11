"use client";

import { ConversationChartsSection } from "./conversation-charts-section";
import { ConversationHeader } from "./conversation-header";
import { ConversationInsights } from "./conversation-insights";
import { ConversationMessageTable } from "./conversation-message-table";
import { ConversationSidePanel } from "./conversation-side-panel";
import { useChatwootContext } from "./use-chatwoot-context";

/** Widget nhúng trong tab Dashboard App — theo context từng hội thoại. */
export function DashboardContent() {
  const { context, isEmbedded } = useChatwootContext();

  return (
    <div className="min-h-full space-y-4 bg-[#f9fafb] p-4">
      {!isEmbedded ? (
        <p className="rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-center text-[11px] text-muted-foreground">
          Preview mock — nhúng Chatwoot sẽ load contact/hội thoại đang mở
        </p>
      ) : null}

      <ConversationHeader context={context} />
      <ConversationInsights context={context} />
      <ConversationChartsSection context={context} />

      <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
        <ConversationMessageTable context={context} />
        <ConversationSidePanel context={context} />
      </div>
    </div>
  );
}
