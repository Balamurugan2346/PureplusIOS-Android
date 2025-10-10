import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProductRepository } from '../../Repository/ProductRepository';

export const loadProducts = createAsyncThunk(
  'products/loadproducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ProductRepository.getProducts();
      return data
    } catch (err) {
      console.log('from thunk error', err)
      return rejectWithValue(err.message);
    }
  }
);


export const getDetailedProducts = createAsyncThunk(
  'products/getDetailedProducts',
  async (id, { rejectWithValue, getState }) => {
    try {
      const data = await ProductRepository.GetProductById(id)
      return data
    } catch (e) {
      return rejectWithValue(err.message)
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    productList: [],
    loading: false,
    selectedProduct: {},
    error: null,
    isFetched: false
  },
  reducers: {
    clearProducts: (state) => {
      state.productList = [];
      state.error = null;
      state.loading = false;
      state.isFetched = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        resetProductState(state);
        state.loading = true;
        state.isFetched = false;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload;
        state.isFetched = true;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      })

      .addCase(getDetailedProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(getDetailedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload
      })

      .addCase(getDetailedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedProduct = {}
      })
  },
});


function resetProductState(state) {
  state.productList = [];
  state.error = null;
  state.loading = false;
  state.isFetched = false;
}


export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
