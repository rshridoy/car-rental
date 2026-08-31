import { LOW_STOCK_THRESHOLD } from "@/data/deals";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductsTable } from "@/components/dashboard/ProductsTable";

export default function LowStocksPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Low Stocks"
        description={`Listings at or below ${LOW_STOCK_THRESHOLD} available units — consider sourcing more of these.`}
      />
      <ProductsTable
        stockFilter="low"
        emptyTitle="Nothing low on stock"
        emptyDescription="Every listing currently has healthy availability."
      />
    </div>
  );
}
