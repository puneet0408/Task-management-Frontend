import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../auth/service/authService";
export const fetchDeletedTasks = createAsyncThunk(
  "SprintListPAge/fetchDeletedTasks",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { params, searchValue } = state.deletedTasklist;
      const { sortFIeld, sortDirection, limit, offset, dateTo, dateFrom } =
        params;
      const api = new AuthService();
      const res = await api.getdeletedtask({
        sortFIeld: sortFIeld == "sno" ? "" : sortFIeld,
        sortDirection: sortFIeld == "sno" ? "" : sortDirection,
        offset: offset || "0",
        limit: limit || "10",
        searchValue,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
      if (res?.status === 200) {
        console.log(res,"rwrwe");
        return res.data;
      } else {
        console.error(`API Error: ${res?.status}`);
      }
    } catch (error) {
      console.log(error, "error");
      if (error?.response?.status === 401) {
        console.log(error,"error");
      }
    }
  }
);
export const RecycleBInSplice = createSlice({
  name: "deletedTasklist",
  initialState: {
    SprintListItem: [],
    loading: false,
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
      .addCase(fetchDeletedTasks.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchDeletedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.SprintListItem = action.payload?.data || [];
        state.totalDataCount = action.payload?.data?.length || 0;
      })
      .addCase(fetchDeletedTasks.rejected, (state, action) => {
        state.loading = false;
        state.SprintListItem = [];
        state.error = action.payload || "Error fetching company data";
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
} = RecycleBInSplice.actions;
export default RecycleBInSplice.reducer;
