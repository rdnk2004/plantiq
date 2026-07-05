'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, History, UserCircle } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Today's Analytics", href: '/', icon: Activity },
    { name: "7-Day History", href: '/history', icon: History },
    { name: "Owner Profile", href: '/user', icon: UserCircle },
  ];

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden md:flex justify-between items-center px-8 py-4 bg-[#161922] border-b border-gray-800/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-[#1D9E75] font-black text-xl tracking-wider select-none">PlantIQ</span>
        </div>
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-bold transition-all duration-200 ${
                  isActive ? 'text-[#1D9E75]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#161922] border-t border-gray-800/80 px-6 py-3 flex justify-around items-center z-50 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors duration-200 ${
                isActive ? 'text-[#1D9E75]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
