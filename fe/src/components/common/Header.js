"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import apiClient from '../../services/apiClient';

export default function Header() {
  const pathname = usePathname();
  const [expiryCount, setExpiryCount] = useState(0);

  // Map route path to header title
  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard/weekly-plan')) return 'Monthly Plan';
    if (path.startsWith('/dashboard/whiteboard')) return 'Whiteboard';
    if (path.startsWith('/dashboard/jobs')) return 'Job Management';
    if (path.startsWith('/dashboard/qa-wip')) return 'QA Inspections';
    if (path.startsWith('/dashboard/employees')) return 'Employee Directory';
    if (path.startsWith('/dashboard/vehicles')) return 'Vehicle Fleet';
    if (path.startsWith('/dashboard/admin-db')) return 'Database Administration';
    return 'Dashboard';
  };

  useEffect(() => {
    const fetchVehicleAlerts = async () => {
      try {
        const response = await apiClient.get('/api/reminders/vehicles/expiry-check');
        if (response.data && response.data.count !== undefined) {
          setExpiryCount(response.data.count);
        }
      } catch (error) {
        console.error('Failed to load vehicle alerts', error);
      }
    };

    fetchVehicleAlerts();
    // Refresh vehicle alerts count every 5 minutes
    const interval = setInterval(fetchVehicleAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-8 font-sans text-zinc-100">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {getPageTitle(pathname)}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Alerts / Notifications */}
        <div className="relative cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition-all">
          <Bell className="w-5 h-5 text-zinc-400 hover:text-white" />
          {expiryCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-zinc-950">
              {expiryCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
