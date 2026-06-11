import { DashboardChannelOverview } from "./dashboard-channel-overview";
import { DashboardChartsSection } from "./dashboard-charts-section";
import { DashboardRecentConversations } from "./dashboard-recent-conversations";
import { DashboardStatsGrid } from "./dashboard-stats-grid";

/** Nội dung widget — nhúng vào vùng main của Chatwoot dashboard (không sidebar/header riêng). */
export function DashboardContent() {
  return (
    <div className="space-y-6 p-6">
      <DashboardStatsGrid />
      <DashboardChartsSection />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardRecentConversations />
        </div>
        <DashboardChannelOverview />
      </div>
    </div>
  );
}
