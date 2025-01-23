import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getCartList = createAsyncThunk(
  "shop/cartList",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/shop/view-cart", {
        params,
      });
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  "shop/deleteCartItem",
  async ({ id, user_id }, { rejectWithValue }) => {
    try {
      await api.delete(`/shop/delete-cart-item/${id}`, {
        params: {
          user_id,
        },
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const changeQuantity = createAsyncThunk(
  "shop/changeQuantity",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/shop/update-cart", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  list: [],
  isLoading: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateListItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      state.list = state.list.map((item) => {
        if (item.id === id) {
          item.quantity = quantity;
        }
        return item;
      });
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getCartList.pending, (state) => {
      state.isLoading = true;
    });
    addCase(getCartList.fulfilled, (state, action) => {
      state.isLoading = false;
      const data = action.payload;
      state.list = data;
    });
    addCase(getCartList.rejected, (state) => {
      state.isLoading = false;
    });

    addCase(deleteCartItem.fulfilled, (state, action) => {
      // delete from list
      state.list = state.list.filter((item) => item.id !== action.meta.arg.id);
    });

    addCase(changeQuantity.pending, (state, action) => {
      // change quantity in list
      const { id, quantity } = action.meta.arg;
      state.list = state.list.map((item) => {
        if (item.id === id) {
          item.quantity = quantity;
        }
        return item;
      });
    });
  },
});

export const { updateListItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
