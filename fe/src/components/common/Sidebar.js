"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Calendar, 
  Kanban, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Truck, 
  Database,
  LogOut,
  Clock,
  Clipboard,
  CalendarDays,
  Activity,
  TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Default right level check helper
  const rightLevel = user?.right_level ?? 1;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, minRight: 1 },
    { name: 'Monthly Plan', path: '/dashboard/weekly-plan', icon: Calendar, minRight: 1 },
    { name: 'Whiteboard', path: '/dashboard/whiteboard', icon: Kanban, minRight: 1 },
    { name: 'Jobs', path: '/dashboard/jobs', icon: Briefcase, minRight: 1 },
    { name: 'QA WIP', path: '/dashboard/qa-wip', icon: CheckSquare, minRight: 1 },
    { name: 'Employees', path: '/dashboard/employees', icon: Users, minRight: 10 },
    { name: 'Holidays', path: '/dashboard/holidays', icon: CalendarDays, minRight: 10 },
    { name: 'Vehicles', path: '/dashboard/vehicles', icon: Truck, minRight: 1 },
    { name: 'Punch Clock', path: '/dashboard/punch', icon: Clock, minRight: 1 },
    { name: 'Activity', path: '/dashboard/activity', icon: Activity, minRight: 1 },
    { name: 'Timesheet', path: '/dashboard/timesheet', icon: Clipboard, minRight: 1 },
    { name: 'Performance', path: '/dashboard/performance', icon: Clipboard, minRight: 5 },
    { name: 'Workload', path: '/dashboard/workload', icon: TrendingUp, minRight: 5 },
    { name: 'Admin DB', path: '/dashboard/admin-db', icon: Database, minRight: 99 },
  ];

  const filteredMenu = menuItems.filter(item => rightLevel >= item.minRight);

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 text-zinc-100 flex flex-col h-screen font-sans">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-wider text-white">STEELWORKS</h1>
        <p className="text-xs text-zinc-500 mt-1">Management Portal</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3 px-2 py-1 mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-semibold text-white">
            {user?.firstname ? user.firstname[0].toUpperCase() : 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white truncate max-w-[130px]">
              {user?.firstname} {user?.surname}
            </p>
            <p className="text-xs text-zinc-400 truncate max-w-[130px]">
              ID: {user?.login}
            </p>
            <p className="text-xs text-zinc-500 truncate max-w-[130px]">
              Level {rightLevel}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
