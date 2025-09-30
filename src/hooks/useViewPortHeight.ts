import { useEffect, useState } from "react";

export function useViewportHeight() {
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      if (window.visualViewport) {
        setVh(window.visualViewport.height);
      } else {
        setVh(window.innerHeight);
      }
    }

    handleResize();
    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return vh;
}
