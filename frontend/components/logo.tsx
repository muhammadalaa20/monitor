'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2 font-bold text-green-400 text-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -5, color: '#22c55e' }}
    >
      <Image
        src="/logo.svg"
        alt="Logo"
        className="h-6 w-6"
        width={24}
        height={24}
      />
      Device Monitor
    </motion.div>
  );
}
