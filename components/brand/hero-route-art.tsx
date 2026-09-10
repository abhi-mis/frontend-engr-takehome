/**
 * Decorative real-estate journey scene for the hero.
 *
 * It is built from HTML and inline SVG rather than an illustration asset: it
 * adds no image request, owns a predictable box from first layout, and keeps
 * the headline as the hero's only likely LCP candidate.
 *
 * THE CAR FOLLOWS THE ROAD, AND THAT IS WHY IT LIVES IN THE SVG
 *
 * It used to be an HTML div outside the SVG, animated with a translate between
 * two hand-picked points and a fixed `rotate(-25deg)`. A straight line between
 * two points cannot follow an S-curve, so it drifted off the road in the middle
 * and pointed the wrong way at both ends. No amount of tuning the keyframes
 * fixes that, because the shape of the motion was wrong, not its numbers.
 *
 * It is now a group INSIDE the svg, driven by CSS Motion Path along the exact
 * same path data the road is drawn from. Being in the svg means it shares the
 * road's coordinate system, so "on the road" is guaranteed by construction
 * rather than by matching two coordinate spaces by hand. `offset-rotate: auto`
 * turns the car to the tangent, so it banks through the curves and arrives at
 * the house pointing at the door.
 *
 * ROAD is declared once and used four times: three stroked passes that draw the
 * road, and a custom property the stylesheet reads for `offset-path`. One
 * string, so the car and the road cannot drift apart in a later edit.
 */

/** The route, in the svg's own 640x540 user space. */
const ROAD =
  "M26 449C124 461 166 415 249 385c76-27 120-1 168-55 47-53 49-119 106-167 29-24 58-39 101-45";

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
        <g className="hero-route-blocks" stroke="var(--color-line-strong)" strokeOpacity="0.18">
          <path d="M38 111h95v66H38zM153 67h96v84h-96zM270 38h83v61h-83zM409 62h103v74H409zM532 127h72v54h-72z" />
          <path d="M61 233h108v77H61zM191 185h85v64h-85zM491 224h98v70h-98zM436 339h128v83H436zM82 400h107v72H82z" />
          <path d="M87 126h36M203 90h31M284 69h32M427 90h39M547 149h30M83 254h49M209 207h42M511 246h40M458 364h61M103 425h44" />
        </g>

        <path d={ROAD} stroke="#fff" strokeWidth="34" strokeLinecap="round" />
        <path
          d={ROAD}
          stroke="var(--color-line-strong)"
          strokeOpacity="0.28"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          className="hero-route-road-dashes"
          d={ROAD}
          stroke="var(--color-brand)"
          strokeOpacity="0.8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 13"
        />

        {/* Checkpoints on the route, at measured points on the path itself
            (34% and 62% along it) rather than at coordinates that look about
            right. Propsoch's argument is that the journey is inspected, not
            just travelled, so the road carries marks where the work happens
            and the car drives through them. */}
        <g className="hero-route-probe">
          <circle cx="260" cy="381" r="13" />
          <circle className="hero-route-probe-dot" cx="260" cy="381" r="3.6" />
        </g>
        <g className="hero-route-probe">
          <circle cx="437" cy="302" r="13" />
          <circle className="hero-route-probe-dot" cx="437" cy="302" r="3.6" />
        </g>

        {/* The car.
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

        <path
          d="M430 185c0-30 24-54 54-54s54 24 54 54c0 40-54 86-54 86s-54-46-54-86Z"
          fill="var(--color-brand)"
          stroke="var(--color-brand-strong)"
          strokeWidth="2"
        />
        <circle cx="484" cy="184" r="14" fill="#fff" />
        {/* Propsoch's own mark, not a generic house glyph. Their logo is a
            house built around a four pointed spark, and the pin already is the
            house, so the spark is the part worth repeating here. */}
        <path
          d="M484 174c0 5.52 4.48 10 10 10-5.52 0-10 4.48-10 10 0-5.52-4.48-10-10-10 5.52 0 10-4.48 10-10Z"
          fill="var(--color-brand-strong)"
        />

        <g className="hero-route-destination">
          <path d="M552 76 590 45l38 31v65h-76V76Z" fill="var(--color-brand-tint)" stroke="var(--color-brand-strong)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M566 91h15v17h-15zM598 91h15v17h-15z" fill="var(--color-brand-soft)" />
          <path d="M583 141v-23h15v23" fill="var(--color-brand)" />
          {/* The house at the end of the route is a VERIFIED one. That is the
              whole proposition, and it was the one thing the scene did not say:
              the old version drew a journey to a generic house. */}
          <g className="hero-route-verified">
            <circle cx="622" cy="132" r="12" fill="var(--color-brand-strong)" stroke="#fff" strokeWidth="3" />
            <path d="m616 132 4 4 8-8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* The report you leave with. Propsoch's signature deliverable is a
            written Peace of Mind Report, and the scene ended at a house with
            no sign of one. Drawn as three checked lines, so it reads as a
            findings document without needing a word on it. */}
        <g className="hero-route-report">
          <rect x="468" y="436" width="134" height="86" rx="16" fill="#fff" />
          <rect x="468" y="436" width="134" height="86" rx="16" fill="none" stroke="var(--color-line-strong)" strokeOpacity="0.2" strokeWidth="2" />
          {[464, 486, 508].map((y, i) => (
            <g key={y}>
              <circle cx="492" cy={y} r="6.4" fill="var(--color-brand)" fillOpacity={i === 2 ? 0.42 : 1} />
              <path
                d={`m489 ${y} 2.4 2.5 4.7-4.9`}
                stroke="#fff"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <rect
                x="508"
                y={y - 3.5}
                width={i === 2 ? 44 : 70}
                height="7"
                rx="3.5"
                fill="var(--color-line-strong)"
                fillOpacity="0.3"
              />
            </g>
          ))}
        </g>

        <g className="hero-route-sun">
          <circle cx="129" cy="128" r="34" fill="var(--color-brand-soft)" fillOpacity="0.32" />
          <circle cx="129" cy="128" r="18" fill="var(--color-brand)" fillOpacity="0.16" />
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
      {/* The shortlisted one. Two faded listings and one picked out is the
          curation story the removed "Curated on 20+ factors" card used to tell
          in words, and a diagram can carry it without a label. */}
      <div className="hero-route-listing hero-route-listing--three hero-route-listing--picked">
        <span className="hero-route-listing-image" />
        <span className="hero-route-listing-lines"><i /><i /></span>
        <span className="hero-route-listing-mark" />
      </div>
    </div>
  );
}
