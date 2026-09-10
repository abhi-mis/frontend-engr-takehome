import { Hero } from "@/components/sections/hero";
import { Comparison } from "@/components/sections/comparison";
import { Testimonials } from "@/components/sections/testimonials";
import { RealityCheck } from "@/components/sections/reality-check";
import { Timeline } from "@/components/sections/timeline";
import { FloorPlan } from "@/components/sections/floor-plan";
import { Advisors } from "@/components/sections/advisors";
import { Guided } from "@/components/sections/guided";
import { FeaturedIn } from "@/components/sections/featured-in";
import { Faq } from "@/components/sections/faq";

/**
 * The page is pure composition. Every section is a Server Component; the
 * comparison and checker islands are the only "use client" boundaries left in
 * the build.
 *
 * Section order follows the plan: lead with the message, then the argument
 * (how we differ), then the PROOF of that argument in three customers' own
 * voices, then the single piece of hard evidence (a real plan, brochure against
 * survey), then the process (25 days), then the FAQ, which is where a reader
 * who is nearly convinced goes to check the things that would stop them.
 *
 * THE TWO ADDED SECTIONS, AND WHY THEY SIT WHERE THEY DO
 *
 * `FloorPlan` follows the reality check because it is the same argument one
 * step on. The reality check shows a plan being read FOR you; the floor plan
 * reader hands you the five checks and lets you do it yourself. Reading them
 * in the other order would be teaching a skill before showing why it matters.
 *
 * `Advisors` follows the timeline because the process raises the question it
 * answers. Once the page has spent five steps describing what happens in 25
 * days, the next question about a service sold on judgement is whose
 * judgement. Before the timeline it would have been four job titles with no
 * work attached to them yet.
 *
 * Both are Server Components, and the floor plan reader is interactive
 * without being a client island: it is a radio group driving CSS, so the two
 * new sections together add zero bytes of JavaScript.
 *
 * `Guided` is the closing argument, and it goes last of the argument sections
 * for the same reason: six capability lines are a recap once the case has been
 * made and proved, and a list of unbacked claims before it has. Its own note
 * covers why it is a light section with a raised card rather than the dark
 * band Propsoch use for it.
 *
 * The grounds still alternate, which is the thing that keeps a long page from
 * reading as one column: sunken, surface, sunken, surface, ink, surface,
 * sunken, band, surface. No two neighbours share a background.
 *
 * The press logos sit in between, as a quiet band rather than a section: by
 * that point the argument is made, and third-party coverage is a stamp on it
 * rather than another claim.
 *
 * The savings calculator and the pincode checker were both removed at your
 * request. Their components, and the lib/currency.ts and lib/pincodes.ts data
 * and tests behind them, are kept rather than deleted: both are verified and
 * both still work, so re-adding either section later is one import. The
 * calculator's own nav anchor (`#calculator`) came out of SECTION_LINKS in
 * lib/content.ts at the same time, so the header and footer are not left
 * linking to a section the page no longer renders.
 *
 * Testimonials sit immediately after the comparison because the comparison
 * makes a claim and the obvious next question is "says who". Answering it
 * anywhere later would mean carrying that claim on trust through two more
 * sections first.
 */
export default function HomePage() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <Comparison />
      <Testimonials />
      <RealityCheck />
      <FloorPlan />
      <Timeline />
      <Advisors />
      <Guided />
      <FeaturedIn />
      <Faq />
    </main>
  );
}
