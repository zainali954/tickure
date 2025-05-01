import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import handleAsyncCases from "../../utils/handleAsync";
import createThunk from "../../utils/createThunk";

export const fetchStats = createThunk("stats/fetchStats", () => apiClient.get("/admin/stats"), true );

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    taskStats: {},
    categoryStats: null,
    labelStats: null,
    activeUsers:{},
    dailyTaskData:{},
    isLoading: false,
  },
  reducers: {
    resetStats: (state) => {
      //everything will be resets
    },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchStats, (state, action) => {
      state.taskStats = action.payload.taskStats;
      state.categoryStats = action.payload.categoryStats;
      state.labelStats = action.payload.labelStats;
      state.activeUsers = action.payload.activeUsers;
      state.dailyTaskData = action.payload.dailyTaskData;
    });

  },
});

export const { resetStats } = statsSlice.actions;
export default statsSlice.reducer;