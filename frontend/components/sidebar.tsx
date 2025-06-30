'use client';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] border-r border-green-500 z-50 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-green-400">Places</h2>
        <button onClick={onClose}>
          <X className="text-white w-5 h-5" />
        </button>
      </div>
      <ul className="space-y-4 text-white text-sm">
        <li className="hover:text-green-400 cursor-pointer">HQ</li>
        <li className="hover:text-green-400 cursor-pointer">Branch A</li>
        <li className="hover:text-green-400 cursor-pointer">Branch B</li>
        <li className="hover:text-green-400 cursor-pointer">Remote</li>
      </ul>
    </motion.aside>
  );
}
