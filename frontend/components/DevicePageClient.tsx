'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link'; { }
interface Device {
  id: number;
  name: string;
  ip: string;
  type: string;
  status: number;
  description: string;
  last_seen: string;
  place: string;
  uptime_seconds: number;
}
import {
  LucideArrowLeft, LucideEdit, LucideTrash2, LucideCpu, LucideServer,
  LucideWifi,
  LucideActivity,
  LucidePcCase,
  LucideHome,
  LucideTimer
} from 'lucide-react';

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function DevicePageClient({ deviceId }: { deviceId: string }) {
  const { user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token) {
      console.warn('🔐 No token found in user object');
      return;
    }

    const fetchDevice = async () => {
      try {
        console.log('🔐 Using token:', user.token);

        const res = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`❌ Fetch failed [${res.status}]: ${text}`);
          throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        setDevice(data);
      } catch (err) {
        setError('Failed to fetch device.');
        console.error(err);
      }
    };

    fetchDevice();
  }, [deviceId, user?.token]);

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!device) return <div className="p-8 text-white">Loading device data...</div>;

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* 🔹 Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.6] z-0"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/80 z-0" />

      {/* 🔹 Device Info */}
      <motion.div
        className="relative z-10 flex flex-col items-start justify-center min-h-screen w-full p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Row with Buttons */}
        <div className="flex items-center justify-between w-full pr-8 pl-8">
          <div className='flex items-center gap-2'>
            <Link href="/dashboard" className='p-2 border rounded-md border-green-600 text-green-400 hover:bg-green-800/20 transition hover:scale-105 active:scale-95 cursor-pointer'>
              <div className="border-green-500 text-green-400 hover:bg-green-900/20">
                <LucideArrowLeft className="h-5 w-5" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-green-400">{device.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 border rounded-md border-yellow-600 text-yellow-400 hover:bg-yellow-800/20 transition hover:scale-105 active:scale-95 cursor-pointer">
              <LucideEdit className="h-5 w-5" />
            </div>
            <div className="p-2 border rounded-md border-red-600 text-red-400 hover:bg-red-800/20 transition hover:scale-105 active:scale-95 cursor-pointer">
              <LucideTrash2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Device Info Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-8 w-full'>
          <Card className="bg-[#111] border border-green-600 w-full">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Device Name</h1><LucideCpu className="h-5 w-5 text-green-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">{device.name}</CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Type</h1><LucideServer className="h-5 w-5 text-cyan-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">{device.type}</CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>IP</h1>
                  <LucidePcCase className="h-5 w-5 text-orange-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">{device.ip}</CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Status</h1>
                  <LucideWifi className={`h-5 w-5 ${device.status ? 'text-green-400' : 'text-red-400'}`} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              {device.status ? '🟢 Online' : '🔴 Offline'}
            </CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Uptime</h1>
                  <LucideActivity className="h-5 w-5 text-purple-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">{formatUptime(device.uptime_seconds)}</CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Last seen</h1>
                  <LucideTimer className="h-5 w-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              {new Date(device.last_seen).toLocaleString()}
            </CardContent>
          </Card>
          <Card className="bg-[#111] border border-green-600 w-full">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Location</h1>
                  <LucideHome className="h-5 w-5 text-blue-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">{device.place}</CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
