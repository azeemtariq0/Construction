import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getEmailTemplateList = createAsyncThunk(
  "email-template/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/email-template", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteEmailTemplate = createAsyncThunk(
  "email-template/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/email-template/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createEmailTemplate = createAsyncThunk(
  "email-template/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/email-template", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getEmailTemplate = createAsyncThunk(
  "email-template/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/email-template/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateEmailTemplate = createAsyncThunk(
  "email-template/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/email-template/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getEmailTags = createAsyncThunk(
  "email-template/getEmailTags",
  async (moduleName, { rejectWithValue }) => {
    try {
      const res = await api.get("/lookups/template-module-Tags", {
        params: {
          tag: moduleName,
        },
      });
      return res.data;
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
  tags: [],
  isTagsLoading: false,
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

export const emailTemplateSlice = createSlice({
  name: "emailTemplate",
  initialState,
  reducers: {
    setEmailTemplateListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getEmailTemplateList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getEmailTemplateList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getEmailTemplateList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createEmailTemplate.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createEmailTemplate.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createEmailTemplate.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getEmailTemplate.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getEmailTemplate.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const [subject, description] = action.payload;
      state.initialFormValues = {
        module: subject.module,
        subject: subject.value,
        description: description.value,
      };
    });
    addCase(getEmailTemplate.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateEmailTemplate.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateEmailTemplate.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateEmailTemplate.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getEmailTags.pending, (state) => {
      state.isTagsLoading = true;
    });
    addCase(getEmailTags.fulfilled, (state, action) => {
      state.isTagsLoading = false;
      state.tags = action.payload;
    });
    addCase(getEmailTags.rejected, (state) => {
      state.isTagsLoading = false;
    });
  },
});

export const { setEmailTemplateListParams } = emailTemplateSlice.actions;
export default emailTemplateSlice.reducer;
