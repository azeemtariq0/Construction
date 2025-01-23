import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const loginHandler = createAsyncThunk(
  "auth/login",
  async (loginCredentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", loginCredentials);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updatePasswordHandler = createAsyncThunk(
  "auth/updatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/change-password", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/verify-email", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/reset-password", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const initialState = {
  isLoggingIn: false,
  user,
  isPasswordUpdating: false,
  isEmailVerifying: false,
  isPasswordResetting: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(loginHandler.pending, (state) => {
      state.isLoggingIn = true;
    });
    addCase(loginHandler.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      const { api_token, ...user } = action.payload;
      localStorage.setItem("token", api_token);
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    });
    addCase(loginHandler.rejected, (state) => {
      state.isLoggingIn = false;
    });

    addCase(updatePasswordHandler.pending, (state) => {
      state.isPasswordUpdating = true;
    });
    addCase(updatePasswordHandler.fulfilled, (state) => {
      state.isPasswordUpdating = false;
      const updatedUser = {
        ...state.user,
        is_change_password: 1,
      };

      state.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
    });
    addCase(updatePasswordHandler.rejected, (state) => {
      state.isPasswordUpdating = false;
    });

    addCase(verifyEmail.pending, (state) => {
      state.isEmailVerifying = true;
    });
    addCase(verifyEmail.fulfilled, (state) => {
      state.isEmailVerifying = false;
    });
    addCase(verifyEmail.rejected, (state) => {
      state.isEmailVerifying = false;
    });

    addCase(resetPassword.pending, (state) => {
      state.isPasswordResetting = true;
    });
    addCase(resetPassword.fulfilled, (state) => {
      state.isPasswordResetting = false;
    });
    addCase(resetPassword.rejected, (state) => {
      state.isPasswordResetting = false;
    });
  },
});

export default authSlice.reducer;
