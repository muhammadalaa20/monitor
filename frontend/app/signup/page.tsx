"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      toast.info("You are already logged in.");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
    }
  }, [user, router]);

  const handleSignup = async () => {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Register
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Account created! Logging in...");

      // Step 2: Login using context method
      const success = await login(username, password);
      if (success) {
        setTimeout(() => {
          router.replace("/dashboard"); // Redirect centralized
        });
      } else {
        toast.error("Login after signup failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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

      {/* Signup form */}
      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-lg p-8 rounded-xl border border-gray-700 shadow-lg space-y-6">
        <div className="text-center space-y-1">
          <span className="text-sm text-gray-400 uppercase tracking-wide font-medium">
            Create Account
          </span>
          <h2 className="text-3xl font-bold">Sign Up to Monitor</h2>
          <p className="text-sm text-gray-400">
            Join and start monitoring instantly.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="mb-2">
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
            className="w-full text-black font-semibold bg-green-500 hover:bg-green-600 cursor-pointer transition-all duration-300"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-white underline hover:text-gray-300"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
