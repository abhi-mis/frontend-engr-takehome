import { PRESS } from "@/lib/content";
import { PRESS_LOGOS, type PressLogo } from "@/lib/press.generated";

// Needs (TRACK_COPIES - 1) * trackWidth >= containerWidth or the marquee shows a
// gap. Measured here: container 893px, track 684px, so two copies left a hole.
const TRACK_COPIES = 4;

export function FeaturedIn() {
  return (
    <section
      id="press"
      className="press-band lazy-section border-y border-line py-10 sm:py-12"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:gap-10">
        <h2 className="flex items-center gap-2.5 text-center text-sm font-semibold tracking-[0.02em] text-ink lg:shrink-0 lg:text-left">
          <span aria-hidden className="press-dot" />
          {PRESS.heading}
        </h2>
        <div className="press-marquee">
          {Array.from({ length: TRACK_COPIES }, (_, i) => (
            <ul
              key={i}
              className="press-track"
              aria-hidden={i === 0 ? undefined : true}
            >
              {PRESS_LOGOS.map((logo) => (
                <PressItem key={logo.src} logo={logo} cloned={i > 0} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function PressItem({
  logo,
  cloned = false,
}: {
  readonly logo: PressLogo;
  readonly cloned?: boolean;
}) {
  return (
    <li>
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={cloned ? undefined : PRESS.linkLabel(logo.name)}
        tabIndex={cloned ? -1 : undefined}
        className="press-card group/press"
      >
        <img
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[26px] w-auto opacity-90 mix-blend-multiply grayscale transition duration-200 group-hover/press:opacity-100 group-hover/press:grayscale-0 group-focus-visible/press:opacity-100 group-focus-visible/press:grayscale-0 sm:h-[30px]"
        />
      </a>
    </li>
  );
}
