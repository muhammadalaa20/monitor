"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Monitor,
  X,
  LucidePrinter,
  Server,
  Router,
  LucideScan,
  Camera,
  Wifi,
  HelpCircle,
  HardDrive,
} from "lucide-react";
import { Device } from "../app/dashboard/page"; // Ensure this matches your data shape
import { Input } from "@/components/ui/input";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  devices: Device[];
}

const deviceTypeIcons: Record<string, React.ReactNode> = {
  PC: <Monitor className="w-4 h-4 text-green-400" />,
  Server: <Server className="w-4 h-4 text-green-400" />,
  Gateway: <HardDrive className="w-4 h-4 text-green-400" />,
  Switch: <Router className="w-4 h-4 text-green-400" />,
  Router: <Router className="w-4 h-4 text-green-400" />,
  Printer: <LucidePrinter className="w-4 h-4 text-green-400" />,
  Scanner: <LucideScan className="w-4 h-4 text-green-400" />,
  Camera: <Camera className="w-4 h-4 text-green-400" />,
  "Access Point": <Wifi className="w-4 h-4 text-green-400" />,
  Other: <HelpCircle className="w-4 h-4 text-green-400" />,
};

export function Sidebar({ open, onClose, devices }: SidebarProps) {
  const [openPlaces, setOpenPlaces] = useState<Record<string, boolean>>({});
  const [ipFilter, setIpFilter] = useState("");

  const filteredDevices = devices.filter(device =>
    device.ip.toLowerCase().includes(ipFilter.toLowerCase())
  );

  if (!open) return null;

  const grouped = filteredDevices.reduce((acc: Record<string, Device[]>, device) => {
    const place = device.place || "Unassigned";
    if (!acc[place]) acc[place] = [];
    acc[place].push(device);
    return acc;
  }, {});

  const togglePlace = (place: string) => {
    setOpenPlaces((prev) => ({ ...prev, [place]: !prev[place] }));
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
        <button
          onClick={onClose}
          aria-label="Close Sidebar"
          className="p-2 border rounded-md border-green-600 text-green-400 hover:bg-green-800/20 transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="text-white w-5 h-5" />
        </button>
      </div>

      <Input
        placeholder="Filter by IP"
        value={ipFilter}
        onChange={(e) => setIpFilter(e.target.value)}
        className="mb-4 border border-green-600 text-green-400 hover:bg-green-800/20 transition hover:scale-105 active:scale-95 cursor-pointer"
      />

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
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-4 mt-2 space-y-1"
              >
                {devs.map((device) => (
                  <li key={device.id}>
                    <Link
                      href={`/device/${device.id}`}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-green-700/20 rounded-md text-sm text-gray-200 transition"
                    >
                      {deviceTypeIcons[device.type] ?? (
                        <HelpCircle className="w-4 h-4 text-green-400" />
                      )}
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
