import { configureStore } from "@reduxjs/toolkit";
import RoleBaseReducer from "../../pages/Home/Billing/slices/userSlice";
import OrderReducer from "../../pages/Home/Billing/slices/orderSlice";

export const store = configureStore({
  reducer: {
    user: RoleBaseReducer,
    orders: OrderReducer,
  },
});
