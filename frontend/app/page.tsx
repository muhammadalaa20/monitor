'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      toast(`Welcome back, ${user.username}!`, {
        description: 'Redirecting to your dashboard...',
      });
      setTimeout(() => router.push('/dashboard'), 1000);
    }
  }, [user, router]);

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* ===== Desktop Layout ===== */}
      <div className="hidden lg:flex relative z-10 flex-row min-h-screen">
        {/* Left: Video */}
        <div className="w-3/4 relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
          >
            <source src="/hero1.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right: CTA */}
        <div className="w-1/2 flex items-center justify-center px-6 py-24 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0c0c0c]">
          <div className="text-start space-y-6 w-full max-w-xl">
            {/* Neon Label */}
            <span className="inline-block text-sm text-green-400 font-semibold uppercase border border-green-400 rounded-full px-3 py-1 shadow-md">
              Reimagined
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Device Monitoring
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground">
              Monitor your infrastructure in real time with visual insights and cyber-resilient tools.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-start gap-4 pt-2 w-full">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-semibold shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-green-400 text-black hover:bg-green-900/20 transition-all duration-300 ease-in-out hover:text-white cursor-pointer"
                onClick={() => router.push('/signup')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile Layout ===== */}
      <div className="lg:hidden relative z-10 min-h-screen w-full flex items-center justify-center px-4 text-start">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5] z-0"
        >
          <source src="/hero1.mp4" type="video/mp4" />
        </video>
        {/* <div className="absolute inset-0 bg-black/70 z-0" /> */}

        {/* CTA Content */}
        <div className="relative z-10 w-full max-w-sm bg-black/40 border border-white/10 backdrop-blur-md px-6 py-10 rounded-xl space-y-4 shadow-md">
          {/* Label */}
          <span className="inline-block text-xs uppercase font-semibold text-green-400 border border-green-500 rounded-full px-3 py-1 tracking-wider">
            Reimagined
          </span>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Device Monitoring
          </h1>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Real-time insights. Cyber-resilient performance. Control everything from your pocket.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-2">
            <Button
              size="lg"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold transition cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-green-500 text-black hover:text-white hover:bg-green-900/30 transition cursor-pointer"
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
