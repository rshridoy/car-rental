"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/data/landing";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      id="home"
      className="sticky top-0 z-30 border-b border-line-strong bg-background"
    >
      <div className="mx-auto flex h-[100px] max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#home" className="text-2xl font-bold tracking-tight text-foreground">
          Logo
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm text-muted-foreground lg:flex"
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={i === 0 ? "page" : undefined}
              className={cn(
                "transition-colors hover:text-foreground",
                i === 0 && "font-medium text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href="#register" className="text-sm text-muted-foreground hover:text-foreground">
            Register
          </a>
          <Separator />
          <Button asChild variant="outline" className="h-10 rounded-full px-6">
            <a href="#login">Log In</a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-4 px-4 text-sm">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn("text-muted-foreground", i === 0 && "font-medium text-foreground")}
                >
                  {link.label}
                </a>
              ))}
              <a href="#register" onClick={() => setOpen(false)} className="text-muted-foreground">
                Register
              </a>
              <Button asChild className="w-fit rounded-full" variant="outline">
                <a href="#login" onClick={() => setOpen(false)}>
                  Log In
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function Separator() {
  return <span aria-hidden="true" className="h-4 w-px bg-border" />;
}
