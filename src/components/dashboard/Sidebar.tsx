"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SIDEBAR_GROUPS, type SidebarItem } from "@/data/dashboard";
import { cn } from "@/lib/utils";

/**
 * `responsive` sidebars live in the persistent desktop column: they render as
 * an icon-only rail at the `lg` breakpoint no matter what, and only obey the
 * `collapsed` toggle once past `xl` (where there's room for a real choice).
 * Non-responsive sidebars (the mobile Sheet drawer) always show full labels,
 * since a viewport narrow enough to trigger the drawer would otherwise also
 * match the same `hidden xl:*` rules and hide everything.
 */
function NavRow({
  item,
  collapsed,
  responsive,
  onNavigate,
}: {
  item: SidebarItem;
  collapsed: boolean;
  responsive: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  const labelClass = responsive
    ? cn("flex-1 truncate text-left hidden xl:inline", collapsed && "xl:hidden")
    : cn("flex-1 truncate text-left", collapsed && "hidden");

  const chevronClass = responsive
    ? cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform hidden xl:block", collapsed && "xl:hidden", open && "rotate-90")
    : cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", collapsed && "hidden", open && "rotate-90");

  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      <span className={labelClass}>{item.label}</span>
      {item.expandable && <ChevronRight className={chevronClass} />}
    </>
  );

  const rowClass = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    item.active
      ? "bg-accent font-medium text-accent-foreground"
      : "text-foreground/80 hover:bg-muted hover:text-foreground",
    responsive && (collapsed ? "justify-center px-0" : "xl:justify-start xl:px-3 justify-center px-0")
  );

  const row = item.expandable ? (
    <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={rowClass}>
      {content}
    </button>
  ) : (
    <a href={item.href} onClick={onNavigate} className={rowClass}>
      {content}
    </a>
  );

  if (!responsive) return row;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{row}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar({
  collapsed = false,
  responsive = false,
  onNavigate,
  className,
}: {
  collapsed?: boolean;
  responsive?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const titleClass = responsive
    ? cn("px-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase hidden xl:block", collapsed && "xl:hidden")
    : cn("px-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase", collapsed && "hidden");

  const dividerClass = responsive
    ? cn("mx-3 mb-1 h-px bg-border xl:hidden", collapsed && "xl:block")
    : cn("mx-3 mb-1 h-px bg-border", !collapsed && "hidden");

  return (
    <nav aria-label="Dashboard" className={cn("flex h-full flex-col gap-6 overflow-y-auto py-4", className)}>
      {SIDEBAR_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-1 px-2">
          <p className={titleClass}>{group.title}</p>
          <div aria-hidden="true" className={dividerClass} />
          {group.items.map((item) => (
            <NavRow key={item.label} item={item} collapsed={collapsed} responsive={responsive} onNavigate={onNavigate} />
          ))}
        </div>
      ))}
    </nav>
  );
}
