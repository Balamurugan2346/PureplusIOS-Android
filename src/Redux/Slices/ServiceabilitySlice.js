import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import GeoService from '../../API/modules/GeoService';

/**
 * Serviceability (CUS-07 / SA-06). The catalog is store-scoped and must be
 * resolved from the delivery address's pincode BEFORE products are shown:
 * one pincode -> one serving store, or "not serviceable yet". Ordering is
 * blocked for an unserviceable area (the backend also enforces this at
 * placement; this is the client-side gate so the user never gets that far).
 *
 * Backend: GET /api/serviceability/resolve?pincode=  ->
 *   { pincode, serviceable, storeId, storeName, storeArea, reason }
 */
export const resolveServiceability = createAsyncThunk(
  'serviceability/resolve',
  async (pincode, { rejectWithValue }) => {
    try {
      const data = await GeoService.resolveServiceability(pincode);
      return data;
    } catch (err) {
      return rejectWithValue(err?.message || 'Could not check serviceability');
    }
  }
);

const initialState = {
  loading: false,
  checked: false,       // has a resolve completed at least once?
  serviceable: null,    // null = unknown, true/false once checked
  storeId: null,
  storeName: null,
  storeArea: null,
  reason: null,         // why not serviceable (backend message)
  pincode: null,        // the pincode the current result is for
  error: null,
};

const serviceabilitySlice = createSlice({
  name: 'serviceability',
  initialState,
  reducers: {
    clearServiceability: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(resolveServiceability.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pincode = action.meta.arg;
      })
      .addCase(resolveServiceability.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.serviceable = !!action.payload?.serviceable;
        state.storeId = action.payload?.storeId ?? null;
        state.storeName = action.payload?.storeName ?? null;
        state.storeArea = action.payload?.storeArea ?? null;
        state.reason = action.payload?.reason ?? null;
        state.pincode = action.payload?.pincode ?? state.pincode;
      })
      .addCase(resolveServiceability.rejected, (state, action) => {
        state.loading = false;
        state.checked = true;
        // Fail-open on a check ERROR (network etc.) — don't hard-block the whole
        // catalog because the check couldn't run; the backend still guards placement.
        // A genuine "not serviceable" comes back as fulfilled with serviceable:false.
        state.serviceable = null;
        state.error = action.payload;
      });
  },
});

export const { clearServiceability } = serviceabilitySlice.actions;
export default serviceabilitySlice.reducer;
