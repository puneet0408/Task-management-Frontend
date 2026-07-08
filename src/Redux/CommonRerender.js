import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../auth/service/authService";
export const CommonerenderSlice = createSlice({
  name: "Commonerender",
  initialState: {
    notificationrerender: false,
  },

  reducers: {
    setnotificationrerender: (state, action) => {
      state.notificationrerender = action.payload;
    },
  },
});
export const { setnotificationrerender } = CommonerenderSlice.actions;
export default CommonerenderSlice.reducer;
