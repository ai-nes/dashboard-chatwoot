"use client";

import { ConversationChartsSection } from "./conversation-charts-section";
import { ConversationMessageTable } from "./conversation-message-table";
import { PanelShell } from "./panel-shell";
import { StudentEngagementStats } from "./student-engagement-stats";
import { StudentEventsPanel } from "./student-events-panel";
import { StudentHeader } from "./student-header";
import { StudentIntentsPanel } from "./student-intents-panel";
import { StudentInteractionsTimeline } from "./student-interactions-timeline";
import { StudentLeadScoreCard } from "./student-lead-score-card";
import { getStudentDashboardData } from "./student-mock-data";
import { StudentSocialMediaPanel } from "./student-social-media-panel";
import { StudentProfileCard } from "./student-profile-card";
import { useChatwootContext } from "./use-chatwoot-context";

/** Widget nhúng Chatwoot — dashboard học sinh theo từng hội thoại. */
export function DashboardContent() {
  const { context, isEmbedded } = useChatwootContext();
  const data = getStudentDashboardData(context);

  return (
    <div className="min-h-full space-y-4 bg-neutral-100 p-4">
      {!isEmbedded ? (
        <p className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center text-[11px] text-muted-foreground">
          Xem thử mock — nhúng Chatwoot sẽ load học sinh & hội thoại đang mở
        </p>
      ) : null}

      <StudentHeader student={data.student} context={context} leadScore={data.leadScore} />

      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <StudentProfileCard student={data.student} />
        <StudentLeadScoreCard leadScore={data.leadScore} />
      </div>

      <StudentEngagementStats data={data} />

      <StudentSocialMediaPanel interests={data.student.socialMediaInterests} />

      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        <StudentIntentsPanel intents={data.intents} />
        <StudentEventsPanel data={data} />
      </div>

      <StudentInteractionsTimeline interactions={data.interactions} />

      <PanelShell
        title={`Hội thoại hiện tại #${context.conversation.id}`}
        subtitle="Loại tương tác: Hội thoại → Ý định"
      >
        <div className="space-y-3 p-3">
          <ConversationChartsSection context={context} />
          <ConversationMessageTable context={context} />
        </div>
      </PanelShell>
    </div>
  );
}
