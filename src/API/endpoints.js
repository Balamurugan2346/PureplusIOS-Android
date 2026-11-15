/**
 * Single source of truth for backend paths, grouped by domain.
 * Functions take path params so call sites never string-concat.
 *
 * Reference: pureplus_docs/PurePlus_API_Reference.pdf + live Swagger at <BASE_URL>/swagger.
 * Replaces the flat src/API/EndPoint.js (kept until all screens migrate here).
 */

const endpoints = {
  auth: {
    sendOtp: 'api/customer/auth/send-otp',       // { mobileNumber } -> { otp (demo), message, expiresAt }
    verifyOtp: 'api/customer/auth/verify-otp',   // { mobileNumber, otp } -> { success, isNewUser, token, user }
    refreshToken: 'api/customer/auth/refresh-token', // { token } -> { success, token }
  },

  profile: {
    get: 'api/customer/profile',
    create: 'api/customer/profile',
    update: 'api/customer/profile',
  },

  // CUS-33 account closure (dues-gated). deletion-check previews blockers; DELETE closes (409 if blocked).
  account: {
    deletionCheck: 'api/customer/account/deletion-check',
    remove: 'api/customer/account',
  },

  // Geocoding will go through the BACKEND (Google Maps, metered) instead of Geoapify.
  // Serviceability is live today (local DB lookup, NO Google call).
  //
  // GOOGLE GEOCODING — code is fully wired in GeoService.reverseGeocode/forwardGeocode but kept
  // DORMANT: the backend endpoints below are NOT built yet and there is no paid Google plan, so the
  // app still uses Geoapify (src/API/Services/LocationService.js) for the demo. To go live:
  //   1) backend ships GET /api/customer/geo/reverse + /forward (see projectdocuments/04_Google_Maps_Geocoding.md)
  //   2) owner adds a billing-enabled, IP-restricted Google Geocoding key (server-side)
  //   3) swap LocationService's Geoapify calls for GeoService.* (the commented block in that file)
  //      and delete the Geoapify key + MapClient.
  geo: {
    serviceabilityResolve: (pincode) => `api/serviceability/resolve?pincode=${encodeURIComponent(pincode)}`,
    reverseGeocode: (lat, lng) => `api/customer/geo/reverse?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`, // lat/lng -> {formattedAddress, pincode, city, state}
    forwardGeocode: (address) => `api/customer/geo/forward?address=${encodeURIComponent(address)}`,                           // typed address -> {lat, lng, pincode, ...}
  },

  address: {
    list: 'api/customer/address',
    create: 'api/customer/address',
    update: 'api/customer/address',
    remove: (id) => `api/customer/address/${id}`,
  },

  catalog: {
    products: 'api/customer/products',
    productById: (id) => `api/customer/products/${id}`,
    allProducts: 'api/customer/products/getallproduct',
    banners: 'api/Banner/GetAllBannerDetails',
  },

  cart: {
    get: 'api/customer/cart',
    count: 'api/customer/cart/count',
    add: 'api/customer/cart/add',
    updateQty: 'api/customer/cart/update-quantity',
    validate: 'api/customer/cart/validate',
    applyFirstOffer: 'api/customer/cart/apply-first-offer',
    remove: (id) => `api/customer/cart/remove/${id}`,
  },

  checkout: {
    estimate: 'api/customer/checkout/estimate',
    estimateWithWallet: 'api/customer/checkout/estimate-with-wallet',
  },

  delivery: {
    slots: 'api/customer/delivery/slots',
  },

  order: {
    place: 'api/customer/orders/place',
    list: 'api/customer/orders',
    current: 'api/customer/orders/current',
    byId: (id) => `api/customer/orders/${id}`,
    isFirst: 'api/customer/orders/is-first',
    track: (id) => `api/customer/orders/track/${id}`,
    eta: (id) => `api/customer/orders/eta/${id}`,
    invoice: (id) => `api/customer/orders/invoice/${id}`, // NOTE: backend stub (hardcoded URL) for now
    modify: (id) => `api/customer/orders/${id}`,           // PUT — change slot/date while PLACED
    canCancel: (id) => `api/customer/orders/${id}/can-cancel`,
    cancel: (id) => `api/customer/orders/${id}/cancel`,   // lifecycle cancel (ASSIGNED-lock + ownership)
  },

  subscription: {
    list: 'api/customer/subscription',
    create: 'api/customer/subscription',
    pause: (id) => `api/customer/subscription/${id}/pause`,
    resume: (id) => `api/customer/subscription/${id}/resume`,
    cancel: (id) => `api/customer/subscription/${id}/cancel`,
  },

  // CUS-25 My Cans — dedicated held-cans endpoint (prefer this over refill/balance for the My Cans screen).
  cans: {
    get: 'api/customer/cans', // { heldCans:[{productId, productName, held, depositPaid}], totalHeld, ... }
  },

  refill: {
    balance: 'api/customer/refill/balance',
    validate: 'api/customer/refill/validate',
    quote: 'api/customer/refill/quote',
    place: 'api/customer/refill/place',
  },

  deposit: {
    calculate: 'api/customer/deposit/calculate',
    update: 'api/customer/deposit/update', // NOTE: backend stub (hardcoded invoice URL)
  },

  wallet: {
    get: 'api/customer/wallet',
    coverage: (amount) => `api/customer/wallet/coverage?amount=${encodeURIComponent(amount)}`,
  },

  payment: {
    initiate: 'api/customer/payment/initiate', // Razorpay — vendor-gated
  },

  bulk: {
    create: 'api/customer/bulk-requests',
    list: 'api/customer/bulk-requests',
    byId: (id) => `api/customer/bulk-requests/${id}`,
    acceptCounter: (id) => `api/customer/bulk-requests/${id}/accept-counter`,
    advance: (id) => `api/customer/bulk-requests/${id}/advance`,
    confirm: (id) => `api/customer/bulk-requests/${id}/confirm`,
    cancel: (id) => `api/customer/bulk-requests/${id}/cancel`,
  },

  serviceRequest: {
    create: 'api/customer/service-requests',
    list: 'api/customer/service-requests',
    byId: (id) => `api/customer/service-requests/${id}`,
    cancel: (id) => `api/customer/service-requests/${id}/cancel`,
  },

  certification: {
    byStore: (storeId) => `api/customer/stores/${storeId}/certification`,
  },

  notifications: {
    list: 'api/customer/notifications',
    unreadCount: 'api/customer/notifications/unread-count',
    markRead: (id) => `api/customer/notifications/${id}/read`,
    readAll: 'api/customer/notifications/read-all',
  },

  support: {
    get: 'api/CustomerSupport', // fixed casing (was 'api/customerSupport')
  },
};

export default endpoints;
