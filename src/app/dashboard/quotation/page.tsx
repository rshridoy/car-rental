"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { QUOTATIONS, type QuotationStatus } from "@/data/admin";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<QuotationStatus, string> = {
  accepted: "border-transparent bg-success/10 text-success",
  sent: "border-transparent bg-info/10 text-info",
  draft: "border-transparent bg-muted text-muted-foreground",
  expired: "border-transparent bg-destructive/10 text-destructive",
};

export default function QuotationPage() {
  const id = useId();
  const [quotations, setQuotations] = useState(QUOTATIONS);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const customer = String(form.get("customer") ?? "").trim();
    const carName = String(form.get("carName") ?? "").trim();
    const total = Number(form.get("total")) || 0;

    if (!customer || !carName) {
      toast.error("Customer and car are required");
      return;
    }

    setQuotations((prev) => [
      {
        id: `QUO-${2000 + prev.length}`,
        customer,
        carName,
        total,
        status: "draft",
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setOpen(false);
    e.currentTarget.reset();
    toast.success("Quotation created");
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Quotation"
        description="Draft price quotes for prospective customers before they book."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <Plus className="h-4 w-4" />
                Create Quotation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create quotation</DialogTitle>
              </DialogHeader>
              <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-customer`}>Customer</Label>
                  <Input id={`${id}-customer`} name="customer" placeholder="Jane Doe" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-car`}>Car</Label>
                  <Input id={`${id}-car`} name="carName" placeholder="Range Rover Sport" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-total`}>Total ($)</Label>
                  <Input id={`${id}-total`} name="total" type="number" min={0} step="0.01" placeholder="350.00" />
                </div>
              </form>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" form={id}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        data={quotations}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.id} ${row.customer} ${row.carName}`}
        searchPlaceholder="Search quotations"
        columns={[
          { key: "id", header: "Quotation", sortValue: (row) => row.id },
          { key: "customer", header: "Customer", sortValue: (row) => row.customer },
          { key: "carName", header: "Car" },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge className={cn(STATUS_CLASS[row.status])}>{row.status}</Badge>,
          },
          {
            key: "total",
            header: "Total",
            className: "text-right",
            sortValue: (row) => row.total,
            render: (row) => `$${row.total.toFixed(2)}`,
          },
        ]}
      />
    </div>
  );
}
