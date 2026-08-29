import { GreetingBar } from "@/components/dashboard/GreetingBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { BestSeller } from "@/components/dashboard/BestSeller";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SalesAnalyticsChart } from "@/components/dashboard/SalesAnalyticsChart";
import { SalesByCountries } from "@/components/dashboard/SalesByCountries";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <GreetingBar />
      <StatCards />

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
