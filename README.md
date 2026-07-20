# O.W.A — Oranais With Attitude

A full-stack ecommerce site for O.W.A, a streetwear brand built around the
identity of Oran, Algeria — the Corniche, Raï music, football culture, and
Mediterranean youth.

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js Route Handlers (`app/api/*`) — this *is* the Node/Express
  layer; Next.js API routes run on Node and give you the same REST surface
  Express would, without a second server to deploy/manage. If you'd rather run
  a standalone Express server, the `/models` and `/lib/db.ts` /
  `/lib/cloudinary.ts` files are framework-agnostic and drop straight into one.
- **Database:** MongoDB via Mongoose (`/models`)
- **Images:** Cloudinary (`/lib/cloudinary.ts`, `/app/api/upload`)
- **Payment:** Cash on Delivery only for now. `Order.paymentMethod` is typed
  as `"cod"` deliberately narrow — widen it to `"cod" | "card" | "edahabia"`
  and add a provider call in `/app/api/orders/route.ts` when you're ready to
  add online payment. Nothing else needs to change.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in MONGODB_URI, Cloudinary keys, admin login
npm run dev
```

The site runs and looks complete on mock data (`/lib/mock-data.ts`) even
before you connect a database — this is what powers the shop, product pages,
cart, and checkout UI out of the box so you can review the design immediately.

All storefront pages (home, boutique, product detail, collections) go
through `lib/data.ts`, which checks whether MongoDB is actually connected:
if it's not, you see the mock catalog; the moment `MONGODB_URI` is set and
products exist in the database, the exact same pages switch to showing your
real products automatically — no code changes needed. Product photos work
the same way: `components/ui/ProductImage.tsx` shows the real Cloudinary
photo when a product has one, and falls back to a stylized placeholder when
it doesn't.

### Connecting real data

1. Create a free MongoDB Atlas cluster, grab the connection string into
   `MONGODB_URI`.
2. Create a free Cloudinary account, put the cloud name / API key / API
   secret into the three `CLOUDINARY_*` vars.
3. Either run `npm run seed` to push the starter mock catalog into MongoDB
   as a starting point, or just add your own products/categories through
   `/admin` — either way, the storefront picks them up immediately.

### Admin panel

The admin panel is fully separate from the storefront — it lives at `/admin`
and every page under it requires a real login (bcrypt-hashed password,
signed session cookie). There's deliberately no public signup form; you
provision your own account from the command line:

```bash
cp .env.example .env.local
# fill in MONGODB_URI and a random ADMIN_SESSION_SECRET (openssl rand -base64 48)
# then set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in .env.local, then:
npm run create-admin
```

That's the only way to create an admin account — re-run it any time to
change the password (it upserts by email). Then log in at `/admin`.

What you can do from the dashboard:
- **Categories** (`/admin/collections`) — create, edit, delete product
  categories with a cover image. Deleting a category is blocked if products
  still reference it, so the storefront never links to an empty category.
- **Products** (`/admin/products`) — create/edit with Cloudinary image
  upload, per-size stock editing, price, description, featured/new flags.
- **Orders** (`/admin/orders`) — see every order as it comes in, filter by
  status, and move each one through the flow (confirm → shipped →
  delivered), or cancel — cancelling automatically restocks the items.
- **Settings** (`/admin/settings`) — the "Livraison à domicile" and
  "Retrait au bureau" prices shown at checkout live here, plus an optional
  free-shipping threshold. Changing them takes effect immediately, no
  redeploy needed.
- **Inventory** (`/admin/inventory`) — read-only stock overview across all
  products, with a shortcut to each product's edit page.
- **Customers** (`/admin/customers`) — built automatically from order data.

All of the write endpoints (`POST`/`PATCH`/`DELETE` on products, collections,
orders, settings, and image upload) check the signed session server-side —
they return 401 if you're not logged in, regardless of what the frontend
shows.

## Project structure

```
app/
  page.tsx                  Homepage
  boutique/                 Shop with live search + filters
  produit/[slug]/           Product detail
  collections/, collections/[slug]/
  lookbook/, notre-histoire/, contact/
  checkout/                 Guest checkout (no account required)
  admin/                    Login + protected dashboard
  api/
    products/, products/[slug]/   Product CRUD
    orders/                       Create + list orders (stock-safe)
    upload/                       Cloudinary image upload
    admin/login, admin/logout
components/
  layout/    Header, Footer
  home/      Hero, LatestDrop, StreetStories, LookbookPreview, Community, Newsletter
  product/   ProductCard, ProductDetail
  shop/      ShopFilters
  cart/      CartDrawer (sliding cart, Zustand-backed)
  admin/     AdminSidebar
  ui/        Stamp, ImagePlaceholder, RevealOnScroll, CustomCursor, GrainOverlay, LoadingScreen
lib/
  db.ts            Mongoose connection (cached across invocations)
  cloudinary.ts    Upload/delete helpers
  mock-data.ts     Starter catalog, matches the real schema exactly
  store/cart.ts    Zustand cart store (persisted to localStorage)
models/            Mongoose schemas: Product, Order, Collection, AdminUser
types/index.ts     Shared TypeScript types (frontend + API)
scripts/seed.ts    Pushes mock-data into MongoDB
```

## Design system

- **Colors:** Ink `#0A0A0A` (bg), Bone `#F5F3EF` (text), Signal Red `#E10600`
  (accent only), Ash `#8A8A87`, Concrete `#1A1A18`, Sand `#D9D4C7`.
- **Type:** Anton (display, large uppercase headlines), Inter (body),
  IBM Plex Mono (labels, prices, SKUs, coordinates — the "tag" language of
  streetwear).
- **Signature motif — The Stamp:** the oval customs-stamp shape from the
  O.W.A logo is reused throughout as a UI device (`components/ui/Stamp.tsx`)
  — "Nouveau" badges, the loading screen mark, the 404 page — instead of a
  generic pill or ribbon.
- **Coordinates device:** `35.6969°N · 0.6331°W — WAHRAN` (Oran's real
  coordinates) appears as a recurring eyebrow/footer detail, grounding the
  brand geographically the way a passport stamp or customs tag would.
- Product photography is currently a generated placeholder
  (`components/ui/ImagePlaceholder.tsx`) — swap for real photography via
  Cloudinary uploads in the admin panel; the aspect ratios and grain treatment
  are already tuned to drop real photos in without layout shift.

## What's still ahead

Still open: coupon codes that apply real discount rules (the cart/checkout
UI has the field, but no backend validation yet) and wishlist persistence
beyond the current browser session. Ask and I'll build these next.
