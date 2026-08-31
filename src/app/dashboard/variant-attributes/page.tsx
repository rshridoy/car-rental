"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { VARIANT_ATTRIBUTES } from "@/data/admin";

export default function VariantAttributesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Variant Attributes" description="Configurable specs that distinguish otherwise-identical listings." />
      <DataTable
        data={VARIANT_ATTRIBUTES}
        rowKey={(row) => row.id}
        searchKeys={(row) => row.name}
        searchPlaceholder="Search attributes"
        columns={[
          { key: "name", header: "Attribute", sortValue: (row) => row.name },
          { key: "values", header: "Values", render: (row) => row.values.join(", ") },
        ]}
      />
    </div>
  );
}
