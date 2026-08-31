import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductsTable } from "@/components/dashboard/ProductsTable";

export default function ExpiredProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Expired Products"
        description="Listings whose registration, inspection, or insurance window has lapsed — pull these from sale until renewed."
      />
      <ProductsTable
        stockFilter="expired"
        emptyTitle="Nothing expired"
        emptyDescription="Every listing in the fleet is currently within its valid registration window."
      />
    </div>
  );
}
