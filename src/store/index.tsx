/**
 * Author: Barkah Hadi
 * Description: The Redux store.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./slice/auth";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
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
  debug: true,
});
