"use client";

import { useRef } from "react";
import { REALITY } from "@/lib/content";
import { PLAN_IMAGES } from "@/lib/plan-media.generated";

// Drag-to-compare slider. A range input drives a clip-path, so it works by
// keyboard and needs no pointer maths.
export function PlanComparison() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      style={{ "--pos": "50%" } as React.CSSProperties}
      className="group/cmp relative aspect-3/2 w-full overflow-hidden rounded-card bg-surface-sunken select-none"
    >
      <img
        src={PLAN_IMAGES.propsoch.src}
        srcSet={PLAN_IMAGES.propsoch.srcSet}
        sizes="(min-width: 1024px) 600px, (min-width: 640px) 90vw, 92vw"
        width={PLAN_IMAGES.propsoch.width}
        height={PLAN_IMAGES.propsoch.height}
        alt={REALITY.propsochAlt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />

      <img
        src={PLAN_IMAGES.broker.src}
        srcSet={PLAN_IMAGES.broker.srcSet}
        sizes="(min-width: 1024px) 600px, (min-width: 640px) 90vw, 92vw"
        width={PLAN_IMAGES.broker.width}
        height={PLAN_IMAGES.broker.height}
        alt={REALITY.brokerAlt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover [clip-path:inset(0_calc(100%-var(--pos))_0_0)]"
      />

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        defaultValue={50}
        aria-label={REALITY.sliderLabel}
        aria-valuetext="Half brochure, half analysis"
        onInput={(event) => {
          const value = event.currentTarget.value;
          wrapRef.current?.style.setProperty("--pos", `${value}%`);

          event.currentTarget.setAttribute(
            "aria-valuetext",
            `${Math.round(Number(value))}% brochure, ${100 - Math.round(Number(value))}% analysis`
          );
        }}
        className="peer absolute inset-0 z-20 size-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus:outline-none [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 rounded-full bg-surface shadow-[0_0_0_1px_rgba(33,33,48,0.35)] peer-focus-visible:shadow-[0_0_0_1px_rgba(33,33,48,0.35),0_0_0_4px_var(--color-brand)]"
        style={{ left: "var(--pos)" }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium whitespace-nowrap text-surface shadow-lg transition-transform duration-200 group-hover/cmp:scale-105"
        style={{ left: "var(--pos)" }}
      >
        <span>&#8249;</span>
        <span>{REALITY.dragLabel}</span>
        <span>&#8250;</span>
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-surface-sunken px-3 py-1 text-sm font-medium text-ink shadow-md"
      >
        {REALITY.brokerLabel}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-brand-strong px-3 py-1 text-sm font-medium text-white shadow-md"
      >
        {REALITY.propsochLabel}
      </span>
    </div>
  );
}
