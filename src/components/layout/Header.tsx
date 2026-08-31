"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavLink } from "@/data/landing";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

/**
 * Scroll-spy hook: watches each section ID in the nav and returns the
 * href of whichever section is currently most visible in the viewport.
 * Falls back to "#home" when nothing else intersects (i.e. at the top).
 */
function useActiveSection(sectionIds: string[]): string {
  const [activeHref, setActiveHref] = useState("#home");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.set(`#${entry.target.id}`, entry.intersectionRatio);
        }
        // Pick the section with the highest intersection ratio.
        let best = "#home";
        let bestRatio = 0;
        for (const [href, ratio] of ratioMap) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = href;
          }
        }
        setActiveHref(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return activeHref;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { data, loading } = useApi<{ items: NavLink[] }>("/api/nav-links");
  const navLinks = data?.items ?? [];

  // Only hash links ("#section") are homepage sections to scroll-spy on —
  // a link like "/cars" is a real route and isn't observed.
  const sectionIds = navLinks
    .filter((l) => l.href.startsWith("#"))
    .map((l) => l.href.slice(1));
  const activeHref = useActiveSection(isHome ? sectionIds : []);

  function resolveLink(link: NavLink) {
    const isSectionLink = link.href.startsWith("#");
    if (!isSectionLink) {
      // A real page route (e.g. "/cars") — use as-is, active when on that page.
      return { href: link.href, isActive: pathname === link.href };
    }
    if (isHome) {
      return { href: link.href, isActive: activeHref === link.href };
    }
    // On other pages: "#home" → "/", other sections → "/#section-id".
    // None of these are the active page (that's decided above by pathname).
    const isHomeLink = link.href === "#home";
    return { href: isHomeLink ? "/" : `/${link.href}`, isActive: false };
  }

  return (
    <header
      id="home"
      className="sticky top-0 z-30 border-b border-line-strong bg-background"
    >
      <div className="mx-auto flex h-[100px] max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
          Logo
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm text-muted-foreground lg:flex"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))
            : navLinks.map((link) => {
                const { href, isActive } = resolveLink(link);
                return (
                  <Link
                    key={link.label}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      isActive && "font-medium text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
              {navLinks.map((link) => {
                const { href, isActive } = resolveLink(link);
                return (
                  <Link
                    key={link.label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-muted-foreground",
                      isActive && "font-medium text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
