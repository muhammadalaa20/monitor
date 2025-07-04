// app/layout.tsx
'use client';
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/sonner"
import { DeviceAlertProvider } from "@/context/DeviceAlertContext";
import { initAlertSound } from "@/lib/alerts";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  useEffect(() => {
    const unlockAudio = () => {
      initAlertSound();
      const sound = new Audio("/alert.mp3");
      sound.play().then(() => {
        sound.pause();
        sound.currentTime = 0;
      });
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
  }, []);
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Device Monitor</title>
        <meta name="description" content="Monitor device statuses in real time" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground scroll-smooth`}
        suppressHydrationWarning
      >
        <PageTransitionWrapper>
          <AuthProvider>
            <DeviceAlertProvider>
              {children}
              <Toaster position="bottom-right" duration={3000} />
            </DeviceAlertProvider>
          </AuthProvider>
        </PageTransitionWrapper>
      </body>
    </html>
  );
}

// ✨ Animation wrapper component
function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
