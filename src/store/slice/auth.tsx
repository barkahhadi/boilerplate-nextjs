/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 12:29:29 PM
 * File: auth.tsx
 * Description: Auth Slice
 */

import { Slice, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  callBackUrl: string | null;
  isLoadingPermission: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  callBackUrl: null,
  isLoadingPermission: false,
};

const authSlice: Slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoading: (state: AuthState, action) => {
      state.isLoading = action.payload;
    },
    setLoadingPermission: (state: AuthState, action) => {
      state.isLoadingPermission = action.payload;
    },
    setError: (state: AuthState, action) => {
      state.error = action.payload;
    },
    setCredential: (state: AuthState, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    setCallBackUrl: (state: AuthState, action) => {
      state.callBackUrl = action.payload;
    },
    removeCredential: (state: AuthState, action) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
