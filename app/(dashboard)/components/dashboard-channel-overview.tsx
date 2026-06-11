import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { DASHBOARD_CHANNELS } from "./mock-data";

export function DashboardChannelOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bổ theo kênh</CardTitle>
        <CardDescription>Tỷ lệ hội thoại đang mở theo từng kênh</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DASHBOARD_CHANNELS.map(({ name, value, total }) => {
          const percent = Math.round((value / total) * 100);

          return (
            <Progress key={name} value={percent} className="w-full flex-col gap-1.5">
              <ProgressLabel className="flex w-full items-center justify-between text-sm">
                <span>{name}</span>
                <span className="text-muted-foreground tabular-nums">
                  {value} ({percent}%)
                </span>
              </ProgressLabel>
            </Progress>
          );
        })}
      </CardContent>
    </Card>
  );
}
