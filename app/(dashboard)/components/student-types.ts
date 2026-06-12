/** Chương trình đào tạo quan tâm */
export type TrainingProgram =
  | "thpt_thuong"
  | "thpt_chuyen"
  | "cao_dang_lien_thong"
  | "gdtx"
  | "song_ngu"
  | "quoc_te";

export const TRAINING_PROGRAM_LABELS: Record<TrainingProgram, string> = {
  thpt_thuong: "THPT thường",
  thpt_chuyen: "THPT chuyên",
  cao_dang_lien_thong: "Cao đẳng liên thông",
  gdtx: "GDTX",
  song_ngu: "Song ngữ",
  quoc_te: "Quốc tế",
};

/** Ngành / chuyên ngành quan tâm */
export type StudyMajor =
  | "cntt"
  | "kinh_te"
  | "kinh_te_quoc_te"
  | "quan_tri_kinh_doanh"
  | "marketing"
  | "tai_chinh_ngan_hang"
  | "luat"
  | "ngoai_ngu"
  | "thiet_ke_do_hoa"
  | "y_duoc"
  | "kiem_toan";

export const STUDY_MAJOR_LABELS: Record<StudyMajor, string> = {
  cntt: "Công nghệ thông tin",
  kinh_te: "Kinh tế",
  kinh_te_quoc_te: "Kinh tế quốc tế",
  quan_tri_kinh_doanh: "Quản trị kinh doanh",
  marketing: "Marketing",
  tai_chinh_ngan_hang: "Tài chính — Ngân hàng",
  luat: "Luật",
  ngoai_ngu: "Ngôn ngữ",
  thiet_ke_do_hoa: "Thiết kế đồ họa",
  y_duoc: "Y — Dược",
  kiem_toan: "Kiểm toán",
};

export type MajorInterestPriority = "primary" | "secondary";

export const MAJOR_PRIORITY_LABELS: Record<MajorInterestPriority, string> = {
  primary: "Ưu tiên",
  secondary: "Phụ",
};

export type InterestedMajor = {
  major: StudyMajor;
  priority: MajorInterestPriority;
};

export type AcademicRecord = {
  year: string;
  grade: "Gioi" | "Kha" | "Trung binh" | "Yeu";
};

export const ACADEMIC_GRADE_LABELS: Record<AcademicRecord["grade"], string> = {
  Gioi: "Giỏi",
  Kha: "Khá",
  "Trung binh": "Trung bình",
  Yeu: "Yếu",
};

export type LanguageCertificate = {
  language: string;
  certificate: string;
  score?: string;
  issuedAt?: string;
};

/** Tỉnh/TP và trường THPT đang theo học */
export type StudentHighSchool = {
  province: string;
  name: string;
};

/** Địa chỉ liên hệ / nơi ở */
export type StudentAddress = {
  province: string;
  district?: string;
  detail?: string;
};

export type Student = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  cohort: string;
  dateOfBirth?: string;
  date_of_birth?: string; // Ngày sinh từ API (snake_case)
  source?: string;        // Nguồn lead từ API
  highSchool?: StudentHighSchool;
  homeAddress?: StudentAddress;
  academicRecords: AcademicRecord[];
  languages: LanguageCertificate[];
  interestedPrograms: TrainingProgram[];
  /** Ngành / chuyên ngành học sinh quan tâm */
  interestedMajors: InterestedMajor[];
  /** Nền tảng MXH học sinh quan tâm / tương tác với trường */
  socialMediaInterests: SchoolSocialMediaInterest[];
  notes?: string;
};

export type SocialMediaPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "zalo"
  | "linkedin"
  | "threads";

export const SOCIAL_MEDIA_PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  zalo: "Zalo",
  linkedin: "LinkedIn",
  threads: "Threads",
};

export type SocialMediaEngagementLevel = "high" | "medium" | "low" | "none";

export const SOCIAL_ENGAGEMENT_LABELS: Record<SocialMediaEngagementLevel, string> = {
  high: "Tích cực",
  medium: "Trung bình",
  low: "Thấp",
  none: "Chưa có",
};

export type SchoolSocialMediaInterest = {
  platform: SocialMediaPlatform;
  isFollowing: boolean;
  engagementLevel: SocialMediaEngagementLevel;
  handle?: string;
  lastActivityAt?: number;
  /** Hành động gần đây với trang trường */
  recentActivities: string[];
};

