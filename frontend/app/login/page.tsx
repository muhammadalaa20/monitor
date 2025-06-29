"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasRedirected, setHasRedirected] = useState(false);

  // ✅ Centralized redirect only after login
  useEffect(() => {
    if (user && !hasRedirected) {
      toast.success(`Welcome back, ${user.username}! Redirecting...`);
      setHasRedirected(true);
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
    }
  }, [user, router, hasRedirected]);

  const handleSubmit = async () => {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const success = await login(username, password);
      if (!success) {
        toast.error("Invalid credentials");
      }
      // ✅ No redirect here — it's handled in useEffect
    } catch (err) {
      toast.error(
        "Login failed. Please try again. " +
          (err instanceof Error ? err.message : "")
      );
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0c0c0c] text-white flex items-center justify-center px-6 py-16">
      {/* Mobile video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.5] z-0"
      >
        <source src="/hero2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 z-0 lg:hidden" />

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-lg p-8 rounded-xl border border-gray-700 shadow-lg space-y-6">
        <div className="text-center space-y-1">
          <span className="text-sm text-gray-400 uppercase tracking-wide font-medium">
            Welcome Back
          </span>
          <h2 className="text-3xl font-bold">Login to Monitor</h2>
          <p className="text-sm text-gray-400">
            Access your dashboard and stay in control.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Username:
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#1a1a1a] border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              Password:
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1a1a1a] border-gray-700 text-white"
            />
          </div>
          <Button
            size="lg"
            className="w-full  text-black font-semibold bg-green-500 hover:bg-green-600 cursor-pointer transition-all duration-300"
            onClick={handleSubmit}
          >
            Login
          </Button>
        </div>

        <div className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-white underline hover:text-gray-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
