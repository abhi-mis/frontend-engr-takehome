# Propsoch landing page, rebuilt

A performance-first rebuild of the [Propsoch](https://www.propsoch.com/) landing
page. Propsoch is a real estate advisory service that helps people buy homes with
independent advisors instead of commission-driven brokers.

The original is a client-rendered Next.js app that scores 42 on mobile
performance. This rebuild keeps Propsoch's branding and copy almost entirely
unchanged, and fixes the cause of the slowness rather than the symptoms.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run verify   # typecheck + contrast gate + unit tests + build
```

---

## 1. The baseline, and what is actually wrong

Measured on a clean mobile Lighthouse run in Incognito against the live site.

| Category | Score |
|---|---|
| Performance | **42** |
| Accessibility | 84 |
| Best Practices | 100 |
| SEO | 92 |

| Metric | Baseline |
|---|---|
| Largest Contentful Paint | 6.9 s |
| Total Blocking Time | 4.6 s |
| Main-thread work | 14.0 s |
| JavaScript bootup | 5.5 s |
| Cumulative Layout Shift | 0 |

**The diagnosis is main-thread JavaScript, not weight.** CLS is already perfect
and Best Practices is already 100. The page is slow because too much JavaScript
executes before anything useful happens.

I did not take that on trust. I fetched the served HTML and then drove a real
browser against the live page. What that turned up:

**1. The content is not in the HTML.** Searching the served markup for the hero
headline, the CTA labels and the marquee text returns nothing. All of it is
generated after hydration. That is the direct cause of the 6.9 s LCP: the browser
cannot paint the headline until a JavaScript bundle has downloaded, parsed and
executed.

**2. 28 separate script requests** for a single landing page.

**3. The entire page is rendered twice.** This one was not in the brief and it is
the biggest finding:

```
total DOM nodes:                 2029
.temporary-mobile-home-layout:    716 nodes
.temporary-desktop-home-layout:   780 nodes
```

There is a mobile tree and a desktop tree, both in the DOM, one hidden with CSS.
About 74% of the document is a duplicate of the other 74%. Every component
mounts twice, so React hydrates twice, on both phones and desktops. This is a
concrete and previously unnamed contributor to the 4.6 s Total Blocking Time.

**4. The tag stack.** Google Tag Manager, GA4, Google Ads conversion, Facebook
Pixel, Facebook CAPI and Microsoft Clarity, plus **Sentry**, which the brief did
not list. Sentry instrumentation appears on nearly every node in the markup
(`data-sentry-component`, `data-sentry-source-file`).

**5. Two `<h1>` elements**, caused by the duplicate trees.

---

## 2. UX and UI problems, and what I did about each

### 2.1 The hero CTA said "Propsoch Kar"

"Propsoch Kar" is Hindi wordplay that pairs with the brand's "Bromatker" line,
and it is good brand voice. It is not an action label, so a first-time visitor
cannot tell what the button does.

**What I did:** kept the label, because you asked for the copy to stay, and kept
the navigation bar as the original has it. The fix is that "Propsoch Kar" is now
the only primary-weight action *in the hero*, and every primary action on the
page renders through a single `PrimaryCta` component so they are all identical
rather than five competing weights.

If the label were mine to change, "Book A Free Call" is the obvious candidate,
and it is already real Propsoch copy used elsewhere on their own site.

### 2.2 The hero asked before it explained

The original's mobile hero order is: headline, city selector, "Propsoch Kar",
"Already a member? Login", and only then the sentence that explains the service.

**What I did:** reordered to headline, value proposition, one primary action,
then the city context and the real numbers. Not one word was rewritten. The value
proposition is Propsoch's own sentence, moved above the ask.

### 2.3 Low-contrast interactive elements

This is the fix I am most confident about, because it is measured rather than
judged by eye.

The brand orange is `#FF6D33`, which is `rgb(255, 109, 50)`. That is not
inferred: it is the fill in Propsoch's own logo SVG. Against the page background
it is **2.71:1**, where WCAG AA needs 4.5:1 for normal text and 3:1 even for
large text. The original's neutrals (`#212130` at 15.31:1 and `#66677E` at
5.33:1) are already fine, so the failure is specifically the orange.

The fix is to stop asking one orange to do three jobs with three different
contrast obligations:

| Token | Value | Job | Ratio on page |
|---|---|---|---|
| `--color-brand` | `#FF6D33` | **Fills only.** Never text, at any size. | 2.71:1 |
| `--color-brand-display` | `#EF5410` | **Large text only** (>=24px) | **3.41:1** |
| `--color-brand-strong` | `#C2410C` | Small text, icons, and the **primary button fill** | **5.00:1** |
| `--color-ink-muted-on-dark` | `#A8A9BC` | Secondary text on the dark sections | **6.84:1** on ink |
| `--color-surface-raised` | `#FFFFFF` | Cards and tool panels, which read by depth rather than by an outline | ink 15.85:1, ink-muted 5.52:1 |
| `--color-surface-sunken` | `#F2F3F7` | Section grounds that hold cards | ink 14.29:1 |

And the foreground rule: the bright orange carries white text in exactly **one**
place, the primary CTA, and that one place is recorded as an accepted deviation
below rather than presented as compliant. Everywhere else its foreground is a
warm near-black `#1A1206`: on the footer's Bromatker mark that pair is 6.61:1.

The primary button is where this gets interesting, and where the shipped page
makes a deliberate exception rather than a clean pass.

The instruction for it was "white text, no borders". Taken literally on
`#FF6D33` that fails twice: the label at 2.80:1 and the button's own boundary at
2.71:1. No brighter orange rescues it either. White needs a fill whose relative
luminance is at or below **0.1833** to reach 4.5:1, and `#FF6D33` is 0.3244
while `#EF5410` is 0.2473, so nothing in the bright half of the palette can
carry a white label. There are exactly two ways out: a deeper fill (`#C2410C`
takes white to **5.18:1**, and is itself 5.00:1 against the page, so the button
would also need no border) or a near-black label (`#1A1206` on `#FF6D33` reaches
**6.61:1**, the same pair the ribbon already uses).

**The shipped button takes neither.** It renders a white label on the bright
`#FF6D33` at **2.80:1**, because keeping the CTA in the real brand orange with a
white label is a product decision, taken with that number known. This README
records it plainly rather than claiming a compliance the page does not have.

What the build does insist on is that the number stays **visible**. `brandButton`
is a token in `scripts/check-contrast.mjs`, and the pair prints on every run
under **Accepted deviations** together with the two resolutions above. Before
this pass the token existed in the stylesheet but not in the gate, so the pair
was asserted nowhere and printed nowhere: the deviation was invisible rather
than decided. A deviation you see on every run is a decision. One the gate never
mentions is an accident waiting to be inherited.

The rest of the button's behaviour still follows the rule: hover and active go
darker rather than lighter, which is the opposite of shadcn's default
`bg-primary/80` and the reason that default would erode a label exactly as you
interact with it.

`--color-brand-display` is the interesting one. WCAG allows 3:1 rather than
4.5:1 for large text, and `#EF5410` clears that while still reading as the bright
brand orange rather than as rust. The hero headline uses it, at 36 to 60px.

This matters for how the page *looks*, not just for the audit. An earlier pass
rendered every piece of orange text in `#C2410C`, which is accessible and reads
as rust, so the page did not look like Propsoch. The true `#FF6D33` now carries
the brand as **fill**, where no contrast rule restricts it: the primary button,
the timeline markers, the artwork, the stat chips, and the typewriter caret in
the hero headline.

That second rule also fixes the focus ring, which the original draws in
`#FF6D33`. A 2.71:1 focus ring fails WCAG 1.4.11 on the one element keyboard
users depend on most.

`npm run check:contrast` asserts all **29** pairs the page actually renders and
exits non-zero on any regression. It also keeps a list of forbidden pairs, so the
known-bad combinations cannot be reintroduced, including `brand-display` on the
page background, which is listed as large-text-only so nobody uses it for a 14px
link and quietly ships a 3.41:1 label. I would rather prove AA than claim it.

