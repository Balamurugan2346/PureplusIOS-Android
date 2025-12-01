import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LocationRepository } from '../../Repository/LocationRepository';

export const decodeAddress = createAsyncThunk(
  'locations/decodeAddress',
  async ({ lat, long }, { rejectWithValue }) => {
    try {
      console.log("before sending to repo", "lat", lat, "lonh", long)
      const data = await LocationRepository.getAddress(lat, long);
      console.log("from thubk", data)
      return data
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const locationSlice = createSlice({
  name: 'locations',
  initialState: { display_name: "",address_line1 : "",address_line2 : "", address: {}, isFetched: false, loading: false, error: null, entireGEOData: {} },
  reducers: {
    clearDecodedAddress: (state) => {
      state.list = {};
      state.error = null;
      state.loading = false;
      state.isFetched = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(decodeAddress.pending, (state) => {
        state.loading = true;
        state.isFetched = false
      })
      .addCase(decodeAddress.fulfilled, (state, action) => {
        state.loading = false;

        const feature = action.payload?.features?.[0];
        const props = feature?.properties;

        state.display_name = props?.formatted || "";
        state.address_line1 = props?.address_line1 || "";
        state.address_line2 = props?.address_line2 || "";
        state.address = props || {}
        state.entireGEOData = action.payload || {};
        state.isFetched = true
      })
      .addCase(decodeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false
      });
  },
});

export const { clearDecodedAddress } = locationSlice.actions;
export default locationSlice.reducer;
