"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user) {
        toast.error("Please login to continue.");
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, router]);

  if (!user || isChecking) {
    return null;
  }

  return <>{children}</>;
}
