import { use, useCallback, useEffect, useRef, useState } from "react";

// First Render Hook
export function useFirstRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}

// Slugify Hook
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
