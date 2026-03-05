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
  DELETEADDRESS: "api/customer/address",


  //currently working auths
  GETOTP: 'api/customer/auth/send-otp',
  VERIFYOTP: 'api/customer/auth/verify-otp',
  REFRESHTOKEN:'api/customer/auth/refresh-token',
  CREATEPROFILE: 'api/customer/profile',

  //profile
  GETUSERPROFILE: 'api/customer/profile',
  UPDATEUSERPROFILE: 'api/customer/profile',

  //CART
  GETCART: 'api/customer/cart',
  ADDTOCART: 'api/customer/cart',  // no need
  UPDATECART: 'api/customer/cart/add',

  //Shedule-order
  GETALLSLOTS:'api/customer/delivery/slots',
  

  //Deposit
  CALCULATE_DEPOSIT:'api/customer/deposit/calculate',


  //Order
  ORDER_PLACE:'api/customer/orders/place',
  CANCEL_ORDER:'api/customer/orders/cancel',  


  //refill
  REFILL_BALANCE: 'api/customer/refill/balance',
  refill_validate:'api/customer/refill/validate',

  //subscription
  GETSUBSCRIPTIONPLANS:'api/customer/subscription',
  PLACESUBSCRIPTIONORDER:'api/customer/subscription',
};
