import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderRepository } from "../../Repository/OrderRepository";


//Place Order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({body,onSuccess,onError}, { rejectWithValue }) => {
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


// cancel order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async ({id,onSuccess,onError}, { rejectWithValue }) => {
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



const orderSlice = createSlice({
  name: "order",
  initialState: {
    
  },
});

export const { } = orderSlice.actions;
export default orderSlice.reducer;
