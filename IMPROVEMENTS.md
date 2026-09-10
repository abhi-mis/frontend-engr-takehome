# Propsoch Landing Page Improvements

This document lists the main product and design improvements made to the Propsoch landing page and the reason behind each change.

## 1. Hero

**Improved:** Reworked the hero hierarchy and presentation while keeping the original Propsoch copy and brand direction.

**Why:** The first section should communicate the service clearly and establish the main action without making the visitor work through the layout to understand the offering.

### Hero Visuals

**Improved:** Refined the road, car and house visual treatment and added the typewriter presentation to the headline.

**Why:** The hero should feel distinctive and connected to the Propsoch identity instead of looking like a generic real-estate landing page.

## 2. How We Read a Plan

**Improved:** Added a floor-plan education section showing the practical things an advisor looks for, including cross ventilation, circulation, door lines, balcony depth and kitchen and utility planning.

**Why:** Buyers are often given a floor plan without knowing what to look for. This section turns part of Propsoch's expertise into useful content that visitors can understand before making a decision.

## 3. Advisors and Team

**Improved:** Added a dedicated team section showing advisor roles, experience, locations covered and the areas they focus on.

**Why:** Property advisory is a trust-based service. Showing the people behind the advice makes the service more tangible and gives visitors a better understanding of who is helping them.

## 4. 25-Day Process

**Improved:** Redesigned the process presentation as a full-page timeline instead of keeping the steps inside a small scroll area.

**Why:** The complete journey should be visible and easy to follow. A normal page-flow timeline makes the sequence easier to scan and understand.

## 5. Testimonials

**Improved:** Corrected the testimonial content so the person, video and supporting information belong together.

**Why:** A testimonial loses credibility when the displayed identity does not match the person in the video. The section needed to present each customer's story accurately.

## 6. Featured In

**Improved:** Added a dedicated section showing the media and companies where Propsoch has been featured, using their actual logos and links.

**Why:** External recognition is useful trust information, but it should be easy to discover and verify rather than being hidden or presented as decorative content.

## 7. Footer

**Improved:** Reworked the footer to include locations, partner builders, navigation, social links and legal information.

**Why:** The footer is the final navigation point on the page. It should provide useful destinations and supporting information instead of ending with mostly unused space.

## 8. Navigation

**Improved:** Refined the existing navigation for both desktop and mobile while keeping the original structure.

**Why:** Visitors should be able to move between the important parts of the landing page without the navigation competing with the content.

## 9. Comparison and Property Guidance

**Improved:** Refined the comparison experience, plan comparison and related property guidance interactions.

**Why:** These sections contain decision-making information, so the presentation should make differences and supporting details easier to explore.

## 10. Savings Calculator and Pincode Experience

**Improved:** Kept the calculator and pincode functionality as part of the landing-page experience and presented them as focused interactions rather than adding unnecessary navigation.

**Why:** Visitors can get useful information directly from the page without breaking their browsing flow.

## 11. FAQ and Supporting Content

**Improved:** Structured the FAQ and supporting content into clearer interactive sections.

**Why:** Visitors who are evaluating a property advisory service often need additional information before taking action. Clear grouping makes that information easier to scan.

## 12. Mobile Experience

**Improved:** Reworked the layout for smaller screens, including the hero, navigation, process, cards, content spacing and interactive areas.

**Why:** The mobile experience should not feel like a compressed desktop page. Content hierarchy, readability and interaction need to work naturally at smaller widths.

## 13. Visual System

**Improved:** Created a more consistent visual language across typography, spacing, colour usage, cards, buttons and section headings.

**Why:** Consistency makes the page easier to scan and gives the different sections a stronger relationship with the Propsoch brand.
## 14. Web Vitals Improvements and Fixes

### 14.1 Largest Contentful Paint (LCP)

**Issue:** The hero depended on client-side rendering, while large artwork, fonts and media increased the time required to display the main content.

**Fix:** Rendered the critical hero content using Next.js Server Components, kept it in the initial HTML, optimised fonts and assets, removed unnecessary third-party requests, hid large hero artwork on mobile, and deferred below-the-fold media.

### 14.2 Total Blocking Time (TBT)

**Issue:** Excessive JavaScript and duplicated responsive markup increased hydration and main-thread execution.

**Fix:** Used Server Components by default, limited Client Components to interactive sections, removed duplicate mobile/desktop markup, replaced unnecessary JavaScript animations with CSS, and removed third-party execution.

### 14.3 Main-thread Work

**Issue:** The original page performed significant scripting, rendering and layout work during startup.

**Fix:** Reduced DOM size and JavaScript execution, moved non-critical content away from the initial rendering path, used `content-visibility: auto` for suitable sections, and replaced expensive animation behaviour with CSS-first approaches.

### 14.4 JavaScript Bootup

**Issue:** Too much client-side JavaScript had to be parsed, evaluated and hydrated before the page became fully interactive.

**Fix:** Server-rendered static content, reduced the number of Client Components, removed unnecessary dependencies, and isolated browser logic to components that actually require it.

### 14.5 DOM and Rendering Cost

**Issue:** Separate mobile and desktop structures duplicated content and increased the DOM size.

**Fix:** Consolidated responsive markup into shared structures, removed duplicated content and unnecessary wrappers, and maintained a single semantic heading structure.

### 14.6 Network Requests and Third-party Resources

**Issue:** The original page made a high number of script requests and loaded third-party resources, increasing network, parsing and execution overhead.

**Fix:** Removed unnecessary third-party resources, replaced YouTube iframes with lightweight poster facades, self-hosted the required font, optimised image and logo assets, and deferred non-critical media.

### 14.7 Cumulative Layout Shift (CLS)

**Issue:** Dynamic content and media could cause layout movement when their dimensions were not established before rendering.

**Fix:** Added explicit dimensions to media, kept the animated hero text area stable, avoided layout-dependent animation, and used stable responsive structures.

### 14.8 Animation and Mobile Rendering

**Issue:** The large decorative hero animation added unnecessary rendering work on smaller devices.

**Fix:** Removed the large hero artwork from mobile rendering, used a CSS-first typewriter effect, kept the animated content inside a stable layout area, and added reduced-motion support.

### 14.9 Asset and Font Cost

**Issue:** Fonts, favicons and media contributed unnecessary bytes and requests. The original font setup also included an unnecessary `latin-ext` request.

**Fix:** Replaced the larger favicon with a lightweight SVG, removed the unnecessary `latin-ext` request, reduced font downloads from approximately **47.8 KB to 26.6 KB**, converted relevant image assets to WebP, and lazy-loaded non-critical media.

## 15. Overall Direction

The redesign focuses on making the Propsoch experience feel more structured, informative and trustworthy without changing the personality of the original brand.

The main improvements are centred around:

- Clearer communication
- Stronger visual hierarchy
- Better trust signals
- More useful advisory content
- Easier content discovery
- More natural mobile layouts
- More consistent interactions

The detailed performance analysis and Web Vitals work are documented separately in [ANALYSIS.md](ANALYSIS.md).