Two more contrast results worth calling out, because both are the same trick.

**Inside the Bromatker wordmark.** The original sets the raised "mat" in pale
yellow `#FFD250` on the orange band, which is **1.95:1**. Swapping the roles so
the yellow is a highlighter *fill* behind near-black text gives **12.87:1**, the
highest-contrast pair on the site. Same two colours, opposite verdict. The band
itself is the same inversion at scale: bright `#FF6D33` with near-black text,
where the original uses white at 2.80:1.

**On the footer's dark panel.** `#FF6D33` on `--color-ink` is **5.65:1**, so the
footer is the one surface on the site where the true brand orange is legible as
small text, against 2.71:1 on the light page. Same hex, different ground.

The general lesson: when a colour pair fails, try inverting it before discarding
it. "This yellow is inaccessible" usually means "this yellow is inaccessible *as
text*".

Two contrast bugs I found in the component library itself, not the original:

- shadcn's inactive tab colour is `text-foreground/60`, which computes to
  **4.10:1** on our tinted panel and fails AA. Alpha is not a colour: a `/60`
  utility has no fixed contrast ratio because what it composites against changes
  per section.
- shadcn's default button hover is `bg-primary/80`, which over a light page
  composites to a *lighter* orange and pushes the label's contrast down. Ours
  darkens to `#F25A1C`.

### 2.4 The 25-day timeline did not look scrollable

The original hides the steps in an inner scroll container with no affordance, so
most people never learn there is more.

**What I did:** deleted the inner scroll container. The steps now flow with the
page, so there is nothing hidden and no affordance is needed. It is an ordered
list (`<ol>`), so a screen reader announces "item 3 of 5", which conveys the
length the original hides.

The progress line fills as you scroll using **CSS scroll-driven animations, with
zero JavaScript.** Verified by sampling the transform at six scroll positions
(0 → 0.03 → 0.64 → 1). The fallback is the important part: the line's default
state is fully drawn, and the animation is applied as an override inside
`@supports (animation-timeline: view())`. Browsers without support, and anyone
who has asked for reduced motion, get a complete static timeline rather than an
empty one.

### 2.5 No footer, and dead space at the bottom on mobile

**What I did:** built a real footer in three bands. A dark closing panel (the
page's only dark surface, so it reads as an ending) carrying the real value
proposition, the primary action and the Bromatker mark in true brand orange.
Then five content columns: the in-page nav, the locations Propsoch covers, the
partner builders, the browse-by filters, and a brand block with the cities and
Propsoch's real social profiles. Then a legal strip with the entity name, both
RERA registrations and the rebuild notice. All real content from the original.

One honest note: the original's footer also prints `GSTIN: 12314ASDAD213` and
`CIN: 21312215151661`. Both are obvious placeholder strings on the live site, so
I left them out rather than ship fabricated registration data. And I could not
recover a phone number or email, so the contact column carries the original's
real "Top Locations We Cover" content instead of an invented address.

### 2.6 Motion and noise

**The Bromatker ribbon is gone.** It was a full-bleed scrolling band under the
hero, and it went for a design reason (it was the third thing in the hero
competing to be looked at first, see 2.8) that happened to resolve an
accessibility problem as well.

That problem is worth recording, because two earlier drafts of this section got
it wrong in opposite directions. The band auto-scrolled and paused only on hover
and focus. WCAG 2.2.2 asks for a mechanism to stop motion that starts
automatically and runs longer than five seconds, and **hover is not that
mechanism**: it does nothing for a keyboard user and nothing on touch.
`focus-within` only helps if something inside the band is focusable, and nothing
was. So the shipped ribbon did not satisfy 2.2.2. Deleting it removes the
obligation rather than arguing with it.

The Bromatker mark itself is still on the page, in the footer's dark closing
panel, where it is static text and raises no motion question at all.

On the wordmark: it is **"Bromatker"**, one word. Take "Broker", wedge
"mat" into the middle, and it reads simultaneously as "Broker" and as "Bro mat
kar", Hindi for "don't do it, bro". Their CDN asset is literally
`bromatkar_icon.png`. An earlier pass of this rebuild had it wrong, cycling
invented terms ("Bro-marketer", "Broker", "Bro Mat Kar") as a word list, which
broke the joke. It is rendered as a single inline text run so it reads as one
word at a glance.

`prefers-reduced-motion` is respected across the site. The headline typewriter
is the case that needs stating: the usual blanket rule collapses animation
durations to `0.01ms`, which lands one-shot animations on their FINAL keyframe,
and this animation's final keyframe is `opacity: 0`. Collapsing it would hide
the headline's tail outright. It is switched off explicitly instead, leaving the
first phrase as ordinary readable text.

**The video testimonials are in**, after being deferred earlier in the build.
Three of them, as a facade: poster and play button on the page, the real player
only after a click. Details in section 8c.

### 2.8 The hero was three things competing to be looked at first

The hero opened with an "Independent advisors" pill, then the headline, then a
full-bleed scrolling ribbon. Three separate attention-grabbers before a single
one of them had been read, and the headline, which is the only one that matters,
sat third in line and low on the page.

**Removed:** the pill and the ribbon. **Raised:** everything else, by cutting the
top padding from `pt-12 sm:pt-16 lg:pt-20` to `pt-7 sm:pt-9 lg:pt-12`, which the
pill's removal made possible. At 1280x900 the whole hero now fits in the first
viewport, headline through logos.

**The headline is a typewriter.** Propsoch's live site rotates the tail of this
h1 through three phrases; that behaviour is back, as a CSS typewriter with a
caret. Two things about it are worth reading the code for:

- It never touches the LCP element. The first line paints statically in frame
  one and is never animated. The phrases are revealed with a **mask**, so their
  text is laid out and painted from the first frame too and only the visible
  portion changes. Measured: **LCP 136ms, one candidate, and the candidate is
  the static lead span.**
- It causes **zero** layout shift, but only after a fix. The first version put
  the caret at `left: var(--p)`, which tracks perfectly and registered a CLS of
  0.00013, because `left` is a layout property and Chrome counts an absolutely
  positioned element moving. The caret is now a fixed-geometry element whose
  BACKGROUND POSITION moves, which is paint-only. Re-measured over twelve
  seconds of cycling: **CLS 0**.

**The artwork is hidden below `lg`, with `display: none`.** Not scaled, not
faded: no layout box, no paint, no animation frames on a phone, and its subtree
leaves the accessibility tree with it.

**The trust strip uses the real logos.** Eight WebP files at 2x, built by
`scripts/fetch-logos.mjs` from Propsoch's own CDN. Details in 8b.

### 2.7 The page read as competent but not modern

The note was that the look and feel needed to be sleeker. Nothing was broken, so
this is worth writing down as a diagnosis rather than as a list of tweaks: the
design system was sound and the RENDERING of it was dated, in five specific
habits.

**Hairline grey boxes.** `border border-line` on every card, in five files. A 1px
grey outline on near-white is the strongest "framework default" signal there is.
It is now gone from the markup entirely, and cards separate by depth instead. The
only borders left on the page are three decorative hero rings, the Propsoch
column's brand top edge, an indicator dot, real control borders (which WCAG
1.4.11 does require) and internal dividers inside cards. Removing outlines is not
the same as removing rules.

**A surface ramp, so depth has something to work against.** Two surfaces plus a
hairline became three: `sunken` for section grounds, `surface` for the page,
`raised` for cards. Both tool panels are now the same object: raised white,
`shadow-lg`, no outline.

**One shadow scale instead of nine arbitrary values.** Every shadow was written
inline and no two agreed: 8px/24px on one card, 14px/34px on the next. There are
now four tokens, each **two layers with a negative spread** (a tight contact
shadow plus a wide soft one, which is how light actually falls) and each tinted
with the **ink hue** rather than black, because pure black over the warm
`#FBFBFA` surface goes muddy grey-brown.

