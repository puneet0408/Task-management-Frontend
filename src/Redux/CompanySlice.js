import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import AuthService from "../auth/service/authService";

export const fetchCompanyData = createAsyncThunk(
  "companyListPage/fetchCompanyData",
  async (_, { getState }) => {
    try {
      console.log("Thunk started");
      const state = getState();
      const { params } = state.companyListPage;
      const api = new AuthService(); 
      const res = await api.getCompany(params);
      console.log("API Response:", res);
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
    params: {abc:"sds"},
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
  reducers: {},
});

export default CompanySlice.reducer;
