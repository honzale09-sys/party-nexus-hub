# 1BIGPARTY

You are building a full multi-page website + admin dashboard web app for a Prague-based party/event hosting company called “ONE BIG PARTY”.

GOAL
- Public website: premium nightlife brand presence + event discovery + ticket buying + merchandise shop
- Admin/CRM dashboard: manage events, ticket tiers/pricing, poster uploads, merch products (photos/prices/stock), and view orders/customers.

TECH + ARCHITECTURE
- Build as a proper website (NOT a single landing page).
- Use a modern stack supported by this builder: responsive, fast, SEO-friendly.
- Include authentication for admin panel (admin login). Public pages do not require login.
- Store data in a database (events, ticket types, orders, customers, products, inventory, promo codes).
- Stripe for payments (tickets + merch).
- After ticket purchase: generate a unique QR code per ticket, stored with order, and email the QR to buyer.
- Admin can scan/validate tickets at the door (QR scanner page in admin panel) and mark as used.
- Use clean URL structure, dynamic routing for event pages.
- Ensure GDPR-friendly basics (privacy policy, cookie notice, terms).

BRAND + STYLE
- Name: ONE BIG PARTY
- Location: Prague, CZ
- Vibe: premium club/nightlife, dark luxury (black/charcoal backgrounds), neon accents (electric blue/purple), minimal but energetic, smooth animations.
- Typography: modern sans, bold headings, high contrast.
- Imagery: party/nightclub visuals, event posters, crowd lights.
- UI: card-based event listing, strong CTA buttons, sticky nav, animated hover states.

SITE MAP (PUBLIC)
1) Home (overview)
2) About Us
3) Parties / Events (list + filters)
4) Event Detail (dynamic page per event)
5) Tickets (can be combined with events, but also provide tickets hub)
6) Merchandise (e-shop)
7) Contact
8) FAQ
9) Legal: Terms, Privacy Policy, Refund Policy

NAVIGATION
Top nav: Home, Parties, Tickets, Merch, About, Contact
Footer: FAQ, Terms, Privacy, Refund policy, Social links

PUBLIC PAGES — REQUIRED CONTENT

HOME
- Hero: “Prague’s Biggest Nights. ONE BIG PARTY.”
- Subheadline: “Limited capacity. Verified tickets. No second chances.”
- Primary CTA: “View Parties”
- Secondary CTA: “Buy Tickets”
- Section: Next Event (featured) with poster thumbnail, date, venue, from-price, CTA “Get Tickets”
- Section: Upcoming Parties (carousel/grid)
- Section: How it works (Choose event → Pay → Get QR → Show at entry)
- Section: Merch teaser (3 featured products)
- Section: Testimonials (placeholders)
- Section: FAQ preview
- Newsletter signup (optional)

ABOUT US
- Story/mission: host high-energy, safe, premium parties across Prague
- Values: quality venues, curated lineups, smooth entry, customer support
- Team section (placeholder cards)
- Press/partners logos (placeholder)

PARTIES / EVENTS (LIST PAGE)
- Filters: date (upcoming/past), venue, price range, category (club/rooftop/warehouse/theme)
- Sorting: soonest, price low→high, popular
- Each event card: poster image, title, date/time, venue, short tagline, from-price, CTA “Details”

EVENT DETAIL (DYNAMIC)
Fields to display:
- Poster image (full)
- Title
- Date & time (include timezone)
- Venue name + address + embedded map link
- Age restriction (e.g., 18+)
- Dress code (optional)
- Lineup/DJs (optional)
- Description: full text
- Capacity indicator (optional: % sold)
- Ticket tiers (list with price + remaining count)
- CTA: “Buy Tickets”
- Additional info blocks: Entry rules, Refund policy excerpt, Contact support
- Gallery (optional placeholders)

TICKETS (HUB)
- Explain ticket types + QR entry
- List upcoming events with “Buy tickets”
- Ticket FAQ
- “Resend my ticket” form (enter email + order ID → send again)

MERCHANDISE (E-SHOP)
- Product grid with filters: category (tees/hoodies/accessories), sizes, price range
- Product detail page:
  - multiple images
  - description
  - sizes/variants
  - stock status
  - quantity
  - add to cart
- Cart + checkout via Stripe
- Order confirmation page

