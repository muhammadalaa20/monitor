'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Monitor, X } from 'lucide-react';
import { Device } from '../app/dashboard/page'; // Ensure this matches your data shape

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  devices: Device[];
}

export function Sidebar({ open, onClose, devices }: SidebarProps) {
  const [openPlaces, setOpenPlaces] = useState<Record<string, boolean>>({});

  if (!open) return null;

  const grouped = devices.reduce((acc: Record<string, Device[]>, device) => {
    const place = device.place || 'Unassigned';
    if (!acc[place]) acc[place] = [];
    acc[place].push(device);
    return acc;
  }, {});

  const togglePlace = (place: string) => {
    setOpenPlaces(prev => ({ ...prev, [place]: !prev[place] }));
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-full w-80 md:w-96 bg-[#0f0f0f] z-50 p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-green-400">Locations</h2>
        <button onClick={onClose} aria-label="Close Sidebar" className='p-2 border rounded-md border-green-600 text-green-400 hover:bg-green-800/20 transition hover:scale-105 active:scale-95 cursor-pointer'>
          <X className="text-white w-5 h-5" />
        </button>
      </div>

      {Object.entries(grouped).map(([place, devs]) => (
        <div key={place} className="mb-4">
          <button
            onClick={() => togglePlace(place)}
            className="flex items-center justify-between w-full px-3 py-2 bg-[#1a1a1a] hover:bg-green-800/30 rounded-md transition"
          >
            <span className="font-medium text-white">{place}</span>
            {openPlaces[place] ? (
              <ChevronDown className="w-4 h-4 text-green-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-green-400" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {openPlaces[place] && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-4 mt-2 space-y-1"
              >
                {devs.map(device => (
                  <li key={device.id}>
                    <Link
                      href={`/device/${device.id}`}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-green-700/20 rounded-md text-sm text-gray-200 transition"
                    >
                      <Monitor className="w-4 h-4 text-green-400" />
                      {device.name}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.aside>
  );
}
