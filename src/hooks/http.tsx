/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Wed Jul 05 2023 6:44:21 PM
 * File: http.tsx
 * Description: Custom hook for handling http requests.
 */

import axios from "axios";
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

  const mutate = useCallback(
    async (config: HttpRequestConfig, onSuccess?: Function) => {
      setIsLoading(true);
      setError(null);

      const url: string =
        config.baseURL || config.external
          ? config.baseURL
          : `${process.env.NEXT_PUBLIC_API_URL}${config.url}`;
      try {
        const response = await axios({
          method: config.method,
          url: url,
          data: config.data,
          headers: config.headers,
        });
        setIsLoading(false);
        if (onSuccess) {
          onSuccess(response);
        }
        return response;
      } catch (err: unknown) {
        setIsLoading(false);
        if (err instanceof Error) {
          setError(err.message || "Something went wrong!");
        }
        return false;
      }
    },
    []
  );

  const post = useCallback(
    async (config: HttpRequestConfig, onSuccess?: Function) => {
      config.method = "post";
      return mutate(config, onSuccess);
    },
    [mutate]
  );

  const put = useCallback(
    async (config: HttpRequestConfig, onSuccess?: Function) => {
      config.method = "put";
      mutate(config, onSuccess);
    },
    [mutate]
  );

  const patch = useCallback(
    async (config: HttpRequestConfig, onSuccess?: Function) => {
      config.method = "patch";
      mutate(config, onSuccess);
    },
    [mutate]
  );

  const del = useCallback(
    async (config: HttpRequestConfig, onSuccess?: Function) => {
      config.method = "delete";
      mutate(config, onSuccess);
    },
    [mutate]
  );

  const get = useCallback(
    async (config: HttpRequestConfig, onSuccess?: Function) => {
      setIsLoading(true);
      setError(null);
      const url: string =
        config.baseURL || config.external
          ? config.baseURL
          : `${process.env.NEXT_PUBLIC_API_URL}${config.url}`;
      try {
        const response = await axios.get(url);
        setIsLoading(false);
        if (onSuccess) {
          onSuccess(response);
        }
        return response;
      } catch (err: unknown) {
        setIsLoading(false);
        if (err instanceof Error) {
          setError(err.message || "Something went wrong!");
        }
        return false;
      }
    },
    []
  );

  return {
    isLoading,
    error,
    post,
    get,
    put,
    patch,
    del,
  };
};

export { useHttp };
