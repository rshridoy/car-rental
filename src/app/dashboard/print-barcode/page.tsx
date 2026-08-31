"use client";

import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CAR_DEALS } from "@/data/deals";

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** A deterministic, visually barcode-like pattern of bars — not a scannable real barcode. */
function Barcode({ id }: { id: string }) {
  const bars = useMemo(() => {
    const seed = hashString(id);
    // `^` coerces to a signed 32-bit int, so the result (and its `%`) can go
    // negative even with an unsigned shift — Math.abs guarantees a valid,
    // always-positive SVG rect width.
    return Array.from({ length: 40 }, (_, i) => 1 + Math.abs(((seed >>> (i % 24)) ^ i) % 4));
  }, [id]);

  return (
    <svg viewBox="0 0 320 90" className="h-24 w-full max-w-sm" role="img" aria-label={`Barcode for ${id}`}>
      <rect width="320" height="90" fill="white" />
      {(() => {
        let x = 8;
        return bars.map((w, i) => {
          const bar = (
            <rect key={i} x={x} y={8} width={w} height={60} fill={i % 2 === 0 ? "#111318" : "transparent"} />
          );
          x += w + 2;
          return bar;
        });
      })()}
    </svg>
  );
}

export default function PrintBarcodePage() {
  const [carId, setCarId] = useState(CAR_DEALS[0]?.id ?? "");
  const car = CAR_DEALS.find((c) => c.id === carId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Print Barcode" description="Generate and print a barcode label for a product." />

      <Card className="max-w-lg rounded-2xl border-border">
        <CardContent className="flex flex-col gap-4 pt-6">
          <Select value={carId} onValueChange={setCarId}>
            <SelectTrigger aria-label="Select product" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAR_DEALS.slice(0, 40).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} — {c.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {car && (
            <div id="barcode-print-area" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
              <p className="text-sm font-medium text-foreground">{car.name}</p>
              <Barcode id={car.id} />
              <p className="font-mono text-xs text-muted-foreground">{car.id}</p>
              <p className="text-xs text-muted-foreground">${car.pricePerDay.toFixed(2)} / day</p>
            </div>
          )}

          <Button onClick={() => window.print()} disabled={!car} className="self-start">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
