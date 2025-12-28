import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./CompanySlice";
import UserReducer from "./UserSlice";

const store = configureStore({
  reducer: {
    companyListPage: companyReducer,
    userListPage :UserReducer,
  },
});

export default store;
