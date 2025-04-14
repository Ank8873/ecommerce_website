import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  filters: {},
  sort: "price-lowtohigh"
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`
    );

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    updateFilters: (state, action) => {
      const { getSectionId, getCurrentOption } = action.payload;
      let updatedFilters = { ...state.filters };

      // Handle mutual exclusivity
      if (getSectionId === 'category') {
        delete updatedFilters['age'];
      } else if (getSectionId === 'age') {
        delete updatedFilters['category'];
      }

      // Handle adding/removing options
      if (!updatedFilters[getSectionId]) {
        updatedFilters[getSectionId] = [getCurrentOption];
      } else {
        const currentOptions = updatedFilters[getSectionId];
        const optionIndex = currentOptions.indexOf(getCurrentOption);

        if (optionIndex === -1) {
          if (getSectionId === 'category' || getSectionId === 'age') {
            updatedFilters[getSectionId] = [getCurrentOption];
          } else {
            updatedFilters[getSectionId].push(getCurrentOption);
          }
        } else {
          currentOptions.splice(optionIndex, 1);
          if (currentOptions.length === 0) {
            delete updatedFilters[getSectionId];
          }
        }
      }

      // Final mutual exclusivity check
      if (updatedFilters['category'] && updatedFilters['age']) {
        if (getSectionId === 'category') {
          delete updatedFilters['age'];
        } else if (getSectionId === 'age') {
          delete updatedFilters['category'];
        }
      }

      state.filters = updatedFilters;
    },
    setInitialFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { 
  setProductDetails, 
  updateFilters, 
  setInitialFilters, 
  clearFilters,
  setSort 
} = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
