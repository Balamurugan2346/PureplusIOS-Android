# PurePlus Customer App — UI/UX Redesign Plan

> **Created 2026-10-10.** Captured now because the app context (screen map, components, theme tokens,
> concrete layout problems) is freshest in-session. This is a **layout + UX** plan — **the darkSea color
> theme and Lexend font stay**. Scope: the customer RN app only (not DP).
>
> Companion: `MOBILE_INTEGRATION_STATUS.md` (API truth), `DESIGN_SYSTEM.md` (tokens), `CLAUDE.md` (arch).
> This session already shipped: slot-button collision fix, Bulk/Service/Support de-dup, product-card
> redesign, geocoding code (dormant), CUS-33 account deletion. The items below are the **remaining**
> redesign backlog.

## 0. Keep (non-negotiable)
- **Colors:** `darkSea` theme in `Context/ThemeContext.jsx` / `Themes/Themes.js`. Consume via `useTheme()`.
- **Font:** Lexend (`assets/fonts/Fonts.js`) — `Fonts.family.{regular,medium,semiBold,bold}`, `Fonts.size.*`.
- **IA decisions locked this session:** Dashboard quick-actions = transactional only (Orders, Subscriptions,
  Refill, Bulk/Event). Services & Support (Service Requests, Help & Support) live in **Profile**. Bulk
  *create* = Dashboard; Bulk *track* ("My Bulk Requests") = Profile.

## 1. Current app context (for whoever picks this up)

**Navigation** (`src/Navigation/AppNavigator.jsx`): one flat native stack; bottom tab (`MainBottomNav.jsx`)
= Dashboard · Cart · MyOrders · Notification. Entry via `ActivityEntry.js` (GetStarted/Login/DashBoard).

**Key screens & components:**
- Dashboard `Screens/Main/Dashboard.jsx` — header (avatar + title + bell), AddressBar, banner carousel,
  `TagData` quick-action row, product rail (`Components/Product/ProductCard1.jsx`), ViewCartButton,
  OrderTracking, address bottom sheet.
- Cart (checkout) `Screens/Product/CartScreen.jsx` — delivery-time/slot row, CartItems, address/pay bar,
  "order for someone else", OrderSummary, PaymentSection.
- Profile `Screens/Main/ProfileScreen.jsx` — profile card, MY ACCOUNT list, SERVICES & SUPPORT (new),
  SETTINGS, delete account, logout.
- Others: DetailedProductScreen, SheduleDeliveryScreen, Address, Wallet, MyCans, Billing, Subscriptions
  (Manage/Create), Bulk (Request/Status), ServiceRequest, CustomerSupport, Notifications, Orders
  (list/detail/track/success), Refill, Certification.

**Theme tokens available** (per `DESIGN_SYSTEM.md`): `spacing`, `radius`, `typography`, `fontFamily` on the
theme object. New shared components exist: `NavScreen`, `AppText`, `StateView`, `PriceBreakdown`,
`StatusBadge`.

## 2. Problems observed (the "why")

1. **Inconsistent theming** — several screens hardcode hex instead of `useTheme()`. The worst offender is
   `ProfileScreen.jsx` (hardcoded `#0C1C2C`, `#F4F6FA`, `#4A90E2`, etc.) — it won't track the darkSea theme
   and diverges from the rest of the app. **Highest-value cleanup.**
2. **No shared spacing/radius scale in practice** — screens use ad-hoc `margin/padding` numbers
   (10/12/14/16/20) inconsistently; cards don't align to a grid. Tokens exist but aren't used everywhere.
3. **Inconsistent screen shells** — some screens use `TopAppBar`, some roll their own header
   (Profile's dark header vs Dashboard's rounded header vs `NavScreen`). No single screen scaffold.
4. **Layout fragility on wide/large widths** — the slot-button collision (fixed this session) was a symptom:
   rows use `space-between` without `flex`/`flexShrink`, so long content overlaps. Likely repeats elsewhere
   (address bars, order rows, summary rows). Needs a sweep.
5. **Dashboard density & hierarchy** — product rail is horizontal-only (limits discovery), the quick-action
   tag row competes visually with products, banners are large. Hierarchy between "find products" and
   "manage account" is muddy.
6. **Component inconsistency** — buttons/cards/inputs styled per-screen (e.g. receiver inputs, pay button,
   list rows) rather than from one kit. `AppText`/`NavScreen`/`StateView` exist but aren't used widely.
