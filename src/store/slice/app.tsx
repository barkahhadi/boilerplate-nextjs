/**
 * Author: Barkah Hadi
 * Description: The auth reducer.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Slice, createSlice } from "@reduxjs/toolkit";

export interface AppState {
  title?: string;
  subtitle?: string;
}

const initialState: AppState = {
  title: "",
  subtitle: "",
};

const appSlice: Slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setTitle: (state: AppState, action) => {
      state.title = action.payload;
    },
    setSubtitle: (state: AppState, action) => {
      state.subtitle = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
