"use client";

import { useRef } from "react";
import { REALITY } from "@/lib/content";
import { PLAN_IMAGES } from "@/lib/plan-media.generated";

/**
 * The brochure-vs-reality comparison slider.
 *
 * HOW IT WORKS
 *
 * Two images stacked in the same box. The Propsoch drawing sits underneath at
 * full size; the builder's render is layered on top and clipped from the right
 * by a CSS custom property. Move the property and the render wipes away to show
 * the drawing beneath. Nothing is resized, nothing reflows, and the clip runs
 * on the compositor.
 *
 * WHY A RANGE INPUT AND NOT POINTER HANDLERS
 *
 * The obvious build is pointerdown/pointermove/pointerup on the container. It
 * is also how these components end up unusable without a mouse: no keyboard
 * control, no role, nothing for a screen reader to announce.
 *
 * A native <input type="range"> stretched invisibly over the image gives all of
 * that for free and correctly. Arrow keys move it, Home and End jump to the
 * ends, it exposes role="slider" with a value, it works with touch, and the
 * browser has already solved the drag maths including pointer capture. The
 * visible divider and the Drag pill are just decoration positioned at the same
 * custom property.
 *
 * The one thing it does not give away is a focus ring, since the input is
 * transparent. The divider carries it instead, via peer-focus-visible.
 *
 * WHY THERE IS NO useState HERE
 *
 * A dragged control fires input events at pointer rate. Putting that value in
 * React state re-renders this subtree on every one of them, sixty times a
 * second, for something whose only effect is one CSS property. The input is
 * left UNCONTROLLED and the handler writes the custom property straight to the
 * wrapper's style. React renders this component once and never again.
 *
 * That is also why the initial 50% is set as an inline style: it makes the
 * server-rendered markup already correct, so there is nothing to correct on
 * hydration and no flash of a mis-positioned divider.
 */
export function PlanComparison() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      style={{ "--pos": "50%" } as React.CSSProperties}
      className="group/cmp relative aspect-3/2 w-full overflow-hidden rounded-card bg-surface-sunken select-none"
    >
      {/* Underneath: the sanctioned drawing. Loads at its natural size. */}
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

      {/* On top: the brochure render, clipped to everything left of --pos. */}
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

      {/* The control.
          Opacity 0 rather than sr-only, because it has to stay exactly on top
          of the image to be draggable. The thumb is stretched to a comfortable
          grab width and the track is the full box, so a drag anywhere across
          the image moves it. */}
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
          // Keep the announced value meaningful rather than a bare number:
          // "62" tells a screen reader user nothing about what they revealed.
          event.currentTarget.setAttribute(
            "aria-valuetext",
            `${Math.round(Number(value))}% brochure, ${100 - Math.round(Number(value))}% analysis`
          );
        }}
        className="peer absolute inset-0 z-20 size-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus:outline-none [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
      />

      {/* The divider, and the focus ring the transparent input cannot show.
          Sits at --pos with a translate of -50% so the bar straddles the seam
          rather than butting up against it.

          It is deliberately TWO-TONE: a light core with a dark hairline around
          it. A focus indicator here sits on top of photographic content whose
          colour is unknown and changes as the slider moves, so a single colour
          cannot be guaranteed to contrast with it. Light-against-dark in the
          same 3px means one of the two always shows.

          Focus therefore ADDS an orange ring rather than recolouring the core.
          An earlier version swapped the white bar for brand orange on focus,
          which would have made the indicator hardest to see over exactly the
          pale drawing it spends half its time on. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 rounded-full bg-surface shadow-[0_0_0_1px_rgba(33,33,48,0.35)] peer-focus-visible:shadow-[0_0_0_1px_rgba(33,33,48,0.35),0_0_0_4px_var(--color-brand)]"
        style={{ left: "var(--pos)" }}
      />

      {/* The grab pill. Theirs, down to the guillemets. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium whitespace-nowrap text-surface shadow-lg transition-transform duration-200 group-hover/cmp:scale-105"
        style={{ left: "var(--pos)" }}
      >
        <span>&#8249;</span>
        <span>{REALITY.dragLabel}</span>
        <span>&#8250;</span>
      </div>

      {/* Which side is which. aria-hidden because the two images already say
          so in their alt text, and a screen reader does not have a slider
          position to attach these to. */}
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
