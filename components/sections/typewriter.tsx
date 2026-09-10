"use client";

import { useEffect } from "react";

/**
 * Drives the hero headline's typewriter.
 *
 * WHY THIS IS NOT A CSS ANIMATION ANY MORE
 *
 * It used to be `animation: propsoch-type 9.6s linear infinite` animating a
 * registered custom property (`--p`) that a mask and a caret both read. That is
 * a lovely, JavaScript-free implementation and it was the single most expensive
 * thing on the page.
 *
 * The reason is not the mask and not the custom property. It is that `--p`,
 * `mask-image`, `clip-path` and `background-position` are all main-thread
 * properties, and Chrome re-runs style resolution for a non-composited
 * animation on EVERY frame, whether or not the computed value actually changed.
 * The keyframes already quantised the reveal with `steps(12)`, so the value
 * changed 24 times per 9.6s cycle, and Chrome still did the work 60 times a
 * second, for as long as the page was open.
 *
 * Traced on a 4x-throttled 412px viewport over a four second window:
 *
 *     with the CSS animation   240 style recalcs   1190ms
 *     with it disabled          12 style recalcs     35ms
 *
 * That is ~1.2s of main thread for a headline effect, and it is why Total
 * Blocking Time was 543ms. I tried, and measured, five ways to keep it in CSS:
 * `contain: layout style paint`, `will-change`, `clip-path` instead of the
 * mask, plain properties with no custom property at all, and dropping to a
 * single animating element. Every one of them stayed within noise of 1200ms,
 * because every one of them still ticks on the main thread each frame. Only
 * animating opacity or transform got the recalc count down (to 10), and neither
 * can express a hard reveal edge sweeping across text.
 *
 * So the reveal is stepped from here instead. `--p` is set 24 times per cycle,
 * which is exactly as often as it visibly changes, and nothing happens at all
 * during the two holds. Same mask, same caret, same 12 steps, same timings.
 *
 * WHAT STILL WORKS WITHOUT THIS COMPONENT
 *
 * Everything readable. `--p` has an `initial-value` of 100% and the first
 * phrase is opacity 1 until this file says otherwise, so with JavaScript
 * disabled, before hydration, or under `prefers-reduced-motion`, the headline
 * is simply "Blindly trusting a broker's Sales Pitch?" as static text. The
 * other two phrases stay in the accessible name via the sr-only span, exactly
 * as before. This renders no markup of its own.
 */

/** One phrase's slot, and the phase boundaries inside it. Milliseconds, and
 *  identical to the 9.6s / 13% / 26% / 33.33% keyframes they replace. */
const SLOT_MS = 3200;
const TYPE_END_MS = 1248;
const HOLD_END_MS = 2496;
const STEPS = 12;

export function Typewriter() {
  useEffect(() => {
    const line = document.querySelector<HTMLElement>(".type-line");
    if (!line) return;

    const count = line.querySelectorAll(".type-item").length;
    if (count === 0) return;

    // Honour the OS setting, and keep honouring it if the user changes it
    // mid-visit rather than only reading it once on mount.
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let timer: number | undefined;
    let running = false;

    const setP = (pct: number) => line.style.setProperty("--p", `${pct}%`);

    // Every step is scheduled against a fixed origin rather than "now + delay".
    // setTimeout is only ever late, so relative scheduling accumulates that
    // lateness: measured over three phrases it drifted the cycle out by ~200ms
    // per phrase. Anchoring to `origin` keeps the 3.2s slot exact no matter how
    // busy the main thread was when a step fired.
    let origin = 0;
    const at = (fn: () => void, dueMs: number) => {
      timer = window.setTimeout(fn, Math.max(0, origin + dueMs - performance.now()));
    };

    const stop = () => {
      running = false;
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
      delete line.dataset.active;
      line.style.removeProperty("--p");
    };

    const phrase = (index: number) => {
      if (!running) return;
      origin = performance.now();
      line.dataset.active = String(index);
      setP(0);

      let step = 0;
      const typeIn = () => {
        if (!running) return;
        step += 1;
        setP(Math.round((step / STEPS) * 100));
        if (step < STEPS) return at(typeIn, ((step + 1) * TYPE_END_MS) / STEPS);
        // Hold, then backspace. Nothing is scheduled during the hold itself.
        at(startDelete, HOLD_END_MS);
      };

      const startDelete = () => {
        if (!running) return;
        const span = SLOT_MS - HOLD_END_MS;
        let left = STEPS;
        const deleteStep = () => {
          if (!running) return;
          left -= 1;
          setP(Math.round((left / STEPS) * 100));
          if (left > 0) {
            return at(deleteStep, HOLD_END_MS + ((STEPS - left) * span) / STEPS);
          }
          phrase((index + 1) % count);
        };
        at(deleteStep, HOLD_END_MS + span / STEPS);
      };

      at(typeIn, TYPE_END_MS / STEPS);
    };

    const sync = () => {
      if (motion.matches) {
        stop();
        return;
      }
      if (running) return;
      running = true;
      phrase(0);
    };

    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
