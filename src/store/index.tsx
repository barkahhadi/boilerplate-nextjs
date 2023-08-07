/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 12:28:52 PM
 * File: index.tsx
 * Description: Redux Store
 */

import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./slice/auth";
import appReducer from "./slice/app";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      app: appReducer,
    },
    devTools: process.env.NODE_ENV === "development",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV === "development",
});
