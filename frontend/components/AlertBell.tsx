import { Bell } from "lucide-react";
import { useDeviceAlertContext } from "@/context/DeviceAlertContext";

export default function AlertBell({ deviceId }: { deviceId: number }) {
  const { alertState, toggleAlert } = useDeviceAlertContext();
  const enabled = alertState[deviceId];

  return (
    <button onClick={() => toggleAlert(deviceId)} title="Toggle Alert" className="hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
      <Bell className={`w-5 h-5 ${enabled ? "text-green-500" : "text-red-500"}`} />
    </button>
  );
}
