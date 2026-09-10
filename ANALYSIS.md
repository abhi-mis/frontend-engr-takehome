# Performance Analysis and Optimisation

This document covers only the performance issues found during the Lighthouse review, the Web Vitals impact, and the changes made to improve them.

## 1. Web Vitals and Performance Issues

### 1.1 Lighthouse baseline

The original mobile Lighthouse result was:

| Metric | Original |
|---|---:|
| Performance | **42** |
| Accessibility | 84 |
| Best Practices | 100 |
| SEO | 92 |

The main performance problems were JavaScript execution, rendering work, duplicated responsive markup, large media and third-party resources.

### 1.2 Largest Contentful Paint (LCP)

**Issue:** The hero depended on client-side work, while large artwork, fonts and media increased the amount of work required before the main content could settle.

**Impact:** Original LCP was **6.9s** in the Lighthouse measurement.

**Fix:**
- Rendered critical hero content with Next.js Server Components.
- Kept the main content available in the initial HTML.
- Reduced client-side JavaScript.
- Optimised fonts and assets.
- Removed unnecessary third-party requests.
- Hid the large hero artwork on mobile.
- Deferred below-the-fold media.

**Result:** LCP improved to approximately **3.2s in the simulated Lighthouse run**, with much lower observed LCP in focused production measurements.

### 1.3 Total Blocking Time (TBT)

**Issue:** Too much JavaScript and duplicated responsive markup increased main-thread execution and hydration work.

**Impact:** Original TBT was **4.6s**.

**Fix:**
- Used Server Components by default.
- Reduced client components to interactive sections only.
- Removed duplicated mobile and desktop DOM where possible.
- Replaced unnecessary JavaScript animation work with CSS.
- Removed third-party product requests from the initial load.

**Result:** TBT reduced to **238ms**.

### 1.4 Main-thread work

**Issue:** The original page performed a large amount of scripting, rendering and layout work during startup.

**Impact:** Main-thread work was approximately **14.0s**.

**Fix:**
- Reduced DOM size.
- Reduced JavaScript execution.
- Moved non-critical content away from the initial rendering path.
- Used `content-visibility: auto` for suitable below-the-fold sections.
- Replaced expensive animation behaviour with CSS-first approaches.

**Result:** Main-thread work reduced to approximately **4.0s**.

### 1.5 JavaScript bootup

**Issue:** Too much client-side code had to be parsed, evaluated and hydrated before the page became fully interactive.

**Impact:** JavaScript bootup was approximately **5.5s**.

**Fix:**
- Server-rendered static content.
- Reduced the number of client components.
- Removed unnecessary dependencies and third-party execution.
- Kept interactive logic isolated to components that require browser state.

**Result:** JavaScript bootup reduced to approximately **1.0s**.

### 1.6 DOM and rendering cost

**Issue:** Separate responsive structures increased the DOM and duplicated content that was only shown at different breakpoints.

**Impact:** The original page had approximately **2,029 DOM nodes**.

**Fix:**
- Consolidated responsive markup into shared structures where practical.
- Removed duplicated content and unnecessary wrappers.
- Kept one semantic heading structure.

**Result:** DOM size was reduced to approximately **837 nodes**.

### 1.7 Network requests and third-party resources

**Issue:** The original page made **28 script requests** and included third-party product resources that added network, parsing and execution cost.

**Fix:**
- Removed unnecessary third-party resources from the initial load.
- Replaced video iframes with lightweight poster facades.
- Self-hosted the required font.
- Optimised image and logo assets.
- Deferred non-critical media.

**Result:** Script requests reduced from **28 to 6**, with **0 third-party requests** in the measured initial load.

### 1.8 Cumulative Layout Shift (CLS)

**Issue:** Dynamic content and media can cause layout movement if dimensions are not known before rendering.

**Fix:**
- Added explicit dimensions to media where required.
- Kept the animated hero text area stable.
- Avoided layout-dependent animation.
- Used stable responsive structures.

**Result:** CLS remained **0**.

### 1.9 Animation and mobile rendering cost

**Issue:** Large decorative hero animation is expensive on smaller devices and is not required to communicate the product.

**Fix:**
- Removed the large hero artwork from mobile rendering.
- Used a CSS-first typewriter effect.
- Kept the animated content inside a stable layout area.
- Added reduced-motion handling.

**Result:** The animation does not introduce measurable layout shift, and focused production testing recorded **CLS 0**.

### 1.10 Asset and font cost

**Issue:** Fonts, favicons and media contributed unnecessary bytes and requests.

**Fix:**
- Replaced the larger favicon with a small SVG.
- Removed an unnecessary `latin-ext` font request.
- Reduced font downloads from approximately **47.8 KB to 26.6 KB**.
- Converted relevant image assets to WebP.
- Added lazy loading for non-critical media.

**Result:** Lower transfer size and less work during the critical loading phase.

## 2. How I Fixed the Performance Issues

The optimisation strategy was intentionally focused on reducing work instead of simply hiding Lighthouse problems.

### Rendering

- Next.js Server Components by default.
- Critical hero content rendered in the initial HTML.
- Static routes prerendered at build time.
- Client components limited to interactive behaviour.

### JavaScript

- Reduced hydration scope.
- Removed duplicated responsive DOM.
- Replaced unnecessary JavaScript animation with CSS.
- Removed third-party execution from the initial load.

### Images and media

- WebP assets where appropriate.
- Explicit media dimensions to protect CLS.
- Lazy loading below the fold.
- Poster facades instead of loading YouTube iframes immediately.
- Large hero artwork removed from mobile rendering.

### Browser rendering

- `content-visibility: auto` for suitable below-the-fold sections.
- Stable dimensions and layout containers.
- CSS-first animation.
- Reduced-motion support.

### Final Web Vitals / Lighthouse result

| Metric | Original | Rebuild |
|---|---:|---:|
| Performance | **42** | **99** |
| Accessibility | 84 | **97** |
| Best Practices | 100 | **100** |
| SEO | 92 | **100** |
| LCP | **6.9s** | **3.2s simulated / 0.4s observed** |
| TBT | **4.6s** | **238ms** |
| Main-thread work | **14.0s** | **4.0s** |
| JS bootup | **5.5s** | **1.0s** |
| CLS | 0 | **0** |
| DOM nodes | **2,029** | **837** |
| Script requests | **28** | **6** |
| Third-party requests | **7 products** | **0** |

The final mobile Lighthouse score is **99 Performance, 97 Accessibility, 100 Best Practices and 100 SEO**.

Lighthouse should be measured against the production build using `npm run build && npm start`, not the development server.
