/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Wed Jul 05 2023 9:27:34 PM
 * File: auth.tsx
 * Description: Auth Thunk
 */

import { AppDispatch } from "..";
import { authActions } from "../slice/auth";
import axios, { Axios, AxiosError } from "axios";
import AuthCookie from "@utils/cookies/auth";
import { HeaderProperties } from "@/types/http";
import { headers } from "next/dist/client/components/headers";

export interface LoginData {
  url: string;
  username: string;
  password: string;
}

export const login = (loginData: LoginData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(authActions.setLoading(true));
    try {
      const { data, status } = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        loginData
      );
      dispatch(authActions.setLoading(false));

      if (status === 200) {
        AuthCookie.set(data);
        dispatch(authActions.setCredential(data.user));
      } else {
        dispatch(authActions.setError(data.message));
        dispatch(authActions.setLoading(false));
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        dispatch(authActions.setError(err.response?.data.message));
        dispatch(authActions.setLoading(false));
      }
    }
  };
};

export const logout = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(authActions.setLoading(true));
    AuthCookie.remove();
    dispatch(authActions.removeCredential(null));
    dispatch(authActions.setLoading(false));
  };
};

export const refreshToken = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(authActions.setLoading(true));
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${AuthCookie.token}`;
    const { data, status } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/auth/refresh"
    );
    dispatch(authActions.setLoading(false));

    if (status === 200) {
      AuthCookie.set(data);
      dispatch(authActions.setCredential(data.user));
    }
  };
};

export const me = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(authActions.setLoading(true));
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${AuthCookie.token}`;
    const { data, status } = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/me"
    );
    dispatch(authActions.setLoading(false));

    if (status === 200) {
      dispatch(authActions.setCredential(data));
    }
  };
};
