import { createSlice } from "@reduxjs/toolkit";

const initalState: any = [];

const orders = createSlice({
  name: "orders",
  initialState: initalState,
  reducers: {
    addOrder(state, action) {
      state.push(action.payload);
    },
    updateOrder(state, action) {
      const { id, order } = action.payload;
      const orderIndex = state.find((el) => el.id === id);
      if (orderIndex) {
        state[state.indexOf(orderIndex)] = order;
      }
    },
  },
});

export const { addOrder, updateOrder } = orders.actions;
export default orders.reducer;
