"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import { CAR_CATEGORIES, LOCATIONS, type Fuel, type Transmission } from "@/data/deals";
import { invalidateApiCache } from "@/hooks/use-api";

const TRANSMISSIONS: Transmission[] = ["Automatic", "Manual"];
const FUELS: Fuel[] = ["Petrol", "Diesel", "Hybrid", "Electric"];

export default function CreateProductPage() {
  const id = useId();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      category: String(form.get("category") ?? "popular"),
      pricePerDay: Number(form.get("price")) || 72,
      location: String(form.get("location") ?? LOCATIONS[0]),
      seats: Number(form.get("seats")) || undefined,
      transmission: String(form.get("transmission") ?? "Automatic"),
      fuel: String(form.get("fuel") ?? "Petrol"),
      stock: Number(form.get("stock")) || 10,
    };

    if (!payload.name) {
      toast.error("Product name is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      invalidateApiCache("/api/cars");
      toast.success(`"${payload.name}" created`);
      router.push("/dashboard/products");
    } catch {
      toast.error("Couldn't create the product — try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Create Product" description="Add a new vehicle to the rental fleet." />
      <Card className="max-w-2xl rounded-2xl border-border">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor={`${id}-name`}>Product name</Label>
              <Input id={`${id}-name`} name="name" placeholder="e.g. Toyota Yaris" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-category`}>Category</Label>
              <Select name="category" defaultValue={CAR_CATEGORIES[0].id}>
                <SelectTrigger id={`${id}-category`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAR_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-location`}>Location</Label>
              <Select name="location" defaultValue={LOCATIONS[0]}>
                <SelectTrigger id={`${id}-location`} className="w-full">
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
              <Label htmlFor={`${id}-price`}>Price per day ($)</Label>
              <Input id={`${id}-price`} name="price" type="number" min={0} step="0.01" placeholder="72.00" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-stock`}>Initial stock</Label>
              <Input id={`${id}-stock`} name="stock" type="number" min={0} step="1" placeholder="10" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-transmission`}>Transmission</Label>
              <Select name="transmission" defaultValue={TRANSMISSIONS[0]}>
                <SelectTrigger id={`${id}-transmission`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-fuel`}>Fuel type</Label>
              <Select name="fuel" defaultValue={FUELS[0]}>
                <SelectTrigger id={`${id}-fuel`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUELS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-seats`}>Seats</Label>
              <Input id={`${id}-seats`} name="seats" type="number" min={2} max={9} placeholder="5" />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
