import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../../config/axiosInsstance";


export const Login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      // console.log(response.data.data);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Unable to sign in"
      );
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/me",
  async (_, thunkApi) => {
    try {
      const res = await apiClient.get("/auth/me");
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Unable to restore your session"
      );
    }
  },
);

export const Logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkApi) => {
    try {
      const res = await apiClient.post("/auth/logout");
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Unable to sign out"
      );
    }
  }
);
