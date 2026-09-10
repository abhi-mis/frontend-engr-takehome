# Analysis Documentation

## 1. Lighthouse Results

### Original Mobile Lighthouse

| Metric | Score |
|---|---:|
| Performance | **42** |
| Accessibility | **84** |
| Best Practices | **100** |
| SEO | **92** |

## 2. UX/UI Issues Found and Fixed

### 2.1 Performance

| Issue | Fixed |
|---|---|
| The hero content waited on client-side JS before it showed up. | Moved it to Server Components so it is available in the initial HTML. |
| Too much content was hydrating on the client unnecessarily. | Kept only interactive elements as Client Components and removed duplicate mobile/desktop markup. |
| Videos and images were loading upfront, including off-screen media. | Added poster facades, lazy-loaded below-the-fold media, hid hero art on mobile, and switched to responsive WebP. |
| Extra font weights, a heavy favicon and missing image dimensions added weight and layout-shift risk. | Reduced the font to one file, replaced the favicon with a lightweight SVG, and added proper media dimensions. |

### 2.2 UX and Hierarchy

| Issue | Fixed |
|---|---|
| Testimonial videos were mismatched with the wrong names and quotes. | Corrected the mappings and replaced heavy embeds with click-to-load previews. |
| The 25-day process was inside a small inner-scroll area, making steps easy to miss. | Converted it into a normal page-flow timeline with a CSS scroll-driven progress line. |
| Press mentions were difficult to discover. | Added a **Featured in** section with named logos and links. |
| The footer was mostly empty and created unnecessary dead space. | Rebuilt it with locations, partner builders, navigation, social links and legal information. |

### 2.3 Accessibility and Visual Quality

| Issue | Fixed |
|---|---|
| Some interactive states lacked sufficient contrast and touch targets were too small. | Improved contrast tokens, added a stronger accessible orange for focus states, and built controls around a 44px minimum. |
| Tabs and accordions were not properly connected for screen readers, and SVG accessibility was unclear. | Added stable `aria-controls` relationships and explicitly marked decorative and meaningful SVGs. |
| Motion lacked reduced-motion handling, while typography and spacing were inconsistent. | Added reduced-motion support and unified the type scale, weights and spacing. |

## 3. Web Vitals Observations

### 3.1 Largest Contentful Paint (LCP)

**Observation:** The hero content depended on client-side work, while large artwork, fonts and media increased the time required for the main content to settle.

**Measurement:** Original LCP was **6.9s**.

### 3.2 Total Blocking Time (TBT)

**Observation:** A large amount of JavaScript execution and duplicated responsive markup increased hydration and main-thread work.

**Measurement:** Original TBT was **4.6s**.

### 3.3 Main-thread Work

**Observation:** The page performed significant scripting, rendering and layout work during the initial load.

**Measurement:** Main-thread work was approximately **14.0s**.

### 3.4 JavaScript Bootup

**Observation:** A large amount of client-side JavaScript had to be parsed, evaluated and hydrated before the page became fully interactive.

**Measurement:** JavaScript bootup was approximately **5.5s**.

### 3.5 DOM and Rendering Cost

**Observation:** Separate responsive structures duplicated content and increased the amount of DOM the browser had to process.

**Measurement:** The original page had approximately **2,029 DOM nodes**.

### 3.6 Network Requests and Third-party Resources

**Observation:** The page made a high number of script requests and loaded third-party resources, increasing network, parsing and execution overhead.

**Measurement:** The page had **28 script requests**, including **7 third-party product requests**.

### 3.7 Cumulative Layout Shift (CLS)

**Observation:** Dynamic content and media can introduce layout movement when their dimensions are not established before rendering.

**Measurement:** CLS was **0**.

### 3.8 Animation and Mobile Rendering

**Observation:** The large decorative hero animation adds unnecessary rendering work on smaller devices, where the visual is not essential to understanding the service.

### 3.9 Asset and Font Cost

**Observation:** Fonts, favicons and media contributed additional bytes and requests. The original font setup also included an unnecessary `latin-ext` request.

**Measurement:** Font downloads were approximately **47.8 KB**.