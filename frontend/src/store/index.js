import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import chatReducer from "./features/chatSlice";
import checkoutReducer from "./features/checkoutSlice";
import dashboardReducer from "./features/dashboardSlice";
import notificationsReducer from "./features/notificationsSlice";
import orderReducer from "./features/orderSlice";
import productCategoryReducer from "./features/productCategorySlice";
import attributeReducer from "./features/attributeSlice";
import productReducer from "./features/productSlice";
import quoteMasterReducer from "./features/quoteMasterSlice";
import quoteReducer from "./features/quoteSlice";
import settingsReducer from "./features/settingsSlice";
import shopReducer from "./features/shopSlice";
import sidebarReducer from "./features/sidebarSlice";
import userPermissionReducer from "./features/userPermissionSlice";
import userReducer from "./features/userSlice";
import emailTemplateReducer from "./features/emailTemplateSlice";
import portalReducer from "./features/portalSlice";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  dashboard: dashboardReducer,
  notifications: notificationsReducer,
  auth: authReducer,
  user: userReducer,
  productCategory: productCategoryReducer,
  attribute: attributeReducer,
  settings: settingsReducer,
  chat: chatReducer,
  userPermission: userPermissionReducer,
  quote: quoteReducer,
  quoteMaster: quoteMasterReducer,
  product: productReducer,
  shop: shopReducer,
  cart: cartReducer,
  order: orderReducer,
  checkout: checkoutReducer,
  emailTemplate: emailTemplateReducer,
  portal: portalReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
