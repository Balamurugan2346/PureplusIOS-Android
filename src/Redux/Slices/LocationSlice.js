import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LocationRepository } from '../../Repository/LocationRepository';

export const decodeAddress = createAsyncThunk(
  'locations/decodeAddress',
  async ({ lat, long }, { rejectWithValue }) => {
    try {
      const data = await LocationRepository.getAddress(lat, long);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const decodeCurrentLocationAddress = createAsyncThunk(
  'locations/decodeCurrentLocationAddress',
  async ({ lat, long }, { rejectWithValue }) => {
    try {
      const data = await LocationRepository.getAddress(lat, long);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const autoCompleteAddress = createAsyncThunk(
  'locations/autoCompleteAddress',
  async (query, { rejectWithValue }) => {
    try {
      const data = await LocationRepository.autoCompleteAddress(query);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    display_name: "",
    address_line1: "",
    address_line2: "",
    address: {},
    pinCode:'',
    city:'',
    state:'',
    entireGEOData: {},
    isFetched: false,
    loading: false,
    error: null,

    // Autocomplete
    autoList: [],
    autoLoading: false,
    autoError: null,

    //current location display address for dashboard only
    currentLocationFormattedAddress:"",
    currentLocationAddressLoading:false,
    currentLocationAddressFetched:false
  },
  reducers: {
    clearDecodedAddress: (state) => {
      state.display_name = "";
      state.address_line1 = "";
      state.address_line2 = "";
      state.address = {};
      state.entireGEOData = {};
      state.isFetched = false;
      state.loading = false;
      state.error = null;
      state.pinCode = ''
      state.state = ''
      state.city = ''
    },
      
    clearCurrentLocationFormattedAddres:(state,action)=>{
      state.currentLocationFormattedAddress = ''
    },
    saveCurrentLocationFormattedAddress:(state,action)=>{
      state.currentLocationFormattedAddress = action.payload
    },
    clearAutoComplete: (state) => {
      state.autoList = [];
      state.autoLoading = false;
      state.autoError = null 
    }
  },
  extraReducers: (builder) => {
    builder

      // DECODE ADDRESS
      .addCase(decodeAddress.pending, (state) => {
        state.loading = true;
        state.isFetched = false;
      })
      .addCase(decodeAddress.fulfilled, (state, action) => {
        state.loading = false;

        const feature = action.payload?.features?.[0];
        const props = feature?.properties;

        state.display_name = props?.formatted || "";
        state.address_line1 = props?.address_line1 || "";
        state.address_line2 = props?.address_line2 || "";
        state.pinCode = props?.postcode || "";
        state.city = props?.city || "";
        state.state = props?.state || "";
        state.address = props || {};
        state.entireGEOData = action.payload || {};
        state.isFetched = true;
      })
      .addCase(decodeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      })


      // DECODE ADDRESS
      .addCase(decodeCurrentLocationAddress.pending, (state) => {
        state.currentLocationAddressLoading = true;
        state.currentLocationAddressFetched = false;
      })
      .addCase(decodeCurrentLocationAddress.fulfilled, (state, action) => {
        state.currentLocationAddressLoading = false;

        const feature = action.payload?.features?.[0];
        const props = feature?.properties;

        state.currentLocationFormattedAddress = props?.formatted || "";
        state.currentLocationAddressFetched = true;
      })
      .addCase(decodeCurrentLocationAddress.rejected, (state, action) => {
        state.currentLocationAddressLoading = false;
        state.error = action.payload;
        state.currentLocationAddressFetched = false;
      })

      // AUTOCOMPLETE
      .addCase(autoCompleteAddress.pending, (state) => {
        state.autoLoading = true;
      })
      .addCase(autoCompleteAddress.fulfilled, (state, action) => {
        state.autoLoading = false;
        state.autoList = action.payload?.features || [];
      })
      .addCase(autoCompleteAddress.rejected, (state, action) => {
        state.autoLoading = false;
        state.autoError = action.payload;
      });
  },
});

export const { clearDecodedAddress, clearAutoComplete ,saveCurrentLocationFormattedAddress , clearCurrentLocationFormattedAddres} = locationSlice.actions;
export default locationSlice.reducer;
