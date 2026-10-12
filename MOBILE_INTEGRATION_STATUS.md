# PurePlus Customer App — API Integration Status

> **What "integrated" means here:** a screen calls the correct backend endpoint, sends a payload whose
> **field names match the backend schema**, and renders the real response. A service-layer file alone is
> **NOT** integration.
>
> **Re-verified 2026-10-10** against the backend as the single source of truth:
> `web/PurePlus/projectdocuments/handoff/{Customer-API.md, Customer-Payloads.md, API-Readiness.md}` and the
> Operations-Revamp docs. Earlier field audit was against live Swagger (`https://pureplusapp.in/swagger`,
> 2026-08-17). Metro bundle last **exit 0 on 2026-09-12**.

## Legend
| Mark | Meaning |
|---|---|
| ✅ **Live** | Wired end-to-end, fields match backend, exercised in the running app |
| 🟡 **Wired — unverified** | Screen calls the API but the **response shape is guessed / untested on device** |
| 🔵 **Built — backend blocked** | App code ready; backend endpoint not built or vendor-gated |
| ⬜ **Not built** | No working integration yet |

---

## 0. Headline (2026-10-10)

- **Customer app ≈ 78–80%.** Nearly all CUS-01..34 screens exist as compile-clean files; the remaining work
  is **verification against live API / on-device**, plus **three real gaps** (geocoding migration, live
  tracking read, push).
