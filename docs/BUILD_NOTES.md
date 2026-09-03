# Production Build Notes & Architecture Audit

## 1. Code Audit of the Original Prototype (`purelane-homepage.html`)

While the prototype delivered a striking visual aesthetic and fluid cinematic art direction, several underlying architectural choices were unsuitable for a high-converting production Shopify store:

### 1.1 Massive Monolithic Assets & Embedded Base64
- **Issue**: Over 40KB of base64-encoded SVG graphics were embedded directly into CSS custom properties (`--p-combo2`, `--p-dish`, etc.) within a single `<style>` block.
- **Impact**: Bloated the main thread CSS parsing time, prevented browser asset caching across multiple pages, and blocked modern responsive picture srcset optimizations.
- **Production Fix**: Modularized CSS into `purelane-theme.css`, extracted background animations into dedicated snippets, and routed product photography through Shopify's CDN with dynamic `image_url` responsive widths (`200, 300, 400`).

### 1.2 Layout Fragility & Card Inconsistency
- **Issue**: The original shelf cards hardcoded fixed text lengths. Cards 5–8 duplicated cards 1–4 with inline SVG copies.
- **Impact**: Any product with a title longer than 4 words or a title wrapping to 3 lines broke the vertical baseline, misaligning "Add to cart" buttons across the shelf row.
- **Production Fix**: Built a robust flex/grid container with CSS `-webkit-line-clamp: 2` on `.card h4`, uniform minimum heights, and standardized `aspect-ratio: 1 / 1` on product image containers.

### 1.3 Unthrottled Event Listeners & Core Web Vitals
- **Issue**: The prototype attached unthrottled scroll listeners that queried DOM offsets and updated element styles synchronously on every pixel scroll.
- **Impact**: Caused significant scroll jank, layout thrashing, and high Interaction to Next Paint (INP) latency.
- **Production Fix**: Decoupled scroll tracking into a single `requestAnimationFrame` render loop with `{ passive: true }` listeners, ensuring 60fps smooth scrolling.

### 1.4 Accessibility Deficits (WCAG 2.1)
- **Issue**: Several `<button>` elements lacked `type="button"`, ARIA labels were absent on interactive icon buttons, and animations ran unconditionally even for users with vestibular disorders.
- **Impact**: Accessibility failure for screen reader and keyboard-only users.
- **Production Fix**: Added semantic ARIA labels, focus rings with `:focus-visible`, proper `<form>` customer tags, and an overarching `@media (prefers-reduced-motion: reduce)` ruleset that stops caustics, ticker loops, and hero drift.

### 1.5 Theme Editor Fragility
- **Issue**: DOM nodes were selected once at page load. If a merchant added, moved, or edited a section in the Shopify Theme Customizer, event listeners broke and animations froze.
- **Production Fix**: Built clean lifecycle handlers listening to `shopify:section:load`, `shopify:section:select`, and `shopify:section:reorder` to reinitialize components cleanly without memory leaks.

---

## 2. Production Section Architecture & Schema Design

Each of the 5 core sections was engineered to give non-technical merchants complete editorial control:

| Section | Template File | Key Merchant Controls |
|---|---|---|
| **01. Hero** | `sections/purelane-hero.liquid` | Eyebrow kicker, dual-tone headline, lede description, dual CTA buttons, product promise blocks, and 3-slide showcase pricing callouts. |
| **02. Reviews Rail** | `sections/purelane-reviews.liquid` | Aggregate score, review counter, and dynamic review card blocks with verified buyer badges and purchased product tags. |
| **03. Combos Rail** | `sections/purelane-combos.liquid` | Horizontal swipe rail of curated combo boxes, saving callouts, product thumbnails with micro-benefit labels, and featured "Best Value" highlighting. |
| **04. Bundles** | `sections/purelane-bundles.liquid` | 3-tier box builder (Starter, Most Popular, Whole Home), unit pricing calculators, checklist bullets, and direct customizer links. |
| **05. Shop Grid** | `sections/purelane-shop.liquid` | Collection selector, products-per-row controls, products count limit, and dynamic integration with `purelane-product-card.liquid`. |

---

## 3. Real Shopify Data & Edge Cases Handled

The assignment specifically required seeding at least 8 products with three specific stress tests:

1. **Sold Out Product** (`purelane-organic-coconut-dishwash-gel`):
   - Inventory quantity set to `0` with `inventory_policy: deny`.
   - Liquid detects `product.available == false`.
   - Card automatically renders a distinct "Sold out" pill, sets opacity to `0.72`, and disables the button with "Sold out" label and `aria-disabled="true"`.
2. **Missing Image Product** (`purelane-multisurface-wood-polish`):
   - Image Src left blank.
   - Liquid detects `product.featured_image == blank`.
   - Renders a stylized botanical SVG placeholder with subtle branding, ensuring the card never collapses, distorts, or creates layout shifts (CLS).
3. **Very Long Title Product** (`purelane-ultraconcentrated-hypoallergenic-laundry-detergent-lemongrass-1000ml`):
   - 170-character title with detailed variant description.
   - Handled via CSS `-webkit-line-clamp: 2`, `text-overflow: ellipsis`, and native `title` attribute tooltip.
   - Card maintains identical height and button alignment with neighboring standard-title cards.

---

## 4. What We'd Do With More Time

1. **Shopify Functions & Cart Transform API**:
   - Implement server-side automatic discount rules (e.g. automatically applying the flat ₹499 rate when any 3 qualifying single bottles are added to the cart, with zero merchant discount code required).
2. **Interactive Bundle Builder Drawer**:
   - A reactive modal/drawer that allows customers to click "Build bundle" and visually pick their 2, 3, or 5 bottles with a live progress bar ("Add 1 more to save ₹249!").
3. **Automated Visual Regression Pipeline**:
   - Playwright CI workflow testing pixel fidelity across 375px, 768px, 1024px, and 1440px on every commit against the prototype baseline.
