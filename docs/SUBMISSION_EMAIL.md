# Submission Email Template

**To**: `nj@troopod.io`  
**Subject**: `AI Product Engineer Assignment - Tushaar`

---

Hi NJ,

Thank you for the opportunity. Please find my submission for the AI Product Engineer build assignment below.

### 1. Dev Store URL & Credentials
- **Store URL**: https://purelane-tushaar.myshopify.com
- **Storefront Password**: `purelane`
- **Theme**: Built on a clean install of stock Shopify Dawn 16.0.0.

### 2. GitHub Repository
- **Repository**: https://github.com/tushaar9560/purelane-shopify-theme
- Commit history is kept clean, atomic, and sequential, tracking the progressive architecture from base tokens to complete sections and edge-case testing.

### 3. Scope & Deliverables
All **5 required core sections** have been built to production standard with full Shopify Theme Editor schema controls and AJAX Cart integration:
1. **Hero (`section.hero`)**: Interactive 3-product showcase stage with live pricing callouts, auto-rotator, dot navigation, product promises rail, and scroll/parallax depth.
2. **Reviews Rail (`#reviews`)**: Infinite marquee customer reviews with star ratings, verified buyer badges, and pause-on-hover.
3. **Best-Selling Combos (`#combos`)**: Horizontal swipe rail with multi-product bundle trays, savings badges, and direct bundle checkout.
4. **Bundles (`#bundles`)**: 3-tiered box builder (Starter, Most Popular, Whole Home) with flat per-product rate calculations and feature checklists.
5. **Shop / Product Grid (`#shop`)**: Bestseller grid powered by real Shopify collection data and a reusable product card component (`snippets/purelane-product-card.liquid`).

**Bonus Sections Included (100% Replication)**:
- Cinematic ambient background engine (`.scenes` 4-depth crossfade, SVG water caustics, micro-bubbles, and vignette).
- Announcement marquee ticker, glass pill navigation header, ingredients grid with interactive bottle rotator (`#rot`), "How it works" pillars, proof stats rings, full range carousel, "Why bundles" grid, bundle categories, trust badges, newsletter signup, and mobile sticky CTA bar.

### 4. Edge Cases Tested (Real Shopify Platform Data)
The store was seeded with 8 products via custom CSV (`data/purelane-products-seed.csv`), specifically verifying:
- **Sold out item** (`Organic Coconut Dishwash Gel`): Inventory 0, inventory policy deny — renders sold-out pill, disabled cart button, and accessible state.
- **No image item** (`Multi-Surface Wood Polish`): Renders a branded botanical SVG placeholder without layout shift or container collapse.
- **Very long title item** (`Ultra-Concentrated Plant-Derived Hypoallergenic Laundry Liquid Detergent...`): 170-character title gracefully clamped to 2 lines with ellipsis and tooltip, maintaining uniform shelf card heights and button alignment.

### 5. Documentation & Reflection Notes
Inside the repository (`/docs`), you will find complete detailed write-ups:
- **`docs/METAFIELDS.md`**: Custom metafields (`custom.badge`, `custom.rating`, `custom.reviews_count`, `custom.volume`) and metaobject definitions.
- **`docs/BUILD_NOTES.md`**: Comprehensive audit of the prototype HTML, architectural fixes for performance (rAF throttling, CWV), accessibility (WCAG AA, reduced motion), and theme customizer lifecycle resilience (`shopify:section:load`).
- **`docs/AI_WORKFLOW_NOTES.md`**: Reflection on agentic workflows — what was delegated, where AI failed (customizer blindness, large asset truncation), and how to systematize this for 20+ client builds.

Looking forward to the technical discussion!

Best regards,  
Tushaar
