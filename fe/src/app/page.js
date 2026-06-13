"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 font-sans text-zinc-100">
      <div className="text-center">
        <p className="text-sm text-zinc-400">Loading Steelworks Manager...</p>
      </div>
    </div>
  );
}
