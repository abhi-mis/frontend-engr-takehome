import { SectionHeading } from "@/components/section-heading";
import { FLOOR_PLAN, FLOOR_PLAN_CHECKS } from "@/lib/content";

// Interactive with no client JavaScript: a radio group drives the highlights
// through sibling selectors. The ids are also CSS selectors in globals.css.
export function FloorPlan() {
  const first = FLOOR_PLAN_CHECKS[0];

  return (
    <section id="floor-plan" className="lazy-section bg-surface py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <SectionHeading
          eyebrow={FLOOR_PLAN.eyebrow}
          heading={FLOOR_PLAN.heading}
          sub={FLOOR_PLAN.intro}
        />

        <fieldset className="plan-reader mt-12">
          <legend className="sr-only">{FLOOR_PLAN.groupLabel}</legend>
          {FLOOR_PLAN_CHECKS.map((check) => (
            <input
              key={check.id}
              className="plan-radio"
              type="radio"
              name="plan-focus"
              id={`plan-${check.id}`}
              defaultChecked={check.id === first.id}
            />
          ))}

          <div className="plan-figure">
            <PlanDrawing />
            <p className="plan-note">{FLOOR_PLAN.figureNote}</p>
          </div>
          <ul className="plan-list">
            {FLOOR_PLAN_CHECKS.map((check) => (
              <li key={check.id} data-focus={check.id} className="plan-item">
                <label className="plan-row" htmlFor={`plan-${check.id}`}>
                  <span aria-hidden className="plan-row-marker" />
                  <span className="plan-row-title">{check.title}</span>
                </label>
                <p className="plan-desc">{check.body}</p>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
    </section>
  );
}

function PlanDrawing() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 520 400"
      className="plan-svg"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="20" y="20" width="480" height="360" rx="3" fill="#fff" />

      <g className="plan-furniture">
        <rect x="45" y="45" width="92" height="112" rx="5" />
        <path d="M45 66h92" />
        <rect x="45" y="228" width="92" height="112" rx="5" />
        <path d="M45 249h92" />
        <rect x="272" y="58" width="104" height="34" rx="7" />
        <rect x="288" y="116" width="72" height="46" rx="4" />
        <rect x="258" y="350" width="126" height="24" rx="3" />
        <ellipse cx="452" cy="352" rx="11" ry="14" />
        <rect x="466" y="312" width="24" height="17" rx="3" />
      </g>
      <g className="plan-zone-under" data-zone="circulation">
        <rect className="plan-zone-fill" x="203" y="23" width="44" height="354" />
      </g>
      <g className="plan-zone-under" data-zone="balcony">
        <rect className="plan-zone-fill" x="433" y="23" width="64" height="214" />
      </g>
      <g className="plan-zone-under" data-zone="kitchen">
        <rect className="plan-zone-fill" x="253" y="243" width="134" height="134" />
        <rect className="plan-zone-fill" x="393" y="243" width="104" height="54" />
      </g>
      <g className="plan-wall-inner">
        <path d="M200 20v90M200 160v90M200 300v80" />
        <path d="M250 20v40M250 140v150M250 350v30" />
        <path d="M20 200h180" />
        <path d="M250 240h250" />
        <path d="M430 20v70M430 170v70" />
        <path d="M390 240v10M390 290v30M390 370v10" />
        <path d="M390 300h110" />
      </g>
      <g className="plan-wall-outer">
        <path d="M20 380V20h480v360h-255M205 380H20" />
      </g>
      <g className="plan-window-break">
        <path d="M20 70v70M20 250v70M70 20h80M300 20h90M500 70v120M290 380h70M440 380h40" />
      </g>
      <g className="plan-window">
        <path d="M20 70v70M20 250v70M70 20h80M300 20h90M500 70v120M290 380h70M440 380h40" />
      </g>
      <g className="plan-label">
        <text x="110" y="182">Bedroom</text>
        <text x="110" y="364">Bedroom</text>
        <text x="340" y="200">Living / dining</text>
        <text x="338" y="266">Kitchen</text>
      </g>
      <g className="plan-label plan-label--small">
        <text x="225" y="200" transform="rotate(-90 225 200)">
          Passage
        </text>
        <text x="465" y="130" transform="rotate(-90 465 130)">
          Balcony
        </text>
        <text x="445" y="272">Utility</text>
        <text x="415" y="348">Bath</text>
      </g>
      <g className="plan-zone" data-zone="ventilation">
        <path
          className="plan-zone-window"
          d="M20 70v70M70 20h80M300 20h90M500 70v120M290 380h70"
        />
        <path className="plan-zone-flow" d="M344 36C348 82 384 120 452 132" />
        <path className="plan-zone-flow" d="M36 104C62 100 88 72 102 38" />
        <path className="plan-zone-arrow" d="M444 124l12 8-13 7" />
        <path className="plan-zone-arrow" d="M94 50l8-12 8 11" />
      </g>
      <g className="plan-zone" data-zone="circulation">
        <path className="plan-zone-route" d="M225 366V100h44" />
        <path className="plan-zone-route" d="M225 150h-38" />
        <path className="plan-zone-route" d="M225 272h-38" />
      </g>
      <g className="plan-zone" data-zone="doors">
        <path className="plan-zone-swing" d="M200 110A50 50 0 0 0 150 160" />
        <path className="plan-zone-leaf" d="M200 160h-50" />
        <path className="plan-zone-swing" d="M200 300A50 50 0 0 1 150 250" />
        <path className="plan-zone-leaf" d="M200 250h-50" />
        <path className="plan-zone-swing" d="M390 370A50 50 0 0 0 440 320" />
        <path className="plan-zone-leaf" d="M390 320h50" />
        <path className="plan-zone-swing" d="M245 380A40 40 0 0 0 205 340" />
        <path className="plan-zone-leaf" d="M205 380v-40" />
      </g>
      <g className="plan-zone" data-zone="balcony">
        <path className="plan-zone-dim" d="M436 205h58" />
        <path className="plan-zone-dim" d="M436 197v16M494 197v16" />
        <path className="plan-zone-arrow" d="M444 200l-8 5 8 5M486 200l8 5-8 5" />
        <text className="plan-zone-dim-text" x="465" y="188">
          depth
        </text>
      </g>
      <g className="plan-zone" data-zone="kitchen">
        <path className="plan-zone-route" d="M292 362 355 362 272 268Z" />
        <g className="plan-zone-node">
          <circle cx="292" cy="362" r="5" />
          <circle cx="355" cy="362" r="5" />
          <circle cx="272" cy="268" r="5" />
        </g>
      </g>
    </svg>
  );
}
