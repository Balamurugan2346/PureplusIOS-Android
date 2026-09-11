# PurePlus Customer App — API Integration Status

> **What "integrated" means here:** a screen calls the correct backend endpoint, sends a payload whose **field names match the backend schema**, and renders the real response. A service-layer file alone is **NOT** integration. This report grades every feature on that bar.
>
> Verified: `2026-08-17`, Metro bundle **exit 0**, field names checked against the live Swagger (`https://pureplusapp.in/swagger`).

## Legend
| Mark | Meaning |
|---|---|
| ✅ **Live** | Wired end-to-end, fields match backend, exercised in the running app |
| ⚠️ **Fixed — verify** | Was mismatched; corrected this session; confirm on device |
| 🟡 **Wired — unverified** | Screen calls the API but the **response shape is guessed**; needs a real-data pass |
| ⬜ **Not built** | No working integration yet |

---

## 1. The place-order failure — root cause & fix

**Error seen:** `400 · "We don't deliver to this area yet"` (now shown in the toast).

**How the backend resolves serviceability (your question):** it is a **pincode string lookup — no geocoding math, no lat/long, no haversine.**
`ResolveByAddressAsync(addressId)` → reads the address's **`pincode`** column → matches it against the `store_service_area` table (one pincode → one store). If the address has no pincode → *"address has no pincode"*; if no store claims that pincode → *"We don't deliver to this area yet."* The lat/long that Geoapify returns is used **only** to pre-fill the address text/pincode in the UI — the backend never uses coordinates for serviceability. (Haversine **is** used elsewhere — driver check-in geofencing — but not for customer serviceability.)

**Why it failed:** the address form saved `pinCode` / `FloorNo` / `hasLift`, but the backend `AddressRequest` expects **`pincode` / `floorNo` / `lift`**. So every saved address had a **null pincode** → serviceability always failed. **Fixed** (payload now maps to the correct names).

**To make it work now (two steps):**
1. **Re-save your address** so it stores a real `pincode` (old rows still have null).
2. Ensure that pincode is registered to a live store in **`store_service_area`** (admin data). If it isn't, you'll still get "we don't deliver here" — that's correct behavior, not a bug. Seed your test pincode (e.g. `600001`) to your store.

---

## 2. Field-match audit (app payload vs backend schema)

The crux of "is it really integrated." Checked against Swagger.

| Flow | Endpoint | Backend expects | App was sending | Status |
|---|---|---|---|---|
| Place order | `POST /orders/place` | addressId, deliveryType, slotId, deliveryDate, depositAmount, paymentMode | same (ids now `Number()`) | ✅ (unblocked by address fix) |
| Add to cart | `POST /cart/add` | productId, quantity | productId, quantity | ✅ match |
| Save/Update address | `POST/PUT /address` | **pincode, floorNo, lift** | ~~pinCode, FloorNo, hasLift~~ | ⚠️ **Fixed** → verify |
| Create bulk request | `POST /bulk-requests` | **requestType, productId, quantity, requestedDate, addressId, gstin, eventDetails** | ~~purpose, requiredDate, venueAddress, contactPerson, notes~~ | ⚠️ **Fixed** → verify |
| Create service request | `POST /service-requests` | category, **description**, orderId?, productId?, addressId? | ~~category, notes~~ | ⚠️ **Fixed** (notes→description) |
| Create profile | `POST /profile` | fullName, email | fullName, email | ✅ match |
| OTP send / verify | `.../send-otp`, `verify-otp` | {mobileNumber}, {mobileNumber, otp} | same | ✅ match |
| Create subscription | `POST /subscription` | productId, addressId, quantity, frequency, startDate | *(create UI not built)* | ⬜ |

---

## 3. Integration status by feature

