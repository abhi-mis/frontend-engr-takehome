import { HERO, STATS } from "@/lib/content";
import { Logo } from "@/components/brand/logo";
import { RouteProgress } from "@/components/brand/route-progress";

const ROAD =
  "M26 449C124 461 166 415 249 385c76-27 120-1 168-55 47-53 49-119 106-167 26-17 48-13 65-11";

const ROAD_ID = "propsoch-hero-road";

const PIN_FILL_ID = "propsoch-hero-pin-fill";
const WALL_FILL_ID = "propsoch-hero-wall-fill";
const ROOF_FILL_ID = "propsoch-hero-roof-fill";
const EAVE_SHADE_ID = "propsoch-hero-eave-shade";

// Points measured along the road by arc length (22%, 46%, 68%), with the unit
// normal at each, so the roadside markers stand off the kerb at a constant gap.
const CHECKPOINTS = [
  { x: 171.1, y: 420, nx: -0.436, ny: -0.9 },
  { x: 326, y: 369.7, nx: -0.104, ny: -0.995 },
  { x: 444.2, y: 290.5, nx: 0.878, ny: 0.478 },
] as const;

const SIGNAL_OFFSET = 40;
const POST_FROM = 17;
const POST_TO = 29;

const ROAD_WORDMARKS = Math.min(7, HERO.marqueeRepeat);

export function HeroRouteArt({ className }: { readonly className?: string }) {
  return (
    <div aria-hidden className={["hero-route-art", className ?? ""].join(" ")}>
      <svg
        className="hero-route-map"
        viewBox="0 0 640 540"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ "--road": `path("${ROAD}")` } as React.CSSProperties}
      >
        <defs>
          <path id={ROAD_ID} d={ROAD} />

          <linearGradient id={PIN_FILL_ID} x1="0.15" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FF895B" />
            <stop offset="52%" stopColor="var(--color-brand)" />
            <stop offset="100%" stopColor="var(--color-brand-display)" />
          </linearGradient>
          <linearGradient id={WALL_FILL_ID} x1="0.1" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#FFFDFB" />
            <stop offset="55%" stopColor="var(--color-brand-tint)" />
            <stop offset="100%" stopColor="#F6DDD1" />
          </linearGradient>
          <linearGradient id={ROOF_FILL_ID} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#F4693A" />
            <stop offset="100%" stopColor="var(--color-brand-strong)" />
          </linearGradient>
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
        <path d={ROAD} stroke="#fff" strokeWidth="38" strokeLinecap="round" />
        <path
          className="hero-route-surface"
          d={ROAD}
          stroke="var(--color-brand-soft)"
          strokeOpacity="0.44"
          strokeWidth="28"
          strokeLinecap="round"
        />

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
        {CHECKPOINTS.map((point, i) => {
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

        <g transform="translate(444.2 290.5) scale(0.82) translate(-484 -273)">
          <g className="hero-route-pin">
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

            <path
              className="hero-route-pin-rim"
              d="M439.6 171.1A46 46 0 0 1 495.9 138.6"
            />

            <circle className="hero-route-pin-eye" cx="484" cy="183" r="20" />

            <g transform="translate(470.5 169.5)">
              <Logo variant="mark" width={27} decorative />
            </g>
          </g>
        </g>
        <g className="hero-route-destination" transform="translate(0 -8)">
          <ellipse className="hero-route-home-ground" cx="590" cy="141" rx="54" ry="7" />

          <g className="hero-route-home-chimney">
            <rect x="606" y="45" width="10" height="24" />
            <rect x="603.5" y="41.5" width="15" height="5" rx="1.6" />
          </g>
          <rect
            className="hero-route-home-wall"
            x="552"
            y="80"
            width="76"
            height="61"
          />

          <rect
            className="hero-route-home-eave-shade"
            x="553"
            y="81"
            width="74"
            height="13"
          />

          <path className="hero-route-home-roof" d="M544 81 590 40l46 41Z" />

          <path className="hero-route-home-tiles" d="M575 55h30M566 63h48M557 71h66" />

          <rect
            className="hero-route-home-fascia"
            x="543"
            y="78.5"
            width="94"
            height="5.5"
            rx="2.2"
          />

          <rect className="hero-route-home-frame" x="583" y="92" width="18" height="20" rx="1.6" />
          <rect className="hero-route-home-frame" x="605" y="92" width="18" height="20" rx="1.6" />
          <rect className="hero-route-home-frame" x="557" y="110" width="19" height="31" rx="1.6" />

          <rect className="hero-route-home-dark" x="585" y="94" width="14" height="16" />
          <rect className="hero-route-home-dark" x="607" y="94" width="14" height="16" />
          <rect className="hero-route-home-dark" x="559" y="112" width="15" height="29" />

          <g className="hero-route-home-lit">
            <rect x="585" y="94" width="14" height="16" fill="var(--color-accent-yellow)" />
            <rect x="607" y="94" width="14" height="16" fill="var(--color-accent-yellow)" />
            <rect x="559" y="112" width="15" height="29" fill="var(--color-brand)" />

            <path className="hero-route-home-spill" d="M583 112h18l3 4h-24zM605 112h18l3 4h-24z" />

            <circle cx="571" cy="127" r="1.5" fill="var(--color-brand-tint)" />
          </g>
          <path
            className="hero-route-home-bars"
            d="M592 94v16M585 102h14M614 94v16M607 102h14"
          />
          <rect className="hero-route-home-sill" x="581.5" y="111.5" width="21" height="2.6" rx="1.3" />
          <rect className="hero-route-home-sill" x="603.5" y="111.5" width="21" height="2.6" rx="1.3" />

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
          <g className="hero-route-probe hero-route-verified" data-step="4">
            <circle className="hero-route-probe-halo" cx="622" cy="132" r="17" />

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
        <g className="hero-route-car">
          <ellipse className="hero-route-car-shadow" cx="0" cy="1.5" rx="18" ry="3.2" />

          <path
            className="hero-route-car-cabin"
            d="M-9 -12v-6a3 3 0 0 1 3-3h9.5a3 3 0 0 1 2.5 1.4l4.8 7.6z"
          />
          <path className="hero-route-car-glass" d="M-6.4 -13.2v-5a1.4 1.4 0 0 1 1.4-1.4h5.4l4.3 6.4z" />
          <rect className="hero-route-car-body" x="-19" y="-13" width="38" height="11" rx="4.2" />

          <circle className="hero-route-car-lamp" cx="16.7" cy="-7.9" r="1.5" />
          <g className="hero-route-wheel hero-route-wheel--back">
            <circle r="4.3" cy="-4.1" cx="-10" />
            <circle className="hero-route-wheel-hub" r="1.45" cy="-4.1" cx="-10" />
          </g>
          <g className="hero-route-wheel hero-route-wheel--front">
            <circle r="4.3" cy="-4.1" cx="10" />
            <circle className="hero-route-wheel-hub" r="1.45" cy="-4.1" cx="10" />
          </g>
          <g transform="rotate(61.43)" data-cancels-tangent-at="68%">
            <g className="hero-route-thinking">
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
      <div className="hero-route-listing hero-route-listing--three hero-route-listing--picked">
        <span className="hero-route-listing-image" />
        <span className="hero-route-listing-lines"><i /><i /></span>
        <span className="hero-route-listing-mark" />
      </div>
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
