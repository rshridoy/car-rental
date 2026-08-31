import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductsTable } from "@/components/dashboard/ProductsTable";

export default function ManageStockPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Manage Stock" description="Current stock levels for every listing in the fleet." />
      <ProductsTable emptyTitle="No products match your filters" emptyDescription="Try a different search term or category." />
    </div>
  );
}
