'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSimulation } from '@/utils/simulationState';
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
import {
  ChevronLeft,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Droplet,
  Sun,
  Thermometer,
  Clock,
  BookOpen
} from 'lucide-react';

// 7-day average health scores under R.D.N.K. botanical supervision
const dailyData = [
  { day: 'Mon', dayFullName: 'Monday', score: 82, temp: 24, moisture: 60, light: 70 },
  { day: 'Tue', dayFullName: 'Tuesday', score: 86, temp: 25, moisture: 62, light: 75 },
  { day: 'Wed', dayFullName: 'Wednesday', score: 84, temp: 26, moisture: 59, light: 68 },
  { day: 'Thu', dayFullName: 'Thursday', score: 79, temp: 27, moisture: 55, light: 80 },
  { day: 'Fri', dayFullName: 'Friday', score: 48, temp: 42, moisture: 30, light: 95 }, // Heat Stress Event
  { day: 'Sat', dayFullName: 'Saturday', score: 78, temp: 24, moisture: 64, light: 65 },
  { day: 'Sun', dayFullName: 'Sunday', score: 85, temp: 25, moisture: 61, light: 72 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#121317] border border-gray-800 p-3 rounded-xl shadow-xl max-w-[220px]">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{data.dayFullName}</p>
        <p className="text-sm font-bold text-white mt-1 font-serif">
          Vigor Rating: <span className={data.score < 50 ? 'text-rose-400' : 'text-brand-green'}>{data.score}/100</span>
        </p>
        <div className="mt-2.5 pt-2 border-t border-gray-900 text-xs text-gray-400 flex flex-col gap-1.5 font-mono">
          <span className="flex items-center gap-1.5"><Droplet className="w-3 h-3 text-blue-400" /> Moisture: {data.moisture}%</span>
          <span className="flex items-center gap-1.5"><Thermometer className="w-3 h-3 text-rose-400" /> Temperature: {data.temp}°C</span>
          <span className="flex items-center gap-1.5"><Sun className="w-3 h-3 text-brand-gold" /> Solar Flux: {data.light}%</span>
        </div>
        {data.score < 50 && (
          <p className="text-xs text-rose-400 mt-2.5 font-semibold flex items-start gap-1">
            ⚠️ Midday thermal stress registered
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function HistoryPage() {
  const { state, profile } = useSimulation('tulsi');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-obsidian text-brand-green/80 flex items-center justify-center font-serif italic text-sm gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping"></span>
        Accessing vigor registry...
      </div>
    );
  }

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Just now";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'dry':
      case 'overwater':
        return <Droplet className="w-3.5 h-3.5 text-blue-400" />;
      case 'heat':
      case 'cold':
        return <Thermometer className="w-3.5 h-3.5 text-rose-400" />;
      case 'dark':
      case 'bright':
        return <Sun className="w-3.5 h-3.5 text-brand-gold" />;
      case 'system':
        return <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'dry':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-copper/10 text-brand-copper border border-brand-copper/15 uppercase tracking-wider">Dry alert</span>;
      case 'overwater':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-550/10 text-blue-400 border border-blue-500/15 uppercase tracking-wider">Over-sat</span>;
      case 'heat':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/15 uppercase tracking-wider">Heat anomaly</span>;
      case 'cold':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/15 uppercase tracking-wider">Chill event</span>;
      case 'system':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/15 uppercase tracking-wider">Sys trace</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-green/10 text-brand-green border border-brand-green/15 uppercase tracking-wider">Record</span>;
    }
  };

  // Historic caretaker logs from R.D.N.K. botanists
  const staticCaretakerLogs = [
    {
      id: 'log-1',
      date: 'Today',
      time: '08:00 AM',
      tag: 'Curation Intake',
      message: 'Administered 50ml slow-release humic acid extract to restore organic nitrogen matrix.',
      caretaker: 'R.D.N.K. Botanist',
      badge: 'bg-brand-green/5 text-brand-green border-brand-green/10'
    },
    {
      id: 'log-2',
      date: 'Yesterday',
      time: '11:30 AM',
      tag: 'Foliar Treatment',
      message: 'Pruned dead lower nodes to improve stem aeration. Inspected for micro-pests. Clear.',
      caretaker: 'R.D.N.K. Auditor',
      badge: 'bg-brand-copper/5 text-brand-copper border-brand-copper/10'
    },
    {
      id: 'log-3',
      date: 'Jul 3, 2026',
      time: '02:00 PM',
      tag: 'Thermal Venting',
      message: 'Drawn overhead UV filtration screen during midday temp peak to stabilize chlorophyll baseline.',
      caretaker: 'R.D.N.K. Operator',
      badge: 'bg-brand-gold/5 text-brand-gold border-brand-gold/10'
    },
    {
      id: 'log-4',
      date: 'Jul 1, 2026',
      time: '09:00 AM',
      tag: 'IoT Calibration',
      message: 'Re-calibrated pot GPIO34 capacitive limits to optimize drying coefficient calculations.',
      caretaker: 'System Admin',
      badge: 'bg-purple-500/5 text-purple-400 border-purple-500/10'
    }
  ];

  const liveStressCount = state.alertHistory.filter(a => ['dry', 'heat', 'cold'].includes(a.type)).length;
  const totalStressEvents = 1 + liveStressCount;

  return (
    <div className="min-h-screen bg-obsidian text-gray-100 font-sans flex flex-col justify-between p-4 sm:p-6 pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col gap-6 py-2">
        
        {/* Navigation & Header */}
        <header className="flex items-center gap-3 border-b border-gray-900 pb-5">
          <Link 
            href="/"
            className="p-2.5 rounded-xl bg-[#14151a] hover:bg-[#191b22] text-gray-400 hover:text-white border border-gray-800 transition-colors active:scale-95"
            aria-label="Back to dashboard"
          >
            <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
          </Link>
          <div>
            <span className="font-serif italic text-brand-gold tracking-wider text-xs block">
              R.D.N.K. Private Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">7-Day Vigor Registry</h1>
          </div>
        </header>

        {/* Analytics Highlights */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#121317]/30 border border-gray-900 shadow-md">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Rolling Avg</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-green mt-1">80/100</h3>
            <span className="text-[11px] text-brand-green/80 font-bold block mt-1 uppercase tracking-wider">Premium baseline</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121317]/30 border border-gray-900 shadow-md">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Peak Day</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-green mt-1">Tue &mdash; 86</h3>
            <span className="text-[11px] text-brand-green/80 font-bold block mt-1 uppercase tracking-wider">Max cell turgor</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121317]/30 border border-gray-900 shadow-md">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Max Stress</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-rose-500 mt-1">Fri &mdash; 48</h3>
            <span className="text-[11px] text-rose-400/80 font-bold block mt-1 uppercase tracking-wider">Env Heatwave</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121317]/30 border border-gray-900 shadow-md">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Stress Events</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-brand-gold mt-1">{totalStressEvents}</h3>
            <span className="text-[11px] text-brand-gold/80 font-bold block mt-1 uppercase tracking-wider">Self-Corrected</span>
          </div>
        </section>

        {/* 7-Day Bar Chart */}
        <section className="bg-[#121317]/30 border border-gray-900 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-900 pb-3">
            <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-green" />
              Specimen Vigor Ledger &mdash; Historical Records
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-0.5 rounded uppercase">
              7 Days
            </span>
          </div>

          <div className="w-full h-[200px]">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barOptimal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3CE7A8" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3CE7A8" stopOpacity={0.15}/>
                    </linearGradient>
                    <linearGradient id="barStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0.15}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#16181d" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#475569" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={12}
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.01)' }} />
                  <Bar dataKey="score" radius={[3, 3, 0, 0]} maxBarSize={32}>
                    {dailyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.day === 'Fri' ? 'url(#barStress)' : 'url(#barOptimal)'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                Mapping bar matrix...
              </div>
            )}
          </div>
        </section>

        {/* Ledger & Telemetry Logs */}
        <section className="bg-[#121317]/30 border border-gray-900 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-900">
            <BookOpen className="w-4 h-4 text-brand-green" />
            <h3 className="text-base font-bold text-white font-serif">Chronological Telemetry Ledger & Auditor Signatures</h3>
          </div>

          <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
            {/* Live simulation telemetry alerts */}
            {isMounted && state.alertHistory && state.alertHistory.length > 0 && (
              <div className="flex flex-col gap-3 pb-3 border-b border-gray-900">
                <span className="text-xs font-bold text-brand-green uppercase tracking-widest block">Live Signal Events (Active Stream)</span>
                {state.alertHistory.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="bg-gray-900/10 border border-gray-950 p-3 rounded-xl flex items-start gap-3 hover:border-gray-900 transition-colors duration-250">
                    <div className="mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-1 border-b border-gray-950/20 mb-1.5">
                        <span className="text-sm font-bold text-gray-300 font-serif">Telemetry Trace</span>
                        <div className="flex flex-wrap items-center gap-1.5 font-mono">
                          {getAlertBadge(alert.type)}
                          <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Static curator logs */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Physiological Auditor Ledger</span>
              {staticCaretakerLogs.map((log) => (
                <div key={log.id} className="bg-gray-900/5 border border-gray-950 p-3 rounded-xl flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#14151a] border border-gray-800 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-1 border-b border-gray-950/20 mb-1.5">
                      <span className="text-sm font-bold text-gray-300 font-serif">{log.tag}</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold border ${log.badge} whitespace-nowrap`}>
                          Sign: {log.caretaker}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{log.date}, {log.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
