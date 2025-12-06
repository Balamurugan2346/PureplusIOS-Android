import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CartRepository } from '../../Repository/CartRepository';

// Async Thunk to fetch cart items for a user
export const loadCartItems = createAsyncThunk(
  'cart/loadCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await CartRepository.getCartItems(userId);
      return data;
    } catch (err) {
      console.log('Error fetching cart items:', err);
      return rejectWithValue(err.message);
    }
  }
);

// Optional: add item to cart, remove, etc., can add more thunks here

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],      // all cart items
    loading: false,     // loading state for async operations
    error: null,        // error if any
    isFetched: false,   // flag to check if fetched at least once
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.loading = false;
      state.error = null;
      state.isFetched = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load Cart Items
      .addCase(loadCartItems.pending, (state) => {
        resetCartState(state);
        state.loading = true;
        state.isFetched = false;
      })
      .addCase(loadCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cartItems || []; // depends on API response structure
        state.isFetched = true;
      })
      .addCase(loadCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      });
  },
});

function resetCartState(state) {
  state.cartItems = [];
  state.loading = false;
  state.error = null;
  state.isFetched = false;
}

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
