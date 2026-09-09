"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CrossIcon, MenuIcon } from "@/components/icons";
import { HEADER_ACTIONS, NAV_GROUPS } from "@/lib/nav";

/**
 * Mobile navigation: a Menu button that opens a full-height panel.
 *
 * Deliberately hand-written rather than pulling in a Dialog or Sheet primitive.
 * The requirements here are small and specific, and meeting them directly is
 * about forty lines, against another primitive's worth of client JavaScript for
 * a page that already has three islands.
 *
 * The four behaviours a disclosure panel actually owes the user, all implemented
 * below:
 *
 *   1. Escape closes it.
 *   2. Focus returns to the Menu button on close, so a keyboard user is not
 *      dumped at the top of the document.
 *   3. Body scroll is locked while it is open, so the page behind does not move
 *      under the panel.
 *   4. `aria-expanded` and `aria-controls` stay in sync with the real state.
 *
 * The groups inside use native `<details>` elements. That is the one genuinely
 * good use of `<details>` in a nav: a vertical stack of independent
 * expand/collapse sections, where the browser gives correct semantics, keyboard
 * support and `aria-expanded` for free, with no state of my own.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = "mobile-nav-panel";

  // Escape to close, and lock scroll while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    // Return focus to where it came from, on the next tick so the panel has
    // unmounted first.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        // Only while the panel exists. The panel is portalled and mounted on
        // open, so a constant aria-controls points at an id that is absent for
        // most of the page's life; axe flags it and anything following the
        // relationship lands nowhere. aria-expanded still carries the state.
        aria-controls={open ? panelId : undefined}
        className="inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-surface-alt"
      >
        <MenuIcon aria-hidden className="size-5" />
        <span className="sr-only">{HEADER_ACTIONS.menuLabel}</span>
      </button>

      {/*
        PORTALLED TO document.body, and this is not optional.

        The panel is `position: fixed`, and the site header it lives in carries
        `backdrop-blur-md`. `backdrop-filter` makes an element a CONTAINING
        BLOCK for fixed-position descendants, exactly like `transform`, `filter`
        and `will-change` do. So `fixed inset-x-0 top-16 bottom-0` resolved
        against the 64px header instead of the viewport, and the menu rendered
        as a thin sliver with all its content clipped.

        Portalling the panel out to the body takes it out of the header's
        containing block, so `fixed` means fixed to the viewport again. The
        alternative was dropping the header's blur, which would have been fixing
        the symptom by deleting the feature.
      */}
      {open &&
        createPortal(
          <div
            id={panelId}
            className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-line bg-surface px-4 pt-2 pb-16 lg:hidden"
          >
            <div className="flex items-center justify-between py-2">
              <p className="text-xs font-bold tracking-wide text-ink-muted uppercase">
                {HEADER_ACTIONS.menuLabel}
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-surface-alt"
              >
                <CrossIcon aria-hidden className="size-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <ul className="flex flex-col">
              {NAV_GROUPS.map((group) => (
                <li key={group.label} className="border-b border-line">
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between py-2 text-base font-semibold text-ink">
                      {group.label}
                      {/* Rotates when the details element is open. Pure CSS off
                        the native open state, no JS. */}
                      <span
                        aria-hidden
                        className="text-ink-muted transition-transform group-open:rotate-45"
                      >
                        <PlusGlyph />
                      </span>
                    </summary>

                    <div className="pb-3">
                      {group.columns.map((column) => (
                        <div key={column.heading ?? "col"} className="mb-2">
                          {column.heading && group.columns.length > 1 && (
                            <p className="mt-2 mb-1 text-xs font-bold tracking-wide text-ink-muted uppercase">
                              {column.heading}
                            </p>
                          )}
                          <ul className="flex flex-col">
                            {column.items.map((item) => (
                              <li key={item.label}>
                                {/* A button, not an anchor: nothing in this
                                    menu navigates. See lib/nav.ts. */}
                                <button
                                  type="button"
                                  className="flex min-h-11 w-full flex-col justify-center rounded-lg px-2 py-2 text-left hover:bg-surface-alt"
                                >
                                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                                    {item.label}
                                    {item.isNew && (
                                      <span className="text-[0.65rem] font-bold tracking-wide text-brand-strong uppercase">
                                        New
                                      </span>
                                    )}
                                  </span>
                                  {item.description && (
                                    <span className="mt-0.5 text-xs leading-snug text-ink-muted">
                                      {item.description}
                                    </span>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}

/** A plus that becomes a cross when rotated 45 degrees. */
function PlusGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
