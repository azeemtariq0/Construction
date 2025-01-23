import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const checkout = createAsyncThunk(
  "checkout/checkout",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/order", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    isSubmitting: false,
  },
  extraReducers: ({ addCase }) => {
    addCase(checkout.pending, (state) => {
      state.isSubmitting = true;
    });
    addCase(checkout.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(checkout.rejected, (state) => {
      state.isSubmitting = false;
    });
  },
});

export default checkoutSlice.reducer;
