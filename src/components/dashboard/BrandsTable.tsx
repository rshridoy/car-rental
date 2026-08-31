"use client";

import { DataTable } from "@/components/dashboard/DataTable";

type BrandRow = { id: string; name: string; productCount: number };

export function BrandsTable({ brands }: { brands: BrandRow[] }) {
  return (
    <DataTable
      data={brands}
      rowKey={(row) => row.id}
      searchKeys={(row) => row.name}
      searchPlaceholder="Search brands"
      columns={[
        { key: "name", header: "Brand", sortValue: (row) => row.name },
        { key: "productCount", header: "Products", sortValue: (row) => row.productCount },
      ]}
    />
  );
}
