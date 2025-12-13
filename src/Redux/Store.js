import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from '../Redux/Slices/ProductsSlice';
import AuthReducer from './Slices/AuthSlice';
import bannerReducer from './Slices/BannerSlice';
import AddressReducer from './Slices/AddressSlice'
import LocationReducer from './Slices/LocationSlice'
import ProfileReducer from './Slices/ProfileSlice'
import CartReducer from './Slices/CartSlice'
import { LOGOUT } from './LogoutActions';


const appReducer = combineReducers({
  banners: bannerReducer,
  products: productsReducer,
  auth: AuthReducer,
  address: AddressReducer,
  locations: LocationReducer,
  profile: ProfileReducer,
  cart: CartReducer,
});


const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // 💣 Reset entire redux state
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// export const store = configureStore({
//   reducer: {
//     banners: bannerReducer,
//     products : productsReducer,
//     auth : AuthReducer,
//     address:AddressReducer,
//     locations:LocationReducer,
//     profile:ProfileReducer,
//     cart:CartReducer
//   },
//   devTools: process.env.NODE_ENV !== 'production',
// });
