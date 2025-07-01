"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  LucideServer,
  LucideWifi,
  LucideActivity,
  LucideMenu,
  LucideX,
  LucidePcCase,
  LucideRocket,
  LucidePercent,
  LucideTurtle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import "chart.js/auto";
import { AddDeviceModal } from "@/components/AddDeviceModal";
import { LogoutButton } from "@/components/Logout";
import { LucideRefreshCcw } from "lucide-react";

function formatSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export interface Device {
  id: number;
  name: string;
  type: string;
  status: number;
  uptime_seconds?: number;
  place: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const lastDevice = [...devices].sort((a, b) => b.id - a.id)[0];
  const mostActiveDevice = devices.length
    ? devices.reduce((prev, curr) =>
        (curr.uptime_seconds || 0) > (prev.uptime_seconds || 0) ? curr : prev
      )
    : null;

  const leastActiveDevice = devices.length
    ? devices.reduce((prev, curr) =>
        (curr.uptime_seconds ?? Infinity) < (prev.uptime_seconds ?? Infinity)
          ? curr
          : prev
      )
    : null;

  useEffect(() => {
    // Avoid premature redirect before user is loaded
    const auth = localStorage.getItem("auth");

    if (!auth) {
      router.replace("/login");
    }
  }, [user?.token, router]);

  useEffect(() => {
    if (user === null) return; // wait until user is hydrated
    if (!user?.token) router.replace("/login");
  }, [user?.token, user, router]);

  const fetchDevices = useCallback(async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/devices", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch devices.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token) return;

    fetchDevices(); // initial fetch

    const interval = setInterval(fetchDevices, 3000); // auto-refresh every 30s

    return () => clearInterval(interval); // cleanup
  }, [user?.token, fetchDevices]);

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 1).length;
  const offlineDevices = totalDevices - onlineDevices;

  const totalUptimeSeconds = devices.reduce(
    (acc, d) => acc + (d.uptime_seconds || 0),
    0
  );
  const avgUptimeSeconds = totalDevices
    ? Math.floor(totalUptimeSeconds / totalDevices)
    : 0;

  const top5Devices = [...devices]
    .filter((d) => typeof d.uptime_seconds === "number")
    .sort((a, b) => (b.uptime_seconds ?? 0) - (a.uptime_seconds ?? 0))
    .slice(0, 5);

  const devicesPerPlace = devices.reduce((acc: Record<string, number>, d) => {
    acc[d.place] = (acc[d.place] || 0) + 1;
    return acc;
  }, {});

  if (loading || !user) return null;

  // Refetch devices function after adding a new device
  const refetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/devices", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch devices.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      {/* 🔹 Layout */}
      <div className="relative z-10 flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} devices={devices} />

        <div className="flex-1 px-4 py-6 sm:px-6 space-y-6">
          {/* 🔹 Topbar */}
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2">
              {/* Welcome Message */}
              <p className="text-md hidden sm:block">
                Welcome,{" "}
                <span className="font-semibold text-green-400">
                  {user?.username}
                </span>
              </p>
              {/* Refresh Button */}
              <div
                onClick={fetchDevices}
                className="p-2 rounded-md border border-green-500 hover:bg-green-900/20 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <LucideRefreshCcw className="w-5 h-5 text-green-400" />
              </div>
              {/* Add Device Modal */}
              <AddDeviceModal onDeviceAdded={refetchDevices} />
              {/* Toggle Sidebar */}
              <motion.button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="p-2 border border-green-500 rounded-md hover:bg-green-900/20 transition cursor-pointer hover:scale-105 active:scale-95"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle Sidebar"
              >
                <AnimatePresence mode="wait">
                  {sidebarOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LucideX className="text-green-400 w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LucideMenu className="text-green-400 w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Logout Button */}
              <LogoutButton />
            </div>
          </div>

          {/* 🔹 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Devices"
              value={`${totalDevices}`}
              icon={<LucideServer className="w-5 h-5 text-white" />}
            />
            <StatCard
              title="Online Devices"
              value={`${onlineDevices}`}
              icon={<LucideWifi className="w-5 h-5 text-green-400" />}
            />
            <StatCard
              title="Offline Devices"
              value={`${offlineDevices}`}
              icon={<LucideWifi className="w-5 h-5 text-red-500" />}
            />
            <StatCard
              title="Avg. Uptime"
              value={formatSeconds(avgUptimeSeconds)}
              icon={<LucideActivity className="w-5 h-5 text-purple-400" />}
            />
            <StatCard
              title="Last Created Device"
              icon={<LucidePcCase className="w-5 h-5 text-green-400" />}
            >
              {lastDevice ? (
                <div className="text-sm text-gray-300 space-y-1 pt-2">
                  <div>
                    <span className="font-semibold text-white">Name:</span>{" "}
                    {lastDevice.name}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Type:</span>{" "}
                    {lastDevice.type}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Place:</span>{" "}
                    {lastDevice.place}
                  </div>
                  <div>
                    <div>
                      <span className="font-semibold text-white">Status:</span>{" "}
                      <span className="inline-flex items-center gap-1">
                        <motion.span
                          className={`w-2.5 h-2.5 rounded-full ${
                            lastDevice.status ? "bg-green-400" : "bg-red-400"
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
                          className={
                            lastDevice.status
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {lastDevice.status ? "Online" : "Offline"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm pt-2">
                  No devices yet.
                </div>
              )}
            </StatCard>
            <StatCard
              title="Most Active Device"
              icon={<LucideRocket className="w-5 h-5 text-orange-400" />}
            >
              {mostActiveDevice ? (
                <div className="text-sm text-gray-300 pt-2 space-y-1">
                  <div>
                    <strong className="text-white">Name:</strong>{" "}
                    {mostActiveDevice.name}
                  </div>
                  <div>
                    <strong className="text-white">Uptime:</strong>{" "}
                    {formatSeconds(mostActiveDevice.uptime_seconds || 0)}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Place:</span>{" "}
                    {mostActiveDevice.place}
                  </div>
                  <div>
                    <div>
                      <span className="font-semibold text-white">Status:</span>{" "}
                      <span className="inline-flex items-center gap-1">
                        <motion.span
                          className={`w-2.5 h-2.5 rounded-full ${
                            mostActiveDevice.status
                              ? "bg-green-400"
                              : "bg-red-400"
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
                          className={
                            mostActiveDevice.status
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {mostActiveDevice.status ? "Online" : "Offline"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm pt-2">
                  No data available.
                </div>
              )}
            </StatCard>
            <StatCard
              title="Last Offline Device"
              icon={<LucideTurtle className="w-5 h-5 text-yellow-400" />}
            >
              {leastActiveDevice ? (
                <div className="text-sm text-gray-300 pt-2 space-y-1">
                  <div>
                    <strong className="text-white">Name:</strong>{" "}
                    {leastActiveDevice.name}
                  </div>
                  <div>
                    <strong className="text-white">Uptime:</strong>{" "}
                    {formatSeconds(leastActiveDevice.uptime_seconds || 0)}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Place:</span>{" "}
                    {leastActiveDevice.place}
                  </div>
                  <div>
                    <div>
                      <span className="font-semibold text-white">Status:</span>{" "}
                      <span className="inline-flex items-center gap-1">
                        <motion.span
                          className={`w-2.5 h-2.5 rounded-full ${
                            leastActiveDevice.status ? "bg-green-400" : "bg-red-400"
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
                          className={
                            leastActiveDevice.status
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {leastActiveDevice.status ? "Online" : "Offline"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm pt-2">
                  No data available.
                </div>
              )}
            </StatCard>

            <StatCard
              title="Online Ratio"
              icon={<LucidePercent className="w-5 h-5 text-blue-400" />}
            >
              <div className="text-2xl font-bold text-white pt-2">
                {totalDevices > 0
                  ? `${Math.round((onlineDevices / totalDevices) * 100)}%`
                  : "N/A"}
              </div>
            </StatCard>
          </div>

          {/* 🔹 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#111] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Devices Per Place
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[280px]">
                <Pie
                  data={{
                    labels: Object.keys(devicesPerPlace),
                    datasets: [
                      {
                        data: Object.values(devicesPerPlace),
                        backgroundColor: [
                          "#22c55e",
                          "#16a34a",
                          "#15803d",
                          "#166534",
                          "#14532d",
                        ],
                      },
                    ],
                  }}
                  options={{ maintainAspectRatio: false }}
                />
              </CardContent>
            </Card>

            <Card className="bg-[#111] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Top 5 Devices by Uptime
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[280px]">
                <Bar
                  data={{
                    labels: top5Devices.map((d) => d.name),
                    datasets: [
                      {
                        label: "Uptime (s)",
                        data: top5Devices.map((d) => d.uptime_seconds ?? 0),
                        backgroundColor: "#22c55e",
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        ticks: { color: "#aaa" },
                      },
                      x: {
                        ticks: { color: "#aaa" },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `${formatSeconds(Number(ctx.raw))}`,
                        },
                      },
                      legend: {
                        labels: { color: "#ccc" },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  children,
}: {
  title: string;
  value?: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="bg-[#111] border border-gray-700 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-300 font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value && (
          <div className="text-2xl font-bold text-green-400">{value}</div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
