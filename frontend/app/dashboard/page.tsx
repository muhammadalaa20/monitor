"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  LucideServer,
  LucideWifi,
  LucideActivity,
  LucideMenu,
  LucideX
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import "chart.js/auto";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  interface Device {
    id: string;
    name: string;
    status: number;
    uptime?: number;
    place: string;
  }

  useEffect(() => {
    const fetchDevices = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch("http://localhost:5000/api/devices", {
          headers: { Authorization: `Bearer ${user.token}` },
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
    fetchDevices();
  }, [user?.token]);

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 1).length;
  const offlineDevices = totalDevices - onlineDevices;
  const avgUptime = (
    devices.reduce((acc, d) => acc + (d.uptime ?? 0), 0) / (totalDevices || 1)
  ).toFixed(1);

  const top5Devices = [...devices]
    .filter((d) => typeof d.uptime === "number")
    .sort((a, b) => b.uptime! - a.uptime!)
    .slice(0, 5);

  const devicesPerPlace = devices.reduce((acc: Record<string, number>, d) => {
    acc[d.place] = (acc[d.place] || 0) + 1;
    return acc;
  }, {});

  if (loading || !user) return null;

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Background Video */}
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

      <div className="relative z-10 flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 px-4 py-6 sm:px-6 space-y-6">
          {/* Topbar */}
          <div className="flex items-center justify-between">
            <Logo />
            <motion.button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 border border-green-500 rounded-md hover:bg-green-900/20 transition"
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Devices" value={`${totalDevices}`} icon={<LucideServer className="w-5 h-5 text-green-400" />} />
            <StatCard title="Online Devices" value={`${onlineDevices}`} icon={<LucideWifi className="w-5 h-5 text-green-400" />} />
            <StatCard title="Offline Devices" value={`${offlineDevices}`} icon={<LucideWifi className="w-5 h-5 text-red-500" />} />
            <StatCard title="Avg. Uptime" value={`${avgUptime}%`} icon={<LucideActivity className="w-5 h-5 text-green-400" />} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="bg-[#111] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Devices Per Place</CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[280px]">
                <Pie
                  data={{
                    labels: Object.keys(devicesPerPlace),
                    datasets: [
                      {
                        data: Object.values(devicesPerPlace),
                        backgroundColor: ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"],
                      },
                    ],
                  }}
                  options={{ maintainAspectRatio: false }}
                />
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="bg-[#111] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Top 5 Devices by Uptime</CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[280px]">
                {top5Devices.length > 0 ? (
                  <Bar
                    data={{
                      labels: top5Devices.map((d) => d.name),
                      datasets: [
                        {
                          label: "Uptime (%)",
                          data: top5Devices.map((d) => d.uptime),
                          backgroundColor: "#22c55e",
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          min: 0,
                          max: 100,
                          ticks: { color: "#aaa" },
                        },
                        x: {
                          ticks: { color: "#aaa" },
                        },
                      },
                      plugins: {
                        legend: {
                          labels: { color: "#ccc" },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center pt-10">No data available.</div>
                )}
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
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
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
        <div className="text-2xl font-bold text-green-400">{value}</div>
      </CardContent>
    </Card>
  );
}
