export type ChatwootContact = {
  id: number;
  name: string;
  email?: string | null;
  phone_number?: string | null;
  identifier?: string | null;
  thumbnail?: string | null;
  availability_status?: string;
  last_activity_at?: number;
  additional_attributes?: {
    company_name?: string;
    description?: string;
  };
};

export type ChatwootAgent = {
  id: number;
  name: string;
  email?: string;
  available_name?: string;
  thumbnail?: string | null;
};

export type ChatwootMessage = {
  id: number;
  content: string;
  message_type: number;
  created_at: number;
  private?: boolean;
  sender?: {
    name?: string;
    type?: string;
  };
};

export type ChatwootConversation = {
  id: number;
  status: string;
  unread_count?: number;
  labels?: string[];
  timestamp?: number;
  meta?: {
    channel?: string;
    sender?: ChatwootContact;
    assignee?: ChatwootAgent | null;
  };
  messages?: ChatwootMessage[];
};

export type ChatwootAppContext = {
  conversation: ChatwootConversation;
  contact: ChatwootContact;
  currentAgent?: ChatwootAgent;
};

import type { LucideIcon } from "lucide-react";

export type ContactStat = {
  label: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  description?: string;
  icon: LucideIcon;
};

export type ConversationMessageRow = {
  id: number;
  sender: string;
  role: "contact" | "agent" | "system";
  content: string;
  channel: string;
  createdAt: number;
};

export type ConversationInsights = {
  stats: ContactStat[];
  /** Grouped bar: tin nhắn khách vs agent theo thời gian */
  messagesByPeriod: { period: string; contact: number; agent: number }[];
  /** Line: thời gian phản hồi từng lượt (phút) */
  responseTimePerTurn: { turn: string; minutes: number }[];
  /** Area: volume tin nhắn trong hội thoại theo ngày */
  activityVolume: { day: string; messages: number }[];
  /** Phân bổ tin nhắn khách / agent */
  messageShare: { key: string; label: string; value: number }[];
  /** Phân bổ loại nội dung (text, note, auto…) */
  contentTypeShare: { key: string; label: string; value: number }[];
  messageHistory: ConversationMessageRow[];
  orders: { id: string; title: string; amount: string; status: string }[];
};
