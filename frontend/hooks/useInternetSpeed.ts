// hooks/useInternetSpeed.ts
import { useState, useCallback } from "react";

export function useInternetSpeed() {
  const [speed, setSpeed] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const checkSpeed = useCallback(() => {
    const imageUrl =
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Sky_Tree_2012.JPG";
    const imageSizeBytes = 8185374;
    const startTime = new Date().getTime();
    const download = new Image();

    setLoading(true);
    download.src = imageUrl + "?cacheBuster=" + startTime;

    download.onload = () => {
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = imageSizeBytes * 8;
      const speedMbps = bitsLoaded / duration / 1024 / 1024;

      setSpeed(Number(speedMbps.toFixed(2)));
      setLoading(false);
    };

    download.onerror = () => {
      setSpeed(null);
      setLoading(false);
    };
  }, []);

  return { speed, loading, checkSpeed };
}
