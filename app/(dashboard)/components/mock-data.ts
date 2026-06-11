import type { LucideIcon } from "lucide-react";
import { Clock3Icon, InboxIcon, MessageCircleIcon, TrendingUpIcon } from "lucide-react";

export type ConversationStatus = "open" | "pending" | "resolved";

export type DashboardStat = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  description: string;
};

export type DashboardConversation = {
  id: string;
  customer: string;
  channel: string;
  status: ConversationStatus;
  agent: string;
  updatedAt: string;
};

export type DashboardChannel = {
  name: string;
  value: number;
  total: number;
};

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    title: "Đang mở",
    value: "128",
    change: "+12%",
    icon: InboxIcon,
    description: "so với tuần trước",
  },
  {
    title: "Chờ phản hồi",
    value: "34",
    change: "-8%",
    icon: MessageCircleIcon,
    description: "cần xử lý trong 1h",
  },
  {
    title: "Đã giải quyết hôm nay",
    value: "89",
    change: "+24%",
    icon: TrendingUpIcon,
    description: "mục tiêu 100",
  },
  {
    title: "Thời gian phản hồi TB",
    value: "4m 12s",
    change: "-18%",
    icon: Clock3Icon,
    description: "trung bình 7 ngày",
  },
];

export const DASHBOARD_CONVERSATIONS: DashboardConversation[] = [
  {
    id: "#1024",
    customer: "Nguyễn Văn A",
    channel: "Live chat",
    status: "open",
    agent: "Trần Thị B",
    updatedAt: "2 phút trước",
  },
  {
    id: "#1023",
    customer: "Lê Minh C",
    channel: "Email",
    status: "pending",
    agent: "Chưa gán",
    updatedAt: "15 phút trước",
  },
  {
    id: "#1022",
    customer: "Phạm Thu D",
    channel: "Facebook",
    status: "resolved",
    agent: "Hoàng Văn E",
    updatedAt: "1 giờ trước",
  },
  {
    id: "#1021",
    customer: "Võ Thị F",
    channel: "WhatsApp",
    status: "open",
    agent: "Trần Thị B",
    updatedAt: "2 giờ trước",
  },
];

export const DASHBOARD_CHANNELS: DashboardChannel[] = [
  { name: "Live chat", value: 42, total: 128 },
  { name: "Email", value: 28, total: 128 },
  { name: "Facebook", value: 22, total: 128 },
  { name: "WhatsApp", value: 18, total: 128 },
];

export const DASHBOARD_CONVERSATIONS_BY_MONTH = [
  { month: "T1", conversations: 186, resolved: 142 },
  { month: "T2", conversations: 305, resolved: 248 },
  { month: "T3", conversations: 237, resolved: 201 },
  { month: "T4", conversations: 273, resolved: 230 },
  { month: "T5", conversations: 209, resolved: 178 },
  { month: "T6", conversations: 314, resolved: 267 },
];

export const DASHBOARD_RESPONSE_TIME_TREND = [
  { month: "T1", minutes: 6.2 },
  { month: "T2", minutes: 5.8 },
  { month: "T3", minutes: 5.1 },
  { month: "T4", minutes: 4.9 },
  { month: "T5", minutes: 4.5 },
  { month: "T6", minutes: 4.2 },
];

export const DASHBOARD_WEEKLY_VOLUME = [
  { day: "T2", open: 45, resolved: 38 },
  { day: "T3", open: 52, resolved: 41 },
  { day: "T4", open: 48, resolved: 44 },
  { day: "T5", open: 61, resolved: 53 },
  { day: "T6", open: 55, resolved: 49 },
  { day: "T7", open: 42, resolved: 39 },
  { day: "CN", open: 36, resolved: 34 },
];

export const DASHBOARD_CHANNEL_SHARE = [
  { channel: "livechat", label: "Live chat", value: 42 },
  { channel: "email", label: "Email", value: 28 },
  { channel: "facebook", label: "Facebook", value: 22 },
  { channel: "whatsapp", label: "WhatsApp", value: 18 },
];

export const DASHBOARD_AGENT_PERFORMANCE = [
  { agent: "Trần Thị B", resolved: 48, pending: 6 },
  { agent: "Hoàng Văn E", resolved: 41, pending: 4 },
  { agent: "Nguyễn Văn G", resolved: 35, pending: 8 },
  { agent: "Lê Thị H", resolved: 29, pending: 5 },
];
