"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, CrossIcon } from "@/components/icons";
import { COMPARISON, COMPARISON_ROWS, type ComparisonRow } from "@/lib/content";

/**
 * Mobile comparison. The only client island in this section.
 *
 * WHY THIS IS TABS AND NOT THREE COLUMNS
 *
 * Reading the original's markup, its tabs choose WHICH COMPETITOR you compare
 * against, and the Propsoch column is always on screen. That is the right call
 * and this keeps it: three columns of prose on a 360px screen is unreadable, so
 * each panel shows exactly two answers, Propsoch's and one competitor's.
 *
 * WHY IT COSTS CLIENT JAVASCRIPT AT ALL
 *
 * Real ARIA tabs need a roving tabindex and arrow key handling, which cannot be
 * done in CSS. Radix supplies `role="tablist"`, `aria-selected`, matching
 * `aria-controls`/`id` pairs, and Left, Right, Home and End keys. This is the
 * one place on the page where buying a primitive is cheaper than being correct
 * by hand.
 *
 * THE `forceMount` IS THE BUG FIX, NOT AN OPTIMISATION
 *
 * The brief flagged broken `aria-controls` on the original. Rendering the live
 * site showed the exact mechanism: Radix does not mount inactive tab panels by
 * default, so every trigger advertises `aria-controls="...-content-x"` while no
 * element with that id exists in the document. That is a real WCAG 1.3.1
 * failure, and it is a trap anyone using Radix Tabs can fall into without
 * noticing.
 *
 * `forceMount` keeps both panels in the DOM. Radix then marks the inactive one
 * `hidden`, which removes it from the accessibility tree, so a screen reader
 * still encounters exactly one panel while `aria-controls` always resolves.
 */

/** The two competitors, and which field of a row each one reads. */
const COMPETITORS = [
  {
    id: "local_brokers",
    tabLabel: "vs Local brokers",
    columnLabel: COMPARISON.localBrokersHeader,
    field: "localBrokers",
  },
  {
    id: "online_portals",
    tabLabel: "vs Online portals",
    columnLabel: COMPARISON.onlinePortalsHeader,
    field: "onlinePortals",
  },
] as const satisfies readonly {
  id: string;
  tabLabel: string;
  columnLabel: string;
  // Constrained to the row fields that hold a competitor's answer, so a typo
  // here is a compile error rather than an "undefined" rendered on the page.
  field: keyof Pick<ComparisonRow, "localBrokers" | "onlinePortals">;
}[];

export function ComparisonTabs() {
  return (
    <Tabs defaultValue={COMPETITORS[0].id} className="gap-5">
      <TabsList
        // shadcn's TabsList is h-8 and its inactive trigger colour is
        // `text-foreground/60`. Both are overridden below: h-8 is under the
        // 44px touch target the brief requires, and foreground at 60% alpha
        // over this panel computes to 4.10:1, which FAILS AA. That is the same
        // low-contrast tab text the brief asks me to fix on the original, and
        // it ships as the library default.
        className="h-auto w-full gap-1 rounded-card bg-surface-raised p-1.5 shadow-xs"
      >
        {COMPETITORS.map((competitor) => (
          <TabsTrigger
            key={competitor.id}
            value={competitor.id}
            // The active pill was bg-surface (#FBFBFA) on a bg-surface-alt
            // list. With the list moved to the raised white step, that pair
            // became invisible, so the active state now carries the brand tint
            // instead. brandStrong on brandTint is asserted in the contrast
            // gate, and a tinted active tab reads more deliberate than a white
            // one on grey.
            className="min-h-11 flex-1 rounded-inner text-sm font-semibold text-ink-muted data-active:bg-brand-tint data-active:text-brand-strong data-active:shadow-xs"
          >
            {competitor.tabLabel}
          </TabsTrigger>
        ))}
      </TabsList>

      {COMPETITORS.map((competitor) => (
        <TabsContent
          key={competitor.id}
          value={competitor.id}
          forceMount
          // `forceMount` on its own is NOT enough, and this caught me out.
          // Radix only applies `hidden` through its Presence exit path, so with
          // forceMount both panels render fully visible and the page shows both
          // competitors stacked. Hiding the inactive one in CSS keeps it in the
          // DOM (so `aria-controls` still resolves, which was the whole point)
          // while `display: none` removes it from the accessibility tree, so a
          // screen reader still meets exactly one panel.
          className="data-[state=inactive]:hidden"
        >
          {/* An ordered structure would imply ranking, so this is a plain list
              of criteria. Each item is a mini two row comparison. */}
          <ul className="flex flex-col gap-3">
            {COMPARISON_ROWS.map((row) => (
              <li
                key={row.criteria}
                className="overflow-hidden rounded-card bg-surface-raised shadow-md"
              >
                {/* The border-b here STAYS. It is an internal divider between
                    a card's header band and its body, which is a different
                    thing from the outline that used to draw the card itself.
                    Removing outlines does not mean removing rules. */}
                <p className="border-b border-line bg-surface-sunken px-4 py-2.5 text-xs font-bold tracking-wide text-ink uppercase">
                  {row.criteria}
                </p>

                <div className="flex flex-col">
                  {/* Propsoch, always shown, always first, tinted. */}
                  <div className="flex items-start gap-3 bg-brand-tint px-4 py-3">
                    <CheckIcon
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-brand-strong"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-brand-strong">
                        {COMPARISON.propsochHeader}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-ink">
                        {row.propsoch}
                      </p>
                    </div>
                  </div>

                  {/* The selected competitor. */}
                  <div className="flex items-start gap-3 px-4 py-3">
                    <CrossIcon
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-ink-muted"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink-muted">
                        {competitor.columnLabel}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {row[competitor.field]}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
