"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DashboardLogo, Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-page">
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border bg-sidebar lg:flex lg:w-[72px]",
          !collapsed && "xl:w-60"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-border px-4">
          <DashboardLogo iconOnly className={cn("flex", !collapsed && "xl:hidden")} />
          <DashboardLogo className={cn("hidden", !collapsed && "xl:flex")} />
        </div>
        <Sidebar collapsed={collapsed} responsive className="flex-1" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        <footer className="flex flex-col gap-2 border-t border-border px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>2026 © All Right Reserved</p>
          <p>Designed &amp; Developed</p>
        </footer>
      </div>
    </div>
  );
}
