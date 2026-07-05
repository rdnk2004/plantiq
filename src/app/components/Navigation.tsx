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
      {/* Desktop Centered Floating Navigation */}
      <div className="hidden md:block fixed top-6 left-0 right-0 z-50 pointer-events-none">
        <nav className="mx-auto w-fit bg-[#121317]/50 border border-white/[0.05] backdrop-blur-md px-2 py-1.5 flex items-center gap-1 rounded-full shadow-2xl pointer-events-auto">
          {/* PlantIQ Brand Stamp */}
          <div className="pl-4 pr-3 py-1 border-r border-white/[0.05] mr-1 flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
            <span className="font-sans font-black text-xs tracking-wider text-white">Plant<span className="text-brand-green">IQ</span></span>
          </div>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-green/10 text-brand-green border border-brand-green/20 shadow-sm shadow-brand-green/5' 
                    : 'text-gray-400 hover:text-gray-200 border border-transparent hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <nav className="bg-[#121317]/60 border border-white/[0.05] backdrop-blur-xl px-4 py-2.5 flex justify-around items-center rounded-2xl shadow-2xl pointer-events-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-green/10 text-brand-green border border-brand-green/25 font-bold shadow-sm shadow-brand-green/5' 
                    : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">{item.name.replace("'", "")}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
