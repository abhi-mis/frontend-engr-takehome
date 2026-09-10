"use client";

import { Fragment } from "react";
import { Tabs } from "radix-ui";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "@/components/tab-strip";
import { CheckIcon, CrossIcon } from "@/components/icons";
import { COMPARISON, COMPARISON_SETS } from "@/lib/content";

// Two separate tables, not one: the portal and broker comparisons do not share
// criteria. Both panels stay mounted so a crawler sees them.
export function ComparisonTabs() {
  return (
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
          className="data-[state=inactive]:hidden"
        >
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
