import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './features/authSlice';
import expenseTypeReducer from './features/expenseTypeSlice';
import expenseReducer from './features/expenseSlice';
import sidebarReducer from './features/sidebarSlice';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  expenseType: expenseTypeReducer,
  expense: expenseReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
