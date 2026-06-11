import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_STATS } from "./mock-data";

export function DashboardStatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {DASHBOARD_STATS.map(({ title, value, change, icon: Icon, description }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium text-primary">{change}</span> {description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
