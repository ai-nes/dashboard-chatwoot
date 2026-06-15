import type { IntentDefinition, IntentKey } from "./student-types";

export const INTENT_DEFINITIONS: Record<IntentKey, IntentDefinition> = {
  admission_inquiry: {
    key: "admission_inquiry",
    label: "Hỏi tuyển sinh",
    intentType: "admission",
    importance: "very_high",
    engagementPoints: 25,
  },
  admission_process: {
    key: "admission_process",
    label: "Quy trình tuyển sinh",
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
  enrollment_intent: {
    key: "enrollment_intent",
    label: "Có ý định nhập học",
    intentType: "admission",
    importance: "very_high",
    engagementPoints: 30,
  },
  deposit_intent: {
    key: "deposit_intent",
    label: "Có ý định đặt cọc",
    intentType: "financial",
    importance: "very_high",
    engagementPoints: 30,
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

const INTENT_ALIASES: Record<string, IntentKey> = {
  admission_process: "admission_process",
  "admission process": "admission_process",
  enrollment_intent: "enrollment_intent",
  "enrollment intent": "enrollment_intent",
  deposit_intent: "deposit_intent",
  "deposit intent": "deposit_intent",
  scholarship: "scholarship_inquiry",
  tuition: "tuition_inquiry",
};

function isIntentObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getIntentValue(value: unknown, field: string): string | undefined {
  if (!isIntentObject(value)) return undefined;
  const rawValue = value[field];
  return typeof rawValue === "string" && rawValue.trim() ? rawValue : undefined;
}

function getIntentKey(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return (
    getIntentValue(value, "key") ??
    getIntentValue(value, "intentKey") ??
    getIntentValue(value, "intent_type") ??
    getIntentValue(value, "intentType") ??
    getIntentValue(value, "label") ??
    getIntentValue(value, "name") ??
    "unknown_intent"
  );
}

function normalizeIntentKey(key: string): string {
  return key.trim().toLowerCase().replace(/[-\s]+/g, "_");
}

function formatUnknownIntentLabel(key: string): string {
  return key
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getIntentDefinition(intent: unknown): IntentDefinition {
  const key = getIntentKey(intent);
  const normalizedKey = normalizeIntentKey(key);
  const knownKey = INTENT_ALIASES[normalizedKey] ?? normalizedKey;
  const definition = INTENT_DEFINITIONS[knownKey as IntentKey];

  if (definition) return definition;

  const label = getIntentValue(intent, "label") ?? getIntentValue(intent, "intent_label");

  return {
    key,
    label: label ?? formatUnknownIntentLabel(key) ?? "Ý định chưa phân loại",
    intentType: "support",
    importance: "medium",
    engagementPoints: 0,
  };
}
