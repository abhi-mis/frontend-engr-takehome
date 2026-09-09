"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { CrossIcon, PlayIcon } from "@/components/icons";
import { POSTERS } from "@/lib/posters.generated";
import type { Testimonial } from "@/lib/content";

/**
 * The video testimonials, as a facade grid with a dialog player.
 *
 * THE ONE DECISION THIS COMPONENT IS ABOUT
 *
 * Three YouTube iframes would cost roughly 700 KB to 1 MB EACH in JavaScript,
 * CSS and images, across a dozen requests to several third-party origins, with
 * cookies, and all of it runs on load whether or not anyone presses play. On a
 * page whose entire budget is under 300 KB that is not a tradeoff.
 *
 * So this is a facade: a poster and a play button that look exactly like a
 * player, and the real embed is mounted only when someone asks for it. Until
 * that click the page keeps its zero third-party requests. After it, one iframe
 * exists, for the one video that was actually wanted.
 *
 * WHY A GRID AND NOT THE ORIGINAL'S CAROUSEL
 *
 * The original shows one video at a time with the neighbours faded to 15% and
 * bleeding off both edges, and only the active slide's quote is in the DOM at
 * all. Two consequences: you cannot read two testimonials without operating a
 * control, and two thirds of the social proof is invisible to a search engine
 * and to a screen reader at any given moment. (It also made this content
 * genuinely hard to extract; see the note in lib/content.ts.)
 *
 * A grid shows all three quotes at once, needs no controls, has no state to get
 * wrong, and reads the same to a person and to a crawler. The video still gets
 * to be large, because playing happens in a dialog rather than inside a
 * 373px-wide card.
 *
 * WHAT THE INTERSECTION OBSERVER IS FOR
 *
 * Not lazy-loading. The posters already do that natively with loading="lazy",
 * which is better than any observer I could write.
 *
 * It is for the CONNECTION. The expensive part of the first play is not the
 * iframe markup, it is the cold start: DNS, TCP and TLS to two new origins
 * before a single byte of video arrives, which is easily 300ms and can be far
 * worse on mobile. The observer fires when the section is still 400px below the
 * viewport and opens those connections early, so by the time a finger reaches
 * the play button the handshakes are already done.
 *
 * preconnect is the right hint precisely because it transfers nothing. It is
 * not a prefetch and it is not a preload: no bytes, no cookies, no third-party
 * request in the waterfall. The page's "zero third-party requests" claim is
 * still true after this runs.
 *
 * It disconnects after the first hit, because warming a connection twice does
 * nothing and an observer left running is a listener nobody owns.
 */

const PRECONNECT_ORIGINS = [
  // The player itself. -nocookie is not cosmetic: the standard youtube.com
  // embed sets tracking cookies as soon as it loads, and this domain does not
  // until playback actually starts.
  "https://www.youtube-nocookie.com",
  // Where the player pulls its own images and static assets from.
  "https://i.ytimg.com",
];

interface TestimonialGridProps {
  readonly items: readonly Testimonial[];
}

