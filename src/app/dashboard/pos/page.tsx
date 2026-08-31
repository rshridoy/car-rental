"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Car, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CAR_DEALS, type CarDeal } from "@/data/deals";

type CartLine = { car: CarDeal; qty: number };

export default function PosPage() {
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);

  const products = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const pool = CAR_DEALS.filter((c) => c.stock > 0).slice(0, 60);
    return needle ? pool.filter((c) => c.name.toLowerCase().includes(needle)) : pool.slice(0, 20);
  }, [q]);

  const addToCart = (car: CarDeal) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.car.id === car.id);
      if (existing) {
        return prev.map((line) => (line.car.id === car.id ? { ...line, qty: line.qty + 1 } : line));
      }
      return [...prev, { car, qty: 1 }];
    });
  };

  const updateQty = (carId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) => (line.car.id === carId ? { ...line, qty: line.qty + delta } : line))
        .filter((line) => line.qty > 0)
    );
  };

  const removeLine = (carId: string) => setCart((prev) => prev.filter((line) => line.car.id !== carId));

  const total = cart.reduce((sum, line) => sum + line.car.pricePerDay * line.qty, 0);

  const checkout = () => {
    if (cart.length === 0) return;
    toast.success(`Sale completed — $${total.toFixed(2)}`, {
      description: "Mock checkout: nothing was charged and no order was persisted.",
    });
    setCart([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="POS" description="Point of sale — build a cart and check out a walk-in rental." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="pl-8" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((car) => (
              <button
                key={car.id}
                type="button"
                onClick={() => addToCart(car)}
                className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-accent"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Car className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="line-clamp-1 text-sm font-medium text-foreground">{car.name}</p>
                <p className="text-xs text-muted-foreground">${car.pricePerDay.toFixed(2)} / day</p>
              </button>
            ))}
          </div>
        </div>

        <Card className="h-fit rounded-2xl border-border lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">Click a product to add it to the cart.</p>
            ) : (
              cart.map((line) => (
                <div key={line.car.id} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{line.car.name}</p>
                    <p className="text-xs text-muted-foreground">${line.car.pricePerDay.toFixed(2)} / day</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon-sm" onClick={() => updateQty(line.car.id, -1)} aria-label="Decrease quantity">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-5 text-center text-sm">{line.qty}</span>
                    <Button variant="outline" size="icon-sm" onClick={() => updateQty(line.car.id, 1)} aria-label="Increase quantity">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeLine(line.car.id)} aria-label={`Remove ${line.car.name}`}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
          <Separator />
          <CardFooter className="flex-col items-stretch gap-3 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span>
            </div>
            <Button onClick={checkout} disabled={cart.length === 0} size="lg">
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
