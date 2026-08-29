"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATE_RANGES, type DateRangeId } from "@/data/dashboard";

export function GreetingBar({
  range,
  onRangeChange,
  onRefresh,
}: {
  range: DateRangeId;
  onRangeChange: (range: DateRangeId) => void;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-semibold text-foreground">👋 Hi Mike Witzel,</p>
        {expanded && (
          <p className="text-sm text-muted-foreground">here&apos;s what&apos;s happening with your store today.</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Select value={range} onValueChange={(v) => onRangeChange(v as DateRangeId)}>
          <SelectTrigger className="w-[200px] rounded-lg" aria-label="Select date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.dateLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" aria-label="Refresh" className="rounded-lg" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label={expanded ? "Collapse" : "Expand"}
          aria-expanded={expanded}
          className="rounded-lg"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
}
