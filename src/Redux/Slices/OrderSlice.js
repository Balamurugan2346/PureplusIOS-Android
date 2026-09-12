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
      console.log("err", err)
      onError && onError(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


//Get Order Detailed
export const getOrderDetailed = createAsyncThunk(
  "order/getOrderDetailed",
  async ({ id, onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await OrderRepository.getOrderDetailed(id);
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
      onError && onError(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// get all  orders
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async ({ onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await OrderRepository.getAllOrders();
      console.log("response", response)
      const result = response?.data ?? response;
      if (onSuccess) onSuccess(result);
      return result
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// get current Order
export const getCurrentOrder = createAsyncThunk(
  "order/getCurrentOrder",
  async ({ onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await OrderRepository.getCurrentOrder();
      console.log("response", response)
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
      console.log("response", response)
      const result = response?.data ?? response;
      if (onSuccess) onSuccess(result);
      return result
    } catch (err) {
      onError && onError(err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const placeOrderSubscription = createAsyncThunk(
  "order/placeOrderSubscription",
  async ({ body, onSuccess, onError }, { rejectWithValue }) => {
    try {
      const response = await OrderRepository.placeOrderSubscription(body);
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
    subscriptionPlans: [],
    subscriptionLoading: false,
    subscriptionError: null,

    placeOrder: {
      isLoading: false,
      error: null,
    },

    orderDetailed: {
      isLoading: false,
      isFetched: false,
      data: {},
      error: null
    },

    orderHistoryList: {
      isLoading: false,
      isFetched: false,
      data: {},
      error: null
    },

    currentOrder: {
      isLoading: false,
      isFetched: false,
      data: {},
      error: null
    }


  },

  reducers: {
    clearOrderDetailed: (state) => {
      state.orderDetailed = {
        isLoading: false,
        isFetched: false,
        data: {},
        error: null
      }
    }
  },

  extraReducers: (builder) => {
    builder

      .addCase(getSubscriptionPlans.pending, (state) => {
        state.subscriptionLoading = true;
        state.subscriptionError = null;
      })

      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        state.subscriptionPlans = action.payload || [];
      })

      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.subscriptionError = action.payload || "Something went wrong";
      })
      .addCase(placeOrderSubscription.pending, (state) => {
        state.subscriptionLoading = true;
        state.subscriptionError = null;
      })

      .addCase(placeOrderSubscription.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
      })

      .addCase(placeOrderSubscription.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.subscriptionError = action.payload || "Something went wrong";
      })


      .addCase(placeOrder.pending, (state) => {
        state.placeOrder.isLoading = true;
        state.placeOrder.error = null;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeOrder.isLoading = false;
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.placeOrder.isLoading = false;
        state.placeOrder.error = action.payload || "Something went wrong";
      })

      //get order detailed state handling

      .addCase(getOrderDetailed.pending, (state) => {
        state.orderDetailed.isLoading = true;
        state.orderDetailed.error = null;
      })

      .addCase(getOrderDetailed.fulfilled, (state, action) => {
        state.orderDetailed.isLoading = false;
        state.orderDetailed.data = action.payload;
        state.orderDetailed.isFetched = true
      })

      .addCase(getOrderDetailed.rejected, (state, action) => {
        state.orderDetailed.isLoading = false;
        state.orderDetailed.error = action.payload || "Something went wrong";
      })


      //get all orders list

      .addCase(getAllOrders.pending, (state) => {
        state.orderHistoryList.isLoading = true;
        state.orderHistoryList.error = null;
      })

      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orderHistoryList.isLoading = false;
        state.orderHistoryList.data = action.payload;
        state.orderHistoryList.isFetched = true
      })

      .addCase(getAllOrders.rejected, (state, action) => {
        state.orderHistoryList.isLoading = false;
        state.orderHistoryList.error = action.payload || "Something went wrong";
      })


      .addCase(getCurrentOrder.pending, (state) => {
        state.currentOrder.isLoading = true;
        state.currentOrder.error = null;
      })

      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        state.currentOrder.isLoading = false;
        state.currentOrder.data = action.payload;
        state.currentOrder.isFetched = true
      })

      .addCase(getCurrentOrder.rejected, (state, action) => {
        state.currentOrder.isLoading = false;
        state.currentOrder.error = action.payload || "Something went wrong";
      });
  }
});

export const { clearOrderDetailed } = orderSlice.actions;
export default orderSlice.reducer;



//get order detailed api
// {
//     "success": true,
//     "data": {
//         "orderId": 89,
//         "items": [
//             {
//                 "productName": "Pure Water",
//                 "quantity": 1,
//                 "price": 0.00,
//                 "uom": "Can",
//                 "orderedQuantity": 1,
//                 "freeQuantity": 0,
//                 "unitPrice": 0.00,
//                 "taxPercentage": 5.00,
//                 "taxAmount": 0.00,
//                 "totalLineAmount": 0.00,
//                 "imageUrls": [
//                     "https://pub-bc52404892e64ea583c2f008e7b721e0.r2.dev/products/0705d958-ff63-49e8-8b59-3db2f0b707d4.png"
//                 ]
//             }
//         ],
//         "totalAmount": 150.00,
//         "deliveryStatus": "Pending",
//         "orderDate": "2026-03-11T07:20:45.58664",
//         "deliveryAddress": "PRN Wedding hall Parking, Vandalur, Tamil Nadu - 603211",
//         "history": [
//             {
//                 "status": "Pending",
//                 "updatedAt": "2026-03-11T07:20:45.58664",
//                 "remarks": "Order Placed Successfully"
//             }
//         ],
//         "subTotal": 0.00,
//         "taxAmount": 0.00,
//         "depositAmount": 150.00,
//         "deliveredUnits": 1
//     }
// }
