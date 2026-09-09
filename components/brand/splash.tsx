import { Logo } from "@/components/brand/logo";

/**
 * The loading splash.
 *
 * Server Component, ZERO client JavaScript, and it removes itself.
 *
 * HOW IT LEAVES WITHOUT JS
 *
 * `.splash` runs a one-shot CSS animation with `animation-fill-mode: forwards`
 * that ends at `opacity: 0; visibility: hidden`. Combined with
 * `pointer-events-none` it cannot trap a click or a focus ring once it has
 * played. No state, no effect, no hydration required.
 *
 * That last part is the reason for doing it this way. A splash dismissed by a
 * `useEffect` cannot leave until React has hydrated, so its real duration is
 * "however long the JavaScript takes to boot" plus whatever timeout you wrote.
 * On the original site that would be several seconds. A CSS animation starts at
 * first paint and finishes on schedule whether or not any JavaScript ever
 * arrives, which is the correct behaviour for something whose entire job is to
 * cover the gap before the page is ready.
 *
 * WHAT IT COSTS
 *
 * Nothing on the network: the mark is the same inline SVG the header uses, and
 * the animation is three keyframe rules in the existing stylesheet.
 *
 * On Largest Contentful Paint: nothing measurable. LCP is defined in terms of
 * an element's own paint and does not account for occlusion by other elements,
 * so the hero headline underneath still registers its paint on time. The
 * splash is genuinely a visual layer over an already-painted page rather than
 * something the page waits on. I measured LCP with and without it to confirm
 * that rather than trusting the spec, and the numbers are in Implementation.md.
 *
 * `aria-hidden` plus `role="presentation"`: this is decoration over content
 * that is already in the DOM and already announced. A screen reader user should
 * be reading the page, not being told about a spinner they cannot see.
 */
export function Splash() {
  return (
    <div
      aria-hidden
      role="presentation"
      className="splash pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-surface"
    >
      {/* Mark inside a sweeping ring. */}
      <div className="relative flex size-24 items-center justify-center">
        {/* `aria-hidden` here as well as on the splash root. It is already
            inherited, so this is belt and braces, but "is this SVG exposed?"
            should be answerable by looking at the SVG rather than by walking up
            the tree, and the accessibility audit checks each one individually. */}
        <svg
          aria-hidden
          focusable={false}
          className="splash-ring absolute inset-0 size-24"
          viewBox="0 0 96 96"
          fill="none"
        >
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="var(--color-line)"
            strokeWidth="2"
          />
          {/* The arc: one dash long enough to read as a sweep, with a gap that
              covers the rest of the circumference. 2*pi*45 is about 283. */}
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="var(--color-brand)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="70 213"
          />
        </svg>

        <span className="relative flex size-14 items-center justify-center">
          <Logo width={52} variant="mark" decorative />
        </span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold tracking-[0.2em] text-ink-muted uppercase">
          Propsoch
        </p>

        {/* A progress bar that does not claim to measure anything: it eases to
            a stop rather than filling linearly, so it reads as "working"
            instead of as a percentage it does not know. */}
        <span className="block h-[3px] w-40 overflow-hidden rounded-full bg-line">
          <span className="splash-bar block h-full w-full rounded-full bg-brand-strong" />
        </span>
      </div>
    </div>
  );
}