**Per-step optical tracking.** Headings did already carry `letter-spacing:
-0.02em`, but one flat value across every size is wrong: apparent letter gaps
grow with type size. Tracking is now part of the type scale itself
(`--text-*--letter-spacing`, from -0.012em at `xl` to -0.038em at `4xl`), so it
scales without being hand-written per component. Display weight also dropped from
800 to 700, which costs nothing because Plus Jakarta Sans is loaded as a variable
font.

**Rhythm.** Four sections at identical `py-16 sm:py-20` separated by `border-b`
rules, with all the visual interest spent in the hero. The two 1px dividers are
gone (sections now alternate sunken / ink / surface / sunken, so the change of
surface draws the line), vertical space went up to `py-20 sm:py-28`, and the
interest is distributed: one soft brand wash behind the comparison, a gradient
slider range, depth on the coverage chips. The hero was made **quieter**, not
louder. It was running two radial washes that produced a muddy third colour where
they crossed; one was removed and the blob came down from 26% to 18%.

The cost of the whole pass: **+2.0 KB** of page weight, **+16** DOM nodes, and
**zero** new JavaScript, because every change is a design token or a class swap.

---

## 2.11. The hero artwork stopped captioning itself

The two floating figure cards are gone. They read "Curated on 20+ factors" and
"Average saved ~Rs 4.78 L", both real Propsoch numbers, and both already on the
page in better places: the curation figure in the comparison table and the
process step, the saving in the calculator where it carries the
illustrative-estimate note a floating label cannot. They were also the only text
inside the artwork and were not aria-hidden, so a screen reader was reading two
stray figures out of a decorative scene. It announces nothing now.

**A label over a diagram is the diagram admitting it does not communicate.** So
the drawing carries the points instead:

- **Curation.** Three listings, two faded back, one outlined in brand with a
  tick. That is the shortlist, drawn.
- **Verification.** A seal on the destination house. The scene used to draw a
  journey to a generic house, which is the one thing Propsoch is not selling.
- **The report.** Three checked lines on a card near the end of the route,
  because the Peace of Mind Report is their signature deliverable and the scene
  had no sign of one.
- **Inspection.** Two checkpoints ON the road, so the route reads as inspected
  rather than merely travelled.
- **The mark.** The pin carried a generic house glyph; their logo is a house
  built around a four pointed spark, and the pin already is the house.

The checkpoints are placed at `getPointAtLength(0.34)` and `(0.62)` of the road
path, not at coordinates that looked about right, and the report card was placed
after checking the block plan so it sits in empty space. Same rule as the car:
if it belongs on the path, ask the path.

CLS stays 0 because every addition is inside the existing svg viewBox, which
reserves its own space. Four dead `.hero-route-insight` rules went with the
cards.

---

## 2.10. The comparison: one competitor at a time, and a column I had invented

**Propsoch ship two tables, not one.** Their "How are we different?" section has
a tab per competitor and each tab is its own table with its own criteria. The
two do not overlap: against portals the argument is about DATA (Information
Depth, Data Accuracy, Service Validity, Data Sources, five rows), against
brokers it is about CONDUCT (Sales Practices, Spam, Curation, Support, nine
rows). Only "Transparency" appears in both, worded identically.

**What this build shipped before was one nine row table with a fourth column I
wrote myself.** I had taken their nine broker criteria and authored an online
portals answer for each. Seven of those nine cells were mine, including "Lead
form, then calls from multiple agents", "Ranked by paid placement, not fit" and
"Your number is shared with every listed agent". They are plausible and they are
not Propsoch's, and inventing criticism of named competitors and presenting it
as a client's own comparison is exactly what this project's rules forbid.

It also buried their real argument. "80+ data points against 20-40", "verified
by architects against loose verification", "RERA, GMaps, CDP" against "added by
developer & broker" is sharper than anything I wrote, and none of it was on the
page. Every cell is now theirs, machine-diffed against their own
`difference.data.tsx`; the only edit is a trailing space trimmed from "Added by
developer & broker ".

**One table, all widths.** This section used to carry two DOM trees, a desktop
table and a mobile card list, toggled with `hidden md:block`. That made it the
heaviest thing on the page at 461 elements. Three columns fit at 360px, so there
is one tree now: **461 elements to 215**, and the page total from 1289 to 1028.

Two things that had to be fixed to make three columns fit at 360:

- The card was `overflow-hidden`, so when the table needed 361px in a 313px card
  it **clipped** the competitor's column. The answers were in the DOM, announced
  to a screen reader, and impossible to read. It scrolls now, as a safety net.
- `(Housing/99Acres/Magicbricks)` is a single 29 character token with no spaces,
  and an unbreakable token sets a column's minimum width. It alone was forcing
  the overflow. A `<wbr/>` after each slash gives the browser the break points a
  reader would pick, which is where Propsoch put their own `<br/>`.

**Two accessibility bugs surfaced as a side effect, and they were not new.** A
shorter page meant Lighthouse's scanner now lays out sections that
`content-visibility: auto` had been skipping, so two checks that had been
recorded as passing turned out never to have run:

- The savings calculator's slider thumb had **no accessible name**. The effect
  that sets it returns early when the slider has not mounted yet, and
  `isSliderMounted` was missing from its dependency array, so it never ran
  again. A screen reader met an anonymous slider.
- The testimonial dots were **8px targets**, against a 24px minimum. The button
  is 24px now with the 8px dot drawn inside it.

Accessibility is back to 97, the same three white-on-`#FF6D33` CTA deviations as
before and nothing else.

**The performance trade-off, stated plainly.** DOM is down 261 elements, but the
desktop table used to be a Server Component with zero JavaScript and is now
inside the client tab island, so more of the section hydrates. Total Blocking
Time moved from roughly 240ms to roughly 380ms across runs, while the
performance score sits at a median of 80 over six runs (77, 79, 80, 80, 81, 89)
against a median of 88 before. That spread is wider than the change, so treat it
as "no clear movement" rather than a regression, and see the note in section 3
about this machine. If it matters, the panels could be server-rendered and
passed into the client tab wrapper as children, which is the obvious next step
and not one I took here.

---

## 2.9. Three hero fixes

**The typewriter was typing on three lines.** Not a timing bug. `.type-line` sets
`display: grid` so the three phrases can share `grid-area: 1 / 1` and overlap;
`.hero-home-heading .type-line` set `display: inline-block` and is one class
more specific, so it won. The overlap never happened, the phrases laid out as
three wrapped inline-blocks, and two invisible ones held open the space. The
orange bar under them was the section underline sitting below all three. Now
`inline-grid`, which also restores the point of using grid here: the box is
sized to the widest phrase from first layout, so swapping phrases never reflows.
The h1 went from 364px to 222px. **CLS stays 0** across a full cycle.

**The car did not follow the road.** It was an HTML div outside the svg, moved
between two hand-picked points with a fixed rotation, which cannot trace an
S-curve at all. It is now a group inside the svg driven by CSS Motion Path along
the same path string the road is drawn from, so it shares the road's coordinate
system and `offset-rotate: auto` banks it through the bends. Verified against
`getPointAtLength` at five points along the route: a constant 8-unit offset,
which is the car's bbox centre sitting above its wheels. Constant means no
drift. It also parks on the road rather than vanishing under reduced motion.

**The artwork was not hidden on mobile, though the comment said it was.** The
`hidden lg:flex` had gone and a 300px diagram was rendering on a 360px screen,
against the original hero brief. Restored, with its dead mobile heights removed.
Mobile now reports `display: none` and **zero running animations**.

---

## 3. Before and target

### READ THIS BEFORE RUNNING LIGHTHOUSE

**Run it against `npm run build && npm start`, never against `npm run dev`, and
use an Incognito window or `--disable-extensions`.**

A dev-server run scored this page **42**. The same commit, built for production
and audited in a clean Chrome, scores **88**. Nothing about the page changed
between those two numbers. A `next dev` run is measuring:

