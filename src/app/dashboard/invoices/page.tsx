"use client";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { INVOICES, type InvoiceStatus } from "@/data/admin";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<InvoiceStatus, string> = {
  paid: "border-transparent bg-success/10 text-success",
  unpaid: "border-transparent bg-info/10 text-info",
  overdue: "border-transparent bg-destructive/10 text-destructive",
};

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Invoices" description="Billing history across every completed and pending rental." />
      <DataTable
        data={INVOICES}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.id} ${row.customer}`}
        searchPlaceholder="Search invoices"
        pageSize={10}
        columns={[
          { key: "id", header: "Invoice", sortValue: (row) => row.id },
          { key: "customer", header: "Customer", sortValue: (row) => row.customer },
          { key: "date", header: "Date", sortValue: (row) => row.date },
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
