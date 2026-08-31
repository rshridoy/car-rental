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
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { INITIAL_PROMO_CODES } from "@/data/admin";

export default function PromoCodesPage() {
  const id = useId();
  const [codes, setCodes] = useState(INITIAL_PROMO_CODES);
  const [open, setOpen] = useState(false);

  const toggleActive = (codeId: string) => {
    setCodes((prev) => prev.map((c) => (c.id === codeId ? { ...c, active: !c.active } : c)));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const code = String(form.get("code") ?? "").trim().toUpperCase();
    const discountPercent = Number(form.get("discountPercent")) || 10;
    const expiresAt = String(form.get("expiresAt") ?? "2026-12-31");

    if (!code) {
      toast.error("Code is required");
      return;
    }

    setCodes((prev) => [{ id: `promo-${prev.length + 1}`, code, discountPercent, expiresAt, usageCount: 0, active: true }, ...prev]);
    setOpen(false);
    e.currentTarget.reset();
    toast.success(`Promo code "${code}" created`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Promo Codes"
        description="Discount codes customers can apply at checkout."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <Plus className="h-4 w-4" />
                Create Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create promo code</DialogTitle>
              </DialogHeader>
              <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-code`}>Code</Label>
                  <Input id={`${id}-code`} name="code" placeholder="SUMMER20" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-discount`}>Discount (%)</Label>
                  <Input id={`${id}-discount`} name="discountPercent" type="number" min={1} max={100} defaultValue={10} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-expires`}>Expires</Label>
                  <Input id={`${id}-expires`} name="expiresAt" type="date" defaultValue="2026-12-31" />
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
        data={codes}
        rowKey={(row) => row.id}
        searchKeys={(row) => row.code}
        searchPlaceholder="Search codes"
        columns={[
          { key: "code", header: "Code", sortValue: (row) => row.code, render: (row) => <span className="font-mono">{row.code}</span> },
          { key: "discountPercent", header: "Discount", sortValue: (row) => row.discountPercent, render: (row) => `${row.discountPercent}%` },
          { key: "expiresAt", header: "Expires", sortValue: (row) => row.expiresAt },
          { key: "usageCount", header: "Uses", sortValue: (row) => row.usageCount },
          {
            key: "active",
            header: "Active",
            render: (row) => (
              <div className="flex items-center gap-2">
                <Switch checked={row.active} onCheckedChange={() => toggleActive(row.id)} aria-label={`Toggle ${row.code}`} />
                <Badge className={row.active ? "border-transparent bg-success/10 text-success" : "border-transparent bg-muted text-muted-foreground"}>
                  {row.active ? "Active" : "Paused"}
                </Badge>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
