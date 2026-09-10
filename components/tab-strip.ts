/**
 * The one tab strip treatment, shared by the comparison and the FAQ.
 *
 * WHY THIS FILE EXISTS
 *
 * There were two tab strips on this page and they looked nothing alike. The
 * comparison used a segmented control: a raised card with two equal-width
 * triggers inside it, the active one tinted. The FAQ used a scrolling row of
 * outlined pills, the active one filled solid `--color-brand-strong` with a
 * white label. Same control, same job, two different designs, and a reader
 * who met both had no reason to think they worked the same way.
 *
 * They are one thing now, and it is a constant rather than a convention so
 * they cannot drift apart again. Same reasoning as components/primary-cta.tsx:
 * there is no way to render a slightly different tab strip, because there is
 * only one string that describes one.
 *
 * WHY PILLS, AND NOT THE SEGMENTED CONTROL
 *
 * A segmented control has to fit its options inside one fixed track. That is
 * fine for the comparison's two, and it is why the comparison had one. The FAQ
 * has four, of very unequal width ("Fees" against "Why Work With Us"), and at
 * 360px they do not fit. A row of pills scrolls, and it reads the same whether
 * there are two of them or four, which is the only version that can be shared.
 *
 * WHY THE ACTIVE STATE IS TINTED AND NOT FILLED
 *
 * The FAQ's solid `--color-brand-strong` pill was the loudest control on the
 * page after the primary CTA, and it was competing with it: a filled orange
 * rounded rectangle is what this design system uses to mean "the action", and
 * a tab is not an action. Tint plus an orange label and border says selected
 * without claiming to be a button. It is also the pairing already used for
 * every other "this one is chosen" state in the build, the route checkpoints,
 * the plan reader's open row, the Propsoch column in the comparison table.
 *
 * CONTRAST
 *
 * No new pairs. `brandStrong` on `brandTint` and `inkMuted` on both the
 * surface and the sunken ground are all asserted in scripts/check-contrast.mjs
 * already, and the border clears the 3:1 that WCAG 1.4.11 asks of a control
 * edge on both grounds.
 */

/**
 * Scrolls rather than wrapping on small screens. Four category labels wrap to
 * three ragged lines at 360px, which reads as a mistake; one scrolling row
 * reads as a deliberate control. The negative margin lets the row bleed to the
 * screen edge so it is obvious there is more of it.
 */
export const TAB_LIST_CLASS =
  "-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0";

/**
 * `min-h-11` is 44px, the touch target this project holds everything to.
 * shadcn's own tab trigger is h-8 with a `text-foreground/60` label, which is
 * both under that target and 4.10:1 against this panel: the same low contrast
 * tab text the brief asks us to fix on the original, shipped as a library
 * default. Neither is inherited here.
 */
export const TAB_TRIGGER_CLASS =
  "min-h-11 shrink-0 snap-start rounded-pill border border-line px-4 text-sm font-semibold whitespace-nowrap text-ink-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong data-active:border-brand-strong data-active:bg-brand-tint data-active:text-brand-strong";
