import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddressRepository } from "../../Repository/AddressRepository";

// SAVE ADDRESS
export const saveAddress = createAsyncThunk(
  "address/saveAddress",
  async (body, { rejectWithValue }) => {
    try {
      const data = await AddressRepository.saveAddress(body);
      console.log("data from redux",data)
      return data;
    } catch (err) {
      console.log("saveAddress thunk error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// GET ADDRESS LIST 
export const getAddressList = createAsyncThunk(
  "address/getAddressList",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await AddressRepository.getAllAddress(userId);
      return data;
    } catch (err) {
      console.log("getAddressList thunk error:", err);
      return rejectWithValue(err.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressList: [],
    selectedAddress: null,
    loading: false,
    error: null,
    isFetched: false
  },
  reducers: {
    clearAddressState: (state) => {
      state.addressList = [];
      state.selectedAddress = null;
      state.error = null;
      state.loading = false;
      state.isFetched = false;
    }
  },
  extraReducers: (builder) => {
    builder
      ////// SAVE ADDRESS //////
      .addCase(saveAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAddress = action.payload;
      })
      .addCase(saveAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      ////// GET ADDRESS LIST //////
      .addCase(getAddressList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isFetched = false;
      })
      .addCase(getAddressList.fulfilled, (state, action) => {
        state.loading = false;
        state.addressList = action.payload;
        state.isFetched = true;
      })
      .addCase(getAddressList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      });
  }
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;
