/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Wed Jul 05 2023 6:44:21 PM
 * File: http.tsx
 * Description: Custom hook for handling http requests.
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import { useState, useCallback } from "react";
import { HttpRequestConfig } from "@/types/http";
import AuthCookie from "@utils/cookies/auth";
import { useAppSelector, useAppDispatch, AppDispatch } from "@/store";
import { AuthState } from "@/store/slice/auth";
import { refreshToken, logout } from "@/store/thunk/auth";
import { ThunkDispatch } from "redux-thunk";
import { openNotification } from "@/store/thunk/app";
import { RequestCallback } from ".";

const createAxiosInstance = (dispatch: AppDispatch): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const token = AuthCookie.token;

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        try {
          await dispatch(refreshToken());

          return axios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${AuthCookie.token}`,
            },
          });
        } catch (err: unknown) {
          console.log(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const request = useCallback(
    async (
      config: HttpRequestConfig,
      onSuccess?: Function,
      onError?: Function
    ) => {
      const axiosInstance = createAxiosInstance(dispatch);
      setIsLoading(true);
      setError(null);

      try {
        const axiosConfig: any = {
          method: config.method,
          url: config.url,
        };
        if (config.data) {
          axiosConfig.data = config.data;
        }

        const response = await axiosInstance(axiosConfig);
        setIsLoading(false);
        if (onSuccess) {
          onSuccess(response);
        }
        return response;
      } catch (err: unknown) {
        setIsLoading(false);
        if (err instanceof AxiosError) {
          if (err.response && err.response.data.message) {
            setError(err.response.data.message);
          }

          if (err.response?.status !== 401) {
            if (onError) {
              onError(err);
            } else {
              dispatch(
                openNotification({
                  type: "error",
                  message: "Error " + err.response?.data.statusCode,
                  description: err.response?.data.message || null,
                })
              );
            }
          }
        }
      }
    },
    []
  );

  const post = useCallback(
    async (
      url: string,
      data: any,
      { onSuccess = null, onError = null }: RequestCallback = {}
    ) => {
      return request(
        {
          url: url,
          data: data,
          method: "post",
        },
        onSuccess,
        onError
      );
    },
    [request]
  );

  const put = useCallback(
    async (
      url: string,
      data: any,
      { onSuccess = null, onError = null }: RequestCallback = {}
    ) => {
      return request(
        {
          url: url,
          data: data,
          method: "put",
        },
        onSuccess,
        onError
      );
    },
    [request]
  );

  const patch = useCallback(
    async (
      url: string,
      data: any,
      { onSuccess = null, onError = null }: RequestCallback = {}
    ) => {
      return request(
        {
          url: url,
          data: data,
          method: "patch",
        },
        onSuccess,
        onError
      );
    },
    [request]
  );

  const del = useCallback(
    async (
      url: string,
      { onSuccess = null, onError = null }: RequestCallback = {}
    ) => {
      return request(
        {
          url: url,
          method: "delete",
        },
        onSuccess,
        onError
      );
    },
    [request]
  );

  const get = useCallback(
    async (
      url: string,
      { onSuccess = null, onError = null }: RequestCallback = {}
    ) => {
      return request(
        {
          url: url,
          method: "get",
        },
        onSuccess,
        onError
      );
    },
    [request]
  );

  return {
    isLoading,
    error,
    post,
    get,
    put,
    patch,
    del,
    request,
  };
};

export { useHttp };
