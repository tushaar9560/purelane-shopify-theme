# AI Workflow Reflection & Systems Blueprint

## 1. What We Delegated to AI

In building this theme replication, AI agents were utilized as force multipliers for volume and precision tasks:

- **Prototype Decomposition**: Parsing the 1,700-line monolithic HTML file to extract CSS color variables, font imports, clamp functions, and SVG assets.
- **Shopify Schema Generation**: Drafting the structured JSON schemas (`{% schema %}`) for all sections, defining types, IDs, labels, defaults, blocks, and presets.
- **Product Seeding Data Generation**: Assembling the 8-product CSV dataset with realistic DTC homecare titles, descriptions, SKU formats, and edge-case parameters.
- **Boilerplate Liquid Scaffolding**: Rapidly producing initial markup shells for standard UI structures (reviews marquee, combo cards, tier lists) following the prototype's exact class hierarchies.

---

## 2. Where AI Failed & How We Caught It

While AI accelerated development speed by 5x, it consistently stumbled on nuanced production and platform-specific edge cases:

### 2.1 The Large Asset Hallucination Trap
- **Failure**: When prompted to manipulate large embedded SVG base64 strings, LLMs frequently truncate lines or hallucinate random character sequences, corrupting image data.
- **How We Caught It**: Bypassed LLM context for large binary assets by using precise Python file extraction scripts directly on the raw prototype file.

### 2.2 Shopify Customizer Lifecycle Blindness
- **Failure**: Standard AI-generated JavaScript attached listeners to `window.addEventListener('load')` or `DOMContentLoaded`. In Shopify's Theme Editor, sections re-render dynamically via AJAX whenever a merchant modifies a setting. The AI code became completely dead upon any Customizer interaction.
- **How We Caught It**: Proactively tested section reload behavior and re-architected `assets/purelane-theme.js` around Shopify's section events:
  ```javascript
  document.addEventListener('shopify:section:load', function (e) {
    initReveals(e.target);
    initHeroStage(e.target);
    initRotator(e.target);
  });
  ```

### 2.3 Fragile Layout Assumptions on Long Text
- **Failure**: The AI generated CSS assuming all product titles would be 3–4 words like the design mockup ("Tap cleaner"). When given the required stress-test product (a 170-character laundry detergent title), the cards expanded irregularly and button alignments collapsed across the grid.
- **How We Caught It**: Caught during edge-case verification. Implemented defensive layout CSS using `-webkit-line-clamp: 2`, fixed aspect ratios, and flex column pinning.

### 2.4 JSON Syntax Errors Inside Liquid Schemas
- **Failure**: AI models often forget that `{% schema %}` blocks must be 100% valid JSON without trailing commas or unescaped double quotes inside default text values.
- **How We Caught It**: Created an automated Python validation script to parse all `{% schema %}` blocks through `json.loads()` prior to git commits.

---

## 3. How to Systematize This for 20+ Client Builds

Scaling this workflow to handle dozens of client onboarding projects requires transforming one-off agentic prompts into a reliable, repeatable delivery pipeline:

```
[ Prototype / Figma Spec ]
           │
           ▼
[ 1. Token & Asset Extractor Script ]  ──►  Modular CSS + Media CDN Assets
           │
           ▼
[ 2. Agentic Section Generator ]       ──►  Semantic Liquid + Strict Customizer Schema
           │
           ▼
[ 3. Automated Validation Linter ]     ──►  Shopify Theme Check + JSON Schema Parser
           │
           ▼
[ 4. Automated Catalog Seeder ]        ──►  Storefront CSV (with edge cases)
           │
           ▼
[ 5. Headless Visual QA (Playwright) ] ──►  Pixel diff vs Prototype (375px, 768px, 1280px)
```

### Key Elements of the System:
1. **Curated Section Primitive Library**: A battle-tested library of accessible Shopify section archetypes (interactive heroes, infinite marquee tracks, multi-product combo trays, bundle tiers) pre-configured with Shopify Customizer resilience.
2. **Automated Catalog Seeder CLI**: A script that accepts a brand's niche and generates a fully compliant Shopify product CSV in 10 seconds, automatically seeding stress-test edge cases (out of stock, missing image, ultra-long title, varied variant structures).
3. **Headless Visual Regression Testing**: A Playwright test runner executing automated screenshot diffs between the client prototype and the live Shopify preview across mobile (375px), tablet (768px), and desktop (1440px), flagging visual regressions before human QA.