export function TestimonialGrid({ items }: TestimonialGridProps) {
  const [active, setActive] = useState<Testimonial | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  /**
   * The play button that opened the dialog, so focus can be put back on it.
   *
   * Radix restores focus on close by itself and normally that is enough. It is
   * not enough here, and this was found by testing rather than by reading: open
   * a video, press Escape, and focus lands on BODY instead of the button.
   *
   * The cause is the cross-origin iframe. Once the player loads it takes focus
   * inside itself, and from outside the iframe there is nothing readable there,
   * so the focus scope has no in-scope element to return from and gives up.
   * The result for a keyboard user is being dumped at the top of the document
   * and having to tab all the way back down to where they were.
   *
   * onCloseAutoFocus is the sanctioned place to override this: preventDefault
   * stops Radix's own attempt and we do it ourselves, at exactly the moment it
   * would have.
   */
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        for (const href of PRECONNECT_ORIGINS) {
          // Guard against double-inserting across a fast remount.
          if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
            continue;
          }
          const link = document.createElement("link");
          link.rel = "preconnect";
          link.href = href;
          // Cross-origin is required for the TLS handshake to be reused.
          link.crossOrigin = "";
          document.head.appendChild(link);
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ul
        ref={gridRef}
        className="mt-12 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => {
          const poster = POSTERS[item.youtubeId];
          const names = item.people.map((p) => p.name).join(" and ");

          return (
            <li key={item.youtubeId}>
              <figure className="flex h-full flex-col">
                {/* The whole poster is the control, not a small badge on top of
                    it. A 373x210 target is a great deal easier to hit than a
                    56px circle, and there is nothing else inside it to click. */}
                <button
                  type="button"
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget;
                    setActive(item);
                  }}
                  aria-label={`Play the video testimonial from ${names}`}
                  className="group/play relative block w-full overflow-hidden rounded-card bg-ink shadow-md transition-shadow hover:shadow-lg"
                >
                  <img
                    src={poster.src}
                    // Empty alt on purpose. The button already carries the full
                    // accessible name, and the people are named in the caption
                    // directly below. Describing the poster too would make a
                    // screen reader say the same names three times.
                    alt=""
                    width={poster.width}
                    height={poster.height}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-video w-full object-cover transition-transform duration-500 group-hover/play:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/play:scale-100"
                  />

                  {/* A scrim, so the play button holds its contrast over
                      whatever frame the poster happens to be. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,18,6,0.05)_0%,rgba(26,18,6,0.28)_100%)]"
                  />

                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* The hover scale is a Tailwind utility, not a rule in
                        globals.css. It used to be the latter and it silently
                        did nothing: the selector Tailwind generates for a named
                        group escapes the slash, hand-writing that escape lost
                        the backslash, and the resulting invalid rule was
                        dropped by the production build without complaint. The
                        framework escapes its own class names correctly, so let
                        it.

                        The badge scales further than the poster underneath it
                        (1.09 against 1.03) on purpose. Two elements moving at
                        different rates read as depth; the same rate reads as
                        one flat image being resized. */}
                    <span className="flex size-14 items-center justify-center rounded-full bg-brand text-on-brand shadow-lg transition-transform duration-[260ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover/play:scale-[1.09] group-active/play:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/play:scale-100 motion-reduce:group-active/play:scale-100">
                      {/* Nudged right by a hair: a triangle's optical centre is
                          left of its bounding box, so a centred play glyph
                          always looks like it is sliding backwards.

                          aria-hidden here as well as on the span around it. It
                          is already inherited, so this is belt and braces, but
                          "is this SVG exposed to assistive technology?" should
                          be answerable by looking at the SVG rather than by
                          walking up the tree, and the audit checks each one
                          individually for exactly that reason. */}
                      <PlayIcon
                        aria-hidden
                        focusable={false}
                        className="size-6 translate-x-[2px] fill-current"
                      />
                    </span>
                  </span>
                </button>

                <figcaption className="mt-5 flex flex-1 flex-col">
                  <blockquote className="flex-1 text-base leading-[1.55] text-ink">
                    <p>{`“${item.quote}”`}</p>
                  </blockquote>

                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {item.people.map((person, i) => (
                      <span key={person.name} className="flex items-center gap-3">
                        {i > 0 && (
                          <span aria-hidden className="text-brand-strong">
                            &amp;
                          </span>
                        )}
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-ink">
                            {person.name}
                          </span>
                          <span className="text-xs text-ink-muted">
                            {person.role}
                          </span>
                        </span>
                      </span>
                    ))}
                  </div>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      {/* The player.
          Radix Dialog rather than a hand-rolled overlay, because the things it
          does are the things hand-rolled overlays get wrong: focus moves in and
          is trapped, Escape closes, the rest of the page goes inert and
          aria-hidden, body scroll locks, and focus returns to the button that
          opened it. Radix is already in this bundle for the tabs and the
          slider, so the marginal cost is small.

          `active &&` is what makes this a facade rather than a hidden embed:
          when nothing is selected there is no iframe in the tree at all. */}
      <Dialog.Root
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[120] bg-[rgba(20,20,30,0.72)] backdrop-blur-sm data-[state=open]:animate-[propsoch-fade-in_180ms_ease-out]" />

          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              lastTriggerRef.current?.focus();
            }}
            className="fixed top-1/2 left-1/2 z-[130] w-[min(96vw,60rem)] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          >
            {active && (
              <>
                <div className="flex items-start justify-between gap-4 pb-3">
                  <Dialog.Title className="text-sm font-semibold text-surface">
                    {active.people.map((p) => p.name).join(" & ")}
                  </Dialog.Title>

                  <Dialog.Close
                    aria-label="Close the video"
                    className="-mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-surface/15 text-surface transition-colors hover:bg-surface/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface"
                  >
                    <CrossIcon aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>

                {/* Radix wants a description or an explicit opt-out. The video
                    is the description, and the title above already names the
                    speakers, so an invisible paragraph repeating the quote
                    would just be noise read out on open. */}
                <Dialog.Description className="sr-only">
                  {`Video testimonial. ${active.quote}`}
                </Dialog.Description>

                <div className="aspect-video w-full overflow-hidden rounded-card bg-ink shadow-lg">
                  <iframe
                    // autoplay is user-initiated: they pressed a play button to
                    // get here, so this is the expected behaviour rather than
                    // the kind media autoplay policies exist to stop.
                    src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={`Video testimonial from ${active.people
                      .map((p) => p.name)
                      .join(" and ")}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
