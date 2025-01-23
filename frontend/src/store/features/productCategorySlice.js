import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getProductCategoryList = createAsyncThunk(
  "productCategory/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/product-category", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteProductCategory = createAsyncThunk(
  "productCategory/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/product-category/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const bulkDeleteProductCategory = createAsyncThunk(
  "productCategory/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/product-category/bulk-delete", {
        product_category_ids: ids,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createProductCategory = createAsyncThunk(
  "productCategory/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/product-category", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getProductCategory = createAsyncThunk(
  "productCategory/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/product-category/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateProductCategory = createAsyncThunk(
  "productCategory/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/product-category/${id}`, data);
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

export const productCategorySlice = createSlice({
  name: "productCategory",
  initialState,
  reducers: {
    setProductCategoryListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setProductCategoryDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getProductCategoryList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getProductCategoryList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getProductCategoryList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createProductCategory.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createProductCategory.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createProductCategory.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getProductCategory.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getProductCategory.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        name: data.name,
      };
    });
    addCase(getProductCategory.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateProductCategory.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateProductCategory.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateProductCategory.rejected, (state) => {
      state.isFormSubmitting = false;
    });
  },
});

export const { setProductCategoryListParams, setProductCategoryDeleteIDs } =
  productCategorySlice.actions;
export default productCategorySlice.reducer;
