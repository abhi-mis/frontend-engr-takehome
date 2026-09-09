import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";

/**
 * The one primary call to action style, reused everywhere on the page.
 *
 * The design thesis is that the original shouts from several places at once, so
 * this rebuild has exactly one primary-weight action and every instance of it
 * looks identical. Centralising it here is what enforces that: there is no way
 * to render a slightly different orange button, because there is only one
 * component that renders one.
 *
 * BRIGHT ORANGE LABEL AND THE DESIGN SYSTEM
 *
 * The CTA intentionally matches the bright orange from the reference design
 * and always keeps a white label, including its arrow and interaction states.
 *
 * The interaction states remain inside the same orange family:
 *
 *   resting       `--color-brand-button` (`#FF6D33`)
 *   hover         `--color-brand-display` (`#EF5410`)
 *   active        `--color-brand-strong` (`#C2410C`)
 *
 * This keeps the CTA recognizable as the same brand device as the ribbon while
 * preserving a readable label and a visible focus treatment.
 *
 * Height is `h-11` (44px) or `h-12` in the hero, because shadcn's largest size
 * is `h-9` (36px), under the brief's 44px touch target.
 *
 * On click behaviour: per the plan, no call to action on this page performs an
 * action. It is still a real `<button>` with an accessible name, a visible focus
 * ring and a 44px target, because a non-functional control still has to be a
 * correct control.
 */

interface PrimaryCtaProps {
  readonly children: React.ReactNode;
  /** "lg" is the hero. "default" is the header and inline uses. */
  readonly size?: "default" | "lg";
  /** Shows a trailing arrow that nudges on hover. */
  readonly withArrow?: boolean;
  readonly className?: string;
}

export function PrimaryCta({
  children,
  size = "default",
  withArrow = false,
  className,
}: PrimaryCtaProps) {
  return (
    <Button
      type="button"
      className={[
        // `border-0` is explicit. shadcn's base sets `border border-transparent`,
        // and a transparent border still occupies a pixel of box, so removing it
        // rather than recolouring it keeps the metrics honest.
        "group/cta border-0 bg-brand-button font-semibold text-white",
        "hover:bg-brand-display active:bg-brand-strong",
        "shadow-[0_1px_2px_rgba(26,18,6,0.18)] hover:shadow-[0_6px_16px_rgba(255,109,51,0.32)]",
        size === "lg" ? "h-12 gap-2 px-7 text-base" : "h-11 gap-2 px-5 text-sm",
        className ?? "",
      ].join(" ")}
    >
      {children}
      {withArrow && (
        <ArrowRightIcon
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
        />
      )}
    </Button>
  );
}
