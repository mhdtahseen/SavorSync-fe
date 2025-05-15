import { createSlice } from "@reduxjs/toolkit";

const initalState = {
  userId: "",
  role: "",
  restaurantId: "",
  menu: [],
};

export const user = createSlice({
  name: "user",
  initialState: initalState,
  reducers: {
    updateUser(state, action) {
      const { key, value } = action.payload;
      if (key in state) {
        state[key] = value;
      }
    },
    setMenu(state, action) {
      state.menu = action.payload;
    },
  },
});

export const { updateUser, setMenu } = user.actions;
export default user.reducer;
