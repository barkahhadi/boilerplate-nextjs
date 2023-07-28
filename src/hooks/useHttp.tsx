/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Wed Jul 05 2023 6:44:21 PM
 * File: http.tsx
 * Description: Custom hook for handling http requests.
 */

import { AxiosError, AxiosInstance } from "axios";
import { useState, useCallback } from "react";
import { useAppDispatch } from "@/store";
import { refreshToken } from "@/store/thunk/auth";
import { openNotification } from "@/store/thunk/app";
import { Http, RequestCallback, HttpRequestConfig } from "@/utils/http";

export interface HttpConfig {
  onExpiredToken?: (originalRequest: any) => Promise<AxiosInstance>;
}

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
      const http = new Http({
        onExpiredToken: async (originalRequest) => {
          try {
            await dispatch(refreshToken());
          } catch (err: unknown) {
            console.log(err);
          }
        },
      });

      try {
        const axiosConfig: HttpRequestConfig = {
          method: config.method,
          url: config.url,
        };
        if (config.data) {
          axiosConfig.data = config.data;
        }

        setIsLoading(true);
        setError(null);
        const response = await http.request(axiosConfig);

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
