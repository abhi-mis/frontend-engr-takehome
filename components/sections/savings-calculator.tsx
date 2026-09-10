"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Slider } from "@/components/ui/slider";
import { InfoIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { CALCULATOR } from "@/lib/content";
import {
  budgetToPosition,
  describeIndianCurrency,
  estimateSaving,
  formatIndianCurrency,
  positionToBudget,
} from "@/lib/currency";

/**
 * Savings calculator. One of three client islands.
 *
 * State is a single number: the slider position from 0 to 100. Budget and
 * saving are DERIVED from it on every render rather than stored. Keeping one
 * source of truth means the displayed budget, the announced value and the
 * saving cannot disagree with the thumb, which is the usual bug in this kind of
 * widget.
 *
 * The maths lives in lib/currency.ts and is unit tested. This file is only the
 * interface.
 */

/** Rs 1 Crore. The average ticket implied by Propsoch's published average
 *  saving of about Rs 4.78 L at a 4.8% rate, so the control opens somewhere
 *  representative rather than at the bottom of the range. */
const DEFAULT_BUDGET = 1_00_00_000;

export function SavingsCalculator() {
  const [position, setPosition] = useState(() =>
    budgetToPosition(DEFAULT_BUDGET)
  );
  const isSliderMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const budget = positionToBudget(position);
  const saving = estimateSaving(budget);

  const sliderId = useId();
  const labelId = `${sliderId}-label`;
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * Puts the accessible name and the value text on the slider THUMB.
   *
   * Both of these are easy to get wrong, and I did get the first one wrong until
   * an audit caught it.
   *
   * 1. `aria-labelledby` on the Slider component lands on the Root wrapper, but
   *    the element that actually carries `role="slider"` is the THUMB. So the
   *    Root was labelled and the control itself was anonymous: a screen reader
   *    announced "slider" with no indication of what it adjusts. The name has to
   *    be on the element with the role.
   *
   * 2. The thumb's `aria-valuenow` is the slider POSITION (for example
   *    "17.718"), which is meaningless spoken aloud. `aria-valuetext` overrides
   *    it with "1 crore rupees".
   *
   * Both are set through a ref because shadcn's Slider renders the thumb
   * internally and forwards only `className` to the Root, so there is no prop
   * path to the thumb. The alternative was editing `components/ui/slider.tsx`,
   * which is the merge conflict this project avoids on purpose (Implementation.md
   * entry 1). This keeps the generated component untouched and upgradable.
   */
  useEffect(() => {
    const thumb = rootRef.current?.querySelector<HTMLElement>(
      '[data-slot="slider-thumb"]'
    );
    if (!thumb) return;

    thumb.setAttribute("aria-labelledby", labelId);
    thumb.setAttribute("aria-valuetext", describeIndianCurrency(budget));
    // isSliderMounted IS a dependency, and leaving it out was a real bug.
    //
    // The store starts false so the server and the first client commit agree,
    // which means on that first commit there is no Slider and therefore no
    // thumb, and this effect returns early. The store then flips to true and
    // the Slider renders, but neither budget nor labelId changed, so React had
    // no reason to run this again. The thumb stayed anonymous until the user
    // dragged it, which a screen reader user cannot do without the name that
    // is missing.
    //
    // An accessibility audit caught it. It had been passing for weeks only
    // because this section carries content-visibility: auto, so the scanner
    // never laid it out and skipped the check entirely. Shortening the page
    // elsewhere brought the section into the scanned region and the failure
    // appeared without anything here changing.
  }, [budget, labelId, isSliderMounted]);

  return (
    <section
      id="calculator"
      className="lazy-section bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            eyebrow={CALCULATOR.eyebrow}
            heading={CALCULATOR.heading}
            sub={CALCULATOR.intro}
          />

          {/* The tool panel: RAISED white, lifted off the page by one shadow
              token, with no outline. Both tool panels on the page use exactly
              this treatment, which is what makes them read as the same kind of
              object. */}
          <div className="rounded-card bg-surface-raised p-5 shadow-lg sm:p-8">
            {/* Budget readout. The label and value are associated by
                aria-labelledby on the slider below. */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span
                id={labelId}
                className="text-sm font-semibold text-ink-muted"
              >
                {CALCULATOR.sliderLabel}
              </span>
              <output
                htmlFor={sliderId}
                className="text-2xl font-bold text-ink tabular-nums"
              >
                {formatIndianCurrency(budget)}
              </output>
            </div>

            <div className="mt-5">
              {isSliderMounted ? (
                <Slider
                id={sliderId}
                aria-labelledby={labelId}
                value={[position]}
                onValueChange={(next) => setPosition(next[0] ?? 0)}
                min={0}
                max={100}
                step={0.5}
                // The thumb and range are styled through data-slot selectors
                // rather than by editing the generated component.
                //
                // Size: shadcn's thumb is `size-3` (12px) with an 8px invisible
                // pad, about 28px of hit area, under the 44px the brief
                // requires. This is 24px visible with a 10px pad on each side,
                // so 44px exactly.
                //
                // Colour: the filled range uses --color-brand-strong rather
                // than the brand orange. --color-brand on this panel is 2.98:1,
                // just under the 3:1 that WCAG 1.4.11 asks of a meaningful
                // graphic. The darker orange is 4.67:1 and matches the
                // timeline's progress line, so "filled means progress" reads
                // consistently across the page.
                className={[
                  "[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-line",
                  // The filled range is a GRADIENT rather than a flat fill,
                  // running from the darkened orange at the left to the
                  // display orange at the right. Both ends still clear the 3:1
                  // that WCAG 1.4.11 asks of a meaningful graphic: 4.67:1 and
                  // 3.19:1 against this panel. So the range reads as brighter
                  // and more alive without any point on it dropping below the
                  // threshold, which a gradient straight to #FF6D33 (2.98:1)
                  // would have done.
                  "[&_[data-slot=slider-range]]:bg-gradient-to-r",
                  "[&_[data-slot=slider-range]]:from-brand-strong",
                  "[&_[data-slot=slider-range]]:to-brand-display",
                  "[&_[data-slot=slider-thumb]]:size-6",
                  "[&_[data-slot=slider-thumb]]:border-2",
                  "[&_[data-slot=slider-thumb]]:border-brand-strong",
                  "[&_[data-slot=slider-thumb]]:bg-brand",
                  "[&_[data-slot=slider-thumb]]:after:-inset-[10px]",
                ].join(" ")}
                ref={rootRef}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-6 w-full rounded-full bg-line"
                />
              )}

              <div className="mt-3 flex justify-between text-xs font-medium text-ink-muted">
                <span>{formatIndianCurrency(CALCULATOR.minBudget)}</span>
                <span>{formatIndianCurrency(CALCULATOR.maxBudget)}</span>
              </div>
            </div>

            {/* Result.
                `min-h` is deliberate: the saving string changes width as the
                scale flips between lakh and crore, and without a reserved height
                a re-render could nudge the disclosure below it. Reserving the
                box keeps CLS at zero while the user drags.

                aria-live="polite" with aria-atomic means the whole phrase is
                announced once per change rather than digit by digit. */}
            <div className="mt-8 min-h-[104px] rounded-inner bg-brand-tint p-5">
              <p className="text-sm font-semibold text-brand-strong">
                {CALCULATOR.resultLabel}
              </p>
              <p
                aria-live="polite"
                aria-atomic
                className="mt-1 text-3xl font-bold text-ink tabular-nums"
              >
                {formatIndianCurrency(saving)}
              </p>
            </div>

            {/* Required by the brief: an estimate has to be labelled as
                illustrative on screen. Not in a tooltip, not behind an info
                icon, just visible next to the number it qualifies. */}
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
              <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
              {CALCULATOR.disclosure}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
