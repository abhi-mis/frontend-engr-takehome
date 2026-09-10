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

// Section order is the argument: how we differ, proof, evidence, the skill,
// the process, the people, then the offer. Grounds alternate so none repeat.
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
