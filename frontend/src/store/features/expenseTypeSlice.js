import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getExpenseTypeList = createAsyncThunk(
  'expenseType/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/expenseType', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteExpenseType = createAsyncThunk(
  'expenseType/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/expenseType/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createExpenseType = createAsyncThunk(
  'expenseType/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/expenseType', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateExpenseType = createAsyncThunk(
  'expenseType/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/expenseType/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteExpenseType = createAsyncThunk(
  'expenseType/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/expenseType/bulk-delete', {
        expenseType_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isSubmitting: false,
  isBulkDeleting: false,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    sort_direction: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const expenseTypeSlice = createSlice({
  name: 'expenseType',
  initialState,
  reducers: {
    setExpenseTypeListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setExpenseTypeDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewExpenseType: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.expenseType_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        expenseType_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewExpenseType: (state) => {
      state.list = state.list.filter((item) => item.expenseType_id !== 'new');
    },

    setExpenseTypeEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with expenseType_id as "new"
      state.list = state.list.filter((item) => item.expenseType_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.expenseType_id === id) {
          return item.editable
            ? {
                ...item.prevRecord,
                editable: false
              }
            : {
                ...item,
                editable: true,
                prevRecord: { ...item }
              };
        }

        // If any other item is editable, reset it
        return item.editable
          ? { ...item.prevRecord, editable: false }
          : { ...item, editable: false };
      });
    },

    updateExpenseTypeListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.expenseType_id === id) {
          return {
            ...item,
            [field]: value
          };
        }
        return item;
      });
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getExpenseTypeList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getExpenseTypeList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getExpenseTypeList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createExpenseType.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createExpenseType.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createExpenseType.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.expenseType_id !== 'new');
    });

    addCase(updateExpenseType.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateExpenseType.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateExpenseType.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteExpenseType.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteExpenseType.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteExpenseType.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setExpenseTypeListParams,
  setExpenseTypeDeleteIDs,
  addNewExpenseType,
  removeNewExpenseType,
  setExpenseTypeEditable,
  updateExpenseTypeListValue
} = expenseTypeSlice.actions;
export default expenseTypeSlice.reducer;
