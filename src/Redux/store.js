import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./CompanySlice";
import UserReducer from "./UserSlice";
import ProjectReducer from "./projectSlice";
import SprintReducer from "./SprintSlice";
import Commonerender from "./CommonRerender";

const store = configureStore({
  reducer: {
    companyListPage: companyReducer,
    userListPage: UserReducer,
    Projectcardpage: ProjectReducer,
    SprintListPAge: SprintReducer,
    Commonerender,
  },
});

export default store;
