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
import { StudentSocialMediaPanel } from "./student-social-media-panel";
import { StudentProfileCard } from "./student-profile-card";
import { useChatwootContext } from "./use-chatwoot-context";
import { Skeleton } from "@/components/ui/skeleton";
import { getMockSocialMediaInterests } from "./student-mock-data";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import type { ApiList } from "./student-types";

function getApiListItems<T>(list: ApiList<T> | undefined): T[] {
  if (!list) return [];
  return Array.isArray(list) ? list : list.items || [];
}

/** Widget nhúng Chatwoot — dashboard học sinh theo từng hội thoại. */
export function DashboardContent() {
  const { context, isEmbedded } = useChatwootContext();
  
  // Ưu tiên SĐT truyền qua URL (?phone=...) khi debug ngoài Chatwoot, sau đó mới fallback về context
  const searchPhone = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("phone") : null;
  const phone = searchPhone || context.contact.phone_number;

  const { data: dashboardData, isLoading, error } = useStudentDashboard(phone);

  // 1. Trạng thái Loading: Hiển thị Skeleton cho các phần dữ liệu CRM nhưng vẫn hiển thị khung thật
  if (isLoading) {
    return (
      <div className="min-h-full space-y-4 bg-neutral-100 p-4">
        {/* Banner thông báo */}
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs text-blue-800">
          <div className="size-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span>Đang tải thông tin học sinh từ CRM...</span>
        </div>

        {/* Student Header Skeleton */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3.5 w-48" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>

        {/* Profile & Lead Score Skeleton */}
        <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
          {/* Profile Card Skeleton */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
            <Skeleton className="h-4 w-40" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
          {/* Lead Score Card Skeleton */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        {/* Hội thoại hiện tại vẫn được render bằng dữ liệu thực tế từ context */}
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

  // 2. Chuẩn bị dữ liệu fallback trống (Empty/Default states) cho trường hợp Lỗi hoặc Không tìm thấy
  const fallbackStudent = {
    id: context.contact.id,
    fullName: context.contact.name || "Khách hàng",
    email: context.contact.email || "Chưa cập nhật email",
    phone: phone || "Chưa có số điện thoại",
    cohort: "Chưa rõ niên khóa",
    socialMediaInterests: getMockSocialMediaInterests("Facebook"),
    academicRecords: [],
    languages: [],
    interestedPrograms: [],
    interestedMajors: [],
  };

  const fallbackLeadScore = {
    fitScore: 0,
    engagementScore: 0,
    totalScore: 0,
    maxScore: 100,
    tier: "cold" as const,
    isPotentialCustomer: false,
    breakdown: [],
    trend: [],
    // eslint-disable-next-line react-hooks/purity
    lastUpdated: Math.floor(Date.now() / 1000),
  };

  const rawLeadScore = dashboardData?.leadScore || fallbackLeadScore;
  const totalScore = rawLeadScore.totalScore ?? 0;

  // Tính toán tier đồng bộ với điểm tổng (>= 75 là hot, >= 45 là warm, còn lại là cold)
  let computedTier: "hot" | "warm" | "cold" = "cold";
  if (totalScore >= 75) computedTier = "hot";
  else if (totalScore >= 45) computedTier = "warm";

  const safeLeadScore = {
    ...rawLeadScore,
    totalScore,
    maxScore: rawLeadScore.maxScore || 100,
    fitScore: rawLeadScore.fitScore ?? 0,
    engagementScore: rawLeadScore.engagementScore ?? 0,
    tier: computedTier,
    isPotentialCustomer: computedTier === "hot" || computedTier === "warm",
    breakdown: rawLeadScore.breakdown || [],
    trend: rawLeadScore.trend || [],
  };

  const safeDashboardData = dashboardData
    ? {
        ...dashboardData,
        student: {
          ...dashboardData.student,
          dateOfBirth: dashboardData.student.date_of_birth || dashboardData.student.dateOfBirth,
          socialMediaInterests: getMockSocialMediaInterests(dashboardData.student.source),
          academicRecords: dashboardData.student?.academicRecords || [],
          languages: dashboardData.student?.languages || [],
          interestedPrograms: dashboardData.student?.interestedPrograms || [],
          interestedMajors: dashboardData.student?.interestedMajors || [],
        },
        interactions: getApiListItems(dashboardData.interactions),
        events: getApiListItems(dashboardData.events),
        suggestedEvents: getApiListItems(dashboardData.suggestedEvents),
        intents: getApiListItems(dashboardData.intents),
        leadScore: safeLeadScore,
      }
    : {
        student: fallbackStudent,
        leadScore: fallbackLeadScore,
        interactions: [],
        events: [],
        suggestedEvents: [],
        intents: [],
      };

  return (
    <div className="min-h-full space-y-4 bg-neutral-100 p-4">
      {/* Banner thông báo trạng thái lỗi hoặc thiếu thông tin nhưng vẫn giữ khung */}
      {error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2.5 text-xs text-red-800">
          Không thể tải dữ liệu từ CRM: {error.message} (Đang hiển thị dữ liệu trống).
        </div>
      ) : !phone ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          Không tìm thấy số điện thoại của liên hệ trong Chatwoot. Không thể tra cứu thông tin CRM.
        </div>
      ) : !dashboardData ? (
        <div className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-xs text-muted-foreground">
          Không tìm thấy thông tin học sinh trên CRM cho số điện thoại {phone}.
        </div>
      ) : null}

      {!isEmbedded ? (
        <p className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center text-[11px] text-muted-foreground">
          Xem thử mock — nhúng Chatwoot sẽ load học sinh & hội thoại đang mở
        </p>
      ) : null}

      <StudentHeader
        student={safeDashboardData.student}
        context={context}
        leadScore={safeDashboardData.leadScore}
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <StudentProfileCard student={safeDashboardData.student} />
        <StudentLeadScoreCard leadScore={safeDashboardData.leadScore} />
      </div>

      <StudentEngagementStats data={safeDashboardData} />

      <StudentSocialMediaPanel interests={safeDashboardData.student.socialMediaInterests} />

      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        <StudentIntentsPanel intents={safeDashboardData.intents} />
        <StudentEventsPanel data={safeDashboardData} />
      </div>

      <StudentInteractionsTimeline interactions={safeDashboardData.interactions} />

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
