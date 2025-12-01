import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BannerRepoitory } from '../../Repository/BannerRepository';

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

const bannerSlice = createSlice({
  name: 'banners',
  initialState: { list: [], loading: false, error: null, isFetched: false },
  reducers: {
    clearBanners: (state) => {
      state.list = [];
      state.error = null;
      state.loading = false;
      state.isFetched = false
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
      });
  },
});

export const { clearBanners } = bannerSlice.actions;
export default bannerSlice.reducer;
