import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderRepository } from "../../Repository/OrderRepository";


//Place Order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ body, onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await OrderRepository.placeOrder(body);
      const result = response?.data ?? response;
      if (onSuccess) onSuccess(result);
      return result
    } catch (err) {
      onError && onError(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const getRefillBalance = createAsyncThunk(
  "order/getRefillBalance",
  async ({ onSuccess, onError }, { rejectWithValue }) => {

    try {
      const response = await OrderRepository.getRefillBalance();
      const result = response?.data ?? response;
      if (onSuccess) onSuccess(result);
      return result
    } catch (err) {
      onError && onError(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// cancel order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async ({ id, onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await OrderRepository.cancelOrder(id);
      const result = response?.data ?? response;
      if (onSuccess) onSuccess(result);
      return result
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


//SUBSCRIPTION
export const getSubscriptionPlans = createAsyncThunk(
  "order/getSubscriptionPlans",
  async ({ onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await OrderRepository.getSubscriptionPlans();
      const result = response?.data ?? response;
      if (onSuccess) onSuccess(result);
      return result
    } catch (err) {
      onError && onError(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



const orderSlice = createSlice({
  name: "order",
  initialState: {
    subscription: {
      plans: [],
      loading: false,
      error: null
    }
  },

  extraReducers: (builder) => {
    builder

      // Pending
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.subscription.loading = true;
        state.subscription.error = null;
      })

      // Fulfilled
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.subscription.loading = false;
        state.subscription.plans = action.payload.data || [];
      })

      // Rejected
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.subscription.loading = false;
        state.subscription.error = action.payload || "Something went wrong";
      });
  }
})

export const { } = orderSlice.actions;
export default orderSlice.reducer;
