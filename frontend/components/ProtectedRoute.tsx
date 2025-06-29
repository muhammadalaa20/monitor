'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue.');
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null; // prevent rendering until redirection
  }

  return <>{children}</>;
}
