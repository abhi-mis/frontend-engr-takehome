import { HERO, STATS } from "@/lib/content";
import { Logo } from "@/components/brand/logo";
import { RouteProgress } from "@/components/brand/route-progress";

/**
 * The hero's guided-route scene.
 *
 * It is built from HTML and inline SVG rather than an illustration asset: it
 * adds no image request, owns a predictable box from first layout, and keeps
 * the headline as the hero's only likely LCP candidate.
 *
 * WHAT CHANGED IN THIS PASS
 *
 * 1. IT IS NO LONGER A PICTURE IN A FRAME. The scene used to sit inside a
 *    white card with its own border, inner ring and dashed orbit, parked in the
 *    right-hand grid cell. Three nested frames around a drawing is what made it
 *    read as a widget bolted onto the hero instead of part of it. The frames
 *    are gone and the artwork now bleeds out of its cell and is masked into the
 *    background wash, so it behaves like the hero's backdrop while staying the
 *    loudest thing on that side of the page.
 *
 * 2. THE ROAD IS MADE OF THE BROMATKER RIBBON. The hero used to carry a
 *    full-bleed scrolling "Bromatker" marquee under the headline, competing
 *    with the copy for first read. It was removed, and the campaign's whole
 *    joke went with it. It is back here as the road's lane lettering, set on a
 *    textPath along the exact road curve: the same wordmark, in the one place
 *    on the page where it is decoration rather than a third thing to read.
 *    Static, so it costs nothing per frame.
 *
 * 3. THE CHECKPOINTS ARE EARNED. Every tick in the scene used to be drawn
 *    already ticked, which is a picture of a finished journey rather than a
 *    journey. Each of the four is now marked only once the car has actually
 *    driven through it, and the four detail cards fill in with them. See
 *    components/brand/route-progress.tsx for why that is one attribute rather
 *    than eight keyframe animations.
 *
 * THE CAR FOLLOWS THE ROAD, AND THAT IS WHY IT LIVES IN THE SVG
 *
 * It used to be an HTML div outside the SVG, animated with a translate between
 * two hand-picked points. A straight line between two points cannot follow an
 * S-curve, so it drifted off the road in the middle and pointed the wrong way
 * at both ends. It is now a group INSIDE the svg, driven by CSS Motion Path
 * along the exact same path data the road is drawn from, so "on the road" is
 * guaranteed by construction rather than by matching two coordinate spaces by
 * hand. `offset-rotate: auto` turns the car to the tangent, so it banks through
 * the curves and arrives at the house pointing at the door.
 *
 * ROAD is declared once and used five times: the stroked passes that draw the
 * road, the textPath the lettering rides, and a custom property the stylesheet
 * reads for `offset-path`. One string, so nothing here can drift apart.
 */

/** The route, in the svg's own 640x540 user space.
 *
 * The last segment used to run 101 units further, to (624, 118), which is
 * INSIDE the destination house's footprint. The car obediently drove to the
 * end of its path and parked in the living room. It now levels off at
 * (588, 152), directly below the house, so the arrival reads as a car on the
 * drive rather than a car in the wall. */
const ROAD =
  "M26 449C124 461 166 415 249 385c76-27 120-1 168-55 47-53 49-119 106-167 26-17 48-13 65-11";

/** textPath needs a referencable path, and an id has to be unique per page. */
const ROAD_ID = "propsoch-hero-road";

/**
 * The three roadside checkpoints.
 *
 * THEY STAND BESIDE THE ROAD NOW, NOT ON IT.
 *
 * They used to be discs centred on the centreline, which made them read as
 * manhole covers: the car drove over the top of each one and the road's own
 * lettering ran underneath them. A checkpoint is a thing you pass, not a thing
 * you drive through, so each one now sits off the verge on a short post, the
 * way a signal does.
 *
 * `x` and `y` are still MEASURED points on the curve rather than coordinates
 * that look about right: 22%, 46% and 68% along a path that is 683.9 units
 * long, found by arc length. `nx` and `ny` are the UNIT NORMAL at that point,
 * taken from the curve's derivative there, and everything else about the
 * marker is derived from them: the post runs along the normal, and the disc
 * sits at the end of it. Offsetting by eye instead would have put each marker
 * at a slightly different distance from a road whose angle changes by 55
 * degrees across these three points.
 *
 * WHY THE THIRD ONE IS ON THE OTHER SIDE
 *
 * One and two sit above the road, which is the open side there. Three cannot:
 * the map pin's tip lands on that exact point, and the pin's body fills the
 * space above it, so a marker there would be behind the pin. It goes below
 * instead, which is the clear side at that point. Signals stand wherever the
 * verge has room, so this reads as intent rather than as an exception.
 *
 * If ROAD changes, all six numbers move with it: recompute the point by arc
 * length and the normal from the derivative, rather than nudging them until
 * they look close.
 */
