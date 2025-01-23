import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { API_URL } from "../../axiosInstance";

export const getOrderList = createAsyncThunk(
  "order/lists",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/order", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getOrderDetails = createAsyncThunk(
  "order/details",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/order/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/order/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const saveOrderDetails = createAsyncThunk(
  "orderDetails/save",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/order/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const changeOrderStatus = createAsyncThunk(
  "order/update-status",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/order/update-status", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const buyAgainOrder = createAsyncThunk(
  "order/buy-again",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/order/buy-again", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  list: [],
  isLoading: false,
  isItemLoading: false,
  orderDetails: null,
  cancelOrderID: null,
  isDetailsSubmitting: false,
  params: {
    page: 1,
    limit: 50,
    search: "",
    sort_column: null,
    sort_direction: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setCancelOrderID: (state, action) => {
      state.cancelOrderID = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getOrderList.pending, (state) => {
      state.isLoading = true;
    });
    addCase(getOrderList.fulfilled, (state, action) => {
      state.isLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getOrderList.rejected, (state) => {
      state.isLoading = false;
    });

    addCase(getOrderDetails.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getOrderDetails.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

      const products = data?.order_detail.map((item) => {
        const name = item.product.name;
        const part_no = item.variant.part_number;
        const price = item.amount;

        const firstImage = item.product.images && item.product.images[0];
        const image = firstImage
          ? `${API_URL}/public/${firstImage.path}/${firstImage.image}`
          : null;

        return {
          id: item.id,
          quantity: item.quantity,
          name,
          part_no,
          price,
          image,
        };
      });

      state.orderDetails = {
        order_no: data.order_no,
        first_name: data.first_name,
        last_name: data.last_name,
        organization: data.organization,
        country: data.country_name,
        phone_no: data.phone_no,
        post_code: data.postal_code,
        address: data.address,
        remarks: data.remarks,
        delivery_date: data.delivery_date,
        status: data.status,
        cancel_reason: data.cancel_reason,
        products,
      };
    });
    addCase(getOrderDetails.rejected, (state) => {
      state.isItemLoading = false;
    });

    addCase(changeOrderStatus.fulfilled, (state, action) => {
      const { order_id, status } = action.meta.arg;

      state.list = state.list.map((item) => {
        if (item.id === order_id) {
          item.status = status;
        }
        return item;
      });
    });

    addCase(saveOrderDetails.pending, (state) => {
      state.isDetailsSubmitting = true;
    });
    addCase(saveOrderDetails.fulfilled, (state) => {
      state.isDetailsSubmitting = false;
    });
    addCase(saveOrderDetails.rejected, (state) => {
      state.isDetailsSubmitting = false;
    });
  },
});

export const { setOrderListParams, setCancelOrderID } = orderSlice.actions;
export default orderSlice.reducer;
