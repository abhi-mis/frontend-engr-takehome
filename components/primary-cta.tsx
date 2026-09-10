import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";

// The one primary action style, so every orange button on the page is identical.
interface PrimaryCtaProps {
  readonly children: React.ReactNode;

  readonly size?: "default" | "lg";

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
        "group/cta border-0 bg-brand-button font-semibold text-white",
        "hover:bg-brand-display active:bg-brand-strong",
        "shadow-[0_1px_2px_rgba(26,18,6,0.15)] hover:shadow-[0_3px_8px_rgba(255,109,51,0.22)]",
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