CONTACT
- Contact form + business email + socials
- Support hours
- “Order help” quick links

FAQ
- Tickets, entry, refunds, age, lost QR, merch sizing/shipping

LEGAL
- Terms, Privacy, Cookie notice, Refund policy (ticket + merch)


ADMIN / CRM DASHBOARD (PROTECTED)
Create /admin login and dashboard.

ADMIN NAV
- Dashboard overview
- Events
- Tickets & Orders
- Customers
- Merch Products
- Inventory
- Promo Codes
- Door Scanner (QR validation)
- Settings

1) DASHBOARD OVERVIEW
- KPIs: total revenue (tickets/merch), tickets sold, upcoming events count, low stock products
- Latest orders list
- Quick actions: “Create Event”, “Add Product”

2) EVENTS MANAGEMENT (CRUD)
Admin can:
- Create new event
- Edit existing event
- Duplicate event
- Publish/unpublish event
Event fields (must be editable):
- Title
- Slug (auto from title)
- Date/time
- Venue name
- Venue address
- Map link
- Category/tags
- Age restriction
- Dress code
- Short tagline
- Full description (rich text)
- Poster upload (image file)
- Gallery images upload (optional)
- Featured toggle (for homepage)
- Status: draft / published / archived

3) TICKET TIERS + PRICING
For each event, admin can manage ticket tiers:
- Tier name (Early Bird / Regular / VIP)
- Price (CZK)
- Quantity available
- Max per order
- Sales start/end dates (optional)
- Visibility toggle
- Automatically stop selling when sold out

4) ORDERS (TICKETS + MERCH)
Admin orders table:
- Order ID
- Customer name/email
- Items (ticket tiers or merch products)
- Amount paid
- Payment status
- Fulfillment status (for merch)
- Ticket status (issued / used / refunded)
- Timestamp
Actions:
- Resend ticket email
- Refund (Stripe)
- Mark merch as shipped (with tracking number field)
- Export CSV

5) CUSTOMERS CRM
Customer list with:
- Name (if captured)
- Email
- Phone (optional)
- Order count
- Total spent
- Tags/notes (manual)
Customer profile:
- all past orders
- resend tickets
- add note/tag

6) MERCH PRODUCTS (CRUD)
Admin can:
- Add/edit/delete products
- Upload/change product photos (multiple)
- Set product name, description
- Set price (CZK)
- Manage variants (size/color)
- Manage stock per variant
- Set featured products
- Set category
- Toggle active/inactive
- SKU field
- Weight/shipping class (optional)

7) INVENTORY
- Low stock alerts
- Stock change history log (who changed, when, delta)
- Bulk update stock

8) PROMO CODES
Admin can create promo codes:
- Code
- % or fixed discount
- Applies to tickets, merch, or both
- Valid date range
- Usage limit
- Minimum spend
- Per-customer limit

9) DOOR SCANNER (QR VALIDATION)
- A page optimized for mobile phone scanning:
  - Access device camera
  - Scan QR → verify in database
  - Show result: VALID / ALREADY USED / INVALID
  - If valid: mark as used + timestamp + event reference
- Search manual by order ID / email if QR fails

10) SETTINGS
- Stripe keys
- Business info
- Support email
- Social links
- Basic SEO defaults (title template, meta description template)

DATA MODELS (CREATE THESE TABLES)
- events
- ticket_tiers
- ticket_instances (unique QR per ticket)
- orders
- order_items
- customers
- products
- product_variants
- inventory_logs
- promo_codes
- admins (auth users)
- scans_logs

SECURITY + QUALITY
- Admin routes protected with auth + role (admin).
- Validate inputs, sanitize rich text, secure file uploads.
- Ensure responsive design everywhere.
- Include loading states, empty states, and error handling.
- Make UI feel premium with smooth micro-interactions.

DELIVERABLE
- Implement the full public website + admin dashboard with working CRUD, Stripe checkout, QR ticket generation + email delivery, and QR scanner validation.
- Provide seeded demo data (3 events, 3 ticket tiers each, 8 merch products with variants) so the site looks complete.

IMPORTANT
- This is not a one-page website.
- Build proper multi-page navigation, dynamic event pages, and the full admin panel requested.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://party-nexus-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7f3cf1e2-7084-4aeb-9615-68e7191d3fb6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
