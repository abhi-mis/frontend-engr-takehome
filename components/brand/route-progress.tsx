"use client";

import { useEffect } from "react";

// Marks each checkpoint as the car reaches it, by reading the car animation's own
// clock. CYCLE_MS and MARKS must match the propsoch-route-drive keyframes.
const CYCLE_MS = 11600;

const MARKS = [
  { at: 0.1849, stage: 1 },
  { at: 0.3556, stage: 2 },
  { at: 0.5121, stage: 3 },
  { at: 0.7397, stage: 4 },
  { at: 0.9668, stage: 0 },
] as const;

export function RouteProgress() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hero-route-art");
    if (!root) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const car = root.querySelector<SVGGElement>(".hero-route-car");

    let timer: number | undefined;
    let running = false;
    let visible = true;
    let onScreen = true;

    let fallbackOrigin = 0;

    const elapsed = () => {
      const t = car?.getAnimations?.()[0]?.currentTime;

      if (typeof t === "number") return t % CYCLE_MS;
      return (performance.now() - fallbackOrigin) % CYCLE_MS;
    };

    const step = () => {
      if (!running) return;
      const f = elapsed() / CYCLE_MS;

      let stage = 0;
      let nextAt = 1;
      for (const mark of MARKS) {
        if (f >= mark.at) stage = mark.stage;
        else {
          nextAt = mark.at;
          break;
        }
      }

      root.dataset.stage = String(stage);

      timer = window.setTimeout(step, Math.max(40, (nextAt - f) * CYCLE_MS));
    };

    const stop = () => {
      running = false;
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };

    const sync = () => {
      const wanted = !motion.matches && visible && onScreen;

      if (!wanted) {
        stop();

        delete root.dataset.stage;
        root.dataset.paused = "";
        return;
      }

      delete root.dataset.paused;
      if (running) return;
      running = true;
      fallbackOrigin = performance.now();
      step();
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" }
    );
    observer.observe(root);

    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
      delete root.dataset.stage;
      delete root.dataset.paused;
    };
  }, []);

  return null;
}