| In the dev run only | Size |
|---|---|
| `next-devtools` overlay bundle | 250 KB transfer, 864 KB parsed |
| Turbopack HMR client + `__nextjs_original-stack-frames` | dev-only requests |
| React development build, unminified | Lighthouse itself reported 274 KB of "unminifiable" JS |
| One browser extension's content script | **2,039,725 bytes** |

That run also carried Lighthouse's own warning, "Chrome extensions negatively
affected this page's load performance". Total script was 905 KB in dev against
183 KB in production. The dev number is real, it is just not a number about
this codebase.

### Lighthouse

Local production build, Chrome headless, no extensions, Lighthouse 12's default
throttled mobile profile. Three runs, median reported, spread in brackets.

| Category | Original | Target | Rebuild (local prod) |
|---|---|---|---|
| Performance | 42 | >= 90 | **88** (79-88) |
| Accessibility | 84 | 100 | **97** |
| Best Practices | 100 | 100 | **100** |
| SEO | 92 | >= 95 | **100** |

The performance spread is the measuring machine, not the build: three runs of an
identical build came back 91, 85 and 83 earlier in the same session. Treat
anything inside about eight points as noise, and treat PageSpeed Insights on a
deployed URL as the number that counts.

Accessibility is 97 rather than 100 for one reason, and it is the CTA you asked
me not to change: white on `#FF6D33` is 2.80:1. Section 2.3 has the arithmetic.

### Core Web Vitals

| Metric | Original | Target | Rebuild (local prod) |
|---|---|---|---|
| Largest Contentful Paint | 6.9 s | < 2.5 s | **3.2 s** simulated / **0.4 s** observed |
| Total Blocking Time | 4.6 s | < 200 ms | **238 ms** |
| Cumulative Layout Shift | 0 | < 0.05 | **0** |
| Main-thread work | 14.0 s | large reduction | **4.0 s** |
| JavaScript bootup | 5.5 s | large reduction | **1.0 s** |

The two LCP figures are both honest and worth separating. Lighthouse's 3.2 s is
a *simulated* projection: it takes the observed load and replays it over a
throttled 4G link. The *observed* breakdown on the same run is 35 ms to first
byte plus 378 ms of render delay, because the critical path is two requests
deep, the document and one 16.4 KB stylesheet.

### The largest thing still on the page

`#comparison` is **461 DOM elements** of the page's 1289, more than the FAQ's
282 and every other section combined. It renders two complete layouts, a mobile
tree and a desktop table, and hides one with `hidden md:block` / `md:hidden`.

That is deliberate and section 4.2 defends it: `display: none` removes a subtree
from the accessibility tree, so each layout can be built for the input it
serves. It is also the single biggest remaining performance lever, and cutting
it means picking one layout and adapting it. Flagged rather than done, because
it is a structural change rather than a tune.

### What I did measure locally

These are real numbers off `npm run build` plus a production server, not
estimates.

| Thing | Original | Rebuild |
|---|---|---|
| Third-party requests | GTM, GA4, Google Ads, FB Pixel, FB CAPI, Clarity, Sentry | **0** |
| Script requests | 28 | **8** |
| Total requests | 40+ | **19 on arrival, 25 if you read all of it** |
| DOM nodes | 2029 | **1057** |
| Duplicate page trees | 2 (mobile + desktop) | **1** |
| `<h1>` elements | 2 | **1** |
| Raster images | several (unoptimised) | **14** (WebP, all lazy, all dimensioned) |
| Font files | multiple subsets | **1** (26.6 KB) |
| Favicon | not measured | 1.9 KB (was a 25.9 KB default) |
| CSS | not measured | 15.0 KB |
| HTML document | not measured | 34.2 KB |
| Client JavaScript | not measured | 181.2 KB |
| Page weight on arrival | not measured | **288.4 KB** |
| Page weight after reading all of it | not measured | **435.1 KB** |

All figures are over the wire (encoded), off a production server on a clean
port. Two passes have moved them since the first build:

| | first build | design pass (2.7) | hero redesign (2.8) | video (8c) | plan comparison (8d) |
|---|---|---|---|---|---|
| Requests | 12 | 12 | 19 | 22 | **25 (19 on arrival)** |
| Total | 243.3 KB | 245.3 KB | 273.9 KB | 355.0 KB | **435.1 KB** |
| Client JS | 171.2 KB | 171.2 KB | 171.2 KB | 180.0 KB | **181.2 KB** |
| DOM nodes | 985 | 1001 | 944 | 1015 | **1057** |
| CLS | 0 | 0 | 0 | 0 | **0** |
| Third-party | 0 | 0 | 0 | 0 | **0** |

From the plan comparison onward the single "total" number stops being the
honest one, so the table above splits it. Everything added in the last three
columns is an image, every one of them is lazy and below the fold, and a
visitor who never scrolls past the hero downloads none of them. **288.4 KB
arrives; 435.1 KB is the figure only if you read the entire page.**

The client JavaScript column is the one to watch, and it has moved 10 KB across
the whole build: 8.8 KB for the video dialog and 1.2 KB for the comparison
slider. Third-party is still zero in every column.

The design pass cost 2 KB and 16 nodes, because every change in it was a token
or a class swap.

The two passes after it are the ones that actually spend. The hero redesign
added the eight logo files: **+7 requests, +28.6 KB.** The video section added
three posters and one client island: **+3 requests, +81 KB**, of which 70 KB is
posters and 8.8 KB is the dialog and the grid.

Both were asked for knowingly, and both are bounded the same way: every image is
lazy, below the fold, and carries explicit dimensions, so none of it reaches LCP
or CLS. Those two rows have not moved. Neither has the third-party count, which
is the number the video section could most easily have wrecked: three ordinary
YouTube embeds would have been roughly 2 MB and dozens of cross-origin requests
on load. See 8c.

Keeping the full four-group navigation cost about **10 KB of JavaScript and 8 KB
of HTML** against the version without it. That is cheap because Radix's core was
already paid for by the comparison tabs and the slider, so a third and fourth
consumer of it is nearly free. It is worth stating rather than hiding, since the
nav was a deliberate add-back after an earlier pass had stripped it.

**On the 160.9 KB of JavaScript, honestly.** My plan set a budget of "under
40 KB", and that number was wrong in a way worth naming. It described my own
code plus Radix, but it reads like a whole-page figure. A Next.js App Router page
ships React and the router client runtime no matter how many Server Components
you use. The real split is:

| Chunk | Size | What it is |
|---|---|---|
| React + React DOM | 69.9 KB | framework floor |
| Next App Router runtime | ~61 KB | framework floor |
| **My client islands** | **40.3 KB** | Radix Tabs, Slider, Input, NavigationMenu, the mobile menu, plus icons |

So about 131 KB is the framework floor and **40.3 KB is the part I control**. The
meaningful comparison with the original is not the total, it is that this page
executes ~30 KB of application JavaScript with no third-party tags, against a
baseline whose single largest first-party chunk alone runs for 4.2 s on top of
seven analytics products.

---

## 4. How the speed was actually achieved

1. **Server Components by default, five leaf client islands.** The only `"use
   client"` files are the desktop nav, the mobile nav, the mobile comparison
   tabs, the savings calculator and the pincode checker. Every section shell, the
   header itself, the footer, the logo, the artwork, the headline typewriter and
   the whole timeline are server-rendered. The content is in the HTML, so first paint
   does not wait for hydration.

2. **Zero third-party scripts.** None of the tag stack ships. This is the single
   biggest win against a 4.6 s TBT. See section 6 for how to add analytics later
   without blocking.

3. **No raster images at all.** All artwork is inline SVG with an explicit
   `viewBox`, so it costs no request and cannot become the LCP element. The LCP
   element is therefore guaranteed to be the `h1`: server-rendered text with one
   self-hosted font in front of it.

