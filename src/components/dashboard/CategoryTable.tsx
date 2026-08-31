"use client";

import { DataTable } from "@/components/dashboard/DataTable";

type CategoryRow = { id: string; label: string; productCount: number };

export function CategoryTable({ categories }: { categories: CategoryRow[] }) {
  return (
    <DataTable
      data={categories}
      rowKey={(row) => row.id}
      searchKeys={(row) => row.label}
      searchPlaceholder="Search categories"
      columns={[
        { key: "label", header: "Category", sortValue: (row) => row.label },
        { key: "productCount", header: "Products", sortValue: (row) => row.productCount },
      ]}
    />
  );
}
