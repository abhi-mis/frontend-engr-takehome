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

/** Same rule for the gradients: referenced by url(), so they need names. */
const PIN_FILL_ID = "propsoch-hero-pin-fill";
const WALL_FILL_ID = "propsoch-hero-wall-fill";
const ROOF_FILL_ID = "propsoch-hero-roof-fill";
const EAVE_SHADE_ID = "propsoch-hero-eave-shade";

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

          {/* The pin's fill. Three real palette oranges rather than one flat
              one: #FF895B is one of the secondary oranges from Propsoch's own
              stylesheet, --color-brand is the logo fill, and
              --color-brand-display is the darkened display tint. Lit from the
              top left, which is where the hero's single light source already
              comes from (see the one radial wash on .hero-home). */}
          <linearGradient id={PIN_FILL_ID} x1="0.15" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FF895B" />
            <stop offset="52%" stopColor="var(--color-brand)" />
            <stop offset="100%" stopColor="var(--color-brand-display)" />
          </linearGradient>

          {/* Rendered walls, lit from the top left like everything else in
              this scene. Near white where the light lands, settling into the
              brand tint and then into shadow at the bottom right. */}
          <linearGradient id={WALL_FILL_ID} x1="0.1" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#FFFDFB" />
            <stop offset="55%" stopColor="var(--color-brand-tint)" />
            <stop offset="100%" stopColor="#F6DDD1" />
          </linearGradient>

          {/* Terracotta, which is both what a roof in this market actually is
              and the one place the scene can carry a second large orange
              without competing with the pin, because it is a roof and roofs
              are supposed to be the darkest plane. */}
          <linearGradient id={ROOF_FILL_ID} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#F4693A" />
            <stop offset="100%" stopColor="var(--color-brand-strong)" />
          </linearGradient>

          {/* The shadow the eaves throw down the wall. A gradient rather than
              a flat band, because an overhang does not cast a hard edge. */}
          <linearGradient id={EAVE_SHADE_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-strong)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-brand-strong)" stopOpacity="0" />
          </linearGradient>
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

        {/* The Propsoch mark on the map, scaled down and pinned by its TIP to
            checkpoint 3.

            THE SHAPE IS DRAWN PROPERLY NOW, NOT APPROXIMATED.

            The old outline was a circle with two curves guessed onto the
            bottom of it, and the seam showed: the tail met the head at an
            angle instead of running out of it, so the silhouette had a kink
            on each shoulder and the point was blunt. This one is a real
            teardrop. The head is an exact 52 radius arc, and each side of the
            tail leaves it on a VERTICAL tangent (the second control point
            shares the x of the arc's endpoint), which is what makes the
            transition invisible and the taper continuous all the way to a
            sharp point at (484, 273).

            WHAT MAKES IT READ AS AN OBJECT RATHER THAN A STICKER

            Three things, none of which cost a frame because all of them are
            painted once and never animate:

              a gradient instead of one flat orange, lit from the top left to
              match the hero's single light source;
              a rim light inset along the top left arc, which is what gives
              the head volume;
              a contact shadow on the tarmac under the point, so it is
              standing on the road rather than floating over it.

            The transform reads right to left: move the tip (484, 273) to the
            origin, scale about it, then put it back on the road at
            (444.2, 290.5). Scaling about the tip is the whole point, because
            the tip is the part that has to stay on the road: scale about
            anything else and the pin lifts off it. 0.82 because at full size
            it was competing with the headline next to it.

            The translate is an attribute on an outer group because the inner
            group's transform belongs to the stylesheet, and a CSS transform
            overwrites a presentation attribute on the same element. */}
        <g transform="translate(444.2 290.5) scale(0.82) translate(-484 -273)">
          <g className="hero-route-pin">
            {/* On the road, under the point. Drawn first so the pin stands on
                it rather than the other way round. */}
            <ellipse
              className="hero-route-pin-shadow"
              cx="484"
              cy="270"
              rx="23"
              ry="6"
            />

            <path
              className="hero-route-pin-body"
              d="M484 273C470 246 432 210 432 183a52 52 0 1 1 104 0c0 27-38 63-52 90Z"
            />

            {/* The rim light. An inset arc rather than a stroke on the whole
                outline, because a light source lights one side. */}
            <path
              className="hero-route-pin-rim"
              d="M439.6 171.1A46 46 0 0 1 495.9 138.6"
            />

            {/* The plate the mark sits on. r=20 against a 27 wide mark, so the
                mark's box fits INSIDE the disc with white all the way around
                it. It used to be r=17 against a 29 wide mark, which meant the
                orange overflowed the white and you read the logo's negative
                space as a white ring instead of reading the logo. */}
            <circle className="hero-route-pin-eye" cx="484" cy="183" r="20" />
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
                translate puts its 27x27 box centred on the pin's eye at
                (484, 183).

                27 in a disc of r=20: the box's half diagonal is 19.1, so the
                whole mark including its corners now sits inside the white with
                room to spare. The previous pairing (29 in r=17) had a half
                diagonal of 20.5 against a 17 radius, so the mark spilled past
                the plate on all four corners. That was survivable only because
                the mark's fill and the pin's fill are the same #FF6D33 and the
                overflow was invisible, but it also meant the white you saw was
                the logo's NEGATIVE space rather than a logo on a plate. It
                reads as the mark now. */}
            <g transform="translate(470.5 169.5)">
              <Logo variant="mark" width={27} decorative />
            </g>
          </g>
        </g>

        {/* The destination, lifted 8 units so it sits ON the kerb rather than
            in the road.

            This number has been wrong twice in opposite directions and both
            are worth recording. Originally the house sat at y 45..141 while
            the road ends at y 152: the road is stroked at 38 with a round cap,
            so a 19 unit half-disc of tarmac stuck out below the building with
            nothing on it, and the house appeared to float above a lollipop.
            Dropping it 14 units fixed the lollipop and created a worse
            problem, because the car parks at the end of that road and the
            house had been moved down on top of where it parks.

            -8 is the value that satisfies both. The house's base now lands on
            the road's top edge (y 133 either way), so there is no gap and no
            floating, and the whole car sits below it, on the tarmac, which is
            where a parked car belongs. The round cap that started all this is
            now the apron the car is parked on, with the ground shadow below
            tying the two together.

            THE HOUSE IS LOCKED UNTIL PROPSOCH OPENS IT.

            This is the point of the whole scene and it was the one beat
            missing. The house now starts shut: grey door, dark windows, a
            padlock on it. It opens the moment the car pulls AWAY from the
            Propsoch mark, not when it arrives at the house, because what
            unlocked it was the advice, not the arrival. The lights come on,
            the door turns brand orange and the padlock pops off.

            The timing is a CSS keyframe on the same 11.6s clock as everything
            else in this scene rather than another `data-stage`, for two
            reasons: the moment it needs (56.38%, the car leaving the pit stop)
            is not one of the five stage boundaries, and adding a sixth stage
            would have broken the 0..4 mapping that the checkpoint ticks and
            the four stat cards both read. See @keyframes propsoch-home-unlock. */}
        <g className="hero-route-destination" transform="translate(0 -8)">
          {/* Ground. Absorbs the road's end cap into something that looks
              deliberate, and stops the house reading as pasted on. */}
          <ellipse className="hero-route-home-ground" cx="590" cy="141" rx="54" ry="7" />

          {/* IT WAS A PENTAGON WITH TWO GREY SQUARES IN IT.

              One path did the roof and the walls together, so there was no
              eaves line, no overhang and no difference in tone between the
              plane that faces the sky and the plane that faces you, which is
              the single biggest thing that makes a drawn house read as a
              house. The windows were filled rectangles with no frame, no
              glazing bars and no sill.

              It is now built the way a house is built, back to front:
              chimney, walls, roof over both, then the openings cut into the
              wall. Each piece is a separate shape so each can take its own
              tone, and the whole thing is lit from the top left to match the
              one light source the rest of the hero uses.

              Everything here paints once. None of it animates, so the detail
              costs nothing per frame. */}

          {/* Chimney FIRST, so the roof laid over it clips the stack off at
              the roofline and it reads as coming through the roof rather than
              as a box parked on top of it. */}
          <g className="hero-route-home-chimney">
            <rect x="606" y="45" width="10" height="24" />
            <rect x="603.5" y="41.5" width="15" height="5" rx="1.6" />
          </g>

          {/* Walls. */}
          <rect
            className="hero-route-home-wall"
            x="552"
            y="80"
            width="76"
            height="61"
          />

          {/* The shadow the overhang throws down the top of the wall. */}
          <rect
            className="hero-route-home-eave-shade"
            x="553"
            y="81"
            width="74"
            height="13"
          />

          {/* Roof, overhanging the walls by 8 either side. */}
          <path className="hero-route-home-roof" d="M544 81 590 40l46 41Z" />
          {/* Tile courses, inset off both rakes so they do not touch the edge.
              Three lines is enough to say "tiled" at this size; more turns
              into a moire. */}
          <path className="hero-route-home-tiles" d="M575 55h30M566 63h48M557 71h66" />
          {/* Fascia, covering the joint where roof meets wall. */}
          <rect
            className="hero-route-home-fascia"
            x="543"
            y="78.5"
            width="94"
            height="5.5"
            rx="2.2"
          />

          {/* THE DOOR IS OFF CENTRE, AND THAT IS THE CAR'S FAULT.

              It used to sit dead centre under the roof apex. The car parks at
              the end of the road, which is x 588, and the car is 38 wide, so
              it covered x 569..607: the entire door, including the orange it
              had just turned. The payoff of the unlock was visible for two
              seconds and then parked on. The door sits left of the face now,
              where the car overlaps only its bottom corner. */}

          {/* Openings: frames first, then the glass and the door leaf, which
              are the parts that change when the house opens. */}
          <rect className="hero-route-home-frame" x="583" y="92" width="18" height="20" rx="1.6" />
          <rect className="hero-route-home-frame" x="605" y="92" width="18" height="20" rx="1.6" />
          <rect className="hero-route-home-frame" x="557" y="110" width="19" height="31" rx="1.6" />

          {/* Shut: dark glass, grey door leaf. */}
          <rect className="hero-route-home-dark" x="585" y="94" width="14" height="16" />
          <rect className="hero-route-home-dark" x="607" y="94" width="14" height="16" />
          <rect className="hero-route-home-dark" x="559" y="112" width="15" height="29" />

          {/* Open: the lights come on and the door leaf takes the brand
              orange. Accent yellow is this palette's declared one flourish and
              it is spent here on purpose: nothing else says "somebody is home"
              as immediately as two lit windows, and another orange would have
              been a change you have to look for rather than one you see. */}
          <g className="hero-route-home-lit">
            <rect x="585" y="94" width="14" height="16" fill="var(--color-accent-yellow)" />
            <rect x="607" y="94" width="14" height="16" fill="var(--color-accent-yellow)" />
            <rect x="559" y="112" width="15" height="29" fill="var(--color-brand)" />
            {/* Warm spill onto the sill, which is what actually sells a lit
                window: the light has to land on something. */}
            <path className="hero-route-home-spill" d="M583 112h18l3 4h-24zM605 112h18l3 4h-24z" />
            {/* A handle, so the open door reads as a door and not a panel. */}
            <circle cx="571" cy="127" r="1.5" fill="var(--color-brand-tint)" />
          </g>

          {/* Glazing bars and sills, drawn AFTER the lit group so they stay
              legible whether the glass behind them is dark or lit. */}
          <path
            className="hero-route-home-bars"
            d="M592 94v16M585 102h14M614 94v16M607 102h14"
          />
          <rect className="hero-route-home-sill" x="581.5" y="111.5" width="21" height="2.6" rx="1.3" />
          <rect className="hero-route-home-sill" x="603.5" y="111.5" width="21" height="2.6" rx="1.3" />

          {/* The padlock.

              Redrawn from a flat dark rectangle with a hairline hoop into
              something that reads as an object at 13 units wide: the body sits
              on a white plate so it separates from the door underneath it
              rather than merging with it, the shackle is heavy enough to read
              as metal at this size, and the keyhole is a real keyhole (a
              bore and a slot) rather than a dot. Pops and vanishes when the
              car leaves the Propsoch mark. */}
          <g className="hero-route-lock">
            <path
              className="hero-route-lock-shackle"
              d="M563 121v-4a3.6 3.6 0 0 1 7.2 0v4"
            />
            <rect
              className="hero-route-lock-plate"
              x="558.6"
              y="119.6"
              width="16.4"
              height="13.8"
              rx="3.6"
            />
            <rect
              className="hero-route-lock-body"
              x="560"
              y="121"
              width="13.6"
              height="11"
              rx="2.8"
            />
            <circle className="hero-route-lock-hole" cx="566.8" cy="125" r="1.5" />
            <rect
              className="hero-route-lock-hole"
              x="566.1"
              y="125.6"
              width="1.4"
              height="3.2"
              rx="0.7"
            />
          </g>

          {/* The house at the end of the route is a VERIFIED one, and that is
              checkpoint four: the badge lands when the car parks, not before.
              Separate from the lock on purpose. The lock is about ACCESS and
              turns at the pit stop; this is about the house having been
              CHECKED, and it turns on arrival. Two claims, two moments. */}
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

          {/* The "thinking" bubble, shown for the 600ms stop at the Propsoch
              mark.

              Lives INSIDE the car group on purpose, not beside it: this way it
              inherits the exact same offset-path transform the car uses to
              follow the road, so it is guaranteed to sit over the roof rather
              than needing a second set of coordinates kept in sync by hand.

              THE COUNTER-ROTATION IS NOT OPTIONAL.

              Inheriting the car's transform means inheriting `offset-rotate:
              auto` with it, and the car banks to the road's tangent. At the
              house that was harmless, because the road levels off to about 7
              degrees there. The Propsoch mark is NOT there: it sits at 68% of
              the road, in the steepest part of the climb, where the tangent is
              -61.43 degrees. Without this wrapper the bubble came up lying
              almost on its side.

              The angle is a hardcoded constant rather than something derived,
              and that is safe for one specific reason: the bubble is only ever
              visible while `offset-distance` is FROZEN at 68%, so the rotation
              it is cancelling cannot change while anyone can see it. If the
              stop ever moves to a different point on the road, this number has
              to be recomputed from the tangent there, which is why the
              distance it belongs to is written next to it. */}
          <g transform="rotate(61.43)" data-cancels-tangent-at="68%">
            <g className="hero-route-thinking">
              {/* Coordinates are local to the car, which is drawn with its
                  wheels at y ~ -4 and its cabin roof at y ~ -21, so -19 to -41
                  sits clear above the roof with the tail closing the gap. */}
              <path className="hero-route-thinking-tail" d="M-4 -24 4 -24 0 -19Z" />
              <rect
                className="hero-route-thinking-bubble"
                x="-15"
                y="-41"
                width="30"
                height="17"
                rx="8.5"
              />
              <circle className="hero-route-thinking-dot" cx="-6.5" cy="-32.5" r="1.9" />
              <circle className="hero-route-thinking-dot" cx="0" cy="-32.5" r="1.9" />
              <circle className="hero-route-thinking-dot" cx="6.5" cy="-32.5" r="1.9" />
            </g>
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
