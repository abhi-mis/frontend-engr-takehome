"use client";

import { useEffect } from "react";

/**
 * Drives the hero route artwork's progress state.
 *
 * WHY THIS IS NOT FOUR MORE CSS ANIMATIONS
 *
 * The brief is that a checkpoint is only marked once the car has actually
 * reached it. The obvious implementation is one infinite keyframe animation per
 * checkpoint, each holding its "off" state until its moment and then popping.
 * That works, and it is the same trap documented at length in
 * components/sections/typewriter.tsx: Chrome re-resolves style every frame for
 * the whole duration of a non-composited animation, whether or not the computed
 * value changed. Eight such animations would tick sixty times a second for the
 * life of the page in order to change eight values four times per eleven
 * seconds.
 *
 * So the state is a single attribute, `data-stage`, set exactly as often as it
 * visibly changes: four times per cycle, plus one reset. Everything downstream
 * is a CSS TRANSITION, which costs frames only while it is actually running
 * (~420ms) and then stops.
 *
 * HOW IT STAYS IN SYNC WITH THE CAR
 *
 * The car is still a CSS animation, because motion path is the only honest way
 * to make it follow the road. That means two clocks, and two clocks drift. This
 * one does not keep a clock at all: every step re-reads the CAR'S OWN
 * `Animation.currentTime` through getAnimations() and works out where in the
 * cycle it is. The tick can therefore never wander away from the car, no matter
 * how late a timeout fires or how long the tab was throttled.
 *
 * MARKS are the same numbers as the `propsoch-route-drive` keyframes in
 * globals.css, and that is the one coupling worth knowing about: change a
 * keyframe percentage there and change the matching `at` here.
 *
 * WHAT HAPPENS WITHOUT IT
 *
 * Nothing breaks and nothing is missing. `data-stage` is simply absent, and the
 * stylesheet's default for the artwork is the FINISHED state: every checkpoint
 * ticked, all four detail cards filled in. That is the right still image, so
 * no-JavaScript, pre-hydration and reduced-motion all land on it for free.
 *
 * It also stops entirely when the hero is off screen or the tab is hidden, and
 * parks the car and its wheels with it, so scrolling past the fold ends the
 * hero's animation cost rather than leaving it running under the page.
 */

/** One full lap. Must equal the `animation-duration` on .hero-route-car. */
const CYCLE_MS = 11000;

/**
 * Where in the cycle the car's wheels reach each checkpoint, as a fraction,
 * read straight off the propsoch-route-drive keyframes. The last entry is the
 * reset: the car has faded out and the next lap is about to start.
 */
const MARKS = [
  { at: 0.195, stage: 1 },
  { at: 0.375, stage: 2 },
  { at: 0.54, stage: 3 },
  { at: 0.78, stage: 4 },
  { at: 0.965, stage: 0 },
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
    /** Only used if the car has no running animation to read. */
    let fallbackOrigin = 0;

    /** Milliseconds into the current lap, taken from the car where possible. */
    const elapsed = () => {
      const t = car?.getAnimations?.()[0]?.currentTime;
      // currentTime is a plain number in every engine that ships motion path;
      // the guard is for the CSSNumericValue future, not for paranoia.
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
      // Sleep until the next boundary and not a millisecond sooner. A late
      // wake-up is self-correcting because the next elapsed() is authoritative.
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
        // Park the artwork on the finished state. Leaving it frozen part way
        // through would read as a rendering bug rather than as a paused
        // animation, because nothing on screen says it is paused.
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
