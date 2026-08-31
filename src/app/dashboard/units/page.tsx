"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { UNITS } from "@/data/admin";

export default function UnitsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Units" description="Billing units available when pricing a rental." />
      <DataTable
        data={UNITS}
        rowKey={(row) => row.id}
        searchKeys={(row) => row.name}
        searchPlaceholder="Search units"
        columns={[
          { key: "name", header: "Unit", sortValue: (row) => row.name },
          { key: "description", header: "Description" },
        ]}
      />
    </div>
  );
}
