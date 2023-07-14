/**
 * Author: Barkah Hadi
 * Description: The auth reducer.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Slice, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice: Slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoading: (state: AuthState, action) => {
      state.isLoading = action.payload;
    },
    setError: (state: AuthState, action) => {
      state.error = action.payload;
    },
    setCredential: (state: AuthState, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    removeCredential: (state: AuthState, action) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
