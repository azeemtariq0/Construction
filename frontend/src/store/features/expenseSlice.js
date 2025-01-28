import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { roundUpto } from '../../utils/number';

export const getExpenseList = createAsyncThunk(
  'expense/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/expense', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expense/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/expense/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createExpense = createAsyncThunk(
  'expense/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/expense', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getExpense = createAsyncThunk(
  'expense/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/expense/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getExpenseForPrint = createAsyncThunk(
  'expenseForPrint/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/expense/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expense/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/expense/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteExpense = createAsyncThunk(
  'expense/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/expense/bulk-delete', {
        expense_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  isBulkDeleting: false,
  initialFormValues: null,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  rebatePercentage: null,
  salesmanPercentage: null,
  expenseDetails: [],
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

export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenseListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setExpenseDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addExpenseDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: Date.now(),
        expense_title: null,
        remarks: null,
        amount: null
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.expenseDetails.splice(index + 1, 0, newDetail);
      } else {
        state.expenseDetails.push(newDetail);
      }
    },

    copyExpenseDetail: (state, action) => {
      const index = action.payload;

      const detail = state.expenseOrderDetails[index];
      const newDetail = {
        ...detail,
        id: Date.now()
      };

      state.expenseDetails.splice(index + 1, 0, newDetail);
    },

    removeExpenseDetail: (state, action) => {
      state.expenseDetails = state.expenseDetails.filter(
        (item) => item.id !== action.payload
      );
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeExpenseDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.expenseDetails[from];
      state.expenseDetails[from] = state.expenseDetails[to];
      state.expenseDetails[to] = temp;
    },

    changeExpenseDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.expenseDetails[index];
      detail[key] = value;

      if (detail.quantity && detail.rate) {
        detail.amount = roundUpto(+detail.quantity * +detail.rate);
      } else {
        detail.amount = '';
      }
    },

    setRebatePercentage: (state, action) => {
      state.rebatePercentage = action.payload;
    },

    setSalesmanPercentage: (state, action) => {
      state.salesmanPercentage = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getExpenseList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.ExpenseDetails = [];
    });
    addCase(getExpenseList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getExpenseList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createExpense.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createExpense.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createExpense.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getExpense.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getExpense.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        required_date: data.required_date ? dayjs(data.required_date) : null,
        type: data.type,
        buyer_name: data.buyer_name,
        buyer_email: data.buyer_email,
        ship_via: data.ship_via,
        department: data.department,
        remarks: data.remarks,
        ship_to: data.ship_to,
        buyer_id: data.user
          ? {
              value: data.user.user_id,
              label: data.user.user_name
            }
          : null,
        payment_id: data.payment
          ? {
              value: data.payment.payment_id,
              label: data.payment.name
            }
          : null,

        supplier_id: data.supplier
          ? {
              value: data.supplier.supplier_id,
              label: data.supplier.name
            }
          : null
      };

      if (!data.expense_detail) return;
      state.expenseDetails = data.expense_order_detail.map((detail) => ({
        id: detail.expense_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        description: detail.description,
        vpart: detail.vpart,
        quantity: detail.quantity ? parseFloat(detail.quantity) : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        rate: detail.rate,
        vendor_notes: detail.vendor_notes,
        amount: detail.amount
      }));
    });
    addCase(getExpense.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(updateExpense.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateExpense.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });
    addCase(updateExpense.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteExpense.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteExpense.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteExpense.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setExpenseListParams,
  setExpenseDeleteIDs,
  addExpenseDetail,
  removeExpenseDetail,
  copyExpenseDetail,
  changeExpenseDetailOrder,
  changeExpenseDetailValue,
  setRebatePercentage,
  setSalesmanPercentage
} = expenseSlice.actions;
export default expenseSlice.reducer;
