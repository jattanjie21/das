'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/alerts', label: 'Alerts', icon: '🚨' },
  { href: '/dashboard/zones', label: 'Zones', icon: '🗺️' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthStore();

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Disaster Alert</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
} 