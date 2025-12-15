import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../auth/service/authService";
export const fetchCompanyData = createAsyncThunk(
  "companyListPage/fetchCompanyData",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { params, searchValue } = state.companyListPage;
      const { sortFIeld, sortDirection, limit, offset, dateTo, dateFrom } =
        params;
      const api = new AuthService();
      const res = await api.getCompany({
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
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/login");
      }
    }
  }
);
export const CompanySlice = createSlice({
  name: "companyListPage",
  initialState: {
    allListItems: [],
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
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.loading = false;
        state.allListItems = action.payload?.data?.companies || [];
        state.totalDataCount = action.payload?.data?.length || 0;
      })
      .addCase(fetchCompanyData.rejected, (state, action) => {
        state.loading = false;
        state.allListItems = [];
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
} = CompanySlice.actions;
export default CompanySlice.reducer;
