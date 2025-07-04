"use client";
import { API_BASE_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { EditDeviceModal } from "@/components/EditDeviceModal";
import { DeleteDeviceModal } from "@/components/DeleteDeviceModal";
import { useRouter } from "next/navigation";
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
  LucideArrowLeft,
  LucideCpu,
  LucideServer,
  LucideWifi,
  LucideActivity,
  LucidePcCase,
  LucideHome,
  LucideTimer,
  LucideInfo,
} from "lucide-react";

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
  const [relatedDevices, setRelatedDevices] = useState<Device[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Avoid premature redirect before user is loaded
    const auth = localStorage.getItem("auth");

    if (!auth) {
      router.replace("/login");
    }
  }, [user?.token, router]);
  useEffect(() => {
    if (user === null) return;
    if (!user?.token) {
      setError("You must be logged in to view this page.");
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user?.token) {
      console.warn("🔐 No token found in user object");
      return;
    }

    const fetchDevice = async () => {
      try {
        console.log("🔐 Using token:", user.token);

        const res = await fetch(
          `${API_BASE_URL}/api/devices/${deviceId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error(`❌ Fetch failed [${res.status}]: ${text}`);
          throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        setDevice(data);
      } catch (err) {
        setError("Failed to fetch device.");
        console.error(err);
      }
    };
    fetchDevice();
    const interval = setInterval(fetchDevice, 1000);
    return () => clearInterval(interval);
  }, [deviceId, user?.token]);

  useEffect(() => {
    if (!user?.token || !device?.place) return;

    const fetchRelatedDevices = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/devices/place/${encodeURIComponent(
            device.place
          )}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter((d: Device) => d.id !== device.id);
          setRelatedDevices(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch related devices:", error);
      }
    };

    fetchRelatedDevices();
    const interval = setInterval(fetchRelatedDevices, 1000);
    return () => clearInterval(interval);
  }, [device?.place, user?.token, device?.id]);

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!device)
    return <div className="p-8 text-white">Loading device data...</div>;

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
        className="relative z-10 flex flex-col items-start justify-start min-h-screen w-full p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Row with Buttons */}
        <div className="flex items-center justify-between w-full pr-8 pl-8">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-2 border rounded-full border-green-600 text-green-400 hover:bg-green-800/20 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="border-green-500 text-green-400 hover:bg-green-900/20">
                <LucideArrowLeft className="h-5 w-5" />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <EditDeviceModal
              device={device}
              onUpdated={() => window.location.reload()}
            />
            <DeleteDeviceModal
              deviceId={device.id}
              onDeleted={() => (window.location.href = "/dashboard")}
            />
          </div>
        </div>

        {/* Device Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-8 w-full">
          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Device Name</h1>
                  <LucideCpu className="h-5 w-5 text-green-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">{device.name}</CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Type</h1>
                  <LucideServer className="h-5 w-5 text-cyan-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">{device.type}</CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
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

          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Status</h1>
                  <LucideWifi
                    className={`h-5 w-5 ${
                      device.status ? "text-green-400" : "text-red-400"
                    }`}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <span className="inline-flex items-center gap-1">
                <motion.span
                  className={`w-2.5 h-2.5 rounded-full ${
                    device.status ? "bg-green-400" : "bg-red-400"
                  }`}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                />
                <span
                  className={device.status ? "text-green-400" : "text-red-400"}
                >
                  {device.status ? "Online" : "Offline"}
                </span>
              </span>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Uptime</h1>
                  <LucideActivity className="h-5 w-5 text-purple-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              {formatUptime(device.uptime_seconds)}
            </CardContent>
          </Card>

          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
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
          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
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
          <Card className="bg-[#111] border border-green-600 w-full hover:bg-gradient-to-r from-green-700/30 to-green-900/20">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                <div className="flex items-center justify-between">
                  <h1>Description</h1>
                  <LucideInfo className="h-5 w-5 text-yellow-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              {device.description}
            </CardContent>
          </Card>
        </div>
        {relatedDevices.length > 0 && (
          <div className="w-full px-8 mt-4">
            <h2 className="text-xl font-semibold text-white mb-2">
              Other Devices in the same place
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {relatedDevices.map((d) => (
                <Link key={d.id} href={`/device/${d.id}`}>
                  <Card
                    className={`min-h-[150px] flex flex-col justify-between transition-all hover:scale-105 cursor-pointer ${
                      d.status
                        ? "bg-[#111] border border-green-600 hover:bg-green-800/10"
                        : "bg-[#1a0000] border border-red-600 hover:bg-red-800/10"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-green-400 text-md flex justify-between items-center">
                        {d.name}
                        <motion.span
                          className={`w-2 h-2 rounded-full ${
                            d.status ? "bg-green-400" : "bg-red-400"
                          }`}
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [1, 0.7, 1],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            repeatType: "loop",
                          }}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white text-sm">
                      <p className="text-sm text-gray-400">{d.ip}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
