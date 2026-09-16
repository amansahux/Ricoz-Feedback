import { createSlice } from "@reduxjs/toolkit";
import { getMe, Login, Logout, Register } from "./auth.action";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    organization: null,
    isHydrating: true,
    isLoggingIn: false,
    isRegistering: false,
    isLoggingOut: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      if (action.payload.organization) {
        state.organization = action.payload.organization;
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.organization = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(Register.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(Register.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.user = action.payload?.data?.user || null;
        state.organization = action.payload?.data?.organization || null;
      })
      .addCase(Register.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = action.payload;
      })
      // Login
      .addCase(Login.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload?.data?.user || null;
        state.organization = action.payload?.data?.organization || null;
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
      })
      // getMe (Session Hydration)
      .addCase(getMe.pending, (state) => {
        state.isHydrating = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload?.data?.user || null;
        state.organization = action.payload?.data?.organization || null;
        state.isHydrating = false;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.user = null;
        state.organization = null;
        state.isHydrating = false;
        state.error = action.payload;
      })
      // Logout
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

export const { setUser, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
