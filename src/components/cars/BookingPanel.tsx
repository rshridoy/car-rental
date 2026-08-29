"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CarDeal } from "@/data/deals";

const DATE_PRESETS = ["Today", "Tomorrow", "This Weekend", "Next Week"];
const TIME_PRESETS = ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"];

export function BookingPanel({ car }: { car: CarDeal }) {
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Booking request sent for ${car.name}`, {
        description: "This is a mock confirmation — no payment was taken and nothing was persisted.",
      });
    }, 500);
  };

  return (
    <Card className="h-fit rounded-2xl border-border lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-1.5 text-2xl">
          <span className="font-bold text-foreground">${car.pricePerDay.toFixed(2)}</span>
          <span className="text-sm font-normal text-muted-foreground">/ day</span>
        </CardTitle>
      </CardHeader>
      <form id={formId} onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-pickup-date`}>Pick-up date</Label>
            <Select name="pickupDate" defaultValue={DATE_PRESETS[0]}>
              <SelectTrigger id={`${formId}-pickup-date`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_PRESETS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-pickup-time`}>Pick-up time</Label>
            <Select name="pickupTime" defaultValue={TIME_PRESETS[0]}>
              <SelectTrigger id={`${formId}-pickup-time`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_PRESETS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-dropoff-date`}>Drop-off date</Label>
            <Select name="dropoffDate" defaultValue={DATE_PRESETS[1]}>
              <SelectTrigger id={`${formId}-dropoff-date`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_PRESETS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2">
          <Button type="submit" size="lg" className="w-full rounded-xl" disabled={submitting}>
            {submitting ? "Confirming…" : "Confirm Booking"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Free cancellation up to 24 hours before pick-up.</p>
        </CardFooter>
      </form>
    </Card>
  );
}
