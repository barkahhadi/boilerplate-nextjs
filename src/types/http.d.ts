import {
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
} from "axios";
import { type } from "os";

export type HttpRequestConfig = AxiosRequestConfig & {
  method?: "get" | "post" | "put" | "delete" | "patch" = "get";
  url: string;
  data?: any;
  external?: boolean = false;
};

export type HttpResponse<T = any> = AxiosResponse<T>;

export type HeaderProperties = HeadersDefaults & {
  Authorization?: string;
};
