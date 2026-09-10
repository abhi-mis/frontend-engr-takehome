"use client";

import { Fragment } from "react";
import { Tabs } from "radix-ui";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "@/components/tab-strip";
import { CheckIcon, CrossIcon } from "@/components/icons";
import { COMPARISON, COMPARISON_SETS } from "@/lib/content";

/**
 * "How are we different?" One comparison at a time.
 *
 * WHY TWO COLUMNS OF ANSWERS AND NEVER THREE
 *
 * Propsoch's own section works this way, and reading their data explains why:
 * the two comparisons do not share criteria. Against portals the argument is
 * about DATA, five rows on depth, accuracy, validity and sources. Against
 * brokers it is about CONDUCT, nine rows on pressure, spam, curation and
 * support. Only "Transparency" appears in both.
 *
 * A single table with a column each would therefore need a union of thirteen
 * criteria with holes in two thirds of it, and the holes would have to be
 * filled with something. That is precisely what went wrong here before: the
 * gaps got filled with copy I wrote, so the page carried invented claims about
 * named competitors. Two tables, each with its own criteria, is not only their
 * design, it is the only version of this that does not require making things up.
 *
 * ONE TABLE, ALL WIDTHS
 *
 * This section used to ship two DOM trees, a desktop table and a mobile card
 * list, toggled with `hidden md:block`. That made it the single heaviest thing
 * on the page at 461 elements. A three column table is narrow enough to hold up
 * at 360px once the type scales down, so there is one tree now and the mobile
 * markup no longer exists to pay for.
 *
 * `scope="col"` and `scope="row"` are what make it a table rather than a grid
 * of phrases: a screen reader announces "Transparency, Propsoch, Detailed pros
 * and cons" when moving across a row.
 *
 * THE `forceMount` IS A BUG FIX, NOT AN OPTIMISATION
 *
 * Radix does not mount an inactive tab panel by default, so every trigger
 * advertises `aria-controls` pointing at an id that is not in the document.
 * That is a real WCAG 1.3.1 failure and it is the default behaviour. Keeping
 * both panels mounted fixes it; hiding the inactive one with `display: none`
 * keeps it out of the accessibility tree, so a reader still meets exactly one.
 */
export function ComparisonTabs() {
  return (
    // Radix directly rather than through components/ui/tabs, and the FAQ's
    // strip does the same. shadcn's TabsList and TabsTrigger carry a
    // segmented-control shape (`inline-flex w-fit`, `flex-1`, a `data-active`
    // background, an `::after` underline and a set of dark-mode rules) that
    // has to be fought class by class to become anything else. The shared
    // treatment in components/tab-strip.ts is a row of pills, so it is
    // cheaper and far less fragile to skip the wrapper than to override it.
    <Tabs.Root
      defaultValue={COMPARISON_SETS[0].id}
      className="mt-8 flex flex-col gap-5"
    >
      <Tabs.List aria-label={COMPARISON.tabsLabel} className={TAB_LIST_CLASS}>
        {COMPARISON_SETS.map((set) => (
          <Tabs.Trigger
            key={set.id}
            value={set.id}
            className={TAB_TRIGGER_CLASS}
          >
            {set.tabLabel}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {COMPARISON_SETS.map((set) => (
        <Tabs.Content
          key={set.id}
          value={set.id}
          forceMount
          // forceMount alone is not enough. Radix only applies `hidden` through
          // its Presence exit path, so without this both panels render at once
          // and the page shows both comparisons stacked.
          className="data-[state=inactive]:hidden"
        >
          {/* overflow-x-auto, not overflow-hidden, and this was a real bug.
              At 360px the three columns need 361px and the viewport gives 345,
              so `overflow-hidden` CLIPPED the competitor column: the answers
              were on the page, inside the accessibility tree, and impossible to
              read or reach. Scrolling is the honest failure mode for a table
              that does not fit. overflow-y is pinned to visible so setting the
              x axis does not quietly turn on a vertical scrollbar too.

              The padding below also tightens on small screens, which gets the
              table under the viewport width in the common case, so the scroll
              is a safety net rather than the everyday experience. */}
          <div className="overflow-x-auto [overflow-y:visible] rounded-card bg-surface-raised shadow-md">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{set.caption}</caption>

              <thead>
                <tr className="border-b border-line bg-surface-sunken">
                  <th
                    scope="col"
                    className="px-2 py-3 text-[0.7rem] font-bold tracking-wide text-ink-muted uppercase sm:px-5 sm:py-4 sm:text-sm sm:tracking-normal sm:normal-case"
                  >
                    {COMPARISON.criteriaHeader}
                  </th>
                  {/* Propsoch's column is tinted the whole way down, so the eye
                      can follow one answer set without reading the header
                      again on every row. */}
                  <th
                    scope="col"
                    className="bg-brand-tint px-2 py-3 text-xs font-bold text-brand-strong sm:px-5 sm:py-4 sm:text-sm"
                  >
                    {COMPARISON.propsochHeader}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-xs font-bold text-ink sm:px-5 sm:py-4 sm:text-sm"
                  >
                    {set.columnLabel}
                    {set.columnNote && (
                      // Their own parenthetical, in normal weight on its own
                      // line exactly as they set it.
                      //
                      // "(Housing/99Acres/Magicbricks)" is a single 29
                      // character token with no spaces, and an unbreakable
                      // token sets a column's MINIMUM width. It alone forced
                      // the table to 364px inside a 313px card and pushed the
                      // competitor's answers off the edge, where they were
                      // present, announced, and impossible to read.
                      //
                      // `overflow-wrap: anywhere` fixed the width and broke it
                      // mid-word, as "99Acre / s/Magicbricks". A <wbr/> after
                      // each slash gives the browser the break points a reader
                      // would choose instead, which is the same place Propsoch
                      // put their own hard <br/> on narrow screens, without
                      // hard-coding one width's worth of layout into the data.
                      <span className="mt-0.5 block text-[0.7rem] leading-tight font-normal text-ink-muted sm:text-xs">
                        {set.columnNote.split("/").map((part, i, all) => (
                          <Fragment key={part}>
                            {part}
                            {i < all.length - 1 && (
                              <>
                                {"/"}
                                <wbr />
                              </>
                            )}
                          </Fragment>
                        ))}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {set.rows.map((row, index) => {
                  const isLast = index === set.rows.length - 1;
                  const rule = isLast ? "" : " border-b border-line";
                  return (
                    <tr key={row.criteria}>
                      <th
                        scope="row"
                        className={`px-2 py-3 align-top text-xs font-semibold text-ink sm:px-5 sm:py-4 sm:text-sm${rule}`}
                      >
                        {row.criteria}
                      </th>

                      <td
                        className={`bg-brand-tint px-2 py-3 align-top sm:px-5 sm:py-4${rule}`}
                      >
                        <span className="flex items-start gap-1.5 sm:gap-2">
                          <CheckIcon
                            aria-hidden
                            className="mt-0.5 hidden size-3.5 shrink-0 text-brand-strong min-[400px]:block sm:size-4"
                          />
                          <span className="text-xs font-medium text-ink sm:text-sm">
                            {row.propsoch}
                          </span>
                        </span>
                      </td>

                      <td className={`px-2 py-3 align-top sm:px-5 sm:py-4${rule}`}>
                        <span className="flex items-start gap-1.5 sm:gap-2">
                          <CrossIcon
                            aria-hidden
                            className="mt-0.5 hidden size-3.5 shrink-0 text-ink-muted min-[400px]:block sm:size-4"
                          />
                          <span className="text-xs text-ink-muted sm:text-sm">
                            {row.other}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
