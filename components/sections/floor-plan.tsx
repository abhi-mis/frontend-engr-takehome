import { SectionHeading } from "@/components/section-heading";
import { FLOOR_PLAN, FLOOR_PLAN_CHECKS } from "@/lib/content";

/**
 * "Read a floor plan like an architect."
 *
 * An interactive teaching diagram: pick one of five checks and the drawing
 * shows you where to look for it.
 *
 * IT IS INTERACTIVE AND IT SHIPS NO JAVASCRIPT. THAT IS THE WHOLE TRICK.
 *
 * This is a Server Component with no client boundary anywhere in it, so the
 * bundle grows by zero bytes and there is nothing to hydrate. The state is a
 * radio group: five inputs sharing a name, visually hidden, sitting as the
 * first children of the fieldset so a plain `~` sibling selector can reach
 * both the drawing and the list from any one of them.
 *
 *     #plan-doors:checked ~ .plan-figure [data-zone="doors"] { opacity: 1 }
 *
 * That buys, for free, things a JavaScript version would have had to
 * reimplement: arrow keys move between options because it is a real radio
 * group, the choice survives with JavaScript disabled, it works before
 * hydration, and it cannot desynchronise from the DOM because there is no
 * second copy of the state.
 *
 * Every state change is `opacity` on a group that is already painted, so the
 * whole interaction stays on the compositor. Nothing here recalculates layout.
 *
 * WHY NOT `:has()`
 *
 * `.plan-reader:has(#plan-doors:checked)` would read better and would let the
 * inputs live next to their labels. The `~` version needs the inputs hoisted
 * to the top of the fieldset, which is the one slightly odd thing about this
 * markup. It is worth it: `~` has no support caveat at all, and matching is
 * strictly leftward rather than a subtree query the engine has to invalidate
 * on every state change. For an effect this small the boring selector wins.
 *
 * FIXED IDS IN A COMPONENT
 *
 * `plan-ventilation`, `plan-doors` and so on are literal ids, not `useId`
 * values, because the stylesheet has to name them. That is safe precisely
 * because this is a Server Component rendered exactly once per page. If this
 * section ever needs to appear twice, the ids collide and the fix is `:has()`
 * with a scoped attribute, not a second set of ids.
 *
 * ACCESSIBILITY
 *
 * The drawing is decoration and is `aria-hidden`: every single thing it shows
 * is stated in the text of the item beside it, so a screen reader gets the
 * whole lesson without it. The fieldset's legend names the group, each label
 * is a real label, and the collapsed descriptions are `display: none` rather
 * than clipped, so they leave the accessibility tree with the visual state
 * instead of being read out for options that are not open.
 */
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

          {/* Hoisted to the top of the fieldset so `~` can reach the figure
              and the list. Absolutely positioned, so they take no space. */}
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

/**
 * The plan itself. A 2BHK drawn to be read rather than to be admired.
 *
 * Coordinates are a plain 520 x 400 grid with the envelope at 20,20 to
 * 500,380, so every wall lands on a round number and a future edit does not
 * have to reverse engineer the geometry:
 *
 *     x=200,250  the passage, running the full depth
 *     y=200      splits the two bedrooms, left of the passage
 *     y=240      splits living from the service rooms, right of the passage
 *     x=430      living to balcony          x=390  kitchen to bath and utility
 *
 * Walls are drawn as SEGMENTS with gaps where the openings are, which is why
 * the wall paths look broken up. That is not decoration: a doorway is an
 * absence of wall, and drawing it as one means the door swings in the `doors`
 * zone land exactly in the holes rather than being positioned by eye.
 *
 * The five highlight groups are painted last, all at `opacity: 0`, and the
 * stylesheet raises whichever one is selected.
 */
function PlanDrawing() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 520 400"
      className="plan-svg"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Floor. */}
      <rect x="20" y="20" width="480" height="360" rx="3" fill="#fff" />

      {/* Furniture, drawn faintly. A plan with nothing in it reads as a
          diagram of boxes; one with a bed in it reads as a home, and it is
          also how you judge whether a room actually takes the furniture. */}
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

      {/* Zone FILLS, painted here rather than with the rest of each zone.

          They used to sit in the late groups with everything else, which put a
          tinted rectangle on top of the room's own name and turned "Kitchen"
          into a smudge the moment you selected it. Fills belong under the
          walls and the labels; only the marks that have to be read over the
          drawing belong on top. Both halves carry the same `data-zone`, so one
          selector still lights both. */}
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

      {/* Internal partitions, with the openings left out. */}
      <g className="plan-wall-inner">
        <path d="M200 20v90M200 160v90M200 300v80" />
        <path d="M250 20v40M250 140v150M250 350v30" />
        <path d="M20 200h180" />
        <path d="M250 240h250" />
        <path d="M430 20v70M430 170v70" />
        <path d="M390 240v10M390 290v30M390 370v10" />
        <path d="M390 300h110" />
      </g>

      {/* The envelope, minus the entry. Drawn as four runs rather than a rect
          so the bottom wall can carry the door opening. */}
      <g className="plan-wall-outer">
        <path d="M20 380V20h480v360h-255M205 380H20" />
      </g>

      {/* Windows. The white break is what makes the opening read as a hole in
          the wall rather than a line drawn on top of it. */}
      <g className="plan-window-break">
        <path d="M20 70v70M20 250v70M70 20h80M300 20h90M500 70v120M290 380h70M440 380h40" />
      </g>
      <g className="plan-window">
        <path d="M20 70v70M20 250v70M70 20h80M300 20h90M500 70v120M290 380h70M440 380h40" />
      </g>

      {/* Room names. */}
      {/* Names sit in the clear floor of each room rather than at its centre,
          because the centre is where the furniture is. "Bath" in particular
          was at y=393, which is below the outer wall at y=380: the label was
          outside the building. */}
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

      {/* ----------------------------------------------------------------
          The five highlight zones. All hidden until one is chosen.
      ---------------------------------------------------------------- */}

      {/* 1. Cross ventilation: the openings that pair up, and the path the air
             takes between them. The living room vents front to back through
             the balcony; the master vents across its corner. */}
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

      {/* 2. Circulation: the passage, plus the route from the front door to
             the living room. Shaded because the point is how much floor it
             costs, not where it runs. */}
      <g className="plan-zone" data-zone="circulation">
        <path className="plan-zone-route" d="M225 366V100h44" />
        <path className="plan-zone-route" d="M225 150h-38" />
        <path className="plan-zone-route" d="M225 272h-38" />
      </g>

      {/* 3. Door lines: every leaf swung to where it actually opens. Three
             doors and the entry, each with the quarter circle it sweeps. */}
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

      {/* 4. Balcony depth: the dimension nobody prints on the brochure. No
             number on it, because this is a representative plan and a
             measurement would be a made up one. */}
      <g className="plan-zone" data-zone="balcony">
        <path className="plan-zone-dim" d="M436 205h58" />
        <path className="plan-zone-dim" d="M436 197v16M494 197v16" />
        <path className="plan-zone-arrow" d="M444 200l-8 5 8 5M486 200l8 5-8 5" />
        <text className="plan-zone-dim-text" x="465" y="188">
          depth
        </text>
      </g>

      {/* 5. Kitchen and utility: the two rooms lit together, because the
             question is whether they connect, plus the triangle between sink,
             hob and fridge that decides whether the room is workable. */}
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
