'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function PrefetchRoutes() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/home');
  }, [router]);
  return null;
}
