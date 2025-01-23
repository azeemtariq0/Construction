import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import api, { API_URL } from "../../axiosInstance";

export const getProductList = createAsyncThunk(
  "product/lists",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/product", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/product/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/product", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getProduct = createAsyncThunk(
  "product/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/product/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/product/${id}`, data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  list: [],
  isLoading: false,
  isFormSubmitting: false,
  initialFormValues: null,
  isItemLoading: false,
  variantAttributes: [],
  createdProductID: null,
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
  variantList: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    addVariant: (state) => {
      const attributeColumns = state.variantAttributes.map((attribute) => ({
        attribute_id: attribute.attribute_id,
        attribute_name: attribute.attribute_name,
        value: null,
      }));

      state.variantList.push({
        id: Date.now(),
        product_id: state.variantAttributes[0].product_id,
        attributes: [
          { attribute_id: "part_no", attribute_name: "Part No", value: null },
          { attribute_id: "price", attribute_name: "Price", value: null },
          ...attributeColumns,
        ],
        isNew: true,
      });
    },

    copyVariant: (state, action) => {
      const id = action.payload;

      const variant = state.variantList.find((item) => item.id === id);
      const deepCopy = JSON.parse(JSON.stringify(variant));

      state.variantList.push({ ...deepCopy, id: Date.now(), isNew: true });
    },

    updateVariant: (state, action) => {
      const { id, name, value } = action.payload;
      state.variantList = state.variantList.map((item) => {
        if (item.id === id) {
          const findColumn = item.attributes.find(
            (attribute) => attribute.attribute_id === name,
          );

          findColumn.value = value;
        }
        return item;
      });
    },

    removeVariant: (state, action) => {
      const id = action.payload;
      state.variantList = state.variantList.filter((item) => item.id !== id);
    },

    setProductFormValues: (state, action) => {
      state.initialFormValues = action.payload;
    },
  },

  extraReducers: ({ addCase }) => {
    addCase(getProductList.pending, (state, action) => {
      state.initialFormValues = null;
      state.isLoading = true;
      state.variantList = [];
      state.variantAttributes = [];
      state.createdProductID = null;
    });
    addCase(getProductList.fulfilled, (state, action) => {
      state.isLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getProductList.rejected, (state, action) => {
      state.isLoading = false;
    });

    addCase(createProduct.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createProduct.fulfilled, (state, action) => {
      state.isFormSubmitting = false;

      const data = action.payload;
      state.createdProductID = data.product_id;
      state.variantAttributes = data.product_attrribute;
    });
    addCase(createProduct.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getProduct.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getProduct.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.variantAttributes = data.product_attributes;
      state.variantList = data.product_variant_attributes.map((item) => {
        return {
          id: item[0].variant_id,
          product_id: item[0].product_id,
          attributes: item.map((attribute) => ({
            attribute_id: attribute.attribute_id,
            attribute_name: attribute.attribute_name,
            value: attribute.attribute_value,
          })),
        };
      });

      state.initialFormValues = {
        name: data.name,
        category: data.product_category_id
          ? { value: data.product_category_id, label: data.product_category }
          : null,
        summary: data.summary,
        tags: data.label_tags ? data.label_tags.split("_") : [],
        attributes: data.product_attributes
          ? data.product_attributes.map((item) => ({
              value: item.attribute_id,
              label: item.attribute_name,
            }))
          : null,
        productDetails: data.description,
        status: data.status,
        date: data.schedule_date
          ? dayjs(data.schedule_date, "YYYY-MM-DD")
          : null,
        time: data.schedule_time ? dayjs(data.schedule_time, "HH:mm") : null,
        images: data?.images?.map((item) => ({
          uid: item.id,
          name: item.image,
          status: "done",
          url: `${API_URL}/public/${item.path}${item.image}`,
        })),
        isPublished: data?.is_published === 1,
      };
    });
    addCase(getProduct.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateProduct.pending, (state, action) => {
      const isPublishing = action.meta.arg.data?.is_published === 1;
      state.isFormSubmitting = isPublishing ? "Publishing" : "Drafting";
    });
    addCase(updateProduct.fulfilled, (state, action) => {
      state.isFormSubmitting = false;
      const { product_attrribute } = action.payload;
      state.variantAttributes = product_attrribute;
    });
    addCase(updateProduct.rejected, (state) => {
      state.isFormSubmitting = false;
    });
  },
});

export const {
  setProductListParams,
  addVariant,
  copyVariant,
  updateVariant,
  removeVariant,
  setProductFormValues,
} = productSlice.actions;
export default productSlice.reducer;
