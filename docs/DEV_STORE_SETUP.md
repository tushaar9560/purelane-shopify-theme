# Development Store Setup & Deployment Guide

This repository contains the complete production Shopify theme replication of the Purelane homepage, built on stock Shopify Dawn.

## Store Information
- **Dev Store URL**: `https://purelane-tushaar.myshopify.com`
- **Storefront Password**: `purelane`
- **Theme Base**: Shopify Dawn (Clean install)

---

## 1. Importing the Seed Products (1-Click)

The assignment requires at least 8 seeded products that suit the brand, specifically testing:
1. One **sold out** product (`Purelane Organic Coconut & Orange Peel Liquid Dishwash Gel`)
2. One with **no image** (`Purelane Multi-Surface Conditioning Wood Polish & Surface Shiner`)
3. One with a **very long title** (`Purelane Ultra-Concentrated Plant-Derived Hypoallergenic Laundry Liquid Detergent with Deep Stain Enzymes, Fabric Softening Actives & Fresh Indian Lemongrass Essential Oil 1000ml Refill Pack`)

### Import Steps:
1. Open your Shopify Admin: `https://admin.shopify.com/store/purelane-tushaar`
2. Navigate to **Products** in the left sidebar.
3. Click the **Import** button at the top right.
4. Click **Add file** and select `data/purelane-products-seed.csv`.
5. Keep "Overwrite any current products that have the same handle" checked.
6. Click **Upload and continue**, then **Import products**.
7. All 8 products are instantly created with pricing, inventory, descriptions, and tags.

---

## 2. Deploying the Theme to your Store

You have two simple ways to deploy this theme:

### Option A: Upload Theme ZIP (Easiest & Fastest)
1. In your project directory, generate a zip of the theme:
   ```bash
   zip -r purelane-dawn-theme.zip assets config layout locales sections snippets templates -x "*.DS_Store"
   ```
2. In Shopify Admin, go to **Online Store** → **Themes**.
3. Under *Theme library*, click **Add theme** → **Upload zip file**.
4. Select `purelane-dawn-theme.zip`.
5. Once uploaded, click **Publish** (or **Customize** to preview).

### Option B: Connect via GitHub
1. Push this repository to your GitHub account (see commit instructions below).
2. In Shopify Admin, go to **Online Store** → **Themes**.
3. Under *Theme library*, click **Add theme** → **Connect from GitHub**.
4. Select your repository and branch (`main`).
5. Shopify will automatically sync and keep the theme up to date with your commits!

---

## 3. Configuring Metafields (Optional but Recommended)

To populate custom badges and review ratings natively, navigate to **Settings** → **Custom data** → **Products** in your Shopify Admin:

1. **Badge**:
   - Name: `Badge`
   - Namespace and key: `custom.badge`
   - Type: `Single line text`
2. **Rating**:
   - Name: `Rating`
   - Namespace and key: `custom.rating`
   - Type: `Decimal (e.g. 4.8)`
3. **Reviews Count**:
   - Name: `Reviews Count`
   - Namespace and key: `custom.reviews_count`
   - Type: `Integer`

*(Note: The theme has built-in smart fallbacks. If metafields are not defined, it automatically extracts badges and ratings from product tags or graceful defaults!)*
