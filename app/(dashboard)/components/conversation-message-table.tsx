import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PanelShell } from "./panel-shell";
import { formatRelativeTime, getMockConversationInsights } from "./mock-data";
import type { ChatwootAppContext } from "./types";

const ROLE_LABEL: Record<string, string> = {
  contact: "Khách hàng",
  agent: "Nhân viên",
  system: "Hệ thống",
};

const ROLE_STYLE: Record<string, string> = {
  contact: "border-cyan-300 bg-cyan-50 text-cyan-800",
  agent: "border-blue-300 bg-blue-50 text-blue-800",
  system: "border-neutral-300 bg-neutral-50 text-neutral-600",
};

export function ConversationMessageTable({ context }: { context: ChatwootAppContext }) {
  const insights = getMockConversationInsights(context);
  const rows = insights.messageHistory;

  return (
    <PanelShell
      title="Lịch sử tin nhắn"
      subtitle={`Hội thoại #${context.conversation.id} · ${rows.length} tin nhắn`}
    >
      <div className="border-t border-neutral-200">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
              <TableHead className="h-8 w-10 border-neutral-200 text-[10px]">#</TableHead>
              <TableHead className="h-8 border-neutral-200 text-[10px]">Người gửi</TableHead>
              <TableHead className="h-8 border-neutral-200 text-[10px]">Nội dung</TableHead>
              <TableHead className="h-8 border-neutral-200 text-[10px]">Vai trò</TableHead>
              <TableHead className="h-8 border-neutral-200 text-[10px]">Kênh</TableHead>
              <TableHead className="h-8 border-neutral-200 text-right text-[10px]">Thời gian</TableHead>
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
                <TableRow key={row.id} className="border-neutral-200 text-xs">
                  <TableCell className="border-neutral-200 py-2 font-mono text-[10px] text-muted-foreground">
                    {row.id}
                  </TableCell>
                  <TableCell className="border-neutral-200 py-2 font-medium">{row.sender}</TableCell>
                  <TableCell className="max-w-[180px] truncate border-neutral-200 py-2 text-muted-foreground">
                    {row.content}
                  </TableCell>
                  <TableCell className="border-neutral-200 py-2">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] font-medium", ROLE_STYLE[row.role] ?? ROLE_STYLE.system)}
                    >
                      {ROLE_LABEL[row.role] ?? row.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-neutral-200 py-2 text-muted-foreground">{row.channel}</TableCell>
                  <TableCell className="border-neutral-200 py-2 text-right text-[10px] text-muted-foreground">
                    {formatRelativeTime(row.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PanelShell>
  );
}
