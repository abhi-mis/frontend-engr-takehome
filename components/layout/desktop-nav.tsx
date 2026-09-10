"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NAV_GROUPS } from "@/lib/nav";

// Desktop mega-menu. Hidden below lg, where MobileNav takes over.
export function DesktopNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {NAV_GROUPS.map((group) => (
          <NavigationMenuItem key={group.label}>
            <NavigationMenuTrigger className="h-11 bg-transparent px-3 text-sm font-semibold text-ink hover:bg-brand-tint hover:text-brand-strong data-[state=open]:bg-brand-tint data-[state=open]:text-brand-strong">
              {group.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent
              className={
                group.columns.length > 1
                  ? "grid gap-x-8 gap-y-1 p-5 md:w-[38rem] md:grid-cols-2"
                  : "p-5 md:w-[24rem]"
              }
            >
              {group.columns.map((column) => (
                <div key={column.heading ?? "col"} className="min-w-0">
                  {column.heading && (
                    <p className="mb-3 px-2 text-xs font-bold tracking-wide text-ink-muted uppercase">
                      {column.heading}
                    </p>
                  )}

                  <ul className="flex flex-col">
                    {column.items.map((item) => (
                      <li key={item.label}>
                        <NavigationMenuLink asChild>
                          <button
                            type="button"
                            className="flex w-full flex-col items-start gap-0.5 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-surface-alt focus-visible:bg-surface-alt"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-ink">
                                {item.label}
                              </span>
                              {item.isNew && (
                                <span className="text-[0.65rem] font-bold tracking-wide text-brand-strong uppercase">
                                  New
                                </span>
                              )}
                            </span>
                            {item.description && (
                              <span className="text-xs leading-snug text-ink-muted">
                                {item.description}
                              </span>
                            )}
                          </button>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
