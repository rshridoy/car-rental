"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { WARRANTIES } from "@/data/admin";

export default function WarrantiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Warranties" description="Protection plans customers can add to a booking." />
      <DataTable
        data={WARRANTIES}
        rowKey={(row) => row.id}
        searchKeys={(row) => row.name}
        searchPlaceholder="Search warranties"
        columns={[
          { key: "name", header: "Plan", sortValue: (row) => row.name },
          {
            key: "price",
            header: "Price",
            sortValue: (row) => row.price,
            render: (row) => (row.price === 0 ? "Included" : `$${row.price.toFixed(2)} / booking`),
          },
          { key: "description", header: "Coverage" },
        ]}
      />
    </div>
  );
}
