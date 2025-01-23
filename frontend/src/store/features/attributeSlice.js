import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getAttributeList = createAsyncThunk(
  "attribute/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/attribute", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteAttribute = createAsyncThunk(
  "attribute/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/attribute/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const bulkDeleteAttribute = createAsyncThunk(
  "attribute/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/attribute/bulk-delete", {
        attribute_ids: ids,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createAttribute = createAsyncThunk(
  "attribute/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/attribute", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getAttribute = createAsyncThunk(
  "attribute/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/attribute/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateAttribute = createAsyncThunk(
  "attribute/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/attribute/${id}`, data);
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
    search: "",
    sort_column: null,
    sort_direction: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {
    setAttributeListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setAttributeDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getAttributeList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getAttributeList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getAttributeList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createAttribute.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createAttribute.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createAttribute.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getAttribute.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getAttribute.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        name: data.name,
      };
    });
    addCase(getAttribute.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateAttribute.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateAttribute.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateAttribute.rejected, (state) => {
      state.isFormSubmitting = false;
    });
  },
});

export const { setAttributeListParams, setAttributeDeleteIDs } =
  attributeSlice.actions;
export default attributeSlice.reducer;
