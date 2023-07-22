/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Sat Jul 22 2023 10:03:25 PM
 * File: useSlugify.tsx
 * Description: Slugify Hook
 * This function slugifies a string, removing all non-word characters,
 * replacing all spaces with hyphens, and trimming hyphens from the beginning and end of the string.
 */

import { useCallback, useEffect, useState } from "react";

export function useSlugify(defaultText: string = "") {
  const [slugify, setSlugify] = useState(defaultText);

  const handleSlugify = useCallback((value: string) => {
    const convert = value
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text

    setSlugify(convert);
    return convert;
  }, []);

  useEffect(() => {
    handleSlugify(defaultText);
  }, [defaultText, handleSlugify]);

  return [slugify, handleSlugify] as const;
}
