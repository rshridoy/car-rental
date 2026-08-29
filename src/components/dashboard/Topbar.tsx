"use client";

import { useState } from "react";
import {
  Bell,
  Car,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  Mail,
  Menu,
  Plus,
  Search,
  Settings,
  Store,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";

export function DashboardLogo({ iconOnly = false, className }: { iconOnly?: boolean; className?: string }) {
  return (
    <a
      href="/dashboard"
      aria-label="Best Auto dashboard home"
      className={cn("items-center gap-2 text-lg font-bold tracking-tight text-foreground", className)}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Car className="h-4 w-4" />
      </span>
      {!iconOnly && (
        <>
          Best<span className="text-primary">.</span>
        </>
      )}
    </a>
  );
}

export function Topbar({
  collapsed,
  onToggleCollapsed,
  className,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  className?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={cn("flex h-16 items-center gap-3 border-b border-border bg-background px-4 sm:px-6", className)}>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open sidebar">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle asChild>
              <DashboardLogo />
            </SheetTitle>
          </SheetHeader>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <Button
        variant="outline"
        size="icon"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-pressed={collapsed}
        className="hidden rounded-full xl:inline-flex"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>

      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9" aria-label="Search" />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden rounded-full sm:inline-flex">
              Coming Soon
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Coming Soon</DropdownMenuItem>
            <DropdownMenuItem>Live</DropdownMenuItem>
            <DropdownMenuItem>Archived</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="hidden rounded-full md:inline-flex">
          <Plus className="h-4 w-4" />
          Add New
        </Button>

        <Button className="hidden rounded-full bg-navy text-navy-foreground hover:bg-navy/90 md:inline-flex">
          <Store className="h-4 w-4" />
          POS
        </Button>

        <span aria-hidden="true" className="hidden text-lg lg:inline">
          🇬🇧
        </span>

        <Button variant="ghost" size="icon" className="hidden rounded-full lg:inline-flex" aria-label="Fullscreen">
          <Maximize className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Messages, 1 unread">
          <Mail className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
            01
          </span>
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="Account menu" className="ml-1 rounded-full">
              <Avatar>
                <AvatarFallback>MW</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
