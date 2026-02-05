'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AuthRedirector() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  return null; // This component doesn't render anything, it just handles redirection
}
