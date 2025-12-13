import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../auth/service/authService";
export const fetchCompanyData = createAsyncThunk(
  "companyListPage/fetchCompanyData",
  async (_, { getState }) => {
    try {
      const state = getState();
      const { params, searchValue } = state.companyListPage;
      const api = new AuthService();
      const res = await api.getCompany({ ...params, searchValue });
      if (res?.status === 200) {
        return res.data;
      } else {
        console.error(`API Error: ${res?.status}`);
      }
    } catch (error) {
      console.error("Thunk Error:", error);
    }
  }
);
export const CompanySlice = createSlice({
  name: "companyListPage",
  initialState: {
    allListItems: [],
    loading: false,
    error: "",
    params: { dateFrom: "", dateTo: "" },
    dateFrom:"",
    dateTo: "",
    searchValue: "",
    totalDataCount: 0,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.loading = false;
        state.allListItems = action.payload?.data?.fetchCompany || [];
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
      state.params = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});
export const { setDateFrom, setDateTo, setParams, setSearchValue } = CompanySlice.actions;
export default CompanySlice.reducer;