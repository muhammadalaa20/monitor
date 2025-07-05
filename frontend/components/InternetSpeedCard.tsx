"use client";

import { useEffect } from "react";
import { useInternetSpeed } from "@/hooks/useInternetSpeed";
import { LucideRefreshCcw, LucideWifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InternetSpeedCard() {
  const { speed, loading, checkSpeed } = useInternetSpeed();

  useEffect(() => {
    checkSpeed();
  }, [checkSpeed]);

  const getStatusTheme = () => {
    if (loading) {
      return {
        bg: "bg-[#1f1f00]",
        border: "border-yellow-400/40",
        text: "text-yellow-400",
        glow: "glow-yellow",
      };
    }

    if (speed) {
      return {
        bg: "bg-[#0c0c0c]",
        border: "border-green-400/40",
        text: "text-green-400",
        glow: "glow-green",
      };
    }

    return {
      bg: "bg-[#1a0c0c]",
      border: "border-red-400/40",
      text: "text-red-400",
      glow: "glow-red",
    };
  };

  const theme = getStatusTheme();

  return (
    <Card
      className={`${theme.bg} border ${theme.border} rounded-xl shadow-lg w-full transition-colors duration-500`}
    >
      <CardHeader className="flex items-center justify-between px-6">
        <CardTitle
          className={`text-sm ${theme.text} font-semibold tracking-wide ${theme.glow}`}
        >
          Internet Speed
        </CardTitle>

        <button
          onClick={checkSpeed}
          disabled={loading}
          title="Check Again"
          className={`${theme.text} relative`}
        >
          <LucideRefreshCcw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          {loading && (
            <div
              className={`absolute inset-0 rounded-full border ${theme.text} animate-ping opacity-30`}
            />
          )}
        </button>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-between h-full px-4">
        <div
          key={speed ?? "loading"}
          className={`text-4xl font-extrabold tracking-tight ${theme.text} ${theme.glow}`}
        >
          {loading ? <span className="animate-pulse">...</span> : speed ?? "0"}
        </div>
        <div className={`${theme.text} text-xs tracking-widest`}>Mbps</div>

        <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full border border-gray-700 bg-[#1a1a1a] shadow-inner">
          <LucideWifi className={`w-4 h-4 ${theme.text}`} />
          <span className={`text-xs font-semibold ${theme.text}`}>
            {loading ? "Checking..." : speed ? "Connected" : "Disconnected"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
