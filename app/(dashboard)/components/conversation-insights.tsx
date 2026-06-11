import { getMockConversationInsights } from "./mock-data";
import { StatCard } from "./stat-card";
import type { ChatwootAppContext } from "./types";

export function ConversationInsights({ context }: { context: ChatwootAppContext }) {
  const insights = getMockConversationInsights(context);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {insights.stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
