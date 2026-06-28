'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'History', href: '/history', icon: '📊' },
    { name: 'About', href: '/about', icon: '🌿' },
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
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-bold transition-all duration-200 ${
                  isActive ? 'text-[#1D9E75]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="text-base">{item.icon}</span>
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
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors duration-200 ${
                isActive ? 'text-[#1D9E75]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
