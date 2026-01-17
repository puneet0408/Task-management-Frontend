import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../auth/service/authService";
export const fetchSprintData = createAsyncThunk(
  "SprintListPAge/fetchSprintData",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { params, searchValue } = state.SprintListPAge;
      const { sortFIeld, sortDirection, limit, offset, dateTo, dateFrom } =
        params;
      const api = new AuthService();
      const res = await api.getSprint({
        sortFIeld: sortFIeld == "sno" ? "" : sortFIeld,
        sortDirection: sortFIeld == "sno" ? "" : sortDirection,
        offset: offset || "0",
        limit: limit || "10",
        searchValue,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
      if (res?.status === 200) {
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
export const SprintSlice = createSlice({
  name: "SprintListPAge",
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
      .addCase(fetchSprintData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchSprintData.fulfilled, (state, action) => {
        state.loading = false;
        state.SprintListItem = action.payload?.data?.fetchSprint || [];
        state.totalDataCount = action.payload?.data?.length || 0;
      })
      .addCase(fetchSprintData.rejected, (state, action) => {
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
} = SprintSlice.actions;
export default SprintSlice.reducer;
