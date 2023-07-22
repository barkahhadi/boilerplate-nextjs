/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 12:29:13 PM
 * File: app.tsx
 * Description: App Slice
 */

import { Slice, createSlice } from "@reduxjs/toolkit";
import { NotificationPlacement } from "antd/es/notification/interface";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationAppState {
  type?: NotificationType;
  message: string;
  description?: string;
  open: boolean;
  placement?: NotificationPlacement;
}

export interface ApplicationState {
  notification?: NotificationAppState;
}

const initialState: ApplicationState = {
  notification: {
    open: false,
    type: "info",
    message: "",
    description: "",
    placement: "bottomRight",
  },
};

const appSlice: Slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    openNotification(state, action) {
      state.notification = {
        ...state.notification,
        ...action.payload,
        open: true,
      };
    },
    closeNotification(state) {
      state.notification = {
        ...initialState,
      };
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