const CHECKPOINTS = [
  { x: 171.1, y: 420, nx: -0.436, ny: -0.9 },
  { x: 326, y: 369.7, nx: -0.104, ny: -0.995 },
  { x: 444.2, y: 290.5, nx: 0.878, ny: 0.478 },
] as const;

/**
 * How far off the centreline the disc stands, and where the post runs.
 *
 * The road is stroked at 38, so its edge is 19 from the centre. The disc is
 * r=11.5 at an offset of 40, which puts its near edge at 28.5, clear of the
 * tarmac by 9.5. The post spans 17 to 29 so it tucks under both the kerb and
 * the disc and cannot show a gap at either end.
 */
const SIGNAL_OFFSET = 40;
const POST_FROM = 17;
const POST_TO = 29;

/**
 * How many times the wordmark repeats along the road.
 *
 * Propsoch's marquee used eight, and eight is one too many for 683.9 units at
 * this size: SVG simply stops rendering a textPath where the path ends, so the
 * eighth copy was cut off mid-word at the house. Seven fills the road with the
 * last one landing whole. HERO.marqueeRepeat still governs the marquee this
 * borrows from, and is the ceiling here.
 */
const ROAD_WORDMARKS = Math.min(7, HERO.marqueeRepeat);

export function HeroRouteArt({ className }: { readonly className?: string }) {
  return (
    <div aria-hidden className={["hero-route-art", className ?? ""].join(" ")}>
      <svg
        className="hero-route-map"
        viewBox="0 0 640 540"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        // The stylesheet reads this for the car's offset-path, so the motion
        // and the drawing are the same string.
        style={{ "--road": `path("${ROAD}")` } as React.CSSProperties}
      >
        <defs>
          <path id={ROAD_ID} d={ROAD} />
        </defs>

        <g className="hero-route-blocks" stroke="var(--color-line-strong)" strokeOpacity="0.18">
          <path d="M38 111h95v66H38zM153 67h96v84h-96zM270 38h83v61h-83zM409 62h103v74H409zM532 127h72v54h-72z" />
          <path d="M61 233h108v77H61zM191 185h85v64h-85zM491 224h98v70h-98zM436 339h128v83H436zM82 400h107v72H82z" />
          <path d="M87 126h36M203 90h31M284 69h32M427 90h39M547 149h30M83 254h49M209 207h42M511 246h40M458 364h61M103 425h44" />
        </g>

        {/* The road, three passes: a white kerb, a warm surface, and the
            lettering. The surface is brand-soft rather than grey, because the
            hero's ground is a peach wash and a neutral grey road sat on top of
            it as a foreign object. */}
        <path d={ROAD} stroke="#fff" strokeWidth="38" strokeLinecap="round" />
        <path
          className="hero-route-surface"
          d={ROAD}
          stroke="var(--color-brand-soft)"
          strokeOpacity="0.44"
          strokeWidth="28"
          strokeLinecap="round"
        />

        {/* The Bromatker wordmark as lane lettering.
            "Broker" with "mat" wedged into the seam reads at once as "Broker"
            and as "Bro mat kar", Hindi for "do not do it, bro". The raised
            insertion is the joke, so it is a smaller tspan lifted off the
            baseline, and `paint-order: stroke` in the stylesheet turns its
            yellow stroke into the highlighter behind it rather than an outline
            around it. */}
        <text className="hero-route-wordmark">
          <textPath href={`#${ROAD_ID}`} startOffset="2.5%">
            {Array.from({ length: ROAD_WORDMARKS }, (_, i) => (
              <tspan key={i}>
                <tspan>{i === 0 ? "Bro" : "  ·  Bro"}</tspan>
                <tspan className="hero-route-wordmark-mat" dy="-3.4">
                  mat
                </tspan>
                <tspan dy="3.4">ker</tspan>
              </tspan>
            ))}
          </textPath>
        </text>

        {/* Checkpoints. Each is drawn ticked and the stylesheet takes the tick
            away until the car has been past, so the still image, the
            no-JavaScript render and the reduced-motion render are all the
            finished journey rather than an empty one. */}
        {CHECKPOINTS.map((point, i) => {
          // Everything is derived from the point and its normal, so the three
          // markers stand off the road by the same distance at three quite
          // different road angles.
          const post = {
            x1: point.x + point.nx * POST_FROM,
            y1: point.y + point.ny * POST_FROM,
            x2: point.x + point.nx * POST_TO,
            y2: point.y + point.ny * POST_TO,
          };
          const head = {
            x: point.x + point.nx * SIGNAL_OFFSET,
            y: point.y + point.ny * SIGNAL_OFFSET,
          };

          return (
            <g key={point.x} className="hero-route-probe" data-step={i + 1}>
              <path
                className="hero-route-probe-post"
                d={`M${post.x1} ${post.y1}L${post.x2} ${post.y2}`}
              />
              {/* The head is its own group so the tick keeps its original
                  coordinates, drawn around 0,0, instead of every path in it
                  having to know where on the verge it ended up. */}
              <g transform={`translate(${head.x} ${head.y})`}>
                <circle className="hero-route-probe-halo" r="17" />
                <circle className="hero-route-probe-ring" r="11.5" />
                <circle className="hero-route-probe-fill" r="11.5" />
                <path
                  className="hero-route-probe-tick"
                  d="m-4.6 0.2 3.2 3.4 6-6.6"
                  fill="none"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          );
        })}

        {/* The map pin, scaled down and pinned by its TIP to checkpoint 3.

            The transform reads right to left: move the tip (484, 271) to the
            origin, scale about it, then put it back down on the road at
            (444.2, 290.5). Scaling about the tip rather than the pin's centre
            is the whole point, because the tip is the part that has to stay
            on the road: scale about anything else and the pin lifts off it.

            0.82 because at full size it was the loudest thing in the scene
            and it was competing with the headline next to it. The translate is
            an attribute on an outer group because the inner group's transform
            belongs to the stylesheet, and a CSS transform overwrites a
            presentation attribute on the same element. */}
        <g transform="translate(444.2 290.5) scale(0.82) translate(-484 -271)">
          <g className="hero-route-pin">
            <path
              d="M430 185c0-30 24-54 54-54s54 24 54 54c0 40-54 86-54 86s-54-46-54-86Z"
              fill="var(--color-brand)"
              stroke="var(--color-brand-strong)"
              strokeWidth="2"
            />
            <circle cx="484" cy="184" r="17" fill="#fff" />
            {/* THE REAL LOGO, not an approximation of it.
                What sat here was a four pointed spark I drew by hand, on the
                reasoning that Propsoch's mark is a house built around a spark
                and the pin was already the house. It was a decent guess and it
                was still a redrawn logo in the middle of a hero.
                components/brand/logo.tsx has the actual path, lifted from
                their site, so the pin now carries the mark itself.

                A nested <svg> rather than a <g>: Logo owns its own viewBox and
                a nested viewport both scales it and clips it to the glyph's
                square, which is exactly what the "mark" variant needs. The
                translate puts its 29x29 box centred on the pin's eye.

                29 in a disc of r=17, so the box's corners fall outside the
                white. That is deliberately safe rather than lucky: the mark's
                fill is #FF6D33 and so is the pin's, so anything that reaches
                past the disc lands on the identical colour and cannot be
                seen. It is why the mark can grow to fill the eye instead of
                being sized to fit inside the disc's inscribed square. */}
            <g transform="translate(469.5 169.5)">
              <Logo variant="mark" width={29} decorative />
            </g>
          </g>
        </g>

        <g className="hero-route-destination">
          <path d="M552 76 590 45l38 31v65h-76V76Z" fill="var(--color-brand-tint)" stroke="var(--color-brand-strong)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M566 91h15v17h-15zM598 91h15v17h-15z" fill="var(--color-brand-soft)" />
          <path d="M583 141v-23h15v23" fill="var(--color-brand)" />
          {/* The house at the end of the route is a VERIFIED one, and that is
              checkpoint four: the badge lands when the car parks, not before. */}
          <g className="hero-route-probe hero-route-verified" data-step="4">
            <circle className="hero-route-probe-halo" cx="622" cy="132" r="17" />
            {/* The waiting state. Without this the badge simply was not there
                until the car arrived, and a house with nothing beside it does
                not read as "not verified yet", it reads as a missing element. */}
            <circle className="hero-route-probe-ring" cx="622" cy="132" r="12" />
            <circle
              className="hero-route-probe-fill"
              cx="622"
              cy="132"
              r="12"
              stroke="#fff"
              strokeWidth="3"
            />
            <path
              className="hero-route-probe-tick"
              d="m616 132 4 4 8-8"
              fill="none"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        <g className="hero-route-sun">
          <circle cx="129" cy="128" r="34" fill="var(--color-brand-soft)" fillOpacity="0.32" />
          <circle cx="129" cy="128" r="18" fill="var(--color-brand)" fillOpacity="0.16" />
        </g>
        {/* The car, drawn LAST so nothing occludes it.
            It used to sit before the pin, and the pin's body covered it at
            exactly the point where the two meet, which is the pin's own foot
            and checkpoint three: the one moment in the loop you most want to
            watch. Painting order is the whole fix.
            Drawn around its own origin with the wheels resting on y = 0, so the
            point the motion path carries is the point where rubber meets road.
            Nose along +x, which is the direction offset-rotate: auto faces. */}
        <g className="hero-route-car">
          <ellipse className="hero-route-car-shadow" cx="0" cy="1.5" rx="18" ry="3.2" />
          {/* Cabin first, so the body's top edge covers where they meet. */}
          <path
            className="hero-route-car-cabin"
            d="M-9 -12v-6a3 3 0 0 1 3-3h9.5a3 3 0 0 1 2.5 1.4l4.8 7.6z"
          />
          <path className="hero-route-car-glass" d="M-6.4 -13.2v-5a1.4 1.4 0 0 1 1.4-1.4h5.4l4.3 6.4z" />
          <rect className="hero-route-car-body" x="-19" y="-13" width="38" height="11" rx="4.2" />
          {/* One warm dot at the nose. Small, but it is the difference between a
              rounded rectangle and a car. */}
          <circle className="hero-route-car-lamp" cx="16.7" cy="-7.9" r="1.5" />
          <g className="hero-route-wheel hero-route-wheel--back">
            <circle r="4.3" cy="-4.1" cx="-10" />
            <circle className="hero-route-wheel-hub" r="1.45" cy="-4.1" cx="-10" />
          </g>
          <g className="hero-route-wheel hero-route-wheel--front">
            <circle r="4.3" cy="-4.1" cx="10" />
            <circle className="hero-route-wheel-hub" r="1.45" cy="-4.1" cx="10" />
          </g>
        </g>


      </svg>

      <div className="hero-route-listing hero-route-listing--one">
        <span className="hero-route-listing-image" />
        <span className="hero-route-listing-lines"><i /><i /></span>
      </div>
      <div className="hero-route-listing hero-route-listing--two">
        <span className="hero-route-listing-image" />
        <span className="hero-route-listing-lines"><i /><i /></span>
      </div>
      {/* The shortlisted one. Two listings receding and one picked out is the
          curation story told the way a diagram should tell it. */}
      <div className="hero-route-listing hero-route-listing--three hero-route-listing--picked">
        <span className="hero-route-listing-image" />
        <span className="hero-route-listing-lines"><i /><i /></span>
        <span className="hero-route-listing-mark" />
      </div>

      {/* The numbers, dealt out as the drive earns them.

          These are Propsoch's four real stats, and until now they were a chip
          grid sitting under the hero CTA. Same four facts, so printing them
          twice on one screen would have been worse than printing them once:
          on desktop they live here, one per checkpoint, and the chip grid stays
          in the DOM for screen readers and renders normally below lg where the
          artwork is display:none. See components/sections/hero.tsx.

          Tying them to the checkpoints is what makes the panel worth the
          space. A static list of four numbers is a list of four numbers; the
          same four arriving one at a time, each as the car reaches the point
          on the road that produced it, is the argument the whole scene is
          making. */}
      <div className="hero-route-panel">
        <p className="hero-route-panel-head">
          <Logo width={78} decorative />
          <span className="hero-route-panel-dot" />
        </p>
        <ul className="hero-route-steps">
          {STATS.map((stat, i) => (
            <li key={stat.label} className="hero-route-step" data-step={i + 1}>
              <span className="hero-route-step-badge" />
              <span className="hero-route-step-text">
                <span className="hero-route-step-value">{stat.value}</span>
                <span className="hero-route-step-label">{stat.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <RouteProgress />
    </div>
  );
}
