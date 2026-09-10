"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "@/components/icons";
import { POSTERS } from "@/lib/posters.generated";
import type { Testimonial } from "@/lib/content";

const PRECONNECT_ORIGINS = [
  "https://www.youtube-nocookie.com",
  "https://i.ytimg.com",
];

interface TestimonialGridProps {
  readonly items: readonly Testimonial[];
}

// Poster images until clicked, so no YouTube iframe loads on first paint.
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
          if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
            continue;
          }
          const link = document.createElement("link");
          link.rel = "preconnect";
          link.href = href;

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
                    alt=""
                    width={poster.width}
                    height={poster.height}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-video w-full object-cover transition-transform duration-500 group-hover/play:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/play:scale-100"
                  />

                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,18,6,0.05)_0%,rgba(26,18,6,0.28)_100%)]"
                  />

                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="testimonial-play flex size-14 items-center justify-center rounded-full bg-brand text-on-brand shadow-lg transition-transform duration-[260ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover/play:scale-[1.09] group-active/play:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/play:scale-100 motion-reduce:group-active/play:scale-100">
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
