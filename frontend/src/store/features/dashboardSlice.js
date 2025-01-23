import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { API_URL } from "../../axiosInstance";

export const getDashboardData = createAsyncThunk(
  "dashboard/get",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/dashboard", {
        params,
      });
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateBanner = createAsyncThunk(
  "banner/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/banner", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  isLoading: false,
  totalQuote: null,
  quoteSubmitted: null,
  quoteUnderReview: null,
  quoteProcessed: null,
  quoteExpired: null,
  currentBanner: null,
  currentVisibleFor: null,
  bannerImage: null,
  deletedBannerImage: null,
  bannerVisibleFor: [],
  isBannerUpdating: false,
};
export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setBannerImage: (state, action) => {
      const newBanner = action.payload;

      state.deletedBannerImage = state.currentBanner;
      state.bannerImage = newBanner;

      if (!newBanner) {
        state.bannerVisibleFor = [];
      }
    },

    setBannerVisibleFor: (state, action) => {
      state.bannerVisibleFor = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getDashboardData.pending, (state) => {
      state.isLoading = true;
    });
    addCase(getDashboardData.fulfilled, (state, action) => {
      const { total_quote, quote_status, banner } = action.payload;
      state.totalQuote = total_quote || 0;
      state.quoteSubmitted = quote_status["Submitted"] || 0;
      state.quoteUnderReview = quote_status["Under Review"] || 0;
      state.quoteProcessed = quote_status["Processed"] || 0;
      state.quoteExpired = quote_status["Expired"] || 0;

      if (banner && banner.image) {
        state.currentBanner = banner.image;
        state.bannerImage = `${API_URL}/public/${banner.path}${banner.image}`;
      } else {
        state.currentBanner = null;
        state.bannerImage = null;
      }

      if (banner && banner.type) {
        const bannerVisibleFor = JSON.parse(banner.type);
        state.currentVisibleFor = bannerVisibleFor;
        state.bannerVisibleFor = bannerVisibleFor;
      }

      state.isLoading = false;
    });
    addCase(getDashboardData.rejected, (state) => {
      state.isLoading = false;
    });

    addCase(updateBanner.pending, (state) => {
      state.isBannerUpdating = true;
    });
    addCase(updateBanner.fulfilled, (state) => {
      state.isBannerUpdating = false;
    });
    addCase(updateBanner.rejected, (state) => {
      state.isBannerUpdating = false;
    });
  },
});

export const { setBannerImage, setBannerVisibleFor } = dashboardSlice.actions;
export default dashboardSlice.reducer;
