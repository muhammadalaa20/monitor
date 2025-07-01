'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

export default function DevicePageClient({ deviceId }: { deviceId: string }) {
  const { user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
  if (user === undefined) return; // still loading
  if (!user?.token) {
    setError('Not authenticated');
    return;
  }

    const fetchDevice = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setDevice(data);
      } catch (err) {
        setError('Failed to fetch device.');
        console.error(err);
      }
    };

    fetchDevice();
  }, [deviceId, user]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete device.');
      toast.success('Device deleted.');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Delete failed' + (err instanceof Error ? `: ${err.message}` : ''));
    }
  };

  const handleUpdate = () => {
    router.push(`/update/${deviceId}`);
  };

  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;
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

      {/* 🔹 Content */}
      <div className="relative z-10 flex flex-col gap-6 p-6 md:px-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-green-400"
        >
          Device Details
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DeviceCard title="Name" value={device.name} />
          <DeviceCard title="Type" value={device.type} />
          <DeviceCard title="IP Address" value={device.ip} />
          <DeviceCard title="Place" value={device.place} />
          <DeviceCard title="Status" value={device.status ? '🟢 Online' : '🔴 Offline'} />
          <DeviceCard title="Uptime" value={`${device.uptime_seconds} seconds`} />
          <DeviceCard title="Last Seen" value={new Date(device.last_seen).toLocaleString()} />
        </motion.div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Delete
          </button>
        </div>
      </div>
    </main>
  );
}

function DeviceCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="bg-[#111] border border-green-600">
      <CardHeader>
        <CardTitle className="text-sm text-green-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white text-md">{value}</p>
      </CardContent>
    </Card>
  );
}
