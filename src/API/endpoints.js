/**
 * Single source of truth for backend paths, grouped by domain.
 * Functions take path params so call sites never string-concat.
 *
 * Reference: pureplus_docs/PurePlus_API_Reference.pdf + live Swagger at <BASE_URL>/swagger.
 * Replaces the flat src/API/EndPoint.js (kept until all screens migrate here).
 */

const endpoints = {
  auth: {
    sendOtp: 'api/customer/auth/send-otp',       // { mobileNumber }
    verifyOtp: 'api/customer/auth/verify-otp',   // { mobileNumber, otp } -> { token, preAuthToken }
    refreshToken: 'api/customer/auth/refresh-token', // { token } -> { token }
  },

  profile: {
    get: 'api/customer/profile',
    create: 'api/customer/profile',
    update: 'api/customer/profile',
  },

  // Geocoding goes through the BACKEND now (not Geoapify). Confirm exact paths in Swagger
  // once the Google Maps backend endpoints (W-11) land; serviceability is live today.
  geo: {
    serviceabilityResolve: (pincode) => `api/serviceability/resolve?pincode=${encodeURIComponent(pincode)}`,
    // reverseGeocode: 'api/customer/geo/reverse',  // vendor-gated; manual pincode fallback until live
    // forwardGeocode: 'api/customer/geo/forward',
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

  refill: {
    balance: 'api/customer/refill/balance',
    validate: 'api/customer/refill/validate',
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
