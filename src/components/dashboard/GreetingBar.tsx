"use client";

import { ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function GreetingBar() {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-semibold text-foreground">👋 Hi Mike Witzel,</p>
        <p className="text-sm text-muted-foreground">here&apos;s what&apos;s happening with your store today.</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-lg border border-border px-3 py-2 text-sm text-foreground">
          01 Jan 2024 - 07 Jan 2024
        </span>
        <Button variant="outline" size="icon" aria-label="Refresh" className="rounded-lg">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Collapse" className="rounded-lg">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
