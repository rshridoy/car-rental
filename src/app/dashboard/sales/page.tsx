"use client";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { RECENT_TRANSACTIONS, type TransactionStatus } from "@/data/dashboard";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<TransactionStatus, string> = {
  success: "border-transparent bg-success/10 text-success",
  cancelled: "border-transparent bg-destructive/10 text-destructive",
  pending: "border-transparent bg-info/10 text-info",
};

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sales" description="Every completed and in-progress sale, across all payment methods." />
      <DataTable
        data={RECENT_TRANSACTIONS}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.product} ${row.reference} ${row.payment}`}
        searchPlaceholder="Search sales"
        pageSize={10}
        columns={[
          { key: "product", header: "Product", sortValue: (row) => row.product },
          { key: "payment", header: "Payment" },
          { key: "reference", header: "Reference" },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge className={cn(STATUS_CLASS[row.status])}>{row.status}</Badge>,
          },
          {
            key: "amount",
            header: "Amount",
            className: "text-right",
            sortValue: (row) => row.amount,
            render: (row) => `$${row.amount.toFixed(2)}`,
          },
        ]}
      />
    </div>
  );
}