4. **The `h1` is never animated.** Fading the LCP element in from `opacity: 0` is
   the most common way a site adds hundreds of milliseconds to its own LCP.
   Everything else in the hero animates on a short stagger; the headline paints
   immediately.

   The headline still gets motion, without breaking that rule: a decorative
   underline draws itself beneath the accent phrase on a delay. The text is at
   full opacity in the first frame and is never touched, so LCP never waits on
   anything. Only the bar animates.

   The headline's three question phrases DO reveal one after another, 160ms
   apart. That is not an exception to the rule, it is the rule applied at the
   right granularity: the first line paints immediately and is never touched, and
   it is enough text to register the block. Measured with a buffered
   `PerformanceObserver`, LCP fires at **200ms with a single candidate**, exactly
   at first paint, so the phrases that animate in afterwards cost nothing.

   The hero's main animation is the flow of pulses down the funnel artwork
   (`stroke-dashoffset` on a mostly-gap dash pattern). It was chosen because it
   carries information: you watch projects narrow from seven to four to one,
   which is what the business actually does. The test for an animation is
   whether removing it loses meaning.

5. **One variable font, self-hosted.** `next/font` downloads Plus Jakarta Sans at
   build time, so there is no runtime request to Google, and it generates a
   size-adjusted local fallback that stops `font-display: swap` from shifting
   layout.

6. **All motion is CSS.** No animation library. The timeline's scroll progress,
   the hero entrance and the marquee are keyframes and scroll-driven animations,
   using only `opacity` and `transform` so the compositor handles them and the
   main thread stays free.

7. **Fully static.** Every route prerenders at build time.

8. **CLS defence:** explicit dimensions on every SVG, a reserved `min-height` on
   both live result regions so revealing an answer never pushes content, and the
   font fallback metric matching above.

9. **An animated loader with zero JavaScript.** `components/brand/splash.tsx`
   is a Server Component that removes itself: a one-shot CSS animation with
   `animation-fill-mode: forwards` ending at `opacity: 0; visibility: hidden`,
   plus `pointer-events-none`.

   A splash dismissed by a `useEffect` cannot leave until React has hydrated, so
   its real duration is "however long the JavaScript takes to boot". On the
   original, with 5.5s of bootup, that overlay would sit there for seconds. A CSS
   animation starts at first paint and finishes on schedule whether or not any
   JavaScript arrives, which is the right behaviour for something whose whole job
   is to cover the gap before the page is ready. Under `prefers-reduced-motion`
   it is `display: none` outright.

10. **Lazy rendering with `content-visibility: auto`.** The only images on the
   page are the eight trust logos, and they all carry `loading="lazy"`. The
   equivalent for the rest, which is text and SVG, is
   `content-visibility: auto`, applied to the four below-the-fold sections, which
   lets the browser skip layout, style and paint for each until it is near the
   viewport. On a page with a nine-row table, a five-step timeline and two
   interactive panels, that is real rendering work moved off the first frame.

   `contain-intrinsic-size: auto 900px` goes with it and is not optional:
   without an intrinsic size a skipped section reports zero height, so the
   scrollbar jumps as you scroll into it and anchor links land in the wrong
   place. The hero deliberately does not get this, since it is above the fold and
   holds the LCP element.

### Two measured wins worth calling out

**A 25.9 KB favicon.** `create-next-app` ships a default `app/favicon.ico` of
25,931 bytes, larger than this site's entire stylesheet, downloaded by every
visitor. Replaced with a 509-byte `app/icon.svg` of the brand glyph. **25.4 KB
saved.**

**The rupee sign was costing 21.2 KB.** A production build was requesting two
Plus Jakarta Sans subsets, 26.6 KB and 21.2 KB. Auditing every non-ASCII
character on the page found exactly one: `₹`, five times. Google's `latin` subset
covers `U+20AC` (the euro) but not `U+20B9` (the rupee), which lives in
`latin-ext`. Five currency symbols were pulling a second font file.

The fix uses `unicode-range` for its intended purpose: a font family claiming
only `U+20B9`, resolving to fonts already on the device, placed first in the
stack. The rupee renders locally, `latin-ext` is never requested, and everything
else falls through to Plus Jakarta Sans. Font files went 2 to 1 and font bytes
47.8 KB to 26.6 KB. If none of the local faces exist, the browser falls through
and downloads `latin-ext` as before, so the worst case is the old behaviour.

---

## 5. Accessibility

Targeting 100. What is in place:

- One `h1`, no skipped heading levels (verified programmatically).
- A skip link as the first focusable element.
- Every interactive control at least 44px, verified by measurement at 360, 390,
  768, 1024 and 1280px.
- `:focus-visible` on everything, ringed in `#C2410C` so the ring itself passes.
- Semantic landmarks, exactly one `<header>`, `<main>`, `<footer>`.
- The comparison is a real `<table>` with `scope="col"` and `scope="row"` plus a
  visually hidden `<caption>`, so a screen reader announces "Transparency,
  Propsoch, Detailed pros and cons" rather than a flat grid of phrases.
- The timeline is an `<ol>`.
- Both interactive results are `aria-live="polite"` and `aria-atomic`.
- All 76 SVGs are either `role="img"` with a title or `aria-hidden`.
- `lang="en-IN"`.

### The original's broken `aria-controls`, and the mechanism

The brief flagged this. Driving the live site found the precise cause, which is
more useful than the symptom:

```
tab "Online Portals"  aria-controls="...-content-online_portals"
document.getElementById("...-content-online_portals")  ->  null
```

**Radix does not mount inactive tab panels by default**, so every inactive
trigger advertises a relationship to an element that is not in the document. It
is a real WCAG 1.3.1 failure, invisible in normal use, and any Radix Tabs
implementation inherits it unless you think about it. On the original, the hero's
city tabs fail the same way.

Our fix is `forceMount` on `TabsContent` so both panels stay in the DOM, plus
`data-[state=inactive]:hidden` so `display: none` removes the inactive one from
the accessibility tree. Verified: all `aria-controls` resolve, exactly one panel
visible, both present in the DOM.

Worth noting: **the original's Online Portals tab is simply broken.** Its panel
renders with zero characters and clicking the tab does nothing.

### Keyboard support, verified

- Tab reaches the comparison tablist, focus delegates to the selected tab, and
  ArrowRight moves selection and switches the panel.
- The slider responds to arrows, Home and End.
- The pincode checker is a real `<form>`, so Enter submits and mobile keyboards
  show a "go" key.
- The marquee pause is a real checkbox and reports its own state.

One bug my own audit caught: `aria-labelledby` on the Slider component lands on
the Root wrapper, but the element carrying `role="slider"` is the **thumb**. The
Root was labelled and the actual control was anonymous. The name has to be on the
element with the role, so it is now set on the thumb, along with an
`aria-valuetext` that announces "1 crore rupees" instead of the raw slider
position "17.718".

---

## 6. Analytics, if it is ever needed

Nothing ships today, deliberately. The omission is a decision, not an oversight,
so here is the non-blocking way to add it back:

```tsx
// app/layout.tsx
import Script from "next/script";

// strategy="lazyOnload" defers until the browser is idle after load, so it
// cannot compete with hydration or add to Total Blocking Time.
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
  strategy="lazyOnload"
/>
```

One tag at a time, each justified, and re-measure after each. The baseline's
4.6 s TBT is what seven of them look like when they all load eagerly.

---

## 7. Content policy

You asked for Propsoch's real copy and no invented pricing, testimonials or
stats. Every word on the page lives in one typed file, `lib/content.ts`, so that
is auditable in one place rather than scattered through JSX.

Real content reused verbatim: the hero headline and all three of its phrases, the
value proposition, the CTA labels, all nine comparison criteria with Propsoch's
and Local Brokers' answers, the timeline's week markers and step titles, the
section headings, the stats (700+ projects, 2,500+ homebuyers, 8,500+ hours,
290+ partner builders, ~₹4.78 L average saved), the footer locations and
property types, the entity name and both RERA registrations.

There are exactly **four** deviations, each flagged inline in that file:

