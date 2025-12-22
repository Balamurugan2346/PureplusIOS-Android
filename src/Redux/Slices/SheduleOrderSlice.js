import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SheduleRepository } from '../../Repository/SheduleOrderRepository';

/**
 * Async thunk to load all available slots
 */
export const loadSheduleSlots = createAsyncThunk(
  'sheduleOrder/loadSheduleSlots',
  async (_, { rejectWithValue }) => {
    try {
      const data = await SheduleRepository.getAllSlots();
      return data;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to load slots');
    }
  }
);

const sheduleOrderSlice = createSlice({
  name: 'sheduleOrder',
  initialState: {
    slots: [],
    loading: false,
    error: null,
    isFetched: false,
  },
  reducers: {
    clearSheduleSlots: (state) => {
      state.slots = [];
      state.loading = false;
      state.error = null;
      state.isFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSheduleSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isFetched = false;
      })
      .addCase(loadSheduleSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload.cartItems; // response.data already returned
        state.isFetched = true;
      })
      .addCase(loadSheduleSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      });
  },
});

export const { clearSheduleSlots } = sheduleOrderSlice.actions;
export default sheduleOrderSlice.reducer;
