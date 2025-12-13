export default {


  //GEOAPIFY
   REVERSEGEOCODER:'reverse',
   AUTOCOMPLETEADDRESS:'autocomplete',


   //OLD API'S NEED TO DELETE
  SENDMOBILENUMBER:'/Auth/UserLog',
  LOGIN: '/Auth/OTP',
  REGISTER: '/auth/register',
  USER_PROFILE: '/users/profile',
  PRODUCTS: '/products',
  POSTS:'/posts',
  GETALLPRODUCTS:'/Product/get-active-products',
  GETPRODUCTBYID:'/Product/GetProductDetailsById',

  //currently working
    GETALLBANNERS:'/Banner/GetAllBannerDetails',

    CREATEORDERADDRESS:'/EndUser/create-order-delivery-address',
    CREATEADDRESS:'/EndUser/create-customer-delivery-address',
    GETALLUSERADDRESS:'/EndUser/customer-delviery-addressess',
    DELETEADDRESS:"/EndUser/soft-delete-customer-address",


    //currently working auths
    GETOTP:'auth/send-otp',
    VERIFYOTP:'auth/verify-otp',
    CREATEPROFILE:'auth/create-user-profile',

    //profile
    GETUSERPROFILE:'user/profile',
    UPDATEUSERPROFILE:'auth/update-user-profile',

    //CART
    GETCART:'/EndUser/get-cart',
    ADDTOCART:'/EndUser/insert-multiple-cart-items',
    UPDATECART:'/EndUser/update-cart-items'

};
