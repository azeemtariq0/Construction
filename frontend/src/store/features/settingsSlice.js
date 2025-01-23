import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getSettings = createAsyncThunk(
  "settings/view",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/setting/general");
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateSettings = createAsyncThunk(
  "settings/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put("/setting/general", payload);
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const debugEmail = createAsyncThunk(
  "settings/debugEmail",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/setting/email-debugging");
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  isSettingGetting: true,
  isSettingUpdating: false,
  initialValues: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getSettings.pending, (state) => {
      state.isSettingGetting = true;
    });
    addCase(getSettings.fulfilled, (state, action) => {
      state.isSettingGetting = false;
      const data = action.payload;
      state.initialValues = data;
    });
    addCase(getSettings.rejected, (state) => {
      state.isSettingGetting = false;
    });

    addCase(updateSettings.pending, (state) => {
      state.isSettingUpdating = true;
    });
    addCase(updateSettings.fulfilled, (state) => {
      state.isSettingUpdating = false;
    });
    addCase(updateSettings.rejected, (state) => {
      state.isSettingUpdating = false;
    });
  },
});

export default settingsSlice.reducer;
