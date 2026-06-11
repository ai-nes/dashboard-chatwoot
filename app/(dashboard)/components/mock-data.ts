import {
  Clock3Icon,
  MessageCircleIcon,
  MessagesSquareIcon,
  StarIcon,
  TimerIcon,
} from "lucide-react";

import { formatChannel } from "./mock-data-utils";
import { buildMessagesByPeriod } from "./messages-chart-data";
import type { ChatwootAppContext, ContactStat, ConversationInsights } from "./types";

export { formatChannel, formatRelativeTime } from "./mock-data-utils";

export const MOCK_CHATWOOT_CONTEXT: ChatwootAppContext = {
  contact: {
    id: 1001,
    name: "Van Dai",
    email: "vandai@example.com",
    phone_number: "+84 901 234 567",
    identifier: "van-dai-001",
    thumbnail: "",
    availability_status: "online",
    last_activity_at: Math.floor(Date.now() / 1000) - 300,
    additional_attributes: {
      company_name: "FPT Software",
      description: "Khách hàng doanh nghiệp — quan tâm gói premium",
    },
  },
  conversation: {
    id: 5,
    status: "open",
    unread_count: 2,
    labels: ["vip", "support"],
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    meta: {
      channel: "Channel::WebWidget",
      sender: {
        id: 1001,
        name: "Van Dai",
        email: "vandai@example.com",
      },
      assignee: {
        id: 42,
        name: "Agent Minh",
        email: "agent@chatwoot.com",
        available_name: "Minh",
      },
    },
    messages: [
      {
        id: 1,
        content: "Chào shop, mình muốn hỏi về gói dịch vụ premium",
        message_type: 0,
        created_at: Math.floor(Date.now() / 1000) - 1800,
        sender: { name: "Van Dai", type: "contact" },
      },
      {
        id: 2,
        content: "Dạ chào anh Van Dai, em hỗ trợ anh ngay ạ!",
        message_type: 1,
        created_at: Math.floor(Date.now() / 1000) - 1500,
        sender: { name: "Agent Minh", type: "user" },
      },
      {
        id: 3,
        content: "Gói premium có hỗ trợ tích hợp API không?",
        message_type: 0,
        created_at: Math.floor(Date.now() / 1000) - 900,
        sender: { name: "Van Dai", type: "contact" },
      },
      {
        id: 4,
        content: "Có ạ, gói premium hỗ trợ REST API và webhook đầy đủ.",
        message_type: 1,
        created_at: Math.floor(Date.now() / 1000) - 600,
        private: false,
        sender: { name: "Agent Minh", type: "user" },
      },
    ],
  },
  currentAgent: {
    id: 42,
    name: "Agent Minh",
    email: "agent@chatwoot.com",
  },
};

const MOCK_INSIGHTS: ConversationInsights = {
  stats: [
    {
      label: "Tin nhắn",
      value: "4",
      change: "+2",
      changeDirection: "up",
      description: "so với TB khách hàng",
      icon: MessagesSquareIcon,
    },
    {
      label: "Phản hồi TB",
      value: "5m 12s",
      change: "-18%",
      changeDirection: "up",
      description: "trung bình agent",
      icon: Clock3Icon,
    },
    {
      label: "Thời lượng",
      value: "45 phút",
      change: "Đang mở",
      changeDirection: "neutral",
      description: "từ lúc bắt đầu",
      icon: TimerIcon,
    },
    {
      label: "CSAT",
      value: "4.5",
      change: "+12%",
      changeDirection: "up",
      description: "mục tiêu 5",
      icon: StarIcon,
    },
  ],
  messagesByPeriod: [
    { period: "09:00", contact: 1, agent: 0 },
    { period: "09:15", contact: 1, agent: 1 },
    { period: "09:30", contact: 1, agent: 1 },
    { period: "10:00", contact: 1, agent: 2 },
    { period: "10:30", contact: 0, agent: 1 },
    { period: "11:00", contact: 1, agent: 1 },
  ],
  responseTimePerTurn: [
    { turn: "L1", minutes: 8.5 },
    { turn: "L2", minutes: 5.0 },
    { turn: "L3", minutes: 3.2 },
    { turn: "L4", minutes: 2.1 },
  ],
  activityVolume: [
    { day: "T2", messages: 0 },
    { day: "T3", messages: 0 },
    { day: "T4", messages: 0 },
    { day: "T5", messages: 0 },
    { day: "T6", messages: 0 },
    { day: "T7", messages: 0 },
    { day: "CN", messages: 4 },
  ],
  messageShare: [
    { key: "contact", label: "Khách hàng", value: 2 },
    { key: "agent", label: "Agent", value: 2 },
  ],
  contentTypeShare: [
    { key: "text", label: "Tin nhắn", value: 4 },
    { key: "note", label: "Ghi chú nội bộ", value: 0 },
    { key: "auto", label: "Tự động", value: 0 },
  ],
  messageHistory: [
    {
      id: 4,
      sender: "Agent Minh",
      role: "agent",
      content: "Có ạ, gói premium hỗ trợ REST API và webhook đầy đủ.",
      channel: "Live chat",
      createdAt: Math.floor(Date.now() / 1000) - 600,
    },
    {
      id: 3,
      sender: "Van Dai",
      role: "contact",
      content: "Gói premium có hỗ trợ tích hợp API không?",
      channel: "Live chat",
      createdAt: Math.floor(Date.now() / 1000) - 900,
    },
    {
      id: 2,
      sender: "Agent Minh",
      role: "agent",
      content: "Dạ chào anh Van Dai, em hỗ trợ anh ngay ạ!",
      channel: "Live chat",
      createdAt: Math.floor(Date.now() / 1000) - 1500,
    },
    {
      id: 1,
      sender: "Van Dai",
      role: "contact",
      content: "Chào shop, mình muốn hỏi về gói dịch vụ premium",
      channel: "Live chat",
      createdAt: Math.floor(Date.now() / 1000) - 1800,
    },
  ],
  orders: [
    { id: "ORD-2401", title: "Gói Standard", amount: "990.000đ", status: "completed" },
    { id: "ORD-2588", title: "Gói Premium (thử)", amount: "2.490.000đ", status: "pending" },
  ],
};

