import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CartRepository } from '../../Repository/CartRepository';

// Async Thunk to fetch cart items for a user
export const loadCartItems = createAsyncThunk(
  'cart/loadCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await CartRepository.getCartItems();
      return data;
    } catch (err) {
      console.log('Error fetching cart items:', err);
      return rejectWithValue(err.message);
    }
  }
);

// addTOCart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ cart, onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await CartRepository.addToCart(cart);
      console.log('cart added in slice', response);
      // If API returns { data: {...} }
      const result = response?.data ?? response;

      if (onSuccess) onSuccess(result);

      return result;
    } catch (err) {
      if (onError) onError(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// updateCart
export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async ({ cart, onSuccess, onError }, { rejectWithValue }) => {
    try {
      console.log("cart going to api", cart)
      const response = await CartRepository.updateCart(cart);
      console.log('cart updated in slice', response);
      // If API returns { data: {...} }
      const result = response?.data ?? response;

      if (onSuccess) onSuccess(result);

      return result;
    } catch (err) {
      if (onError) onError(err)
      return rejectWithValue(err.response?.data || err.message);
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

    cartUpdateLoading: false,
    cartUpdateError: null,
    cartUpdateFetched: false
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.loading = false;
      state.error = null;
      state.isFetched = false;
      state.cartUpdateLoading = false,
        state.cartUpdateFetched = false,
        state.cartUpdateError = null
    },

    // ✅ UI ONLY: Add item to cart (no API)
    addItemLocal: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity ?? 1;
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity ?? 1,
        });
      }
    },

    // ✅ UI ONLY: Remove item from cart (no API)
    removeItemLocal: (state, action) => {
      const productId = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Cart Items
      .addCase(loadCartItems.pending, (state) => {
        // resetCartState(state);
        state.loading = true;
        state.isFetched = false;
      })
      .addCase(loadCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.data.items || []; // depends on API response structure
        state.isFetched = true;
      })
      .addCase(loadCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      })



      // update Cart Items
      .addCase(updateCart.pending, (state) => {
        state.cartUpdateLoading = true;
        state.cartUpdateFetched = false;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cartUpdateLoading = false;
        state.cartUpdateFetched = true;

        //UI OPTIMIZED BUT NO NEED
        // const updatedItem = action.payload;

        // const index = state.cartItems.findIndex(
        //   (item) => item.id === updatedItem.id
        // );

        // if (index !== -1) {
        //   state.cartItems[index].quantity = updatedItem.quantity;
        // }
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.cartUpdateLoading = false;
        state.cartUpdateError = action.payload;
        state.cartUpdateFetched = false;
      })



      // add Cart Items
      .addCase(addToCart.pending, (state) => {
        state.cartUpdateLoading = true;
        state.cartUpdateFetched = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartUpdateLoading = false;
        state.cartUpdateFetched = true;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartUpdateLoading = false;
        state.cartUpdateError = action.payload;
        state.cartUpdateFetched = false;
      });
  },
});

function resetCartState(state) {
  state.cartItems = [];
  state.loading = false;
  state.error = null;
  state.isFetched = false;

  state.cartUpdateLoading = false,
    state.cartUpdateFetched = false,
    state.cartUpdateError = null
}

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
