"use client";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { SALES_RETURNS, type SalesReturnStatus } from "@/data/admin";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<SalesReturnStatus, string> = {
  approved: "border-transparent bg-success/10 text-success",
  pending: "border-transparent bg-info/10 text-info",
  rejected: "border-transparent bg-destructive/10 text-destructive",
};

export default function SalesReturnPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sales Return" description="Return and refund requests raised against completed bookings." />
      <DataTable
        data={SALES_RETURNS}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.id} ${row.orderId} ${row.product}`}
        searchPlaceholder="Search returns"
        columns={[
          { key: "id", header: "Return", sortValue: (row) => row.id },
          { key: "product", header: "Product", sortValue: (row) => row.product },
          { key: "reason", header: "Reason" },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge className={cn(STATUS_CLASS[row.status])}>{row.status}</Badge>,
          },
          {
            key: "refundAmount",
            header: "Refund",
            className: "text-right",
            sortValue: (row) => row.refundAmount,
            render: (row) => `$${row.refundAmount.toFixed(2)}`,
          },
        ]}
      />
    </div>
  );
}
