import { createSlice } from "@reduxjs/toolkit";
import { getMe, Login, Logout, Register } from "./auth.action";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isHydrating: true,
    isLoggingIn: false,
    isLoggingOut: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Register.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(Register.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload.user;
      })
      .addCase(Register.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
      })
      .addCase(Login.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload.user;
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
      })
      .addCase(getMe.pending, (state) => {
        state.isHydrating = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isHydrating = false;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isHydrating = false;
        state.error = action.payload;
      })
      .addCase(Logout.pending, (state) => {
        state.isLoggingOut = true;
        state.error = null;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.user = null;
        state.organization = null;
      })
      .addCase(Logout.rejected, (state, action) => {
        state.isLoggingOut = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
