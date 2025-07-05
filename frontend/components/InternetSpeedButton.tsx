'use client';

import { motion } from 'framer-motion';
import { LucideRefreshCcw } from 'lucide-react';
import { useState } from 'react';

export function InternetSpeedDisplay() {
  const [speed, setSpeed] = useState(0);
  const [speedLoading, setSpeedLoading] = useState(false);

  const checkSpeed = async () => {
    setSpeedLoading(true);

    const imageLink =
      'https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Sky_Tree_2012.JPG';
    const downloadSize = 8185374; // bytes
    const timeStart = performance.now();

    const img = new Image();
    img.src = imageLink + '?cacheBust=' + Date.now();

    img.onload = () => {
      const timeEnd = performance.now();
      const duration = (timeEnd - timeStart) / 1000;
      const bitsLoaded = downloadSize * 8;
      const speedBps = bitsLoaded / duration;
      const speedMbps = speedBps / (1024 * 1024);

      setSpeed(parseFloat(speedMbps.toFixed(2)));
      setSpeedLoading(false);
    };

    img.onerror = () => {
      setSpeedLoading(false);
      setSpeed(0);
    };
  };

  const formatSpeed = (val: number): string => {
    if (val >= 1000) return `${(val / 1000).toFixed(2)} Gbps`;
    if (val >= 1) return `${val.toFixed(2)} Mbps`;
    return `${(val * 1024).toFixed(0)} Kbps`;
  };

  return (
    <div className="flex items-center text-sm sm:text-base w-fit">
      <button
        onClick={checkSpeed}
        title="Check Internet Speed"
        className="text-blue-400 hover:text-blue-200 transition cursor-pointer hover:scale-110 active:scale-95 rounded-lg bg-blue-900/20 border border-blue-800 backdrop-blur-sm shadow-sm p-2"
      >
        <LucideRefreshCcw className={`w-5 h-5 ${speedLoading ? 'animate-spin' : ''}`} />
      </button>
      <motion.div
        key={speed} // triggers animation on change
        initial={{ opacity: 0.6, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-blue-300 font-mono text-[15px] sm:text-md min-w-[90px] text-right"
      >
        {speedLoading ? '.........' : formatSpeed(speed)}
      </motion.div>
    </div>
  );
}
