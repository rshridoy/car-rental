"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
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
import { STOCK_TRANSFERS } from "@/data/admin";
import { CAR_DEALS, LOCATIONS } from "@/data/deals";

export default function StockTransferPage() {
  const id = useId();
  const [transfers, setTransfers] = useState(STOCK_TRANSFERS);
  const productNames = [...new Set(CAR_DEALS.map((c) => c.name))].slice(0, 30);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const productName = String(form.get("productName") ?? "");
    const from = String(form.get("from") ?? LOCATIONS[0]);
    const to = String(form.get("to") ?? LOCATIONS[1]);
    const quantity = Number(form.get("quantity")) || 1;

    if (from === to) {
      toast.error("Pick two different locations");
      return;
    }

    setTransfers((prev) => [
      { id: `TRF-${prev.length + 1}`, productName, from, to, quantity, date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    e.currentTarget.reset();
    toast.success(`Transferred ${quantity} × ${productName} from ${from} to ${to}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Stock Transfer" description="Move vehicles between rental locations." />

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
              <Label htmlFor={`${id}-from`}>From</Label>
              <Select name="from" defaultValue={LOCATIONS[0]}>
                <SelectTrigger id={`${id}-from`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-to`}>To</Label>
              <Select name="to" defaultValue={LOCATIONS[1]}>
                <SelectTrigger id={`${id}-to`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-quantity`}>Quantity</Label>
              <Input id={`${id}-quantity`} name="quantity" type="number" min={1} defaultValue={1} required />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Log transfer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable
        data={transfers}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.productName} ${row.from} ${row.to}`}
        searchPlaceholder="Search transfers"
        columns={[
          { key: "productName", header: "Product", sortValue: (row) => row.productName },
          { key: "from", header: "From" },
          { key: "to", header: "To" },
          { key: "quantity", header: "Qty", sortValue: (row) => row.quantity },
          { key: "date", header: "Date", sortValue: (row) => row.date },
        ]}
      />
    </div>
  );
}
