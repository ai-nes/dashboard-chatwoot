import type { IntentDefinition, IntentKey } from "./student-types";

export const INTENT_DEFINITIONS: Record<IntentKey, IntentDefinition> = {
  admission_inquiry: {
    key: "admission_inquiry",
    label: "Hỏi tuyển sinh",
    intentType: "admission",
    importance: "very_high",
    engagementPoints: 25,
  },
  eligibility_check: {
    key: "eligibility_check",
    label: "Kiểm tra điều kiện",
    intentType: "admission",
    importance: "very_high",
    engagementPoints: 25,
  },
  scholarship_inquiry: {
    key: "scholarship_inquiry",
    label: "Hỏi học bổng",
    intentType: "financial",
    importance: "very_high",
    engagementPoints: 25,
  },
  tuition_inquiry: {
    key: "tuition_inquiry",
    label: "Hỏi học phí",
    intentType: "financial",
    importance: "very_high",
    engagementPoints: 25,
  },
  application_submission: {
    key: "application_submission",
    label: "Nộp hồ sơ",
    intentType: "admission",
    importance: "very_high",
    engagementPoints: 30,
  },
  enrollment_inquiry: {
    key: "enrollment_inquiry",
    label: "Hỏi ghi danh",
    intentType: "admission",
    importance: "very_high",
    engagementPoints: 25,
  },
  career_exploration: {
    key: "career_exploration",
    label: "Khám phá nghề nghiệp",
    intentType: "career",
    importance: "high",
    engagementPoints: 15,
  },
  major_inquiry: {
    key: "major_inquiry",
    label: "Hỏi ngành học",
    intentType: "academic",
    importance: "high",
    engagementPoints: 15,
  },
  major_comparison: {
    key: "major_comparison",
    label: "So sánh ngành",
    intentType: "academic",
    importance: "high",
    engagementPoints: 15,
  },
  university_comparison: {
    key: "university_comparison",
    label: "So sánh trường",
    intentType: "admission",
    importance: "high",
    engagementPoints: 15,
  },
  event_registration: {
    key: "event_registration",
    label: "Đăng ký sự kiện",
    intentType: "campus_life",
    importance: "high",
    engagementPoints: 12,
  },
  campus_visit_inquiry: {
    key: "campus_visit_inquiry",
    label: "Hỏi tham quan campus",
    intentType: "campus_life",
    importance: "high",
    engagementPoints: 12,
  },
  student_life_inquiry: {
    key: "student_life_inquiry",
    label: "Hỏi đời sống sinh viên",
    intentType: "campus_life",
    importance: "medium",
    engagementPoints: 8,
  },
  international_program_inquiry: {
    key: "international_program_inquiry",
    label: "Hỏi chương trình quốc tế",
    intentType: "academic",
    importance: "medium",
    engagementPoints: 8,
  },
  complaint_support: {
    key: "complaint_support",
    label: "Khiếu nại / Hỗ trợ",
    intentType: "support",
    importance: "medium",
    engagementPoints: 5,
  },
};

export function getIntentDefinition(key: IntentKey): IntentDefinition {
  return INTENT_DEFINITIONS[key];
}
