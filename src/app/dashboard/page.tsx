"use client";

import { useState } from "react";
import { GreetingBar } from "@/components/dashboard/GreetingBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { BestSeller } from "@/components/dashboard/BestSeller";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SalesAnalyticsChart } from "@/components/dashboard/SalesAnalyticsChart";
import { SalesByCountries } from "@/components/dashboard/SalesByCountries";
import type { DateRangeId } from "@/data/dashboard";

export default function DashboardPage() {
  const [range, setRange] = useState<DateRangeId>("this-week");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <GreetingBar range={range} onRangeChange={setRange} onRefresh={() => setRefreshKey((k) => k + 1)} />
      <StatCards range={range} refreshKey={refreshKey} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BestSeller />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesAnalyticsChart />
        </div>
        <div className="lg:col-span-1">
          <SalesByCountries />
        </div>
      </div>
    </div>
  );
}
