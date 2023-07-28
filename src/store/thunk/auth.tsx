/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Wed Jul 05 2023 9:27:34 PM
 * File: auth.tsx
 * Description: Auth Thunk
 */

import { AppDispatch } from "..";
import { authActions } from "../slice/auth";
import { AxiosError } from "axios";
import AuthCookie from "@utils/cookies/auth";
import Router from "next/router";
import http, { Http } from "@utils/http";

export interface LoginData {
  url: string;
  username: string;
  password: string;
}

export const login = (loginData: LoginData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(authActions.setLoading(true));
    try {
      localStorage.removeItem("ability");
      const { data, status } = await http.post("/auth/login", loginData);
      dispatch(authActions.setLoading(false));

      if (status === 200) {
        AuthCookie.set(data);
        dispatch(authActions.setCredential(data.user));
        dispatch(getPermissions());
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
    localStorage.removeItem("ability");
    dispatch(authActions.removeCredential(null));
    dispatch(authActions.setLoading(false));
  };
};

export const refreshToken = () => {
  return async (dispatch: AppDispatch) => {
    await http
      .post("/auth/refresh", {
        token: AuthCookie.refreshToken,
      })
      .then(({ data }) => {
        AuthCookie.set(data);
        dispatch(authActions.setCredential(data.user));
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 400) {
            dispatch(logout());
            Router.push("/auth/login");
          }
        }
      });
  };
};

export const getPermissions = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.setLoadingPermission(true));
      const { data, status } = await new Http({
        onExpiredToken: async () => {
          try {
            await dispatch(refreshToken());
          } catch (err: unknown) {
            console.log(err);
          }
        },
      }).get("/auth/permissions");
      // Should check if token expired refresh token manually

      if (status === 200) {
        localStorage.removeItem("ability");
        localStorage.setItem("ability", JSON.stringify(data));
        dispatch(authActions.setLoadingPermission(false));
      }
    } catch (err: unknown) {
      throw new Error("Unable to get permissions");
    }
  };
};

export const me = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data, status } = await new Http({
        onExpiredToken: async () => {
          try {
            await dispatch(refreshToken());
          } catch (err: unknown) {
            console.log(err);
          }
        },
      }).get("/me");

      if (status === 200) {
        dispatch(authActions.setCredential(data));
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 401) {
          AuthCookie.remove();
          dispatch(authActions.removeCredential(null));
        }
      }
    }
  };
};
