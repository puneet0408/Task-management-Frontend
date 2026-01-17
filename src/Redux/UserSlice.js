import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../auth/service/authService";
export const fetchUsersData = createAsyncThunk(
  "userListPage/fetchUsersData",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { params, searchValue } = state.userListPage;
      const { sortFIeld, sortDirection, limit, offset, dateTo, dateFrom } =
        params;
      const api = new AuthService();
      const res = await api.getUsers({
        sortFIeld: sortFIeld == "sno" ? "" : sortFIeld,
        sortDirection: sortFIeld == "sno" ? "" : sortDirection,
        offset: offset || "0",
        limit: limit || "10",
        searchValue,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
      console.log(res, "getUsers");
      if (res?.status === 200) {
        return res.data;
      } else {
        console.error(`API Error: ${res?.status}`);
      }
    } catch (error) {
      console.log(error, "error");
      if (error?.response?.status === 401) {
        // localStorage.clear();
        // sessionStorage.clear();
        // window.location.replace("/login");
      }
    }
  }
);
export const fetchCurrentLogin = createAsyncThunk(
  "userListPage/fetchCurrentLogin",
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem("userData");
      const userData = stored ? JSON.parse(stored) : null;
      if (!userData?._id) {
        return rejectWithValue("User not found");
      }
      console.log(userData._id,"userData._id");
      
      const api = new AuthService();
      const res = await api.getProfile(userData._id);
      console.log(res,"ressssss");
      

      if (res?.status === 200) {
        return res.data;
      }
      return rejectWithValue(`API Error: ${res?.status}`);
    } catch (error) {
      if (error?.response?.status === 401) {
        // localStorage.clear();
        // sessionStorage.clear();
        // window.location.replace("/login");
      }
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

export const UsersSlice = createSlice({
  name: "userListPage",
  initialState: {
    allUserListItems: [],
    currentUser: null,
    loading: false,
    loadingsingle:false,
    error: "",
    params: {
      dateFrom: null,
      dateTo: null,
      sortFIeld: null,
      sortDirection: null,
      offset: 0,
      limit: 10,
    },
    dateFrom: "",
    dateTo: "",
    searchValue: "",
    totalDataCount: 0,
    sortFIeld: "",
    sortDirection: "",
    startIndex: "",
    lastIndex: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsersData.fulfilled, (state, action) => {
        state.loading = false;
        state.allUserListItems = action.payload?.data?.users || [];
        state.totalDataCount = action.payload?.data?.length || 0;
      })
      .addCase(fetchUsersData.rejected, (state, action) => {
        state.loading = false;
        state.allUserListItems = [];
        state.error = action.payload || "Error fetching company data";
      })
      .addCase(fetchCurrentLogin.pending, (state) => {
        state.loadingsingle = true;
        state.error = null;
      })
      .addCase(fetchCurrentLogin.fulfilled, (state, action) => {
        state.loadingsingle = false;
        state.currentUser = action.payload?.data?.user || null;
      })
      .addCase(fetchCurrentLogin.rejected, (state, action) => {
        state.loadingsingle = false;
        state.error = action.payload;
      });
  },
  reducers: {
    setDateFrom: (state, action) => {
      state.dateFrom = action.payload;
    },
    setDateTo: (state, action) => {
      state.dateTo = action.payload;
    },
    setParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    SetSortField: (state, action) => {
      state.sortFIeld = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
    },
    setStartIndex: (state, action) => {
      state.startIndex = action.payload;
    },
    setLastIndex: (state, action) => {
      state.lastIndex = action.payload;
    },
  },
});
export const {
  setDateFrom,
  setDateTo,
  setParams,
  setSearchValue,
  SetSortField,
  setSortDirection,
  setLastIndex,
  setStartIndex,
} = UsersSlice.actions;
export default UsersSlice.reducer;
