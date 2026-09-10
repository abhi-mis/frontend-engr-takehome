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

const DEFAULT_BUDGET = 1_00_00_000;

// Not currently rendered; kept because the maths in lib/currency.ts is tested.
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

  useEffect(() => {
    const thumb = rootRef.current?.querySelector<HTMLElement>(
      '[data-slot="slider-thumb"]'
    );
    if (!thumb) return;

    thumb.setAttribute("aria-labelledby", labelId);
    thumb.setAttribute("aria-valuetext", describeIndianCurrency(budget));
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

          <div className="rounded-card bg-surface-raised p-5 shadow-lg sm:p-8">
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
                className={[
                  "[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-line",
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
