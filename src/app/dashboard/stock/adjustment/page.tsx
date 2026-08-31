"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { STOCK_ADJUSTMENTS } from "@/data/admin";
import { CAR_DEALS } from "@/data/deals";
import { cn } from "@/lib/utils";

export default function StockAdjustmentPage() {
  const id = useId();
  const [adjustments, setAdjustments] = useState(STOCK_ADJUSTMENTS);
  const productNames = [...new Set(CAR_DEALS.map((c) => c.name))].slice(0, 30);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const productName = String(form.get("productName") ?? "");
    const type = String(form.get("type") ?? "add") as "add" | "remove";
    const quantity = Number(form.get("quantity")) || 1;
    const reason = String(form.get("reason") ?? "").trim();

    if (!productName || !reason) {
      toast.error("Product and reason are required");
      return;
    }

    setAdjustments((prev) => [
      {
        id: `ADJ-${prev.length + 1}`,
        productName,
        type,
        quantity,
        reason,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    e.currentTarget.reset();
    toast.success(`Stock ${type === "add" ? "added" : "removed"} for ${productName}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Stock Adjustment" description="Manually add or remove units from a listing's available stock." />

      <Card className="max-w-2xl rounded-2xl border-border">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor={`${id}-product`}>Product</Label>
              <Select name="productName" defaultValue={productNames[0]}>
                <SelectTrigger id={`${id}-product`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-type`}>Adjustment</Label>
              <Select name="type" defaultValue="add">
                <SelectTrigger id={`${id}-type`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add stock</SelectItem>
                  <SelectItem value="remove">Remove stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-quantity`}>Quantity</Label>
              <Input id={`${id}-quantity`} name="quantity" type="number" min={1} defaultValue={1} required />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor={`${id}-reason`}>Reason</Label>
              <Input id={`${id}-reason`} name="reason" placeholder="e.g. Restock" required />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Log adjustment</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable
        data={adjustments}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.productName} ${row.reason}`}
        searchPlaceholder="Search adjustments"
        columns={[
          { key: "productName", header: "Product", sortValue: (row) => row.productName },
          {
            key: "type",
            header: "Type",
            render: (row) => (
              <Badge
                className={cn(
                  "border-transparent",
                  row.type === "add" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}
              >
                {row.type === "add" ? "Added" : "Removed"}
              </Badge>
            ),
          },
          { key: "quantity", header: "Qty", sortValue: (row) => row.quantity },
          { key: "reason", header: "Reason" },
          { key: "date", header: "Date", sortValue: (row) => row.date },
        ]}
      />
    </div>
  );
}
