import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DASHBOARD_CONVERSATIONS, type ConversationStatus } from "./mock-data";

function StatusBadge({ status }: { status: ConversationStatus }) {
  if (status === "open") return <Badge>Đang mở</Badge>;
  if (status === "pending") return <Badge variant="secondary">Chờ xử lý</Badge>;
  return <Badge variant="outline">Đã đóng</Badge>;
}

export function DashboardRecentConversations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hội thoại gần đây</CardTitle>
        <CardDescription>Danh sách hội thoại cần theo dõi trong ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Kênh</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Cập nhật</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DASHBOARD_CONVERSATIONS.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.customer}</TableCell>
                <TableCell>{item.channel}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>{item.agent}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
