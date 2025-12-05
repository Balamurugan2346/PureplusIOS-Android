import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddressRepository } from "../../Repository/AddressRepository";

// SAVE ADDRESS
export const saveAddress = createAsyncThunk(
  "address/saveAddress",
  async (body, { rejectWithValue }) => {
    try {
      const response = await AddressRepository.saveAddress(body);

      return response?.data ?? response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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


export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const data = await AddressRepository.deleteAddress(id)
      return data
    } catch (e) {
      console.log("delete error from redux", e)
      return rejectWithValue(e.message)
    }
  }
)

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressList: [],
    selectedAddress: null,
    loading: false,
    error: null,
    isFetched: false,

    loadingDelete: false,
    deletedResponse: {},
    deleteApiError: null
  },
  reducers: {
    clearAddressState: (state) => {
      state.addressList = [];
      // state.selectedAddress = null;
      state.error = null;
      state.loading = false;
      state.isFetched = false;

      state.deleteApiError = null;
      state.loadingDelete = false;
      state.deletedResponse = {}
    },
    saveSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload
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
        state.selectedAddress = action.payload.addressId;
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
        state.addressList = action.payload.addressId;
        state.isFetched = true;
      })
      .addCase(getAddressList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      })


      ////// Delete Address //////
      .addCase(deleteAddress.pending, (state) => {
        state.loadingDelete = true;
        state.deleteApiError = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.deletedResponse = action.payload;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loadingDelete = false;
        state.deleteApiError = action.payload;
      });
  }
});

export const { clearAddressState, saveSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
