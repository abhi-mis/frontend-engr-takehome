/**
 * The "Bromatker" wordmark.
 *
 * The pun: take "Broker", wedge "mat" into the middle, and it reads at once as
 * "Broker" and as "Bro mat kar", Hindi for "don't do it, bro". Their CDN asset
 * is literally `bromatkar_icon.png`.
 *
 * This is the third attempt, and the first two are worth recording because the
 * failures were different in kind.
 *
 *   1. WRONG CONTENT. I invented "Bro-marketer" and "Bro Mat Kar" as separate
 *      marquee terms. That broke the joke and added copy Propsoch never wrote.
 *      It is one wordmark, not a word list.
 *   2. WRONG LAYOUT, TWICE. First `inline-flex` split it into three boxes with
 *      gaps, so it read as three words. Then I set "mat" as a small near-black
 *      chip on the orange band, which looked like a redaction box stamped over
 *      the word. Legible, accessible, and visually wrong.
 *
 * THE IDEA THIS TIME: a proofreader's correction.
 *
 * The joke is an edit to a word, so the mark is drawn as one. "Broker" is set
 * whole, and "mat" is a rotated highlighter annotation wedged into the seam,
 * the way you would scribble an insertion onto a printed page. It reads as
 * "somebody corrected this word", which is exactly what the campaign means.
 *
 * Why the yellow finally works here. The brand's accent yellow is 1.95:1 as
 * TEXT on the orange band, which is why the previous attempt could not use it.
 * As a highlighter FILL behind near-black text it is 12.87:1, the highest
 * contrast pair on the whole site. Same two colours, inverted roles, and the
 * accessibility problem disappears.
 */
export function Bromatker({ className }: { readonly className?: string }) {
  return (
    <span
      className={`relative inline-block font-extrabold tracking-[-0.03em] whitespace-nowrap ${className ?? ""}`}
    >
      Bro
      {/*
        The annotation. `sup` keeps it one readable token, so a screen reader
        hears "Bromatker" rather than three fragments.

        `leading-none` and a fixed rotation origin matter: the marquee row must
        not change height as this scrolls past, or the whole band jitters.
      */}
      <sup className="mx-[0.04em] inline-block -translate-y-[0.18em] -rotate-[7deg] rounded-[0.14em] bg-accent-yellow px-[0.2em] py-[0.04em] align-baseline text-[0.42em] leading-none font-black tracking-tight text-on-brand shadow-[0_1px_0_rgba(0,0,0,0.18)]">
        mat
      </sup>
      ker
    </span>
  );
}
