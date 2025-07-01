'use client';

import DevicePageClient from '@/components/DevicePageClient';
import { notFound, useParams } from 'next/navigation';

export default function DevicePage() {
  const params = useParams();
  const id = params?.id;

  if (typeof id !== 'string') return notFound();

  return <DevicePageClient deviceId={id} />;
}