1. **The marquee terms.** Generated inside a client-only component, so not
   recoverable from the rendered DOM. The page ships an asset named
   `bromatkar_icon.png` and the brief names the element the "Bro-marketer /
   Broker" marquee, so those are the terms used. One array to correct.
2. **The Online Portals column.** There is no copy to reuse, because that tab is
   broken on the live site and its panel is empty. Rather than fabricate claims
   about named competitors, these nine values describe how a listings
   marketplace works structurally ("Ranked by paid placement, not fit"). This is
   the only block on the page I authored.
3. **The timeline step details.** Markers and titles are verbatim. The
   supporting sentences are condensed from facts recovered elsewhere on the same
   page (10 to 12 curated projects, 4 to 5 shortlisted, 20+ curation factors,
   2 complimentary Peace of Mind Reports). No new claims.
4. **An omission:** the placeholder GSTIN and CIN, as explained in 2.5.

One correction rather than a copy: the original labels the same statistic "Hours
of Advise" on mobile and "Hours of Research" on desktop. `8500+` is untouched;
the spelling is fixed and the label made consistent.

**The savings calculator is labelled illustrative on screen**, next to the number
it qualifies, not behind a tooltip: "Illustrative estimate based on Propsoch's
average savings. Not a quote."

The 4.8% rate is not arbitrary. Propsoch publishes an average saving of about
₹4.78 L. At 4.8% that implies an average ticket near ₹1 Crore, so the rate is
consistent with the published figure. A unit test documents that relationship so
a future edit has to confront it.

---

## 8. The two new sections

### Savings calculator

A budget slider from ₹50 Lakh to ₹25 Crore applying a fixed 4.8% save rate, in
Indian lakh and crore formatting.

The slider is **logarithmic**, and that is a deliberate UX decision. Mapped
linearly across a 50x range, the midpoint of the track lands at about ₹12.75
Crore, and every budget under ₹2.5 Crore, which is where most buyers are, gets
crammed into the first 8% of the track. One pixel of thumb movement would jump
the budget by roughly ₹25 Lakh. A log scale gives each doubling of budget equal
track distance, so precision scales the way the need for it does. Values snap to
₹5 Lakh steps below a crore and ₹25 Lakh above, so the readout looks like a
budget rather than a calculation.

### Pincode availability checker

A six-digit pincode checked against a typed `pincode -> area` map covering
**85 real pincodes**, 40 in Bangalore and 45 in Mumbai.

Every one was verified against India Post's public API rather than written from
memory, via `node scripts/verify-pincodes.mjs`, which checks that each pincode
exists and that its district matches the city claimed. **It caught a real error:**
`400062`, which I had labelled Goregaon West, does not exist in India Post's
database at all. Goregaon West is `400104`.

The result type is a discriminated union rather than a nullable value, so "not a
valid pincode" and "a valid pincode we do not serve" stay distinct. Entering a
Delhi pincode gets "We're not in that area yet" plus the cities we do serve, not
a validation error.

---

## 8a. Branding and navigation

**The logo is Propsoch's real mark**, extracted from their live site, where it
ships as an inline SVG rather than an asset file. Two paths: the interlocking
mark plus "Prop" in `#FF6D33`, and "soch" in `#212130`. Useful side effect, the
logo's own fill is the primary evidence for what the brand orange is, cited in
the token comment.

**The tab icon is Propsoch's mark**, not the wordmark: at 32px the letterforms
are illegible noise, so the icon uses only the interlocking glyph, which meant
splitting their logo path at the subpath where the "P" begins. 1,963 bytes.

**The navigation bar is kept as Propsoch's own:** four dropdown groups with their
real labels, descriptions and "New" badges, plus the search, share and wishlist
icon rail and the "Get Started" button. Every string was extracted by opening
each dropdown in a real browser, because the menus are client-rendered and absent
from the served HTML. It all lives in `lib/nav.ts`.

**Nothing in the navigation navigates.** It is user interface only. `lib/nav.ts`
has no `href` field at all, which is the point: there is nowhere to put a
destination that does not exist. Every item is a real
`<button type="button">`, and that choice is deliberate:

| Markup | Focusable | Announces as | Clicking it |
|---|---|---|---|
| `<a>` with no href | **No** | nothing | nothing |
| `<a href="#">` | Yes | a link | **jumps to top of page** |
| `<button type="button">` | Yes | a button | nothing |

The first drops the item out of the keyboard order and the accessibility tree
entirely. The second lies twice. The third is honest. Verified: exactly one
anchor in the header (the logo, to `#main`, which works), zero `a[href="#"]`
anywhere on the page, and clicking a dropdown item leaves the URL unchanged.

The dropdowns are the only reason there is client JavaScript in the header. A
menu cannot be done correctly in CSS: it needs Escape to close, arrow keys
between items, focus returned to the trigger, and `aria-expanded` kept in sync.
Hover-only CSS menus are unusable by keyboard and hostile on touch, which is the
class of bug this rebuild exists to fix rather than introduce. The header shell
itself stays a Server Component; only the two nav subtrees hydrate.

Nav hrefs point at the real Propsoch pages, which is consistent with the rule the
footer follows: navigation gets real destinations, calls to action do not act.
Pointing a nav link at `href="#"` would be a worse lie than pointing it at the
real page.

The mobile menu is hand-written rather than pulling in a Dialog primitive, and it
does the four things a disclosure panel owes the user: Escape closes it, focus
returns to the Menu button, body scroll locks while it is open, and
`aria-expanded` tracks real state. Its groups use native `<details>`, which gives
correct semantics and keyboard support with no state of my own.

## 8b. The trust logos

The hero's trust strip used to render the eight employers as text wordmarks. It
now renders their real logos as WebP, and the whole pipeline is
`scripts/fetch-logos.mjs` rather than eight files someone converted by hand and
committed. A binary in a repo with no script beside it is unreviewable.

**Provenance.** Every file comes from Propsoch's OWN CDN, the same assets their
live site serves on this exact claim. That was not the first thing I tried: I
checked two public icon sources first and could only get three of the eight
between them, with Flipkart, Deloitte and Navi missing entirely. Driving the
live site and reading its image requests found all eight in one place. The
source URLs are in the script, so the provenance is checkable rather than
asserted.

**What the script does to each file:**

1. **White to alpha, where needed.** Atlassian's source is RGB on solid white,
   which would render as a white box on the off-white surface. The fix is the
   standard un-premultiply, `a = 255 - min(r,g,b)` then scale each channel back
   up by `a`, done per pixel so anti-aliased edges survive instead of being
   hard-keyed into a jagged cutout.
