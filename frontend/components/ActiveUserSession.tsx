'use client';
import { useState, useEffect, useCallback } from "react";
import { RotateCw } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

function getDuration(logonTime: string) {
    const logon = new Date(logonTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - logon.getTime()) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h}h ${m}m ${s}s`;
}

interface UserLog {
    id: number;
    logonTime: string;
    logoffTime: string;
    username: string;
    sessionName: string;
    logon_time: string;
    // Add other properties as needed
}
interface Log {
    state: string;
    collected_at: string;
}

export function ActiveUserSession({
    deviceId,
    isOnline,
    token,
}: {
    deviceId: number;
    isOnline: boolean;
    token: string;
}) {
    const [userLog, setUserLog] = useState<UserLog | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLog = async () => {
        if (!isOnline) {
            setUserLog(null);
            return;
        }

        setLoading(true);

        try {
            // 🔁 Step 1: Collect log (POST)
            await fetch(`${API_BASE_URL}/api/devicelogs/${deviceId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // ✅ Step 2: Fetch logs (GET)
            const res = await fetch(`${API_BASE_URL}/api/devicelogs/${deviceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const logs = await res.json();

            // 🔍 Step 3: Pick latest active session
            const activeLog = logs
                .filter((log: Log) => log.state === "Active")
                .sort(
                    (a: Log, b: Log) =>
                        new Date(b.collected_at).getTime() -
                        new Date(a.collected_at).getTime()
                )[0];

            setUserLog(activeLog || null);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Failed to collect or fetch logs:", err);
            setUserLog(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchLogCallback = useCallback(fetchLog, [deviceId, isOnline, token]);

    useEffect(() => {
        fetchLogCallback();
        const interval = setInterval(fetchLogCallback, 30 * 60 * 1000); // every 30 mins
        return () => clearInterval(interval);
    }, [deviceId, fetchLogCallback]);

    return (
        <div className="flex items-center gap-2">
            <div className="flex md:flex-row flex-col items-start md:items-center text-xs md:text-lg md:gap-6 gap-1 text-white rounded w-fit max-w-full">

                {!isOnline ? (
                    <span className="text-sm text-red-400 whitespace-nowrap">
                        No Active Session. The device is offline.
                    </span>
                ) : userLog ? (
                    <>
                        <span className="text-sm text-gray-400 whitespace-nowrap">
                            <span className="text-gray-400">Username:</span>{" "}
                            <span className="text-green-300">{userLog.username}</span>
                        </span>
                        <span className="text-sm text-gray-400whitespace-nowrap ">
                            <span className="text-gray-400">Session Time:</span>{" "}
                            <span className="text-blue-300">{getDuration(userLog.logon_time)}</span>
                        </span>
                        <span className="text-sm text-gray-400 whitespace-nowrap md:block hidden">
                            Updated:{" "}
                            {lastUpdated?.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </>
                ) : (
                    <span className="text-yellow-400 whitespace-nowrap">
                        No active session found.
                    </span>
                )}
            </div>
            <button
                onClick={fetchLog}
                className="p-2 border border-green-600 text-green-400 rounded-md hover:bg-green-800/20 transition hover:scale-105 active:scale-95 cursor-pointer"
                disabled={loading}
                title="Refresh User Session"
            >
                <RotateCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </button>
        </div>
    );
}
