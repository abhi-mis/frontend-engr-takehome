"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CrossIcon, MenuIcon } from "@/components/icons";
import { HEADER_ACTIONS, NAV_GROUPS } from "@/lib/nav";

// Mobile menu in a portal, with focus return and Escape to close.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = "mobile-nav-panel";

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

    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-surface-alt"
      >
        <MenuIcon aria-hidden className="size-5" />
        <span className="sr-only">{HEADER_ACTIONS.menuLabel}</span>
      </button>
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
