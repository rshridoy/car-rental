"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

const DATE_PRESETS = ["Today", "Tomorrow", "This Weekend", "Next Week"];
const TIME_PRESETS = ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"];

function TripField({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  loading,
}: {
  label: string;
  placeholder: string;
  options: readonly string[];
  value?: string;
  onValueChange?: (value: string) => void;
  loading?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-1 h-5 w-32" />
      ) : (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="mt-1 h-auto w-full justify-between border-none p-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0 data-placeholder:text-muted-foreground [&>svg]:text-muted-foreground">
            <SelectValue placeholder={placeholder} className="truncate" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

function TripFields({
  locationValue,
  onLocationChange,
  locations,
  loadingLocations,
}: {
  locationValue?: string;
  onLocationChange?: (value: string) => void;
  locations: readonly string[];
  loadingLocations?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
      <TripField
        label="Locations"
        placeholder="Select your city"
        options={locations}
        value={locationValue}
        onValueChange={onLocationChange}
        loading={loadingLocations}
      />
      <TripField label="Date" placeholder="Select your date" options={DATE_PRESETS} />
      <TripField label="Time" placeholder="Select your time" options={TIME_PRESETS} />
    </div>
  );
}

export function BookingSearchBar() {
  const [mode, setMode] = useState<"pickup" | "dropoff">("pickup");
  const [location, setLocation] = useState<string>("");
  const groupId = useId();
  const router = useRouter();

  const { data, loading: loadingLocations } = useApi<{ items: string[] }>("/api/locations");
  const locations: readonly string[] = data?.items ?? [];

  const handleSearch = () => {
    const query = location ? `?location=${encodeURIComponent(location)}` : "";
    router.push(`/cars${query}`);
  };

  return (
    <div className="rounded-[10px] border border-border bg-card p-6 shadow-lg shadow-foreground/5">
      <RadioGroup
        value={mode}
        onValueChange={(v) => setMode(v as "pickup" | "dropoff")}
        className="hidden lg:flex lg:items-start lg:gap-4"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start">
          <label htmlFor={`${groupId}-pickup`} className="flex shrink-0 items-center gap-2 sm:w-28">
            <RadioGroupItem id={`${groupId}-pickup`} value="pickup" />
            <span className={cn("text-sm font-medium", mode === "pickup" ? "text-foreground" : "text-muted-foreground")}>
              Pick - Up
            </span>
          </label>
          <TripFields
            locationValue={location}
            onLocationChange={setLocation}
            locations={locations}
            loadingLocations={loadingLocations}
          />
        </div>

        <div aria-hidden="true" className="h-full w-px self-stretch bg-border" />

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start">
          <label htmlFor={`${groupId}-dropoff`} className="flex shrink-0 items-center gap-2 sm:w-28">
            <RadioGroupItem id={`${groupId}-dropoff`} value="dropoff" />
            <span className={cn("text-sm font-medium", mode === "dropoff" ? "text-foreground" : "text-muted-foreground")}>
              Drop - Off
            </span>
          </label>
          <TripFields locations={locations} loadingLocations={loadingLocations} />
        </div>

        <Button size="lg" className="shrink-0 self-center rounded-xl px-6" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </RadioGroup>

      <Tabs defaultValue="pickup" className="lg:hidden">
        <TabsList className="w-full">
          <TabsTrigger value="pickup">Pick - Up</TabsTrigger>
          <TabsTrigger value="dropoff">Drop - Off</TabsTrigger>
        </TabsList>
        <TabsContent value="pickup" className="mt-4">
          <TripFields
            locationValue={location}
            onLocationChange={setLocation}
            locations={locations}
            loadingLocations={loadingLocations}
          />
        </TabsContent>
        <TabsContent value="dropoff" className="mt-4">
          <TripFields locations={locations} loadingLocations={loadingLocations} />
        </TabsContent>
        <Button size="lg" className="mt-6 w-full rounded-xl" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </Tabs>
    </div>
  );
}
