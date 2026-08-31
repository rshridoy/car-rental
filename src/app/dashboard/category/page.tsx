import { PageHeader } from "@/components/dashboard/PageHeader";
import { CategoryTable } from "@/components/dashboard/CategoryTable";
import { getCategorySummary } from "@/data/admin";

// Reads the live, in-memory CAR_DEALS array — must not be frozen into a
// build-time static snapshot, since "Create Product" mutates it at runtime.
export const dynamic = "force-dynamic";

export default function CategoryPage() {
  const categories = getCategorySummary();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Category" description="Top-level groupings used to organize the fleet." />
      <CategoryTable categories={categories} />
    </div>
  );
}
