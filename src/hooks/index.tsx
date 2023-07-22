import { use, useCallback, useEffect, useRef, useState } from "react";
import { useSlugify } from "./useSlugify";
import { useFirstRender } from "./useFirstRender";
import { useHttp } from "./useHttp";
import { AxiosError, AxiosResponse } from "axios";

export interface RequestCallback {
  onError?: (error: AxiosError) => void;
  onSuccess?: (res: AxiosResponse) => void;
}

export { useSlugify, useFirstRender, useHttp };
