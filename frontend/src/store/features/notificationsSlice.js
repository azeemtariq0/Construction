import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getNotificationList = createAsyncThunk(
  "notifications/lists",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/notification", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notification/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteAllNotification = createAsyncThunk(
  "notifications/delete-all",
  async (id, { rejectWithValue }) => {
    try {
      await api.post("/notification/bulk-delete", {
        user_id: id,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const readAllNotification = createAsyncThunk(
  "notifications/read-all",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/notification/read-all", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  isLoading: false,
  list: [],
  deletingID: null,
  totalUnread: 0,
  cartTotal: 0,
  params: {
    page: 1,
    status: null,
  },
  totalRecords: 0,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationsListParams: (state, action) => {
      state.params = { ...state.params, ...action.payload };
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getNotificationList.pending, (state, action) => {
      state.isLoading = true;
    });
    addCase(getNotificationList.fulfilled, (state, action) => {
      state.isLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.totalRecords = rest.pagination.total;
      state.totalUnread = rest.total_unread;
      state.cartTotal = rest.cart_total;
    });
    addCase(getNotificationList.rejected, (state, action) => {
      state.isLoading = false;
    });

    addCase(deleteNotification.pending, (state, action) => {
      state.deletingID = action.meta.arg;
    });
    addCase(deleteNotification.fulfilled, (state) => {
      state.deletingID = null;
    });
    addCase(deleteNotification.rejected, (state) => {
      state.deletingID = null;
    });
  },
});

export const { setNotificationsListParams } = notificationsSlice.actions;
export default notificationsSlice.reducer;