### A. Live / working (the app you built — legacy Redux + services)
| Feature | Screen | Endpoint | Status |
|---|---|---|---|
| Login / OTP | Login, OtpVerification | send-otp, verify-otp | ✅ |
| Profile | Profile, EditProfile | GET/PUT /profile | ✅ |
| Home catalog | Dashboard | GET /products (getallproduct) | ✅ |
| Banners | Dashboard | GET /Banner | ✅ |
| Cart | CartScreen, CartButton | GET /cart, POST /cart/add | ✅ |
| Address book | AddressScreen | GET /address, POST/PUT/DELETE | ✅ (⚠️ pincode fix applies) |
| Slots | ScheduleDelivery | GET /delivery/slots | ✅ (labels opaque — W-05) |
| Orders | MyOrders, OrderDetailed, OrderTracking | GET /orders, /current, /{id} | ✅ |
| Place order | CartScreen | POST /orders/place | ⚠️ was blocked by address; fixed |
| Support | CustomerSupport | GET /CustomerSupport | ✅ |
| Location/geocode | Dashboard, Address | Geoapify (client-side) | ✅ (moves to backend later) |

### B. New screens added this session — **wired but response-shape unverified**
These call the correct endpoint via the class-service layer; they **render defensively** because the backend response fields aren't documented in Swagger (only 200 OK). Each needs one real-data pass to confirm field names.

| Screen | Endpoint | Status | Note |
|---|---|---|---|
| Wallet | GET /wallet | 🟡 | reads `balance`/`ledger` with fallbacks |
| My Cans | GET /refill/balance | 🟡 | reads `cansHeld`/`depositPaid` w/ fallbacks |
| Billing | GET /subscription | 🟡 | derives unbilled from subscriptions |
| Manage Subscription | /subscription + pause/resume/cancel | 🟡 | actions correct; list fields guessed |
| Bulk request (create) | POST /bulk-requests | ⚠️ **Fixed** | payload now matches CreateBulkRequest |
| Bulk status (list) | GET /bulk-requests | 🟡 | list item fields guessed |
| Service request | POST/GET /service-requests | ⚠️ **Fixed** | create fixed; list fields guessed |
| Certification | GET /stores/{id}/certification | 🟡 | needs a real storeId + field confirm |
| Notifications | /notifications (+read) | 🟡 | reads title/body/isRead w/ fallbacks |

> **This is the gap you noticed on bulk.** The screens were built ahead of confirmed response contracts. The *requests* are now correct; the *response rendering* still needs verifying against live data (rename the fallback fields to the real ones once seen).

### C. Not built / not integrated
| Feature | Screen (CUS) | What's needed |
|---|---|---|
| Modify order | CUS-19 | screen + wire (edit while PLACED) |
| Order-for-someone-else | CUS-29 | receiver fields in checkout + recipient-store re-resolve |
| Live order tracking (map position) | CUS-16 | driver position feed + map |
| Wallet payment / Razorpay | CUS-24 / payment | vendor-gated (Razorpay keys) |
| Create subscription (real) | CUS-21 | build create form → POST /subscription (fields above) |
| Refill order flow UI | CUS-25 area | wire /refill/validate + /refill/place |

---

## 4. Priority TODO (recommended order)

1. **Unblock ordering:** re-save address (pincode) + seed the test pincode into `store_service_area`; confirm place-order succeeds end-to-end. *(code done — data + verify)*
2. **Verify the new screens against real data** (Tier B): open each, read the actual JSON, replace the guessed field names. Start with **Bulk** and **Wallet**.
3. **Build the missing create flows:** Create Subscription (CUS-21), Refill (CUS-25).
4. **Modify order (CUS-19)** + **Order-for-someone-else (CUS-29)**.
5. Vendor-gated last: Razorpay (payment), FCM (push send), backend Google Maps (geocoding).

---

## 5. Verification done this session
- Metro bundle: **exit 0** (all screens compile + imports resolve).
- Field audit vs Swagger: place-order ✅, cart ✅, profile ✅, OTP ✅; address ⚠️→fixed, bulk ⚠️→fixed, service-request ⚠️→fixed.
- Serviceability logic read from backend source (`ServiceabilityService.cs`): pincode-only.
- **Not done:** on-device run against live API to confirm Tier-B response shapes.
