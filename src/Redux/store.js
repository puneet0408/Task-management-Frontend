import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./CompanySlice";
import UserReducer from "./UserSlice";
import ProjectReducer from "./projectSlice";
import SprintReducer from "./SprintSlice";

const store = configureStore({
  reducer: {
    companyListPage: companyReducer,
    userListPage :UserReducer,
    Projectcardpage :ProjectReducer,
    SprintListPAge :SprintReducer
  },
});

export default store;
