import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getShopList = createAsyncThunk(
  "shop/lists",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/shop", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getShopItem = createAsyncThunk(
  "shop/get",
  async ({ id, user_id }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/shop/product-detail/${id}`, {
        params: {
          user_id,
        },
      });
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const addToFavorite = createAsyncThunk(
  "shop/addToFavorite",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/shop/add-to-favorite", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const addToCart = createAsyncThunk(
  "shop/addToCart",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/shop/add-to-cart", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  list: [],
  isLoading: false,
  isItemLoading: false,
  shopItemDetails: null,
  isAddingToCart: false,
  params: {
    page: 1,
    limit: 12,
    search: "",
    sort_column: null,
    sort_direction: null,
  },
  totalRecords: 0,
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setShopListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },
  },

  extraReducers: ({ addCase }) => {
    addCase(getShopList.pending, (state, action) => {
      if (state.list.length === 0) {
        state.isLoading = true;
      }
    });
    addCase(getShopList.fulfilled, (state, action) => {
      state.isLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.totalRecords = rest.total;
    });
    addCase(getShopList.rejected, (state, action) => {
      state.isLoading = false;
    });

    addCase(getShopItem.pending, (state) => {
      state.isItemLoading = true;
      state.shopItemDetails = null;
    });
    addCase(getShopItem.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.shopItemDetails = data;
    });
    addCase(getShopItem.rejected, (state) => {
      state.isItemLoading = false;
    });

    addCase(addToFavorite.pending, (state, action) => {
      const { is_favorite, product_id } = action.meta.arg;

      state.list = state.list.map((item) => {
        if (item.id === product_id) {
          item.favorite = is_favorite;
        }
        return item;
      });

      if (state.shopItemDetails) {
        state.shopItemDetails.favorite = is_favorite;
      }
    });

    addCase(addToCart.pending, (state) => {
      state.isAddingToCart = true;
    });
    addCase(addToCart.fulfilled, (state) => {
      state.isAddingToCart = false;
    });
    addCase(addToCart.rejected, (state) => {
      state.isAddingToCart = false;
    });
  },
});

export const { setShopListParams } = shopSlice.actions;
export default shopSlice.reducer;
