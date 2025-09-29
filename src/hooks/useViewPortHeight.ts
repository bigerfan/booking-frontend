import { useEffect, useState } from "react";

export function useViewportHeight() {
  const [height, setHeight] = useState(
    window.visualViewport?.height ?? window.innerHeight
  );

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    const handleResize = () => setHeight(viewport.height);

    viewport.addEventListener("resize", handleResize);
    viewport.addEventListener("scroll", handleResize); // sometimes keyboard triggers scroll
    return () => {
      viewport.removeEventListener("resize", handleResize);
      viewport.removeEventListener("scroll", handleResize);
    };
  }, []);

  return height;
}
