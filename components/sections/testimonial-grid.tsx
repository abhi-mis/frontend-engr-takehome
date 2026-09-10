"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "@/components/icons";
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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const gridRef = useRef<HTMLUListElement>(null);

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

  const featured = items[featuredIndex];
  const featuredNames = featured.people.map((person) => person.name).join(" & ");
  const showTestimonial = (index: number) => {
    setPlayingIndex(null);
    setFeaturedIndex(index);
  };
  const selectPrevious = () => {
    setPlayingIndex(null);
    setFeaturedIndex((current) => (current - 1 + items.length) % items.length);
  };
  const selectNext = () => {
    setPlayingIndex(null);
    setFeaturedIndex((current) => (current + 1) % items.length);
  };

  return (
    <>
      <ul
        ref={gridRef}
        className="testimonial-showcase mt-12 sm:mt-14"
      >
        {items.map((item, index) => {
          const poster = POSTERS[item.youtubeId];
          const names = item.people.map((p) => p.name).join(" and ");
          let distance = index - featuredIndex;
          if (distance > 1) distance -= items.length;
          if (distance < -1) distance += items.length;
          const position = distance === 0 ? "active" : distance < 0 ? "previous" : "next";

          return (
            <li
              key={item.youtubeId}
              data-position={position}
              className="testimonial-item min-w-0"
              aria-hidden={position === "active" ? undefined : true}
            >
              <figure className="testimonial-card flex h-full flex-col">
                {/* The whole poster is the control, not a small badge on top of
                    it. A 373x210 target is a great deal easier to hit than a
                    56px circle, and there is nothing else inside it to click. */}
                {playingIndex === index ? (
                  <div className="testimonial-inline-player aspect-video w-full overflow-hidden rounded-card bg-ink shadow-lg">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={`Video testimonial from ${names}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (position !== "active") {
                        showTestimonial(index);
                        return;
                      }
                      setPlayingIndex(index);
                    }}
                    tabIndex={position === "active" ? 0 : -1}
                    aria-label={position === "active" ? `Play the video testimonial from ${names}` : `Show the testimonial from ${names}`}
                    className="testimonial-poster group/play relative block w-full overflow-hidden rounded-card bg-ink shadow-lg"
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
                    <span className="testimonial-play flex size-14 items-center justify-center rounded-full bg-brand text-on-brand shadow-lg transition-transform duration-[260ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover/play:scale-[1.09] group-active/play:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/play:scale-100 motion-reduce:group-active/play:scale-100">
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
                )}

                <figcaption className="testimonial-caption mt-5 flex flex-1 flex-col">
                  <blockquote className="testimonial-quote flex-1 text-[0.98rem] leading-[1.65] text-ink sm:text-base">
                    <p>{`“${item.quote}”`}</p>
                  </blockquote>

                  <div className="testimonial-people mt-5 flex flex-wrap items-start gap-x-3 gap-y-3">
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
                          <span className="text-xs leading-5 text-ink-muted">
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

      <div className="testimonial-carousel-controls">
        <button type="button" onClick={selectPrevious} className="testimonial-arrow" aria-label="Previous testimonial">
          <span aria-hidden>←</span>
        </button>
        <div className="testimonial-dots" aria-label="Choose a testimonial">
          {items.map((item, index) => (
            <button
              key={item.youtubeId}
              type="button"
              onClick={() => showTestimonial(index)}
              aria-label={`Show testimonial ${index + 1}`}
              aria-current={index === featuredIndex ? "true" : undefined}
              className="testimonial-dot"
            />
          ))}
        </div>
        <button type="button" onClick={selectNext} className="testimonial-arrow" aria-label="Next testimonial">
          <span aria-hidden>→</span>
        </button>
      </div>

      <div className="testimonial-story" aria-live="polite">
        <p className="testimonial-story-kicker">Homebuyer story</p>
        <blockquote className="testimonial-featured-quote">
          <p>{`“${featured.quote}”`}</p>
        </blockquote>
        <div className="testimonial-featured-people">
          {featured.people.map((person, index) => (
            <span key={person.name} className="flex items-start gap-3">
              {index > 0 && <span aria-hidden className="text-brand-strong">&amp;</span>}
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-ink">{person.name}</span>
                <span className="text-xs leading-5 text-ink-muted">{person.role}</span>
              </span>
            </span>
          ))}
        </div>
        <p className="sr-only">Currently showing the story from {featuredNames}.</p>
      </div>

    </>
  );
}
