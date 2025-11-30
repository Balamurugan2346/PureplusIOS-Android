import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../Redux/Slices/ProductsSlice';
import AuthReducer from './Slices/AuthSlice';
import bannerReducer from './Slices/BannerSlice';
import AddressReducer from './Slices/AddressSlice'
import LocationReducer from './Slices/LocationSlice'

export const store = configureStore({
  reducer: {
    banners: bannerReducer,
    products : productsReducer,
    auth : AuthReducer,
    address:AddressReducer,
    locations:LocationReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
});
