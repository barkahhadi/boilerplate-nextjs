/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Sat Jul 22 2023 10:13:05 PM
 * File: useFirstRender.tsx
 * Description: First Render Hook
 */

import { useEffect, useRef } from "react";

export function useFirstRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}
