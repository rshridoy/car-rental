import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductsTable, AddProductLink } from "@/components/dashboard/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="The full fleet catalog — the same data that powers the customer-facing site."
        action={<AddProductLink />}
      />
      <ProductsTable emptyTitle="No products match your filters" emptyDescription="Try a different search term or category." />
    </div>
  );
}
