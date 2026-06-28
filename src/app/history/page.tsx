'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// Data points for the 7-day average health scores
const dailyData = [
  { day: 'Mon', dayFullName: 'Monday', score: 71 },
  { day: 'Tue', dayFullName: 'Tuesday', score: 89 },
  { day: 'Wed', dayFullName: 'Wednesday', score: 77 },
  { day: 'Thu', dayFullName: 'Thursday', score: 68 },
  { day: 'Fri', dayFullName: 'Friday', score: 44 },
  { day: 'Sat', dayFullName: 'Saturday', score: 72 },
  { day: 'Sun', dayFullName: 'Sunday', score: 76 },
];
interface TooltipPayload {
  payload: {
    day: string;
    dayFullName: string;
    score: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

// Custom Tooltip component for the bar chart
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#161922] border border-gray-800/80 p-3 rounded-xl shadow-xl">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{data.dayFullName}</p>
        <p className="text-sm font-extrabold text-white mt-1">
          Average Health: <span className={data.day === 'Fri' ? 'text-red-400' : 'text-[#1D9E75]'}>{data.score}/100</span>
        </p>
        {data.day === 'Fri' && (
          <p className="text-xs text-red-400 mt-1.5 font-semibold flex items-center gap-1">
            ⚠️ Heat stress detected &mdash; 38°C recorded
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function HistoryPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-100 font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 md:gap-8 justify-center py-6">
        
        {/* Header */}
        <header className="flex items-center gap-4 border-b border-gray-800 pb-5">
          <Link 
            href="/"
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all duration-200"
            aria-label="Back to dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Tulsi &mdash; 7 Day History
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">
              Ocimum tenuiflorum &bull; Pot #001
            </p>
          </div>
        </header>

        {/* Weekly Summary Cards (2x2 Grid) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-md">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Score</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1D9E75] mt-1.5">73/100</h3>
            <span className="text-[10px] text-emerald-400 font-medium block mt-1">Healthy Range</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-md">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Best Day</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1D9E75] mt-1.5">Tue &mdash; 89</h3>
            <span className="text-[10px] text-emerald-400 font-medium block mt-1">Peak condition</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-md">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Worst Day</p>
            <h3 className="text-2xl sm:text-3xl font-black text-red-500 mt-1.5">Fri &mdash; 44</h3>
            <span className="text-[10px] text-red-400 font-medium block mt-1">Heat stress</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-md">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stress Events</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-500 mt-1.5">2</h3>
            <span className="text-[10px] text-amber-400 font-medium block mt-1">Requires monitoring</span>
          </div>
        </section>

        {/* Daily Average Health Score Bar Chart */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-lg flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] shadow-sm shadow-[#1D9E75]/50"></span>
              Daily Average Health Score
            </h3>
            <span className="text-xs text-gray-400 bg-gray-800/40 px-2.5 py-1 rounded-md border border-gray-800/60">
              Last 7 Days
            </span>
          </div>
          
          <div className="w-full h-[280px] mt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252936" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11}
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {dailyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.day === 'Fri' ? '#EF4444' : '#1D9E75'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900/10 rounded-lg text-gray-500 text-sm">
                Loading chart...
              </div>
            )}
          </div>
        </section>

        {/* Event Log Table */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-lg flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            📋 Event Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 pl-4">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-sm">
                <tr className="hover:bg-gray-800/20 transition-all duration-150">
                  <td className="py-3.5 pr-4 text-gray-300 font-medium whitespace-nowrap">Friday Jun 27</td>
                  <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">2:00 PM</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                      🔴 Heat stress
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-red-400">44</td>
                  <td className="py-3.5 pl-4 text-gray-300 font-semibold">Move away from direct afternoon sun</td>
                </tr>
                <tr className="hover:bg-gray-800/20 transition-all duration-150">
                  <td className="py-3.5 pr-4 text-gray-300 font-medium whitespace-nowrap">Wednesday Jun 25</td>
                  <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">7:00 AM</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      🟡 Dry soil alert
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-amber-400">68</td>
                  <td className="py-3.5 pl-4 text-gray-300 font-semibold">Water immediately</td>
                </tr>
                <tr className="hover:bg-gray-800/20 transition-all duration-150">
                  <td className="py-3.5 pr-4 text-gray-300 font-medium whitespace-nowrap">Tuesday Jun 24</td>
                  <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">10:00 AM</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      🟢 Peak health
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#1D9E75]">89</td>
                  <td className="py-3.5 pl-4 text-gray-300">No action needed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Back to Home Button */}
        <section className="flex justify-center mt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </section>

      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-800/30 mt-8">
        <p className="text-[10px] sm:text-xs text-gray-500 tracking-wider uppercase font-semibold">
          Verified by PlantIQ &bull; Powered by ESP32 &bull; IOPT 2026
        </p>
      </footer>
    </div>
  );
}