2. **Trim, then resize to 2x.** The sources carry wildly different padding
   (Deloitte's has about 120px of it), so trimming first is what makes one
   target height produce comparable logos. Nothing is upscaled: after trimming,
   the smallest source is exactly the 48px target, so every logo is 1:1 or
   downscaled.
3. **Per-brand optical scale.** This is the part that is not arithmetic.
   Normalising eight logos to one bounding-box height normalises their BOXES,
   not what the eye sees: Atlassian's all-caps wordmark fills its box, where
   "amazon" is lowercase with the smile below it using about two thirds. Matched
   by box, ATLASSIAN's letters render about 1.6x everyone else's. The correction
   is baked into the asset (Atlassian 0.62, Deloitte 0.74, Microsoft 0.85), so
   the strip reads level.

**Cost and safety.** 8 files, **31.4 KB total**, all `loading="lazy"`, all below
the fold. Each carries its exact intrinsic width and height from the generated
`lib/logos.generated.ts`, which gives the browser an aspect ratio to reserve the
box with before any byte arrives. Measured CLS with all eight streaming in: **0**.

They are plain `<img>`, not `next/image`. These are eight fixed-size static
assets with no art direction and no responsive variants to choose between, so
the component would add client JavaScript to solve a problem this strip does not
have.

---

## 8c. The video testimonials

Three customer videos, placed immediately after the comparison. The comparison
makes a claim, the obvious next question is "says who", and three people
answering in their own recorded voices is the strongest available answer.
Putting it any later would mean carrying that claim on trust through two more
sections first.

### The facade, and what it is worth

An ordinary YouTube embed is roughly 700 KB to 1 MB of JavaScript, CSS and
images, across a dozen requests to several third-party origins, with cookies,
and it all runs on load whether or not anyone presses play. Three of them on a
274 KB page is not a tradeoff, it is a different page.

So the page ships a poster and a play button that look like a player, and mounts
the real embed only on click. Measured after a full scroll of the finished page:

| | value |
|---|---|
| Third-party requests before any click | **0** |
| Iframes in the DOM before any click | **0** |
| Cost of the three posters | 70.2 KB, lazy, below the fold |
| Third-party origins after a click | 1 (youtube-nocookie.com) |
| Iframes after closing again | **0**, so the audio actually stops |

The nocookie domain is not cosmetic: the standard embed sets tracking cookies
the moment it loads, and that one does not until playback starts.

### What the IntersectionObserver actually does

Not lazy-loading. The posters already do that natively with loading="lazy",
which beats anything hand-written.

It warms the **connection**. The expensive part of a first play is not the
iframe markup, it is DNS plus TCP plus TLS to two cold origins before a byte of
video moves, easily 300ms and much worse on a phone. The observer fires while
the section is still 400px below the viewport and issues preconnect hints, so
the handshakes are finished before a finger reaches the button. It disconnects
on first hit.

preconnect is the right hint precisely because it transfers nothing: no bytes,
no cookies, no request in the waterfall. The zero above is still zero after it
runs. Verified: two preconnect links in the head, third-party requests still 0.

### A grid, not their carousel

The original shows one video with its neighbours faded to 15% and bleeding off
both edges, and keeps only the ACTIVE slide's quote in the DOM. Two testimonials
cannot be read without operating a control, and two thirds of the social proof
is invisible to a crawler at any given moment.

The grid shows all three quotes at once, has no controls and no state, and reads
the same to a person and to a search engine: **3 blockquotes in the served
HTML**. The video still gets to be big, because playing happens in a dialog
rather than inside a 373px card. The whole poster is the button, so the target
is 365x205 rather than a 56px circle.

### Two defects found by testing

**Their data pairs every quote with the wrong video.** Propsoch's array is
rotated by one against their actual uploads, so their live carousel captions
each testimonial with someone else's name. Nid3XKVEApg settles it: that video's
own YouTube title is "Meet Bharath and Neerja" and its thumbnail says the same,
while their array labels it Ankita and Vishal. The video id on each entry is
corrected here; every word, name, role and the display order are still theirs.
Shipping the rotation faithfully would have put a real person's name under a
different real person's face. Full evidence table in lib/content.ts.

**Escape left keyboard focus on the body.** Radix restores focus on close, and
here it could not: the cross-origin iframe takes focus into itself, so the focus
scope has nothing in-scope to return from. A keyboard user closing a video was
dumped at the top of the document. Fixed by capturing the trigger and restoring
it in onCloseAutoFocus. Verified with a real key press: focus returns to the
exact play button that opened the dialog.

Also verified on the open dialog: 35 focusable elements outside it, **0 still
exposed to assistive technology**.

---

## 8d. The plan comparison, and the process CTA

### Brochure against survey

The section between the testimonials and the process is the only place on the
page that shows rather than tells: a builder's glossy marketing site plan and
the sanctioned technical drawing of the same site, with a slider to wipe between
them. Propsoch's annotations on the second one mark a high tension line and a
water treatment plant. That is the argument the whole page is making, in one
image.

**The slider is a native range input.** The obvious build is
pointerdown/pointermove/pointerup on the container, and it is also how these
components end up mouse-only. A transparent `<input type="range"` stretched
over the image gives keyboard control, Home and End, `role="slider"`, a real
value, touch support and the browser's own pointer capture, all correct, for
free. The visible divider and the Drag pill are decoration positioned at the
same custom property.

Verified at three positions: the divider and pill land within 2px of the
expected pixel every time, and the clip is its exact complement.

**There is no useState in it.** A dragged control fires input events at pointer
rate; putting that in React state re-renders the subtree sixty times a second
to change one CSS property. The input is uncontrolled and the handler writes the
custom property straight onto the wrapper. React renders the component once.
The initial 50% is an inline style, so the server-rendered markup is already
correct and there is nothing to fix up on hydration.

**The two source images did not match.** 989x682 against 987x692, a 1.450 aspect
against 1.426. Left alone the reveal would wipe between two slightly different
framings, which quietly destroys the illusion of one place seen two ways. Both
are cover-cropped to exactly 3:2 at build time.

**Responsive images are the real optimisation here.** These are the heaviest
assets on the site: 1.17 MB and 782 KB as source PNGs. At 990px the WebP pair is
still 121.5 KB. Each is therefore emitted at 660w and 990w with a `sizes` hint,
and both a phone and an ordinary 1x desktop take the 660w pair at **73.8 KB**.
Verified in the browser at both 360px and 1280px: `currentSrc` resolves to the
660w file at each.

**The focus indicator is two-tone, and that was a fix.** The divider is a light
core with a dark hairline, because a focus ring here sits on photographic
content whose colour changes as the slider moves and no single colour can be
guaranteed against it. The first version recoloured the core to brand orange on
focus, which would have made the indicator hardest to see over exactly the pale
drawing it spends half its time on. Focus now adds a ring and keeps the core.

### The missing process CTA and testimonial

Their process section carries a "Book An Appointment" button and a written
testimonial from Roshik Shenoy that this rebuild had simply not reproduced.
Both are now in, verbatim, including the italic on "research-based approach"
and the emphasis their own h2 puts on "25 days".

They sit in the sticky heading column rather than after the five steps. On a
large screen that column is pinned while the steps scroll past it, so the action
stays reachable for the whole section instead of only at the bottom of it; on
small screens the column is not sticky and they sit above the steps, which is
where their page puts them.

One ordering deviation, stated plainly: their lead-in line "Buying a property
should not take you forever" sits ABOVE the heading on their page and sits below
it here, because every other section on this page introduces itself with the
same eyebrow-then-heading pattern and breaking that for one section costs more
than the ordering gains. Same words, same role, one line lower.

---

## 8e. The FAQ, and the pincode checker's removal

32 questions in four categories, every word theirs.

**Their answers ship as HTML strings** inside a JavaScript chunk, with `<ol>`,
`<li>`, `<strong>` and `<br/>` in them. Rendering those with
dangerouslySetInnerHTML would mean trusting a scraped string to stay markup
forever, so a one-off extractor parsed each answer into a small block shape and
`lib/faq.ts` is its output. The words are untouched; only the container changed,
from a string of tags to real elements.

**Shape, because 32 questions is a lot of page.** Categories are tabs rather
than four stacked lists, and answers are a collapsed accordion. A FAQ is a
lookup table, not prose. Every question is a real `h3` inside its button, so the
section has an outline instead of 32 anonymous clickable divs.

**All 32 are in the served HTML.** `forceMount` plus
`data-[state=inactive]:hidden`, the same pattern as the comparison tabs. This is
the largest block of indexable text in the build and a FAQ that only exists
after JavaScript is a FAQ no crawler reads. Verified: 32 questions and every
answer present without JS, and **every `aria-controls` resolves to a real
element**, which is precisely the bug the original has (see 5.1).

**One edit to their content.** Their "I am confused looking at various options"
answer lists the bullet "Is this neighborhood safe?" twice in a row. The repeat
is dropped: it removes no information, and a duplicated bullet reads as a defect
in this rebuild rather than as fidelity to theirs.

**Two words their copy contains that this project's own rules ban:** an en dash
in the video testimonial and "empower" in an FAQ answer. Both rules are about my
prose, both of those are quotations, so neither is reworded. Flagged rather than
silently tidied.

### The card underneath

Their version is a flat orange band with a white button. Kept, with its three
strings, and two things fixed: a white button on the bright orange is a 2.80:1
boundary, and a flat fill next to a page built on layered depth looks like a
different site. It now uses the deep brand orange, which white clears at 5.18:1
both as the label and as the button's own edge, plus a soft radial for light.

One of my own bugs, caught by measuring: I first set the sub-line to
`text-white/85`, which composites to `#F6E3DB` over that orange and is
**4.17:1, below AA**. That is the same mistake this README calls out in shadcn's
tab styling in section 2.3, made by me, the same way, because an alpha looks
like a colour and is not one. It is solid white now.

### The pincode checker

Removed from the page at your request. `lib/pincodes.ts`, its 85 India
Post-verified entries, its tests and the component are all kept, so restoring
the section is one import in `app/page.tsx`. The footer's in-page nav swapped
that entry for the FAQ.

---

## 8f. Featured in, and two bugs the audit found

### The press band

Five publications, each linking to the actual article. The heading is theirs.
19 DOM elements and 7.8 KB of images for the whole section, which is what
"minimal" should cost.

**Theirs is an Embla carousel with an autoscroll plugin.** That is two libraries
and a requestAnimationFrame loop running for the entire visit to slide five
logos that already fit on one line. This is a flex row that wraps: nothing to
hydrate, nothing running in the background, and readable when stopped.

**Every logo links to its article.** Their component carries the URLs and I kept
them. A press logo that links nowhere is decoration pretending to be evidence.

**The link is named for what it does, not for the brand.** Five links called
"The Print", "ANI", "Mint" tell a screen reader who published and never that
there is anything to read, so each link is labelled "Read the article about
Propsoch on The Print" and the logo itself carries an empty alt. The publication
goes last because "Read the The Print article" is what putting it first
produces.

**`mix-blend-multiply` on the logos is load-bearing.** Those PNGs have
transparent rounded corners but an opaque white plate behind the artwork, so on
the grey band each one rendered as a white card. Multiplying white against the
background gives back the background, so the plate vanishes and the artwork
stays. It only works because this band is light.

**Seven logos are missing and that is deliberate.** The homepage screenshot
shows twelve; their CDN serves five at the path their code uses. I probed for
the rest (Times of India, CNBC, Economic Times, Outlook Business, Inc42, The
Hindu) and they are not there. Guessing filenames would mean shipping mastheads
I cannot tie to a real article. Send me the files and the five becomes twelve.

### Two bugs, both found by the audit rather than by reading

**A duplicate React key.** The console error in your report named the
Magicbricks question. Their "Why Work With Us" category lists it twice, at
positions 1 and 3, with a byte-identical answer. The extractor now drops exact
duplicates anywhere in a category, not just adjacent ones, so the FAQ is 31
questions rather than 32. The accordion is also keyed by position now, because a
key should not depend on content staying unique when nothing enforces that.

**An `aria-controls` pointing at nothing.** Radix builds element ids from a tab's
value, and `aria-controls` is a space-separated list of ids, so a value of
"About the Service" emitted `aria-controls="...-About the Service"`, which is
three id references and none of them resolve. Tab values are slugs now.

The same audit found a third one I had not been told about: the mobile menu
button carried `aria-controls="mobile-nav-panel"` at all times, while the panel
is portalled and only mounted when open. It is conditional now. Zero unresolved
`aria-controls` on the page at 360 and 1280.

---

## 9. Scope notes

- **No call to action performs an action.** There is no booking backend, and
  inventing one would add risk without demonstrating anything. Every CTA is still
  a real `<button>` with an accessible name, a visible focus ring and a 44px
  target, because a non-functional control still has to be a correct control. The
  footer's in-page section links are real and work, since those are navigation
  rather than an ask. The two RERA links go to the real state authority sites.
- **The video facade is deferred**, per section 2.6.
- **Two DOM trees exist in exactly one place**, the comparison section, where a
  semantic table and a tabbed two-up list are genuinely different components
  rather than the same content twice. Everywhere else responsiveness is CSS over
  a single tree, which is the opposite of the original's approach.

---

## 10. Stack and structure

Next.js 16.3.4 (App Router), React 19.2.8, TypeScript, Tailwind CSS 4.3.3,
shadcn/ui on Radix primitives, `react-icons`, Vitest.

Runtime dependencies are deliberately few: `next`, `react`, `react-dom`,
`react-icons`, `radix-ui`, `class-variance-authority`, `cn` and `shadcn` (the
last is a build-time CSS dependency in this CLI version). `shadcn init` also
installed `lucide-react` and `tw-animate-css`; I checked whether the generated
components actually used them, found they did not, and removed both. I applied
the same rule to my own work at the end: `card.tsx` was generated but every
panel ended up being a plain bordered container, so it was dead code and was
deleted too.

```
app/                      layout, page, globals.css, robots, sitemap, OG image, icon
components/
  brand/                  logo.tsx             Propsoch's real mark, inline SVG
                          bromatker.tsx        the wordmark
                          splash.tsx           the CSS-only loader
                          hero-art.tsx         the shortlist funnel diagram
  layout/                 site-header.tsx, site-footer.tsx (server)
                          desktop-nav.tsx, mobile-nav.tsx  (CLIENT)
  sections/               hero, comparison, timeline,
                          testimonials, reality-check,
                          faq, featured-in                 (server)
                          comparison-tabs, savings-calculator,
                          testimonial-grid, plan-comparison,
                          faq-tabs                         (CLIENT)
                          pincode-checker                  (kept, not mounted)
  primary-cta.tsx         the one CTA style, reused everywhere
  section-heading.tsx     the one section heading treatment
  icons.tsx               the react-icons set, one swap point
  ui/                     shadcn: button, slider, input, tabs, navigation-menu
public/
  logos/                  the 8 trust logos as WebP, built by scripts/fetch-logos.mjs
  posters/                the 3 video posters as WebP, built by scripts/fetch-posters.mjs
  plan/                   the 2 master plans at 2 widths, plus the process avatar
  press/                  the 5 press logos as WebP, 7.8 KB all in
lib/
  faq.ts                  the 31 questions, extracted from their HTML answers
  press.generated.ts      GENERATED: the five press logos and their articles
  logos.generated.ts      GENERATED: each logo's intrinsic size, for zero CLS
  posters.generated.ts    GENERATED: each poster's intrinsic size, for zero CLS
  plan-media.generated.ts GENERATED: the plan srcsets and the avatar's size
  content.ts              every word on the page, with provenance
  nav.ts                  the real navigation, extracted from the live site
  pincodes.ts             85 verified pincodes
  currency.ts             Indian formatting, log slider mapping
  __tests__/              31 unit tests
scripts/
  check-contrast.mjs      WCAG gate over the palette, 34 pairs
  verify-pincodes.mjs     data check against India Post
  fetch-logos.mjs         builds public/logos/*.webp from Propsoch's CDN
  fetch-posters.mjs       builds public/posters/*.webp from the video thumbnails
  fetch-plan-media.mjs    builds public/plan/*.webp, two widths for the srcset
  fetch-media-logos.mjs   builds public/press/*.webp from their press list
```

Not one file in `components/ui/` was hand-edited. All theming happens through the
CSS variable layer, so `npx shadcn add` can overwrite those files and the
Propsoch theme survives. Where a shadcn default needed changing (thumb size, tab
contrast, hover colour), it was overridden from the outside via `data-slot`
selectors or the component's own `className`.

## 11. Verification

```bash
npm run verify          # typecheck + contrast gate + 31 tests + build
npm run check:contrast  # 34 WCAG pairs, plus the accepted deviations
npm run test            # unit tests
node scripts/verify-pincodes.mjs   # data check, hits India Post
```

Everything claimed in this README as "measured" was measured. Everything left for
PSI is left blank rather than guessed.

`Implementation.md` is a running teaching log covering every build step: what was
done, why, the tradeoffs, and the underlying best practice, including the bugs I
made and caught along the way.
