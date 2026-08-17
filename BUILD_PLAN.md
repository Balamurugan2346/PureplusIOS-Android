# PurePlus Customer App — Build Plan (module by module)

> **Goal:** finish the React Native customer app to the full 34-screen spec, on a clean, refactored foundation, wired to the live backend (`https://pureplusapp.in`). Built in phases; each phase is shippable and testable on its own.
>
> **Decisions (senior defaults, stated so we move fast):**
> - **Language:** stay **JavaScript/JSX** (codebase is 100% JS; a mid-build TS migration isn't worth the churn). Use JSDoc + Zod-style runtime guards where a shape matters.
> - **Refactor in place** — fix the existing API layer, don't fork a parallel one.
> - **Theme:** keep `darkSea` canonical; add typography/spacing tokens (DESIGN_SYSTEM.md §3–4).
> - **State:** keep Redux Toolkit for cross-screen state (auth, cart, address/store, orders); use local state for screen-only concerns.
> - **API contract:** the authoritative reference is `../../pureplus_docs/PurePlus_API_Reference.pdf` + live Swagger. Endpoint→screen map in `Customer_App_Build_Guide_RN.md`.

---

## Architecture (target)

```
src/
├─ api/
│  ├─ client.js         # axios instance + interceptors (refactor of API/Client.js)
│  ├─ endpoints.js      # ALL paths, grouped, single source (refactor of API/EndPoint.js)
│  ├─ http.js           # thin wrapper: unwraps {success,data,message}, typed errors (NEW)
│  └─ services/         # one class per domain (OOP): AuthService, CatalogService, CartService,
│                       #   OrderService, WalletService, SubscriptionService, BulkService,
│                       #   ServiceRequestService, NotificationService, GeoService …
├─ Themes/  Context/    # theme tokens + provider (extend)
├─ Redux/Slices/        # auth, cart, storeScope, orders, wallet, notifications
├─ Components/          # shared UI (+ AppText, PriceBreakdown, StatusBadge, ScreenContainer)
├─ Screens/             # per-module screens
└─ Utils/               # formatCurrency, validators, errorMap, tokenStore
```

**OOP service pattern** (every domain service):
```js
class OrderService {
  place(payload)      { return http.post(endpoints.order.place, payload); }
  current()           { return http.get(endpoints.order.current); }
  canCancel(id)       { return http.get(endpoints.order.canCancel(id)); }
  cancel(id)          { return http.post(endpoints.order.cancel(id)); }
}
export default new OrderService();
```
Services return **unwrapped data** or throw a typed `ApiError` — screens never touch `res.data.data`.

---

## Phase 0 · Get it running (0.5 day)
- `npm install`; create `.env` (base URL, keys placeholders); `npx react-native run-android`.
- Confirm the app boots against `https://pureplusapp.in`.
- **Exit:** app launches, splash → login renders.

## Phase 1 · Foundation refactor (2–3 days) — *starting now*
The API layer has real bugs; fix them before building features on top.

| Task | Why |
|---|---|
| **`http.js` wrapper** — unwrap `{success,data,message}`, throw typed `ApiError`, handle **429** (OTP rate limit) distinctly | Screens stop digging into `res.data.data`; consistent errors |
| **Refactor `client.js`** — fix refresh flow (uses **access token as refresh token** today + references an **undefined `refreshClient`**), implement the refresh **queue** (already stubbed but unused), real **logout on refresh failure**, gate verbose logging behind `__DEV__` (currently logs Authorization headers) | Correctness + security |
| **Rebuild `endpoints.js`** — group by domain, remove dead/`OLD API'S NEED TO DELETE`, fix `customerSupport`→`CustomerSupport`, add missing (serviceability, checkout estimate, wallet, notifications, bulk, service-requests, lifecycle cancel, certification) | Complete + correct surface |
| **`tokenStore` util** — store **accessToken + refreshToken separately** | Fixes the refresh bug at the source |
| **Design tokens** — add `typography`, `spacing`, `radius`, semantic colors + correct aliases (`tertiary`, `textForGlass`) to `Themes.js`; add `AppText` + `ScreenContainer` | DESIGN_SYSTEM.md §3–4 |
| **Service base + first services** — `AuthService`, `CatalogService` refactored onto `http.js` | Template for all modules |

**Exit:** login/OTP works on the new client; 429 handled; one catalog call flows through a service. No feature regressions.

## Phase 2 · Auth & onboarding (2 days) — CUS-01..06, 33
Splash (token check) · Login (10-digit, 429 UX) · OTP (cooldown timer) · Profile create (name+email required) · Location permission · Profile screen (mobile not editable). Wire `AuthService`, `ProfileService`.

## Phase 3 · Store resolution rework (2–3 days) — **CUS-07, 08, 28** (highest priority)
- **CUS-07:** drop Geoapify + hardcoded warehouse list; map pin → backend reverse-geocode → pincode → `GET /api/serviceability/resolve` → bind store or "not serviceable". Manual-pincode fallback.
- **CUS-08:** capture **floor + lift**; send `floor_no`, `lift`, receiver name/phone.
- **CUS-28:** address book; each address re-resolves its store; switching re-validates cart.
- `GeoService`, `AddressService`, `storeScope` slice.

## Phase 4 · Catalog → Cart → Checkout (3–4 days) — CUS-10..15
Home (store-scoped catalog) · Product detail (min-qty, reusable/disposable) · Cart (use `/checkout/estimate` + `PriceBreakdown`) · Slots (opaque labels) · Checkout (**pay-at-delivery framing, no payment**) · Order success. `CatalogService`, `CartService`, `OrderService`.

## Phase 5 · Orders lifecycle (2–3 days) — CUS-16..20
Tracking (timeline, ETA) · Order detail/history · Modify (while PLACED) · Cancel (lifecycle `/{id}/cancel` + `can-cancel` gate). `StatusBadge`.

## Phase 6 · Money & assets (3–4 days) — CUS-23, 24, 25, 30, 31
Billing/postpaid (overdue-block UX) · Wallet (`/wallet`, coverage) · My Cans · Certification · Service request. `WalletService`, `ServiceRequestService`.

## Phase 7 · Subscription & bulk (3–4 days) — CUS-21, 22, 26, 27, 29
Create subscription (postpaid opt-in framing) · Manage (pause/skip/resume/cancel — real, not the current product list) · Bulk/Event request + status · Order-for-someone-else. `SubscriptionService`, `BulkService`.

## Phase 8 · Notifications & polish (2 days) — CUS-34, 09
Notification center (`/notifications`, unread badge) · FCM token register (send is vendor-gated) · skeletons/empty/error states everywhere · money formatting · QA pass.

## Phase 9 · Vendor-gated finish (as keys land)
OTP SMS (MSG91), push (FCM), maps (Google Maps), payment (Razorpay). Logic built earlier; flips on with keys.

---

## Sequencing notes
- **Phase 3 is the top-value rework** — nothing downstream is correct until an address resolves to a real store.
- Phases 4–7 are independent modules; can parallelize if two devs.
- Every phase: reuse existing `Components/`; add to shared kit only when reused ≥2×.
- Definition of done per screen: loading + empty + error states, theme tokens only, service-layer calls (no inline axios), 429/overdue/ASSIGNED-lock handled where relevant.
