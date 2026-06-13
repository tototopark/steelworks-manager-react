"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import DevHints from '../../components/common/DevHints';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400 font-sans">
        <p className="text-sm">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-zinc-900/40 p-8">
          <div className="flex flex-col min-h-full justify-between">
            <div>
              {children}
            </div>
            <DevHints />
          </div>
        </main>
      </div>
    </div>
  );
}
