export default {


  //GEOAPIFY
  REVERSEGEOCODER: 'reverse',
  AUTOCOMPLETEADDRESS: 'autocomplete',


  //OLD API'S NEED TO DELETE
  GETPRODUCTBYID: '/Product/GetProductDetailsById',



  //currently working
  GETALLBANNERS: 'api/Banner/GetAllBannerDetails',


  //product
  GETALLPRODUCTS: 'api/customer/products/getallproduct',


  //address
  CREATEADDRESS: 'api/customer/address',
  GETALLUSERADDRESS: 'api/customer/address',
  UPDATEADDRESS: 'api/customer/address',
  DELETEADDRESS: "api/customer/address",


  //currently working auths
  GETOTP: 'api/customer/auth/send-otp',
  VERIFYOTP: 'api/customer/auth/verify-otp',
  REFRESHTOKEN: 'api/customer/auth/refresh-token',
  CREATEPROFILE: 'api/customer/profile',

  //profile
  GETUSERPROFILE: 'api/customer/profile',
  UPDATEUSERPROFILE: 'api/customer/profile',

  //CART  (verified against backend CustomerCartRepository.cs)
  // NOTE: the app's updateCart thunk always sends an ABSOLUTE quantity and is used for the
  // FIRST add too (CartButton sends quantity:1 on a not-yet-in-cart item). `cart/add`
  // (CustomerAddAsync) is absolute-set + upsert + delete-at-0 — the only endpoint that
  // handles all three (first-add / set-quantity / remove). `cart/update-quantity` THROWS
  // "Cart item not found" on a missing line, so it must NOT be used for add.
  GETCART: 'api/customer/cart',
  CARTCOUNT: 'api/customer/cart/count',
  ADDTOCART: 'api/customer/cart/add',    // POST { productId, quantity } — upsert (absolute)
  UPDATECART: 'api/customer/cart/add',   // same upsert endpoint; sending 0 removes the line
  REMOVEFROMCART: 'api/customer/cart/remove',  // DELETE /remove/{id}

  //Shedule-order
  GETALLSLOTS: 'api/customer/delivery/slots',


  //Deposit
  CALCULATE_DEPOSIT: 'api/customer/deposit/calculate',


  //Order
  ORDER_PLACE: 'api/customer/orders/place',
  CANCEL_ORDER: 'api/customer/orders/cancel',
  ORDER_DETAILED: 'api/customer/orders',
  GET_ALL_ORDERS: 'api/customer/orders',
  GET_CURRENT_ORDER : 'api/customer/orders/current',


  //refill
  REFILL_BALANCE: 'api/customer/refill/balance',
  refill_validate: 'api/customer/refill/validate',

  //subscription
  GETSUBSCRIPTIONPLANS: 'api/customer/subscription',
  PLACESUBSCRIPTIONORDER: 'api/customer/subscription',
  CUSTOMER_SUPPORT: 'api/CustomerSupport'   // route casing fixed (was 'api/customerSupport')
};
