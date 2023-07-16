/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Wed Jul 05 2023 6:44:21 PM
 * File: http.tsx
 * Description: Custom hook for handling http requests.
 */

import axios, { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { HttpRequestConfig } from "@/types/http";
import AuthCookie from "@utils/cookies/auth";
import { useAppSelector } from "@/store";
import { AuthState } from "@/store/slice/auth";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated }: AuthState = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${AuthCookie.token}`;
  }

  const request = useCallback(
    async (
      config: HttpRequestConfig,
      onSuccess?: Function,
      onError?: Function
    ) => {
      setIsLoading(true);
      setError(null);

      const url: string = `${process.env.NEXT_PUBLIC_API_URL}${config.url}`;
      try {
        const axiosConfig: any = {
          method: config.method,
          url: url,
          headers: config.headers,
        };
        if (config.data) {
          axiosConfig.data = config.data;
        }

        const response = await axios(axiosConfig);
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
        }
        onError && onError(err);
        throw err;
      }
    },
    []
  );

  const post = useCallback(
    async (
      url: string,
      data: any,
      onSuccess?: Function,
      onError?: Function
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
      onSuccess?: Function,
      onError?: Function
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
      onSuccess?: Function,
      onError?: Function
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
    async (url: string, onSuccess?: Function, onError?: Function) => {
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
    async (url: string, onSuccess?: Function, onError?: Function) => {
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
