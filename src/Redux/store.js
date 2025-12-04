import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./CompanySlice";

const store = configureStore({
  reducer: {
    companyListPage: companyReducer,
  },
});

export default store;
