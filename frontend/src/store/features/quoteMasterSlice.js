import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getQuoteMasterList = createAsyncThunk(
  "parlourMaster/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/parlour-master", {
        params: { ...params, check_permission: true },
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteQuoteMaster = createAsyncThunk(
  "parlourMaster/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/parlour-master/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const bulkDeleteQuoteMaster = createAsyncThunk(
  "parlourMaster/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/parlour-master/bulk-delete", {
        parlour_master_ids: ids,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createQuoteMaster = createAsyncThunk(
  "parlourMaster/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/parlour-master", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getQuoteMaster = createAsyncThunk(
  "parlourMaster/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/parlour-master/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateQuoteMaster = createAsyncThunk(
  "parlourMaster/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/parlour-master/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  initialFormValues: null,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  params: {
    page: 1,
    limit: 50,
    sort_column: null,
    sort_direction: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const quoteMasterSlice = createSlice({
  name: "quoteMaster",
  initialState,
  reducers: {
    setQuoteMasterListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setQuoteMasterDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetQuoteMasterTableSate: (state) => {
      state.list = [];
      state.params = {
        page: 1,
        limit: 50,
        sort_column: null,
        sort_direction: null,
      };
      state.paginationInfo = {
        total_records: 0,
        total_pages: 0,
      };
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getQuoteMasterList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getQuoteMasterList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getQuoteMasterList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createQuoteMaster.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createQuoteMaster.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createQuoteMaster.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getQuoteMaster.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getQuoteMaster.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const { parlour_module, name } = action.payload;
      state.initialFormValues = {
        module_id: parlour_module
          ? {
              value: parlour_module.id,
              label: parlour_module.name,
            }
          : null,
        name,
      };
    });
    addCase(getQuoteMaster.rejected, (state) => {
      state.isItemLoading = false;
    });

    addCase(updateQuoteMaster.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateQuoteMaster.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(updateQuoteMaster.rejected, (state) => {
      state.isFormSubmitting = false;
    });
  },
});

export const {
  setQuoteMasterListParams,
  setQuoteMasterDeleteIDs,
  resetQuoteMasterTableSate,
} = quoteMasterSlice.actions;
export default quoteMasterSlice.reducer;
