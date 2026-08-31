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

const GRID = 12;

/** A deterministic, visually QR-like grid of modules — not a scannable real QR code. */
function QrCode({ id }: { id: string }) {
  const cells = useMemo(() => {
    const seed = hashString(id);
    return Array.from({ length: GRID * GRID }, (_, i) => {
      // Deterministic finder-pattern corners for visual authenticity.
      const x = i % GRID;
      const y = Math.floor(i / GRID);
      const inCorner = (cx: number, cy: number) => x >= cx && x < cx + 3 && y >= cy && y < cy + 3;
      if (inCorner(0, 0) || inCorner(GRID - 3, 0) || inCorner(0, GRID - 3)) return true;
      return ((seed >> (i % 30)) ^ (i * 7)) % 3 === 0;
    });
  }, [id]);

  const cellSize = 100 / GRID;

  return (
    <svg viewBox="0 0 100 100" className="h-40 w-40" role="img" aria-label={`QR code for ${id}`}>
      <rect width="100" height="100" fill="white" />
      {cells.map(
        (on, i) =>
          on && (
            <rect
              key={i}
              x={(i % GRID) * cellSize}
              y={Math.floor(i / GRID) * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#111318"
            />
          )
      )}
    </svg>
  );
}

export default function PrintQrCodePage() {
  const [carId, setCarId] = useState(CAR_DEALS[0]?.id ?? "");
  const car = CAR_DEALS.find((c) => c.id === carId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Print QR Code" description="Generate and print a QR code label for a product." />

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
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
              <p className="text-sm font-medium text-foreground">{car.name}</p>
              <QrCode id={car.id} />
              <p className="font-mono text-xs text-muted-foreground">{car.id}</p>
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
