import { useCallback, useState, useEffect, type JSX } from "react";
import { Button } from "../ui/button";
import { Maximize, Minimize } from "lucide-react";

// Vendor-prefixed APIs for elements
interface FullscreenHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => void; // IE11 doesn’t return a Promise
}

// Vendor-prefixed APIs for document
interface FullscreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => void;
}

export default function FullscreenButton(): JSX.Element {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleToggleFullscreen = useCallback<() => void>(() => {
    const elem: FullscreenHTMLElement =
      document.documentElement as FullscreenHTMLElement;
    const doc: FullscreenDocument = document as FullscreenDocument;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        void elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        void elem.webkitRequestFullscreen(); // Safari
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); // IE11
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        void document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        void doc.webkitExitFullscreen(); // Safari
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen(); // IE11
      }
    }
  }, []);

  useEffect((): (() => void) => {
    const handleChange = (): void => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  return (
    <Button onClick={handleToggleFullscreen}>
      {isFullscreen ? <Minimize /> : <Maximize />}
    </Button>
  );
}
