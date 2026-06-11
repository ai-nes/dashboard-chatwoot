import { getIntentDefinition } from "./student-intents";
import type {
  DetectedIntent,
  LeadScore,
  LeadScoreTier,
  ScoreBreakdownItem,
  Student,
  StudentEvent,
  StudentInteraction,
} from "./student-types";
import { INTERACTION_TYPE_LABELS } from "./student-types";

const MAX_FIT = 40;
const MAX_ENGAGEMENT = 60;
const MAX_TOTAL = MAX_FIT + MAX_ENGAGEMENT;

const TIER_THRESHOLDS: { tier: LeadScoreTier; min: number }[] = [
  { tier: "hot", min: 75 },
  { tier: "warm", min: 45 },
  { tier: "cold", min: 0 },
];

const INTERACTION_POINTS: Record<string, number> = {
  conversation: 3,
  event_attendance: 8,
  form_submission: 10,
  phone_call: 6,
  email: 4,
  application_submission: 15,
  payment: 20,
};

function getTier(score: number): LeadScoreTier {
  for (const { tier, min } of TIER_THRESHOLDS) {
    if (score >= min) return tier;
  }
  return "cold";
}

function scoreFit(student: Student): { score: number; breakdown: ScoreBreakdownItem[] } {
  const breakdown: ScoreBreakdownItem[] = [];
  let score = 0;

  if (student.interestedPrograms.length > 0) {
    const pts = Math.min(student.interestedPrograms.length * 8, 16);
    score += pts;
    breakdown.push({
      label: `Quan tâm ${student.interestedPrograms.length} chương trình`,
      points: pts,
      category: "fit",
    });
  }

  const latestGrade = student.academicRecords.at(-1);
  if (latestGrade) {
    const gradePts =
      latestGrade.grade === "Gioi" ? 12 : latestGrade.grade === "Kha" ? 8 : latestGrade.grade === "Trung binh" ? 4 : 0;
    if (gradePts > 0) {
      score += gradePts;
      breakdown.push({
        label: `Học lực ${latestGrade.year}: ${latestGrade.grade}`,
        points: gradePts,
        category: "fit",
      });
    }
  }

  if (student.languages.length > 0) {
    const pts = Math.min(student.languages.length * 4, 12);
    score += pts;
    breakdown.push({
      label: `${student.languages.length} chứng chỉ ngoại ngữ`,
      points: pts,
      category: "fit",
    });
  }

  if (student.cohort) {
    score += 6;
    breakdown.push({ label: `Niên khóa ${student.cohort}`, points: 6, category: "fit" });
  }

  return { score: Math.min(score, MAX_FIT), breakdown };
}

function scoreEngagement(
  interactions: StudentInteraction[],
  intents: DetectedIntent[],
  events: StudentEvent[],
): { score: number; breakdown: ScoreBreakdownItem[] } {
  const breakdown: ScoreBreakdownItem[] = [];
  let score = 0;

  const typeCounts = new Map<string, number>();
  for (const interaction of interactions) {
    typeCounts.set(interaction.type, (typeCounts.get(interaction.type) ?? 0) + 1);
  }

  for (const [type, count] of typeCounts) {
    const base = INTERACTION_POINTS[type] ?? 2;
    const pts = Math.min(base * count, base * 3);
    score += pts;
    const label = INTERACTION_TYPE_LABELS[type as keyof typeof INTERACTION_TYPE_LABELS] ?? type;
    breakdown.push({
      label: `${count}× ${label}`,
      points: pts,
      category: "engagement",
    });
  }

  const seenIntents = new Set<string>();
  for (const intent of intents) {
    if (seenIntents.has(intent.key)) continue;
    seenIntents.add(intent.key);
    const def = getIntentDefinition(intent.key);
    score += def.engagementPoints;
    breakdown.push({
      label: `Ý định: ${def.label}`,
      points: def.engagementPoints,
      category: "engagement",
    });
  }

  const attended = events.filter((e) => e.status === "attended").length;
  if (attended > 0) {
    const pts = Math.min(attended * 6, 18);
    score += pts;
    breakdown.push({
      label: `${attended} sự kiện đã tham dự`,
      points: pts,
      category: "engagement",
    });
  }

  const recentMs = 7 * 24 * 60 * 60 * 1000;
  const recentCount = interactions.filter((i) => Date.now() - i.occurredAt * 1000 < recentMs).length;
  if (recentCount >= 2) {
    const pts = 8;
    score += pts;
    breakdown.push({
      label: "Hoạt động tích cực 7 ngày qua",
      points: pts,
      category: "engagement",
    });
  }

  return { score: Math.min(score, MAX_ENGAGEMENT), breakdown };
}

function buildTrend(totalScore: number): LeadScore["trend"] {
  const offsets = [28, 21, 14, 7, 0];
  const deltas = [18, 12, 8, 4, 0];
  return offsets.map((daysAgo, i) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      date: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      score: Math.max(0, Math.min(MAX_TOTAL, totalScore - deltas[i])),
    };
  });
}

export function calculateLeadScore(
  student: Student,
  interactions: StudentInteraction[],
  intents: DetectedIntent[],
  events: StudentEvent[],
): LeadScore {
  const fit = scoreFit(student);
  const engagement = scoreEngagement(interactions, intents, events);
  const totalScore = fit.score + engagement.score;
  const tier = getTier(totalScore);

  return {
    fitScore: fit.score,
    engagementScore: engagement.score,
    totalScore,
    maxScore: MAX_TOTAL,
    tier,
    isPotentialCustomer: tier === "hot" || tier === "warm",
    breakdown: [...fit.breakdown, ...engagement.breakdown].sort((a, b) => b.points - a.points),
    trend: buildTrend(totalScore),
    lastUpdated: Math.floor(Date.now() / 1000),
  };
}
