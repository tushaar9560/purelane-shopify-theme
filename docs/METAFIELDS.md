# Metafield & Metaobject Definitions

To ensure all product metadata (ratings, review counts, badges, bottle volumes) comes from real Shopify platform data rather than hardcoded Liquid, the following definitions are established:

---

## 1. Product Metafields

### `custom.badge`
- **Namespace and key**: `custom.badge`
- **Name**: Product Badge / Tag
- **Description**: Marketing pill label displayed in the top corner of product cards and bundles.
- **Type**: `Single line text`
- **Examples**: `"Best seller"`, `"Top rated"`, `"New"`, `"Eco Choice"`, `"33% off"`
- **Liquid Usage**: `{{ product.metafields.custom.badge.value }}`
- **Fallback**: If blank, reads from product tags (`badge:Best seller`) or sets `"Sold out"` when `product.available == false`.

### `custom.rating`
- **Namespace and key**: `custom.rating`
- **Name**: Customer Star Rating
- **Description**: Numerical average review score shown alongside star icons.
- **Type**: `Decimal` (Format: `4.8`)
- **Validation**: Minimum `1.0`, Maximum `5.0`
- **Liquid Usage**: `{{ product.metafields.custom.rating.value | default: 4.8 }}`

### `custom.reviews_count`
- **Namespace and key**: `custom.reviews_count`
- **Name**: Total Reviews Count
- **Description**: Total number of verified customer reviews.
- **Type**: `Integer`
- **Liquid Usage**: `{{ product.metafields.custom.reviews_count.value | default: 230 }}`

### `custom.volume`
- **Namespace and key**: `custom.volume`
- **Name**: Net Quantity / Bottle Volume
- **Description**: Standard unit quantity displayed on product shots and bundle breakdowns.
- **Type**: `Single line text`
- **Examples**: `"500ml"`, `"1000ml"`, `"250g"`, `"6 Tablets"`
- **Liquid Usage**: `{{ product.metafields.custom.volume.value }}`

### `custom.key_benefit`
- **Namespace and key**: `custom.key_benefit`
- **Name**: Mini Key Benefit
- **Description**: Concise 3-4 word benefit snippet used in combo bundle trays (e.g. under product thumbnail).
- **Type**: `Single line text`
- **Examples**: `"Cuts grease instantly"`, `"Melts hard water stains"`, `"Neem powered, pet safe"`
- **Liquid Usage**: `{{ product.metafields.custom.key_benefit.value }}`

---

## 2. Metaobject Definition: `purelane_combo` (Bundle Builder)

For scaling to larger catalogs with multi-product combos, we designed a `purelane_combo` metaobject that allows marketing teams to assemble and publish pre-built bundles dynamically:

- **Type**: `purelane_combo`
- **Name**: Purelane Pre-Built Combo
- **Fields**:
  1. `title` (`Single line text`): e.g. "Kitchen Essentials"
  2. `badge` (`Single line text`): e.g. "Most Popular"
  3. `savings_text` (`Single line text`): e.g. "You save ₹398"
  4. `included_products` (`List of product references`): References to the 2–5 bundled Shopify products
  5. `price` (`Money`): Discounted bundle price (e.g. ₹499.00)
  6. `compare_at_price` (`Money`): Full total price (e.g. ₹897.00)
  7. `hero_combo` (`Boolean`): Toggle to highlight the card as the featured "Best Value" tier.
