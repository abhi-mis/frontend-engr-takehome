import { Logo } from "@/components/brand/logo";

// First-paint splash. Hidden outright under prefers-reduced-motion.
export function Splash() {
  return (
    <div
      aria-hidden
      role="presentation"
      className="splash pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-surface"
    >
      <div className="relative flex size-24 items-center justify-center">
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
        <span className="block h-[3px] w-40 overflow-hidden rounded-full bg-line">
          <span className="splash-bar block h-full w-full rounded-full bg-brand-strong" />
        </span>
      </div>
    </div>
  );
}