- **The backend Operations Revamp barely touches the customer app.** It reshaped the *driver/store* shift +
  reconciliation model (see the DP app's `STATUS.md`). Customer-facing contracts (auth, cart, checkout,
  orders, subscriptions, wallet, bulk, service requests, notifications) are **unchanged**. The only
  customer-relevant knock-ons: **canonical order-status labels** (W-07), **`501` on invoice/deposit
  documents** (handle, don't fake), and placement total still comes from the **CUS-12 estimate**
  (`OrderPricing:ComposeAtPlacement` is OFF in prod).
- **New this cycle (built 2026-09-12, compile-clean, unverified on device):** CUS-19 Modify Order, CUS-20
  Cancel, CUS-21 Create Subscription, CUS-25 Refill, CUS-29 Order-for-Someone-Else. The old version of this
  doc listed these as "not built" — **that is stale; they are built.**
- **Two API layers coexist:** new OOP `src/API/modules/*` (envelope-correct, drives Tier-B + new screens)
  and legacy functional `src/API/Services/*` + `Repository/*` + `EndPoint.js` (core flow: auth/cart/address/
  order/products/profile via Redux). Core-flow migration to the module layer is still pending.

---

## 0.1 Shipped this session (2026-10-10 code pass) — Metro bundle EXIT=0

- **Slot-button collision fixed** (`Screens/Product/CartScreen.jsx`) — the delivery-time row is now
  flex-safe (left label `flex:1`/`flexShrink:1` + single-line ellipsis; Schedule/Change button
  `flexShrink:0`), so a long scheduled-slot label can no longer overlap the button on wide/large widths.
- **Bulk / Service / Support de-duplicated** — "Service" (ServiceRequest) + "support" (CustomerSupport)
  removed from the Dashboard quick-actions (`Data/TagData.js`) and placed in **Profile → SERVICES & SUPPORT**
  (`Screens/Main/ProfileScreen.jsx`). Dashboard keeps transactional quick-actions only (Orders,
  Subscriptions, Refill, Bulk/Event). Bulk *create* = Dashboard; Bulk *track* = Profile ("My Bulk Requests").
- **Product list-item card redesigned** (`Components/Product/ProductCard1.jsx`) — layout + info hierarchy
  only (darkSea colors unchanged): taller image well, 2-line aligned title, clear "1 unit = N cans" pack
  chip, prominent per-unit price + quiet per-can, full "Add"/"Added" pill with in-cart state.
- **Google geocoding code written but DORMANT** (Geoapify stays live for the demo) — see §1.
- **CUS-33 account deletion wired** (`API/modules/AccountService.js` + `ProfileScreen.handleDeleteAccount`):
  deletion-check → show blockers / or confirm → `DELETE /account` → logout. Replaces the old dead stub.
- **API endpoints added:** `account.{deletionCheck,remove}` and `cans.get` (`/api/customer/cans`).

### API-integration audit (endpoints.js vs backend `handoff/Customer-API.md`)
Overall **well-aligned**. Findings:
- ✅ auth, profile, serviceability, products, cart, checkout, delivery/slots, orders (incl. modify/cancel/
  can-cancel), subscription, refill, deposit, wallet, bulk, service-requests, certification, notifications,
  support — all paths match the backend catalog.
- ⚠️ **My Cans (CUS-25):** backend has a dedicated `GET /api/customer/cans`; the app's My Cans screen still
  reads `/refill/balance`. The `cans.get` endpoint is now added — **remaining one-liner:** point the My Cans
  screen/service at `endpoints.cans.get`.
- ✅ **Account closure (CUS-33):** was missing from `endpoints.js` + the Profile action was a stub — **now
  added + wired** this session.
- Note: Refill & Subscription use the `{status,message,data}` envelope; `http.js` already unwraps both.

## 1. Google Maps geocoding migration (NEW — user-requested, replaces Geoapify)

**Goal:** stop calling Geoapify directly from the app; route geocoding through the **Pureplus backend**
(Google Maps Geocoding API) so we get a **human-readable formatted address + pincode** to attach to the
order — and so usage is metered/capped server-side. Spec: `web/PurePlus/projectdocuments/04_Google_Maps_Geocoding.md`.

**Current state of the code (2026-10-10 — swap wired but dormant):**
- The app **still calls Geoapify directly** for the demo: `src/API/Services/LocationService.js` →
  `src/API/MapClient.js` (`https://api.geoapify.com`, **hardcoded key `c182…68`**). Reverse-geocode
  (`getAddress`) + autocomplete (`autoCompleteAddress`) — **LIVE, unchanged**.
- The backend-Google path is now **fully written but DORMANT**: `src/API/endpoints.js` defines
  `geo.reverseGeocode(lat,lng)` + `geo.forwardGeocode(address)`; `src/API/modules/GeoService.js` has
  `reverseGeocode`/`forwardGeocode` methods; `LocationService.js` carries a commented **"GOOGLE BACKEND SWAP"**
  block showing the exact drop-in (same `getAddress`/`autoCompleteAddress` signatures). Nothing calls Google
  yet (no backend endpoint, no paid plan).
- **Backend endpoints `GET /api/customer/geo/reverse` + `/forward` are NOT built yet** (API-Readiness 2026-09-26:
  "Google Maps geocoding — not built server-side"; doc 04 is a design/implementation spec, Phase 8 vendor
  wiring). **This is the blocker.**

**Migration plan (two sides):**
1. **Backend (prerequisite):** implement `GeocodeController` (`/api/customer/geo/reverse?lat=&lng=` and
   `/forward?address=`) per doc 04 §4; obtain a **Google Cloud project + billing + Geocoding API key**,
   **IP-restricted** to the backend server; wire the metering backbone (provider `GOOGLE_MAPS`, 65k alert /
   70k hard cap). Response: `GeocodeResultDto {lat,lng,formattedAddress,pincode,city,state,success}` or
   `{success:false, fallback:"manual_entry"}`.
2. **App:** replace `LocationService.getAddress` → `GET /api/customer/geo/reverse` (pin drop on CUS-07) and
   the typed-address path → `GET /api/customer/geo/forward`; **delete the hardcoded Geoapify key + MapClient**;
   uncomment the `endpoints.js` geo block; on `{success:false, fallback:"manual_entry"}` show the CUS-07
   **manual pincode/address entry** path (the confirmed address text is authoritative). Serviceability stays
   a local DB lookup (`api/serviceability/resolve?pincode=`) — **no Google call**.

**Decision needed (autocomplete):** the app currently uses Geoapify **autocomplete** (`autoCompleteAddress`).
Google Geocoding API does **not** do autocomplete — that is **Places Autocomplete, a separate paid SKU**
(doc 04 §6 recommends a separate `GOOGLE_PLACES` meter). Options: **(a)** drop autocomplete, geocode the
full typed address via `/forward`; **(b)** add a backend `GOOGLE_PLACES` endpoint + meter and keep
autocomplete. Recommend **(a)** for v1 (cheapest; serviceability is pincode-only anyway).

---

## 2. Serviceability & the place-order path (unchanged, still data-gated)

Serviceability is a **pincode string lookup** against `store_service_area` (one pincode → one store) —
**no lat/long / haversine**. Google is used only to turn a pin/text into a **pincode + formatted address**.

Place-order succeeds only when: (1) the saved address stores a real **`pincode`** (the `pinCode`→`pincode`
field bug is fixed in the payload), and (2) that pincode is seeded into `store_service_area` for a live
store. Both are **data steps**, not code. Field-name fixes already applied: address
`pincode`/`floorNo`/`lift`; bulk `requestType`/`requestedDate`/`addressId`/`eventDetails`; service-request
`description`.

---

## 3. Integration status by feature (re-verified 2026-10-10)

### A. Core flow — live (legacy Redux + `src/API/Services/*`)
| Feature | Screen | Endpoint | Status |
|---|---|---|---|
| Login / OTP | Login, OtpVerification | `/api/customer/auth/send-otp`, `/verify-otp` | ✅ (SMS key-gated → demo OTP in response until MSG91) |
| Profile | Profile, EditProfile | `/api/customer/profile` GET/PUT | ✅ |
| Home catalog | Dashboard | `/api/customer/products` | ✅ |
| Banners | Dashboard | `/api/Banner/GetAllBannerDetails` | ✅ |
| Cart | CartScreen, CartButton | `/api/customer/cart`, `/cart/add` | ✅ |
| Address book | AddressScreen | `/api/customer/address` CRUD | ✅ (pincode fix applies; re-save old rows) |
| Slots | ScheduleDelivery | `/api/customer/delivery/slots` | ✅ (labels opaque — 3 slot models, W-05) |
| Checkout estimate | CartScreen | `/api/customer/checkout/estimate(-with-wallet)` | ✅ (**use this total** — composer OFF in prod) |
| Place order | CartScreen | `/api/customer/orders/place` | ✅ (unblocked by address fix + data seed) |
| Orders list/current/detail/track | MyOrders, OrderDetailed, OrderTracking | `/api/customer/orders`, `/current`, `/{id}`, `/track/{id}` | ✅ (status timeline only; no live map position) |
| Support | CustomerSupport | `/api/CustomerSupport` | ✅ |
| Geocode / autocomplete | Dashboard, Address | **Geoapify (client-side)** | ⚠️ **migrating to backend Google Maps — see §1** |

### B. New screens (built 2026-09-12) — compile-clean, **unverified on device**
| Screen | CUS | Endpoint | Status | Note |
|---|---|---|---|---|
| Modify Order | CUS-19 | `PUT /api/customer/orders/{id}` | 🟡 | Backend v1 changes **item quantities** while PLACED (not slot/date — reschedule not built backend-side). Confirm payload shape on device. |
| Cancel Order | CUS-20 | `/orders/{id}/can-cancel` + `/cancel` | 🟡 | Wired in `OrderDetailedScreen`, gated on backend `can-cancel` (PLACED / pre-ASSIGNED). IDOR fixed backend-side. |
| Create Subscription | CUS-21 | `POST /api/customer/subscription` | 🟡 | `{productId, addressId, quantity, frequency, startDate}`. |
| Refill | CUS-25 | `/refill/balance` · `/validate` · `/place` | 🟡 | Flow wired; verify response fields. |
| Order-for-Someone-Else | CUS-29 | receiver fields in place-order | 🟡 | `receiverName`/`receiverPhone` payload names **unconfirmed** vs Swagger; recipient-store re-resolve not enforced backend-side. |

### C. Tier-B — wired via `src/API/modules/*`, **response fields guessed / unverified on device**
| Screen | Endpoint | Status |
|---|---|---|
| Wallet (CUS-24) | `/api/customer/wallet` (+ `/coverage`) | 🟡 reads `balance`/`ledger` w/ fallbacks |
| My Cans (CUS-25) | `/api/customer/cans` *(or `/refill/balance`)* | 🟡 confirm which; held-cans + deposits |
| Billing / Postpaid (CUS-23) | `/api/customer/subscription` + postpaid ledger | 🟡 |
| Manage Subscription (CUS-22) | `/subscription` + pause/skip/resume/cancel | 🟡 actions correct; list fields guessed |
| Bulk status (CUS-27) | `/api/customer/bulk-requests` (+ accept/advance/confirm/cancel) | 🟡 list item fields guessed |
| Service request (CUS-31) | `/api/customer/service-requests` | 🟡 create fixed; list fields guessed |
| Certification (CUS-30) | `/api/customer/stores/{id}/certification` | 🟡 needs real storeId + field confirm |
| Notifications (CUS-34) | `/api/customer/notifications` (+ read/read-all) | 🟡 reads title/body/isRead w/ fallbacks |

### D. Not built / backend-blocked
| Feature | CUS | Blocker |
|---|---|---|
| Backend geocoding | CUS-07 | 🔵 `/api/customer/geo/*` **not built** + Google key not procured (§1) |
| Live order tracking (map position) | CUS-16 | 🔵 driver publishes GPS (`/api/delivery/me/location`) but there is **no customer-facing read** of live position (API-Readiness 🔴); status timeline only |
| Push notifications (delivery to device) | — | 🔵 **no device-token registration endpoint** + FCM vendor-gated → push can't reach a device yet |
| Reschedule (change slot/date on PLACED) | CUS-19 | 🔵 backend only changes **quantities**, not slot/date |
| Wallet payment / Razorpay | CUS-24 | 🔵 vendor-gated (Razorpay keys) |
| Invoice / deposit documents | CUS-17/deposit | 🔵 backend returns **`501`** (no PDF) — handle as "not available", never a fake link |

---

## 4. Priority TODO (recommended order)

1. **On-device verification pass** (the single biggest debt): re-save an address (real pincode) + seed that
   pincode into `store_service_area`; then run place-order end-to-end and walk every 🟡 screen against live
   data, renaming guessed response fields. Start with **Wallet, My Cans, Bulk, Subscription**.
2. **Confirm payload shapes** against Swagger: CUS-19 `PUT /orders/{id}` (quantities), CUS-29
   `receiverName`/`receiverPhone`.
3. **Google Maps geocoding migration (§1)** — gated on the backend building `/api/customer/geo/*` + a key.
   Until then keep Geoapify but plan the swap; remove the hardcoded key as part of it.
4. **Order-status labels:** map canonical `UPPER_SNAKE` values (`PLACED/ASSIGNED/OUT_FOR_DELIVERY/DELIVERED/
   CANCELLED/…`) to display labels; don't hard-filter on one literal (old rows may carry legacy spellings).
5. **Handle `501`** on invoice/deposit endpoints gracefully.
6. Vendor-gated last: Razorpay (payment), FCM + device-token registration (push), live-tracking read (CUS-16).

---

## 5. Verification status
- ✅ Metro bundle exit 0 (2026-09-12) — all screens compile + imports resolve.
- ✅ Field audit vs Swagger (2026-08-17): place-order/cart/profile/OTP match; address/bulk/service-request fixed.
- ✅ Serviceability logic confirmed pincode-only from backend source.
- ❌ **Not done:** on-device run against live API to confirm Tier-B + new-screen response shapes.
- ❌ **Not done:** Google Maps geocoding swap (backend endpoint missing).
