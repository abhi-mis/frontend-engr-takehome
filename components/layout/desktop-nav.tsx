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

/**
 * The desktop navigation, kept as Propsoch's own: four dropdown groups with the
 * real labels, descriptions, "New" badges and destinations.
 *
 * WHY THIS IS A CLIENT ISLAND
 *
 * A dropdown menu cannot be done correctly in CSS. It needs Escape to close,
 * arrow keys to move between items, focus returned to the trigger on close, and
 * `aria-expanded` kept in sync. Radix's NavigationMenu supplies all of that.
 * Hover-only CSS menus are unusable by keyboard and hostile on touch, which is
 * exactly the class of bug this rebuild is meant to fix rather than introduce.
 *
 * It is still a leaf island: the header itself stays a Server Component and
 * only this subtree hydrates. It also shares the Radix core already in the
 * bundle for Tabs and Slider, so the marginal cost is small.
 *
 * CONTRAST NOTE
 *
 * shadcn's NavigationMenuTrigger inherits the same `text-foreground/60` style
 * of muted default that failed AA on the comparison tabs. Alpha over a variable
 * background has no fixed ratio, so the trigger and every link below use named
 * tokens with measured values instead.
 */
export function DesktopNav() {
  return (
    // `viewport` is left at its default (true) on purpose. With viewport={false}
    // each panel renders inside its own nav item, so a 40rem panel under the
    // right-hand "Company" trigger runs off the edge of the screen. Radix's
    // shared viewport renders one centred box under the whole bar and sizes
    // itself from the active panel, which is what keeps every panel on screen.
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {NAV_GROUPS.map((group) => (
          <NavigationMenuItem key={group.label}>
            <NavigationMenuTrigger className="h-11 bg-transparent px-3 text-sm font-semibold text-ink hover:bg-brand-tint hover:text-brand-strong data-[state=open]:bg-brand-tint data-[state=open]:text-brand-strong">
              {group.label}
            </NavigationMenuTrigger>

            <NavigationMenuContent
              className={
                // The width MUST be set at the `md:` variant, not the base.
                // shadcn's NavigationMenuContent ships `w-full md:w-auto`, and
                // tailwind-merge does not let a base `w-[38rem]` override a
                // `md:w-auto`: they are different variants, so both survive and
                // `md:w-auto` wins at every width that matters. The panel
                // collapsed to the trigger's width until this was scoped to
                // `md:`. Sized in rem so it cannot depend on font loading.
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
                          {/*
                            A `<button>`, not an anchor: nothing in this menu
                            navigates. See the note at the top of lib/nav.ts for
                            why a button beats both `<a>` with no href and
                            `<a href="#">`.

                            `flex flex-col items-start` is explicit rather than
                            relying on overriding the primitive's default.
                            NavigationMenuLink defaults to `flex items-center
                            gap-2`, and `asChild` does NOT run classNames
                            through tailwind-merge: Radix's Slot simply
                            concatenates the two strings. So a `block` of mine
                            and the primitive's `flex` both survive into the
                            class list and stylesheet order decides the winner,
                            which put the label and its description side by side.
                            Setting the direction I actually want removes the
                            ambiguity entirely.
                          */}
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
