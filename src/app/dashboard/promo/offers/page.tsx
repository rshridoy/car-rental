"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { OFFERS } from "@/data/admin";

export default function OffersPage() {
  const [offers, setOffers] = useState(OFFERS);

  const toggleActive = (id: string) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Offers" description="Seasonal and audience-targeted promotional banners." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <Card key={offer.id} className="rounded-2xl border-border">
            <CardContent className="flex flex-col gap-3 pt-6">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{offer.title}</p>
                <Switch checked={offer.active} onCheckedChange={() => toggleActive(offer.id)} aria-label={`Toggle ${offer.title}`} />
              </div>
              <Badge className="w-fit border-transparent bg-primary/10 text-primary">{offer.discountPercent}% off</Badge>
              <p className="text-xs text-muted-foreground">
                Valid {offer.validFrom} – {offer.validTo}
              </p>
              <Badge
                className={
                  offer.active
                    ? "w-fit border-transparent bg-success/10 text-success"
                    : "w-fit border-transparent bg-muted text-muted-foreground"
                }
              >
                {offer.active ? "Live" : "Paused"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
