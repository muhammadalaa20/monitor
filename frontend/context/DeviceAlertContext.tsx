// context/DeviceAlertContext.tsx
"use client";
import { API_BASE_URL } from "@/lib/config";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { playAlertSound } from "../lib/alerts";
import { useAuth } from "@/context/AuthContext";

type DeviceInfo = {
  name: string;
  status: boolean;
};
type DeviceMap = Record<number, DeviceInfo>;

type AlertState = Record<number, boolean>; // deviceId => enabled

const DeviceAlertContext = createContext<{
  alertState: AlertState;
  toggleAlert: (deviceId: number) => void;
}>({ alertState: {}, toggleAlert: () => { } });

export function useDeviceAlertContext() {
  return useContext(DeviceAlertContext);
}

export const DeviceAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertState, setAlertState] = useState<AlertState>(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("global-alert-state");
    return saved ? JSON.parse(saved) : {};
  });
  const { user } = useAuth();
  const [devices, setDevices] = useState<DeviceMap>({});

  const toggleAlert = (id: number) => {
    setAlertState((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("global-alert-state", JSON.stringify(updated));
      return updated;
    });
  };


  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.token) return; // Avoid request if not authenticated

      try {
        const res = await fetch(`${API_BASE_URL}/api/devices`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected an array but got:", data);
          return;
        }

        const deviceMap: DeviceMap = {};
        data.forEach((d) => {
          deviceMap[d.id] = { name: d.name, status: d.status === 1 };
        });

        setDevices(deviceMap);
      } catch (e) {
        console.error("Failed to fetch device statuses", e);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [user?.token]);

  // Repeating alert loop
  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(alertState).forEach(([idStr, enabled]) => {
        const id = parseInt(idStr);
        const device = devices[id];
        if (enabled && device && !device.status) {
          toast.error(`${device.name} is offline`,
            {
              className: "bg-red-900 text-white border border-red-500",
              dismissible: true,
              icon: "🔴",
            }
          );
          playAlertSound();
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [alertState, devices]);

  return (
    <DeviceAlertContext.Provider value={{ alertState, toggleAlert }}>
      {children}
    </DeviceAlertContext.Provider>
  );
};
