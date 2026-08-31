import { PageHeader } from "@/components/dashboard/PageHeader";
import { BrandsTable } from "@/components/dashboard/BrandsTable";
import { getBrandSummary } from "@/data/admin";

// Reads the live, in-memory CAR_DEALS array — must not be frozen into a
// build-time static snapshot, since "Create Product" mutates it at runtime.
export const dynamic = "force-dynamic";

export default function BrandsPage() {
  const brands = getBrandSummary();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Brands" description="Manufacturers represented in the fleet, derived live from Products." />
      <BrandsTable brands={brands} />
    </div>
  );
}
