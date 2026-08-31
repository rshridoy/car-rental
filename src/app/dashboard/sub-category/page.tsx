"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { SUB_CATEGORIES } from "@/data/admin";

export default function SubCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sub Category" description="Body-style groupings nested under each top-level category." />
      <DataTable
        data={SUB_CATEGORIES}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.name} ${row.parentCategory}`}
        searchPlaceholder="Search sub categories"
        columns={[
          { key: "name", header: "Sub Category", sortValue: (row) => row.name },
          { key: "parentCategory", header: "Parent Category", sortValue: (row) => row.parentCategory },
        ]}
      />
    </div>
  );
}
