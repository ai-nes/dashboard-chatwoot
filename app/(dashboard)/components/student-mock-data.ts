import { calculateLeadScore } from "./student-lead-scoring";
import { getIntentDefinition } from "./student-intents";
import type { ChatwootAppContext } from "./types";
import type {
  DetectedIntent,
  Student,
  StudentDashboardData,
  StudentEvent,
  StudentInteraction,
} from "./student-types";

const now = Math.floor(Date.now() / 1000);
const day = (d: number) => now - d * 86400;
const hour = (h: number) => now - h * 3600;

const MOCK_STUDENT: Student = {
  id: 1001,
  fullName: "Nguyễn Văn Đại",
  email: "vandai@example.com",
  phone: "+84 901 234 567",
  cohort: "2025-2028",
  dateOfBirth: "15/08/2007",
  address: "Quận 7, TP. Hồ Chí Minh",
  school: "THPT Nguyễn Thị Minh Khai",
  academicRecords: [
    { year: "2022-2023", grade: "Kha" },
    { year: "2023-2024", grade: "Gioi" },
    { year: "2024-2025", grade: "Gioi" },
  ],
  languages: [
    { language: "Tiếng Anh", certificate: "IELTS", score: "6.5", issuedAt: "03/2025" },
    { language: "Tiếng Anh", certificate: "TOEIC", score: "780", issuedAt: "11/2024" },
  ],
  interestedPrograms: ["thpt_chuyen", "quoc_te", "song_ngu"],
  socialMediaInterests: [
    {
      platform: "facebook",
      isFollowing: true,
      engagementLevel: "high",
      handle: "facebook.com/vandai.nguyen",
      lastActivityAt: day(3),
      recentActivities: ["Comment bài tuyển sinh 2025", "Share video Open Day"],
    },
    {
      platform: "instagram",
      isFollowing: true,
      engagementLevel: "medium",
      handle: "@vandai_07",
      lastActivityAt: day(8),
      recentActivities: ["Like story campus tour", "Xem reel ngành CNTT"],
    },
    {
      platform: "tiktok",
      isFollowing: false,
      engagementLevel: "low",
      lastActivityAt: day(15),
      recentActivities: ["Xem video review trường"],
    },
    {
      platform: "youtube",
      isFollowing: true,
      engagementLevel: "medium",
      handle: "Đã đăng ký kênh trường",
      lastActivityAt: day(20),
      recentActivities: ["Xem webinar học bổng", "Like video giới thiệu ngành"],
    },
    {
      platform: "zalo",
      isFollowing: true,
      engagementLevel: "high",
      lastActivityAt: day(1),
      recentActivities: ["Nhắn Zalo OA trường", "Nhận thông báo tuyển sinh"],
    },
    {
      platform: "threads",
      isFollowing: false,
      engagementLevel: "none",
      recentActivities: [],
    },
  ],
  notes: "Quan tâm chương trình Quốc tế, đã tham dự ngày hội tuyển sinh tháng trước.",
};

const MOCK_INTERACTIONS: StudentInteraction[] = [
  {
    id: "int-conv-5",
    type: "conversation",
    title: "Hội thoại #5 — Trò chuyện trực tuyến",
    summary: "Hỏi điều kiện tuyển sinh và học bổng chương trình Quốc tế",
    occurredAt: hour(1),
    channel: "Trò chuyện trực tuyến",
    intents: ["admission_inquiry", "scholarship_inquiry", "tuition_inquiry"],
    metadata: { conversationId: "5" },
  },
  {
    id: "int-event-1",
    type: "event_attendance",
    title: "Ngày hội tuyển sinh 2025 — Tham quan campus",
    summary: "Tham dự buổi tham quan campus và Q&A với khoa CNTT",
    occurredAt: day(12),
    metadata: { eventId: "evt-001" },
    intents: ["event_registration", "campus_visit_inquiry"],
  },
  {
    id: "int-form-1",
    type: "form_submission",
    title: "Biểu mẫu đăng ký tư vấn tuyển sinh",
    summary: "Điền form online — chọn ngành CNTT, chương trình Quốc tế",
    occurredAt: day(18),
    intents: ["admission_inquiry", "major_inquiry"],
  },
  {
    id: "int-call-1",
    type: "phone_call",
    title: "Cuộc gọi tư vấn — 12 phút",
    summary: "Hỏi điều kiện xét tuyển thẳng và học bổng merit",
    occurredAt: day(25),
    intents: ["eligibility_check", "scholarship_inquiry"],
  },
  {
    id: "int-email-1",
    type: "email",
    title: "Thư điện tử — Tài liệu chương trình",
    summary: "Yêu cầu gửi brochure so sánh THPT chuyên vs Quốc tế",
    occurredAt: day(30),
    intents: ["major_comparison", "university_comparison"],
  },
  {
    id: "int-webinar",
    type: "event_attendance",
    title: "Hội thảo trực tuyến — Học bổng 2025",
    summary: "Tham dự webinar về cơ chế học bổng toàn phần",
    occurredAt: day(35),
    intents: ["scholarship_inquiry"],
  },
];

const MOCK_EVENTS: StudentEvent[] = [
  {
    id: "evt-001",
    name: "Ngày hội tuyển sinh 2025 — Tham quan campus",
    type: "open_day",
    attendedAt: day(12),
    status: "attended",
  },
  {
    id: "evt-002",
    name: "Hội thảo trực tuyến Học bổng 2025",
    type: "webinar",
    attendedAt: day(35),
    status: "attended",
  },
  {
    id: "evt-003",
    name: "Workshop Kỹ năng phỏng vấn",
    type: "workshop",
    attendedAt: day(5),
    status: "registered",
  },
];

function buildIntents(interactions: StudentInteraction[]): DetectedIntent[] {
  const intents: DetectedIntent[] = [];
  for (const interaction of interactions) {
    for (const key of interaction.intents ?? []) {
      const def = getIntentDefinition(key);
      intents.push({
        key,
        label: def.label,
        intentType: def.intentType,
        importance: def.importance,
        detectedAt: interaction.occurredAt,
        sourceInteractionId: interaction.id,
        sourceType: interaction.type,
        confidence: key === "admission_inquiry" || key === "scholarship_inquiry" ? 0.92 : 0.85,
      });
    }
  }
  return intents.sort((a, b) => b.detectedAt - a.detectedAt);
}

export function getStudentDashboardData(context: ChatwootAppContext): StudentDashboardData {
  const student: Student = {
    ...MOCK_STUDENT,
    fullName: context.contact.name || MOCK_STUDENT.fullName,
    email: context.contact.email ?? MOCK_STUDENT.email,
    phone: context.contact.phone_number ?? MOCK_STUDENT.phone,
    id: context.contact.id,
  };

  const interactions = MOCK_INTERACTIONS.map((item) =>
    item.id === "int-conv-5"
          ? {
          ...item,
          title: `Hội thoại #${context.conversation.id} — Trò chuyện trực tuyến`,
          metadata: { conversationId: String(context.conversation.id) },
        }
      : item,
  );

  const intents = buildIntents(interactions);
  const leadScore = calculateLeadScore(student, interactions, intents, MOCK_EVENTS);

  return { student, interactions, events: MOCK_EVENTS, intents, leadScore };
}
