// hooks/useInternetSpeed.ts
import { useEffect, useState } from "react";

export function useInternetSpeed() {
  const [speed, setSpeed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const checkSpeed = async () => {
    setLoading(true);
    const imageLink = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Sky_Tree_2012.JPG";
    const downloadSize = 8185374; // bytes
    const start = new Date().getTime();
    const img = new Image();
    img.src = imageLink + "?nn=" + start;

    img.onload = () => {
      const duration = (new Date().getTime() - start) / 1000;
      const bitsLoaded = downloadSize * 8;
      const mbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
      setSpeed(parseFloat(mbps));
      setLoading(false);
    };

    img.onerror = () => {
      setSpeed(0);
      setLoading(false);
    };
  };

  useEffect(() => {
    checkSpeed();
  }, []);

  return { speed, checkSpeed, loading };
}
