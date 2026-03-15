import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BannerRepoitory } from '../../Repository/BannerRepository';
import { clear } from 'react-native/types_generated/Libraries/LogBox/Data/LogBoxData';

export const loadBanners = createAsyncThunk(
  'banners/loadBanners',
  async (_, { rejectWithValue }) => {
    try {
      const data = await BannerRepoitory.getBanners();
      return data
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const loadCustomerSupportDetails = createAsyncThunk(
  'banners/loadCustomerSupportDetails',
  async (_, { rejectWithValue }) => {
    try {
      const data = await BannerRepoitory.getCustomerSupportDetails();
      return data
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: { list: [], loading: false, error: null, isFetched: false, customerSupportData: {}, customerSupportLoading: false, customerSupportError: null , isCustomerSupportFetched : false },
  reducers: {
    clearBanners: (state) => {
      state.list = [];
      state.error = null;
      state.loading = false;
      state.isFetched = false
    },
    clearCustomerSupportDetails: (state) => {
      state.customerSupportData = {};
      state.customerSupportError = null;
      state.customerSupportLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBanners.pending, (state) => {
        state.loading = true;
        state.isFetched = false
      })
      .addCase(loadBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.jsonData;
        state.isFetched = true
      })
      .addCase(loadBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false
      })

      .addCase(loadCustomerSupportDetails.pending, (state) => {
        state.customerSupportLoading = true;
        state.customerSupportError = null;
        state.isCustomerSupportFetched
      })
      .addCase(loadCustomerSupportDetails.fulfilled, (state, action) => {
        state.customerSupportLoading = false;
        state.customerSupportData = action.payload;
        state.isCustomerSupportFetched = true
      })
      .addCase(loadCustomerSupportDetails.rejected, (state, action) => {
        state.customerSupportLoading = false;
        state.customerSupportError = action.payload;
        state.isCustomerSupportFetched = false
      });
  },
});

export const { clearBanners , clearCustomerSupportDetails } = bannerSlice.actions;
export default bannerSlice.reducer;
