/** Accent palette — mỗi section một màu để tránh UI 1 tông */
export type DashboardAccent =
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "orange";

export const ACCENT_STYLES: Record<
  DashboardAccent,
  {
    stripe: string;
    header: string;
    icon: string;
    badge: string;
    bar: string;
    card: string;
    change: string;
  }
> = {
  blue: {
    stripe: "bg-blue-500",
    header: "bg-gradient-to-r from-blue-50/90 to-transparent",
    icon: "text-blue-600 bg-blue-100",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    bar: "bg-blue-500",
    card: "border-blue-100/80 bg-gradient-to-br from-blue-50/50 to-card",
    change: "text-blue-600",
  },
  violet: {
    stripe: "bg-violet-500",
    header: "bg-gradient-to-r from-violet-50/90 to-transparent",
    icon: "text-violet-600 bg-violet-100",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    bar: "bg-violet-500",
    card: "border-violet-100/80 bg-gradient-to-br from-violet-50/50 to-card",
    change: "text-violet-600",
  },
  emerald: {
    stripe: "bg-emerald-500",
    header: "bg-gradient-to-r from-emerald-50/90 to-transparent",
    icon: "text-emerald-600 bg-emerald-100",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    card: "border-emerald-100/80 bg-gradient-to-br from-emerald-50/50 to-card",
    change: "text-emerald-600",
  },
  amber: {
    stripe: "bg-amber-500",
    header: "bg-gradient-to-r from-amber-50/90 to-transparent",
    icon: "text-amber-600 bg-amber-100",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
    card: "border-amber-100/80 bg-gradient-to-br from-amber-50/50 to-card",
    change: "text-amber-600",
  },
  rose: {
    stripe: "bg-rose-500",
    header: "bg-gradient-to-r from-rose-50/90 to-transparent",
    icon: "text-rose-600 bg-rose-100",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    bar: "bg-rose-500",
    card: "border-rose-100/80 bg-gradient-to-br from-rose-50/50 to-card",
    change: "text-rose-600",
  },
  cyan: {
    stripe: "bg-cyan-500",
    header: "bg-gradient-to-r from-cyan-50/90 to-transparent",
    icon: "text-cyan-600 bg-cyan-100",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
    bar: "bg-cyan-500",
    card: "border-cyan-100/80 bg-gradient-to-br from-cyan-50/50 to-card",
    change: "text-cyan-600",
  },
  orange: {
    stripe: "bg-orange-500",
    header: "bg-gradient-to-r from-orange-50/90 to-transparent",
    icon: "text-orange-600 bg-orange-100",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    bar: "bg-orange-500",
    card: "border-orange-100/80 bg-gradient-to-br from-orange-50/50 to-card",
    change: "text-orange-600",
  },
};

import type { IntentType, InteractionType } from "./student-types";

export const INTENT_TYPE_ACCENT: Record<IntentType, DashboardAccent> = {
  admission: "rose",
  financial: "amber",
  academic: "blue",
  career: "violet",
  campus_life: "emerald",
  support: "cyan",
};

export const INTERACTION_BAR_COLORS: Record<InteractionType, string> = {
  conversation: "#2781f6",
  event_attendance: "#8b5cf6",
  form_submission: "#f59e0b",
  phone_call: "#10b981",
  email: "#06b6d4",
  application_submission: "#f43f5e",
  payment: "#f97316",
};

export const PROGRAM_BADGE_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];