export function getMockConversationInsights(context: ChatwootAppContext): ConversationInsights {
  const messages = context.conversation.messages ?? [];
  const channel = formatChannel(context.conversation.meta?.channel);
  const contactCount = messages.filter((m) => m.message_type === 0).length;
  const agentCount = messages.filter((m) => m.message_type === 1).length;

  if (context.contact.id === 1001 && context.conversation.id === 5) {
    const derivedPeriods = buildMessagesByPeriod(messages);
    return {
      ...MOCK_INSIGHTS,
      stats: MOCK_INSIGHTS.stats.map((stat, i) => {
        if (i === 0) return { ...stat, value: String(messages.length || 4) };
        return stat;
      }),
      messagesByPeriod:
        derivedPeriods.length >= 2 ? derivedPeriods : MOCK_INSIGHTS.messagesByPeriod,
      messageShare: [
        { key: "contact", label: "Khách hàng", value: contactCount || 2 },
        { key: "agent", label: "Agent", value: agentCount || 2 },
      ],
    };
  }

  const fallbackStats: ContactStat[] = [
    {
      label: "Tin nhắn",
      value: String(messages.length),
      change: messages.length > 0 ? "+1" : "0",
      changeDirection: messages.length > 0 ? "up" : "neutral",
      description: "trong hội thoại này",
      icon: MessagesSquareIcon,
    },
    {
      label: "Phản hồi TB",
      value: "—",
      change: "—",
      changeDirection: "neutral",
      description: "chưa đủ dữ liệu",
      icon: Clock3Icon,
    },
    {
      label: "Thời lượng",
      value: "—",
      change: context.conversation.status === "open" ? "Đang mở" : "Đã đóng",
      changeDirection: "neutral",
      description: "từ lúc bắt đầu",
      icon: TimerIcon,
    },
    {
      label: "CSAT",
      value: "—",
      change: "—",
      changeDirection: "neutral",
      description: "chưa khảo sát",
      icon: StarIcon,
    },
  ];

  return {
    stats: fallbackStats,
    messagesByPeriod: buildMessagesByPeriod(messages).length
      ? buildMessagesByPeriod(messages)
      : [{ period: "—", contact: contactCount, agent: agentCount }],
    responseTimePerTurn: [{ turn: "L1", minutes: 0 }],
    activityVolume: [{ day: "CN", messages: messages.length }],
    messageShare: [
      { key: "contact", label: "Khách hàng", value: contactCount },
      { key: "agent", label: "Agent", value: agentCount },
    ],
    contentTypeShare: [{ key: "text", label: "Tin nhắn", value: messages.length }],
    messageHistory: messages
      .map((m) => ({
        id: m.id,
        sender: m.sender?.name ?? "Unknown",
        role: (m.message_type === 1 ? "agent" : "contact") as "contact" | "agent",
        content: m.content,
        channel,
        createdAt: m.created_at,
      }))
      .sort((a, b) => b.createdAt - a.createdAt),
    orders: [],
  };
}

/** @deprecated use getMockConversationInsights */
export function getMockContactInsights(contactId: number) {
  return getMockConversationInsights({
    ...MOCK_CHATWOOT_CONTEXT,
    contact: { ...MOCK_CHATWOOT_CONTEXT.contact, id: contactId },
  });
}
