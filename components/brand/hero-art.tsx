/**
 * Hero artwork. Original work, inline SVG.
 *
 * This is not decoration. It draws the funnel the 25-day process actually
 * performs, which is the same story the timeline section tells further down the
 * page: a wide field of Bangalore projects narrows to a curated shortlist, then
 * to the one home you buy.
 *
 *   top tier     seven muted cards, the 700+ projects across Bangalore
 *   middle tier  four accented cards, the 4 to 5 you actually visit
 *   bottom tier  one solid brand card with a check, the home you close on
 *
 * Why inline SVG and not an image file:
 *
 *   - Zero network requests, so nothing competes with the font on the critical
 *     path and nothing can be the LCP element except the headline.
 *   - It inherits the CSS custom properties, so it is themed by the same tokens
 *     as everything else and cannot drift from the palette.
 *   - A fixed viewBox plus an explicit width and height means the browser knows
 *     its aspect ratio before paint, so it reserves its own space and cannot
 *     contribute to CLS.
 *
 * Accessibility: the whole graphic is one meaningful image, so it gets a single
 * `role="img"` with a title and a longer description rather than exposing dozens
 * of meaningless rect nodes to a screen reader.
 */
export function HeroArt({ className }: { readonly className?: string }) {
  // Geometry is derived rather than hand-typed so the tiers stay centred and
  // evenly spaced, and so the connector lines always meet the cards.
  const topCards = [37, 79, 121, 163, 205, 247, 289];
  const midCards = [51, 119, 187, 255];

  const topCenter = (x: number) => x + 17;
  const midCenter = (x: number) => x + 27;
  const finalCenter = 180;

  // Which middle card each top card feeds into.
  const topToMid: readonly [number, number][] = [
    [0, 0],
    [1, 0],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 3],
    [6, 3],
  ];

  return (
    <svg
      width={360}
      height={400}
      viewBox="0 0 360 400"
      className={className}
      role="img"
      aria-labelledby="hero-art-title hero-art-desc"
    >
      <title id="hero-art-title">
        How Propsoch narrows the search
      </title>
      <desc id="hero-art-desc">
        A funnel diagram. Seven projects at the top narrow to four shortlisted
        projects in the middle, and then to a single chosen home at the bottom.
      </desc>

      {/* Connectors, drawn first so the cards sit on top of them. */}
      <g strokeLinecap="round" fill="none">
        {topToMid.map(([top, mid]) => (
          <line
            key={`t${top}`}
            x1={topCenter(topCards[top])}
            y1={46}
            x2={midCenter(midCards[mid])}
            y2={170}
            stroke="var(--color-line-strong)"
            strokeOpacity={0.35}
            strokeWidth={1.5}
          />
        ))}

        {midCards.map((x, i) => (
          <line
            key={`m${i}`}
            x1={midCenter(x)}
            y1={210}
            x2={finalCenter}
            y2={310}
            stroke="var(--color-brand-soft)"
            strokeWidth={2}
          />
        ))}
      </g>

      {/* Flow pulses.
          A second, overlaid set of the same lines, drawn with a dash pattern
          that is mostly gap so a single short segment slides down each path.
          This is what turns the diagram from a static tree into "many projects
          being narrowed to one", which is the whole point of the graphic.

          Each pulse has its own duration and delay so they do not march in
          lockstep. `stroke-dashoffset` is a compositor-friendly property to
          animate on the GPU in modern engines, and there are only eleven of
          them, so the cost is negligible. */}
      <g fill="none" strokeLinecap="round" aria-hidden>
        {topToMid.map(([top, mid], i) => (
          <line
            key={`flow-t${top}`}
            className="animate-flow"
            x1={topCenter(topCards[top])}
            y1={46}
            x2={midCenter(midCards[mid])}
            y2={170}
            stroke="var(--color-brand)"
            strokeWidth={2}
            style={
              {
                "--delay": `${i * 420}ms`,
                "--dur": `${3.4 + (i % 3) * 0.5}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {midCards.map((x, i) => (
          <line
            key={`flow-m${i}`}
            className="animate-flow"
            x1={midCenter(x)}
            y1={210}
            x2={finalCenter}
            y2={310}
            stroke="var(--color-brand-strong)"
            strokeWidth={2.4}
            style={
              {
                "--delay": `${900 + i * 380}ms`,
                "--dur": `${2.8 + (i % 2) * 0.4}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </g>

      {/* Top tier: the wide field. Muted, because these are unfiltered.
          Each card floats on a slightly different cycle and delay, so the field
          drifts rather than pulsing in unison. Transform only, so the
          compositor handles it. */}
      <g>
        {topCards.map((x, i) => (
          <g
            key={`top-${x}`}
            className="animate-float"
            style={
              {
                "--delay": `${i * 320}ms`,
                "--dur": `${6.5 + (i % 3) * 0.7}s`,
                transformBox: "fill-box",
                transformOrigin: "center",
              } as React.CSSProperties
            }
          >
            <rect
              x={x}
              y={20}
              width={34}
              height={26}
              rx={5}
              fill="#ffffff"
              stroke="var(--color-line-strong)"
              strokeOpacity={0.45}
              strokeWidth={1}
            />
            {/* A thumbnail block plus one caption line, so each reads as a
                listing card rather than as two stacked dashes. */}
            <rect
              x={x + 5}
              y={25}
              width={11}
              height={11}
              rx={2}
              fill="var(--color-line-strong)"
              fillOpacity={0.5}
            />
            <rect
              x={x + 19}
              y={26}
              width={10}
              height={2.5}
              rx={1.25}
              fill="var(--color-line-strong)"
              fillOpacity={0.4}
            />
            <rect
              x={x + 19}
              y={31}
              width={7}
              height={2.5}
              rx={1.25}
              fill="var(--color-line-strong)"
              fillOpacity={0.4}
            />
          </g>
        ))}
      </g>

      {/* Middle tier: the shortlist. Picks up the brand. */}
      <g>
        {midCards.map((x, i) => (
          <g
            key={`mid-${x}`}
            className="animate-float"
            style={
              {
                "--delay": `${400 + i * 260}ms`,
                "--dur": `${7.5 + (i % 2) * 0.6}s`,
                transformBox: "fill-box",
                transformOrigin: "center",
              } as React.CSSProperties
            }
          >
            <rect
              x={x}
              y={170}
              width={54}
              height={40}
              rx={7}
              fill="var(--color-brand-tint)"
              stroke="var(--color-brand-strong)"
              strokeWidth={1.5}
            />
            {/* A small roof line, so each card still reads as a home. */}
            <path
              d={`M${x + 14} ${190} L${x + 27} ${181} L${x + 40} ${190}`}
              fill="none"
              stroke="var(--color-brand-strong)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x={x + 23}
              y={192}
              width={8}
              height={10}
              rx={1.5}
              fill="var(--color-brand-strong)"
            />
          </g>
        ))}
      </g>

      {/* Bottom tier: the one home. Solid brand fill with the darker boundary,
          matching the primary button's treatment so the accent reads as
          "the chosen thing" consistently across the page. */}
      <g>
        {/* A soft expanding halo. The one piece of looping attention-drawing
            motion on the page, on the single element the whole diagram resolves
            to. */}
        <rect
          className="animate-halo"
          x={132}
          y={310}
          width={96}
          height={62}
          rx={11}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={2}
          style={
            {
              transformBox: "fill-box",
              transformOrigin: "center",
            } as React.CSSProperties
          }
        />
        <rect
          x={132}
          y={310}
          width={96}
          height={62}
          rx={11}
          fill="var(--color-brand)"
          stroke="var(--color-brand-strong)"
          strokeWidth={2}
        />
        <path
          d="M156 342 L180 322 L204 342"
          fill="none"
          stroke="var(--color-on-brand)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M170 352 l6.5 6.5 L191 344"
          fill="none"
          stroke="var(--color-on-brand)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
