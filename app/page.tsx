import { Hero } from "@/components/sections/hero";
import { Comparison } from "@/components/sections/comparison";
import { Testimonials } from "@/components/sections/testimonials";
import { RealityCheck } from "@/components/sections/reality-check";
import { Timeline } from "@/components/sections/timeline";
import { SavingsCalculator } from "@/components/sections/savings-calculator";
import { FeaturedIn } from "@/components/sections/featured-in";
import { Faq } from "@/components/sections/faq";

/**
 * The page is pure composition. Every section is a Server Component; the three
 * interactive islands live inside the comparison, calculator and checker and
 * are the only "use client" boundaries in the build.
 *
 * Section order follows the plan: lead with the message, then the argument
 * (how we differ), then the PROOF of that argument in three customers' own
 * voices, then the single piece of hard evidence (a real plan, brochure against
 * survey), then the process (25 days), then the savings calculator, and finally
 * the FAQ, which is where a reader who is nearly convinced goes to check the
 * things that would stop them.
 *
 * The press logos sit in between, as a quiet band rather than a section: by
 * that point the argument is made, and third-party coverage is a stamp on it
 * rather than another claim.
 *
 * The pincode checker was removed at your request. lib/pincodes.ts and its
 * tests are kept: the data is verified against India Post and the component
 * still works, so re-adding the section is one import.
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
      <Timeline />
      <SavingsCalculator />
      <FeaturedIn />
      <Faq />
    </main>
  );
}
