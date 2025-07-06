import { LucideRss } from "lucide-react";
import { useOnlineAlertContext } from "@/context/OnlineAlertContext";

export default function AlertOnline({ deviceId }: { deviceId: number }) {
  const { onlineState, toggleOnline } = useOnlineAlertContext();
  const enabled = onlineState[deviceId] ?? false;

  return (
    <button
      onClick={() => toggleOnline(deviceId)}
      title={enabled ? "Disable Online alert" : "Enable Online alert"}
      className="hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
    >
      <LucideRss
        className={`w-5 h-5 ${enabled ? "text-green-500 animate-pulse" : "text-red-500"}`}
      />
    </button>
  );
}