7. **Empty/loading/error states** — ad-hoc (`AppLoading` overlay, inline text). `StateView` exists; adopt it.

## 3. Redesign principles (layout only; colors fixed)

- **One 4-pt spacing scale** (`4/8/12/16/24/32`) and **one radius scale** (`8/12/16/20`). Replace ad-hoc
  numbers. Put them on the theme (`spacing`, `radius`) and use everywhere.
- **One screen scaffold** — adopt `NavScreen` (TopAppBar + safe-area padded body) for every non-tab screen;
  standardize the tab-screen header. Kill bespoke headers.
- **Flex-safe rows** — any `row + space-between` gets `flex:1`/`flexShrink:1` on the growable side and
  `flexShrink:0` on the action, with single-line ellipsis for labels. Apply the pattern used in the slot-row
  fix across address bars, order rows, summary lines.
- **One component kit** — standardize `PrimaryButton`/`SecondaryButton`, `Card`, `ListRow`, `Input`, `Chip`,
  `SectionHeader` (all theme-driven, Lexend). Migrate screens onto them.
- **Typographic hierarchy** — define and use `title / section / body / caption / price` roles from
  `Fonts.size` consistently; stop per-screen font sizes.
- **Consistent states** — `StateView` for loading/empty/error on every data screen.

## 4. Screen-by-screen backlog (priority order)

| # | Screen(s) | Redesign work | Priority |
|---|---|---|---|
| 1 | **ProfileScreen** | Move all hardcoded hex → `useTheme()`; adopt `NavScreen` + section/list-row components; align cards to the spacing scale. | **High** (theme divergence) |
| 2 | **Dashboard** | Rework hierarchy: compact sticky header + AddressBar, slimmer banner, quick-actions as a tidy row/grid, products as the hero (consider a 2-col grid section below the rail for discovery). Flex-safe header + AddressBar. | **High** |
| 3 | **CartScreen / Checkout** | Standardize section cards (delivery, items, address, someone-else, summary, pay) onto one card + spacing scale; sticky pay bar; flex-safe rows throughout. | **High** |
| 4 | **DetailedProductScreen** | Clear image gallery, pack/price hierarchy matching the new product card, prominent qty stepper + add-to-cart, MOQ messaging. | Medium |
| 5 | **Orders (list/detail/track)** | One order-row component + `StatusBadge`; canonical status→label map; timeline polish. | Medium |
| 6 | **Address + bottom sheet** | Consistent form inputs, flex-safe address rows, clearer selected state; prep for the Google-geocoding manual-entry fallback. | Medium |
| 7 | **Tier-B list screens** (Wallet, MyCans, Billing, Subscriptions, Bulk, ServiceRequest, Notifications, Certification) | One list/detail template + `StateView`; standard section headers; verify + bind real response fields (see status doc). | Medium |
| 8 | **Auth (Login/OTP), GetStarted** | Spacing/typography polish, consistent inputs + primary button. | Low |

## 5. Suggested phasing
- **R1 — Foundation:** finalize spacing/radius/typography tokens + the component kit (`Button/Card/ListRow/
  Input/Chip/SectionHeader`) + adopt `NavScreen`/`StateView`. No screen looks different yet; the kit exists.
- **R2 — High-traffic screens:** ProfileScreen (de-hardcode), Dashboard, Checkout onto the kit.
- **R3 — Secondary:** Orders, Address, Detailed product.
- **R4 — Tier-B list screens** (pairs with the on-device API verification pass).
- **R5 — Polish:** auth/onboarding, empty/error states, micro-interactions.

Each phase: keep darkSea colors, verify with the Metro bundle (`npx react-native bundle … --bundle-output …`,
exit 0), and spot-check on a device.

## 6. Done this session (for continuity)
- ✅ Slot-button collision fixed (flex-safe delivery-time row) — `CartScreen.jsx`.
- ✅ Bulk/Service/Support de-duplicated — Service & Support moved Dashboard→Profile (`TagData.js`,
  `ProfileScreen.jsx`).
- ✅ Product list-item card redesigned (layout + info hierarchy, colors unchanged) — `ProductCard1.jsx`.
- ✅ Google geocoding code written but dormant (Geoapify live) — `endpoints.js`, `modules/GeoService.js`,
  `Services/LocationService.js`.
- ✅ CUS-33 account deletion wired (deletion-check → confirm → close → logout) — `AccountService.js`,
  `ProfileScreen.jsx`; `/account/*` + `/cans` endpoints added.
