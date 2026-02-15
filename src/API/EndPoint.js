export default {


  //GEOAPIFY
  REVERSEGEOCODER: 'reverse',
  AUTOCOMPLETEADDRESS: 'autocomplete',


  //OLD API'S NEED TO DELETE
  GETPRODUCTBYID: '/Product/GetProductDetailsById',



  //currently working
  GETALLBANNERS: 'api/Banner/GetAllBannerDetails',


  //product
  GETALLPRODUCTS: 'api/customer/products',


  //address
  CREATEADDRESS: 'api/user/address',
  GETALLUSERADDRESS: 'api/user',
  DELETEADDRESS: "api/user/address",


  //currently working auths
  GETOTP: 'api/customer/auth/send-otp',
  VERIFYOTP: 'api/customer/auth/verify-otp',
  CREATEPROFILE: 'api/customer/profile',

  //profile
  GETUSERPROFILE: 'api/customer/profile',
  UPDATEUSERPROFILE: 'api/customer/profile',

  //CART
  GETCART: 'api/customer/cart',
  ADDTOCART: 'api/customer/cart',  // no need
  UPDATECART: 'api/customer/cart/add',

  //Shedule-order
  GETALLSLOTS:'api/customer/delivery/slots'
  

};
