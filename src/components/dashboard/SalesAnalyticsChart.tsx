"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SALES_ANALYTICS } from "@/data/dashboard";
import { useDelayedReady } from "@/hooks/use-delayed-ready";

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-popover-foreground">{label}</p>
      <p className="text-muted-foreground">${payload[0].value}k in sales</p>
    </div>
  );
}

export function SalesAnalyticsChart() {
  const ready = useDelayedReady(1100);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Sales Analytics</CardTitle>
        <span className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground">2023</span>
      </CardHeader>
      <CardContent>
        {!ready ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_ANALYTICS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  domain={[10, 60]}
                  ticks={[10, 20, 30, 40, 50, 60]}
                  tickFormatter={(v) => `${v}k`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#salesFill)"
                  dot={{ r: 3, fill: "var(--color-chart-1)", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
