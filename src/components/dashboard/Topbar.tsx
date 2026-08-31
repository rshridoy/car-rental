"use client";

import { useId, useState, type FormEvent } from "react";
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
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CAR_CATEGORIES } from "@/data/deals";
import { invalidateApiCache } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { title: "New order received", detail: "Range Rover — 15 mins ago" },
  { title: "Payment failed", detail: "Red Toyota — 1 hour ago" },
  { title: "Stock running low", detail: "Compact car — today" },
];

const MESSAGES = [{ title: "New message from support", detail: "Regarding invoice #147784454554" }];

function AddProductDialog() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const category = String(form.get("category") ?? "popular");
    const price = Number(form.get("price")) || 72;

    setSubmitting(true);
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, pricePerDay: price }),
      });
      if (!res.ok) throw new Error("Request failed");

      invalidateApiCache("/api/cars");
      setOpen(false);
      e.currentTarget.reset();
      toast.success(`"${name}" added to inventory`, {
        description: "It now shows up in Products and the matching category everywhere in the app.",
      });
    } catch {
      toast.error("Couldn't add product — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden rounded-full md:inline-flex">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new product</DialogTitle>
          <DialogDescription>
            Adds a real (in-memory) entry to the catalog — it resets when the server restarts.
          </DialogDescription>
        </DialogHeader>
        <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-name`}>Product name</Label>
            <Input id={`${formId}-name`} name="name" placeholder="e.g. Toyota Yaris" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-category`}>Category</Label>
            <Select name="category" defaultValue={CAR_CATEGORIES[0].id}>
              <SelectTrigger id={`${formId}-category`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAR_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-price`}>Price per day ($)</Label>
            <Input id={`${formId}-price`} name="price" type="number" min={0} step="0.01" placeholder="72.00" required />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={submitting}>
            {submitting ? "Saving…" : "Save product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

        <AddProductDialog />

        <Button
          className="hidden rounded-full bg-navy text-navy-foreground hover:bg-navy/90 md:inline-flex"
          onClick={() => toast.info("POS terminal is a mock action in this build")}
        >
          <Store className="h-4 w-4" />
          POS
        </Button>

        <span aria-hidden="true" className="hidden text-lg lg:inline">
          🇬🇧
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="hidden rounded-full lg:inline-flex"
          aria-label="Fullscreen"
          onClick={() => document.documentElement.requestFullscreen?.()}
        >
          <Maximize className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Messages, ${MESSAGES.length} unread`}>
              <Mail className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                {String(MESSAGES.length).padStart(2, "0")}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Messages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MESSAGES.map((m) => (
              <DropdownMenuItem key={m.title} className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{m.title}</span>
                <span className="text-xs text-muted-foreground">{m.detail}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((n) => (
              <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.detail}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
