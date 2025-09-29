import { useCallback } from "react";
import { Button } from "./ui/button";

export default function FullscreenButton() {
  const handleFullscreen = useCallback(() => {
    const elem = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      // Safari
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE11
      elem.msRequestFullscreen();
    }
  }, []);

  return (
    <Button
      onClick={handleFullscreen}
      //   className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Go Fullscreen
    </Button>
  );
}