/** Loại interaction — Student (1) ↔ (N) Interaction */
export type InteractionType =
  | "conversation"
  | "event_attendance"
  | "form_submission"
  | "phone_call"
  | "email"
  | "application_submission"
  | "payment";

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  conversation: "Hội thoại",
  event_attendance: "Tham gia sự kiện",
  form_submission: "Nộp biểu mẫu",
  phone_call: "Cuộc gọi",
  email: "Thư điện tử",
  application_submission: "Nộp hồ sơ",
  payment: "Thanh toán",
};

/** IntentType nhóm các Intent */
export type IntentType =
  | "admission"
  | "academic"
  | "financial"
  | "career"
  | "campus_life"
  | "support";

export const INTENT_TYPE_LABELS: Record<IntentType, string> = {
  admission: "Tuyển sinh",
  academic: "Học thuật",
  financial: "Tài chính",
  career: "Nghề nghiệp",
  campus_life: "Đời sống sinh viên",
  support: "Hỗ trợ",
};

export type IntentImportance = "very_high" | "high" | "medium";

export const INTENT_IMPORTANCE_LABELS: Record<IntentImportance, string> = {
  very_high: "Rất cao",
  high: "Cao",
  medium: "Trung bình",
};

export type IntentKey =
  | "admission_inquiry"
  | "eligibility_check"
  | "scholarship_inquiry"
  | "tuition_inquiry"
  | "application_submission"
  | "enrollment_inquiry"
  | "career_exploration"
  | "major_inquiry"
  | "major_comparison"
  | "university_comparison"
  | "event_registration"
  | "campus_visit_inquiry"
  | "student_life_inquiry"
  | "international_program_inquiry"
  | "complaint_support";

export type IntentDefinition = {
  key: IntentKey;
  label: string;
  intentType: IntentType;
  importance: IntentImportance;
  engagementPoints: number;
};

export type DetectedIntent = {
  key: IntentKey;
  label: string;
  intentType: IntentType;
  importance: IntentImportance;
  detectedAt: number;
  sourceInteractionId: string;
  sourceType: InteractionType;
  confidence?: number;
};

export type StudentInteraction = {
  id: string;
  type: InteractionType;
  title: string;
  summary: string;
  occurredAt: number;
  channel?: string;
  intents?: IntentKey[];
  metadata?: Record<string, string>;
};

export type StudentEvent = {
  id: string;
  name: string;
  type: "open_day" | "webinar" | "campus_tour" | "workshop" | "info_session";
  attendedAt: number;
  status: "registered" | "attended" | "no_show";
};

export const EVENT_TYPE_LABELS: Record<StudentEvent["type"], string> = {
  open_day: "Ngày hội tuyển sinh",
  webinar: "Hội thảo trực tuyến",
  campus_tour: "Tham quan campus",
  workshop: "Workshop",
  info_session: "Buổi giới thiệu",
};

export const EVENT_STATUS_LABELS: Record<StudentEvent["status"], string> = {
  registered: "Đã đăng ký",
  attended: "Đã tham dự",
  no_show: "Vắng mặt",
};

/** Sự kiện gợi ý phù hợp với hồ sơ học sinh */
export type SuggestedEvent = {
  id: string;
  name: string;
  type: StudentEvent["type"];
  startsAt: number;
  /** Điểm phù hợp 0–100 */
  matchScore: number;
  matchReason: string;
};

export type LeadScoreTier = "hot" | "warm" | "cold";

export const LEAD_TIER_LABELS: Record<LeadScoreTier, string> = {
  hot: "Khách hàng tiềm năng cao",
  warm: "Tiềm năng trung bình",
  cold: "Cần nuôi dưỡng thêm",
};

export type ScoreBreakdownItem = {
  label: string;
  points: number;
  category: "fit" | "engagement";
};

export const SCORE_CATEGORY_LABELS: Record<ScoreBreakdownItem["category"], string> = {
  fit: "Phù hợp",
  engagement: "Tương tác",
};

export type LeadScore = {
  fitScore: number;
  engagementScore: number;
  totalScore: number;
  maxScore: number;
  tier: LeadScoreTier;
  isPotentialCustomer: boolean;
  breakdown: ScoreBreakdownItem[];
  trend: { date: string; score: number }[];
  lastUpdated: number;
};

export type ApiList<T> = T[] | { items: T[] };

export type StudentDashboardData = {
  student: Student;
  interactions: StudentInteraction[];
  events: StudentEvent[];
  suggestedEvents: SuggestedEvent[];
  intents: DetectedIntent[];
  leadScore: LeadScore;
};

export type ApiStudentDashboardData = {
  student: Student;
  interactions: ApiList<StudentInteraction>;
  events: ApiList<StudentEvent>;
  suggestedEvents: ApiList<SuggestedEvent>;
  intents: ApiList<DetectedIntent>;
  leadScore: LeadScore;
};
