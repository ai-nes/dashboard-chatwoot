import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRelativeTime, getMockConversationInsights } from "./mock-data";
import type { ChatwootAppContext } from "./types";

const ROLE_LABEL: Record<string, string> = {
  contact: "Khách hàng",
  agent: "Agent",
  system: "Hệ thống",
};

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  contact: "outline",
  agent: "default",
  system: "secondary",
};

export function ConversationMessageTable({ context }: { context: ChatwootAppContext }) {
  const insights = getMockConversationInsights(context);
  const rows = insights.messageHistory;

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/50 px-3 py-2.5">
        <h3 className="text-xs font-semibold">Lịch sử tin nhắn</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Hội thoại #{context.conversation.id} · {rows.length} tin nhắn
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 w-10 text-[10px]">#</TableHead>
            <TableHead className="h-8 text-[10px]">Người gửi</TableHead>
            <TableHead className="h-8 text-[10px]">Nội dung</TableHead>
            <TableHead className="h-8 text-[10px]">Vai trò</TableHead>
            <TableHead className="h-8 text-[10px]">Kênh</TableHead>
            <TableHead className="h-8 text-right text-[10px]">Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-xs text-muted-foreground">
                Chưa có tin nhắn
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} className="text-xs">
                <TableCell className="py-2 font-mono text-[10px] text-muted-foreground">
                  {row.id}
                </TableCell>
                <TableCell className="py-2 font-medium">{row.sender}</TableCell>
                <TableCell className="max-w-[180px] truncate py-2 text-muted-foreground">
                  {row.content}
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant={ROLE_VARIANT[row.role] ?? "secondary"} className="text-[10px]">
                    {ROLE_LABEL[row.role] ?? row.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-muted-foreground">{row.channel}</TableCell>
                <TableCell className="py-2 text-right text-[10px] text-muted-foreground">
                  {formatRelativeTime(row.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
