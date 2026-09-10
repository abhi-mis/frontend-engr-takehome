"use client";

import { useEffect } from "react";

// Steps the headline reveal from JS. As a CSS animation it re-ran style resolution
// every frame for the life of the page; this sets --p only when it changes.
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

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let timer: number | undefined;
    let running = false;

    const setP = (pct: number) => line.style.setProperty("--p", `${pct}%`);

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
