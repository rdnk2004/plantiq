'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSimulation } from '@/utils/simulationState';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { 
  Droplet, 
  Thermometer, 
  Sun, 
  WifiOff, 
  Settings,
  ChevronRight,
  Shield,
  User,
  MapPin,
  Cpu,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

// Trend data represents a 24-hour log of this specific plant in the nursery
const trendData = {
  health: [
    { time: '12 AM', score: 83 },
    { time: '2 AM', score: 83 },
    { time: '4 AM', score: 84 },
    { time: '6 AM', score: 85 },
    { time: '8 AM', score: 85 },
    { time: '10 AM', score: 86 },
    { time: '12 PM', score: 87 },
    { time: '2 PM', score: 86 },
    { time: '4 PM', score: 84 },
    { time: '6 PM', score: 85 },
    { time: '8 PM', score: 85 },
    { time: '10 PM', score: 84 },
  ],
  moisture: [
    { time: '12 AM', score: 62 },
    { time: '2 AM', score: 61 },
    { time: '4 AM', score: 61 },
    { time: '6 AM', score: 60 },
    { time: '8 AM', score: 60 },
    { time: '10 AM', score: 59 },
    { time: '12 PM', score: 58 },
    { time: '2 PM', score: 58 },
    { time: '4 PM', score: 57 },
    { time: '6 PM', score: 57 },
    { time: '8 PM', score: 64 }, // watered
    { time: '10 PM', score: 63 },
  ],
  temp: [
    { time: '12 AM', score: 23 },
    { time: '2 AM', score: 22 },
    { time: '4 AM', score: 22 },
    { time: '6 AM', score: 23 },
    { time: '8 AM', score: 25 },
    { time: '10 AM', score: 27 },
    { time: '12 PM', score: 29 },
    { time: '2 PM', score: 30 },
    { time: '4 PM', score: 28 },
    { time: '6 PM', score: 26 },
    { time: '8 PM', score: 25 },
    { time: '10 PM', score: 24 },
  ],
  light: [
    { time: '12 AM', score: 0 },
    { time: '2 AM', score: 0 },
    { time: '4 AM', score: 5 },
    { time: '6 AM', score: 35 },
    { time: '8 AM', score: 65 },
    { time: '10 AM', score: 78 },
    { time: '12 PM', score: 82 },
    { time: '2 PM', score: 75 },
    { time: '4 PM', score: 60 },
    { time: '6 PM', score: 25 },
    { time: '8 PM', score: 0 },
    { time: '10 PM', score: 0 },
  ]
};

type MetricTab = 'health' | 'moisture' | 'temp' | 'light';

export default function DashboardPage() {
  const { 
    state, 
    profile, 
    healthScore, 
    predictedHours, 
    updateSensors, 
    waterPlant,
    resetSimulation
  } = useSimulation('tulsi');

  const [isMounted, setIsMounted] = useState(false);
  const [isSimOpen, setIsSimOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MetricTab>('health');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-obsidian text-brand-green/80 flex items-center justify-center font-serif italic text-sm gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping"></span>
        Ingesting telemetry registry...
      </div>
    );
  }

  // Map raw values to percentages
  const moisturePct = Math.round(((4095 - state.moistureRaw) / 4095) * 100);
  const lightPct = Math.round((state.lightRaw / 1023) * 100);

  // SVG Gauge calculations
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  let statusColor = 'text-brand-green bg-brand-green/5 border-brand-green/20';
  let glowColor = 'shadow-brand-green/10 border-brand-green/30';
  let progressStrokeColor = 'stroke-brand-green';
  let healthStatusText = 'Optimal Vigor';
  let healthBadgeText = 'Collector\'s Standard';

  if (healthScore < 45) {
    statusColor = 'text-rose-400 bg-rose-500/5 border-rose-500/20';
    glowColor = 'shadow-rose-500/20 border-rose-500/30';
    progressStrokeColor = 'stroke-rose-500';
    healthStatusText = 'Vigor Deficit';
    healthBadgeText = 'Needs Adjustment';
  } else if (healthScore < 75) {
    statusColor = 'text-brand-copper bg-brand-copper/5 border-brand-copper/20';
    glowColor = 'shadow-brand-copper/10 border-brand-copper/30';
    progressStrokeColor = 'stroke-brand-copper';
    healthStatusText = 'Sub-Optimal';
    healthBadgeText = 'Mild Env Stress';
  }

  // Trigger quick presets in simulation
  const triggerPreset = (type: 'perfect' | 'dry' | 'heat' | 'shade') => {
    switch (type) {
      case 'perfect':
        updateSensors({
          moistureRaw: Math.round(profile.moistureMin + (profile.moistureMax - profile.moistureMin) * 0.3),
          tempC: Math.round((profile.tempMin + profile.tempMax) / 2),
          lightRaw: Math.round((profile.lightMin + profile.lightMax) / 2),
        });
        break;
      case 'dry':
        updateSensors({ moistureRaw: 3750 });
        break;
      case 'heat':
        updateSensors({ tempC: 41.5, lightRaw: 970 });
        break;
      case 'shade':
        updateSensors({ lightRaw: 75 });
        break;
    }
  };

  const getChartLineColor = () => {
    switch (activeTab) {
      case 'health': return '#3CE7A8';
      case 'moisture': return '#3b82f6';
      case 'temp': return '#f87171';
      case 'light': return '#fbbf24';
    }
  };

  const getChartLabel = () => {
    switch (activeTab) {
      case 'health': return 'Health Index';
      case 'moisture': return 'Soil Hydration (%)';
      case 'temp': return 'Air Temperature (°C)';
      case 'light': return 'Luminous Intensity (%)';
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-gray-100 font-sans flex flex-col justify-between p-4 sm:p-6 pb-28 md:pb-12 selection:bg-brand-green/20 selection:text-brand-green">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col gap-6 py-2">
        
        {/* Editorial Specimen Identification Header */}
        <header className="border-b border-gray-900 pb-6 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="text-left">
            <span className="font-serif italic text-brand-gold tracking-wider text-xs block mb-1">
              R.D.N.K. Private Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight flex items-center gap-2">
              Specimen: Tulsi
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1 font-sans font-semibold">
              {profile.scientificName} &bull; Pot ID #001
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#14151a] border border-gray-800 text-gray-400">
              <MapPin className="w-3 h-3 text-brand-copper" />
              East Greenhouse, Shelf A4
            </span>
            <Link 
              href="/user" 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#111613] hover:bg-[#15221b] text-brand-green border border-brand-green/20 transition-all duration-300 active:scale-95 shadow-sm shadow-brand-green/5"
            >
              <User className="w-3 h-3" />
              Curator: R.D.N.K.
              <ChevronRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Verification / Buy Callout Card */}
        <div className="bg-[#121317]/60 border border-gray-900 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-gold/5 text-brand-gold border border-brand-gold/15 select-none animate-pulse">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-200 font-serif">Verified Organic Telemetry Baseline</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Capacitive soil monitoring active. Valuation: <span className="text-brand-green font-bold">₹350</span> (Smart Terracotta included).
              </p>
            </div>
          </div>
          <Link
            href="/user"
            className="w-full sm:w-auto text-center text-[10px] font-bold text-black bg-brand-green hover:bg-brand-green/90 px-4 py-2.5 rounded-xl tracking-widest uppercase transition-all duration-300 shadow-md shadow-brand-green/10 active:scale-95 whitespace-nowrap"
          >
            Aquire Specimen
          </Link>
        </div>

        {/* System Failsafe Banner */}
        {state.isOffline && (
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400/90 flex items-start gap-3 shadow-md animate-pulse">
            <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider">Wi-Fi Telemetry Severed &mdash; Offline Cache Active</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                ESP32 is storing telemetry logs in local EEPROM flash memory. Automatic ingestion will resume once signal bridges.
              </p>
            </div>
          </div>
        )}

        {/* Telemetry Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Glowing Halo Health score */}
          <div className="md:col-span-5 bg-[#121317]/30 border border-gray-900 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-md relative group">
            <span className="absolute top-4 left-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Biometric Vigor
            </span>
            
            <div className={`relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#07080A]/60 border shadow-2xl transition-all duration-700 ${glowColor} mt-4`}>
              <div className="absolute inset-0 rounded-full bg-brand-green/[0.02] blur-xl" />
              
              <svg className="w-full h-full transform -rotate-90 scale-95" viewBox="0 0 200 200">
                <defs>
                  <filter id="glow-halo" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={getChartLineColor()} floodOpacity="0.4" />
                  </filter>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className="stroke-[#181a22] fill-none"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className={`transition-all duration-700 ease-out fill-none ${progressStrokeColor}`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  filter="url(#glow-halo)"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white font-serif tracking-tighter leading-none">{healthScore}</span>
                <span className="text-[8px] font-bold text-gray-500 tracking-widest uppercase mt-2">Vigor index</span>
              </div>
            </div>

            <div className="mt-6 w-full">
              <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-bold border font-serif italic ${statusColor}`}>
                {healthStatusText}
              </span>
              <p className="text-[10px] text-gray-500 mt-2.5">
                Rating: <span className="text-gray-300 font-semibold">{healthBadgeText}</span>
              </p>
            </div>
          </div>

          {/* Environmental Sensors */}
          <div className="md:col-span-7 flex flex-col gap-3">
            
            {/* Biometric Sensor Ledger List */}
            <div className="flex flex-col gap-3">
              {/* Moisture Row */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141210]/40 border border-brand-copper/10 hover:border-brand-copper/30 transition-all duration-300 gap-3 group">
                <div className="flex items-center gap-3 min-w-[95px] sm:min-w-[140px]">
                  <div className="p-2 rounded-lg bg-brand-copper/10 text-brand-copper">
                    <Droplet className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-200 block font-serif">Soil Hydration</span>
                    <span className="text-[8px] text-gray-500 block font-mono">Target: 50%-70%</span>
                  </div>
                </div>

                <div className="flex-1 max-w-[160px] h-1 bg-gray-950 rounded-full overflow-hidden border border-white/[0.02] hidden min-[380px]:block">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      moisturePct >= 50 && moisturePct <= 70 ? 'bg-brand-green' : 'bg-brand-copper'
                    }`}
                    style={{ width: `${moisturePct}%` }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold font-serif text-white">{moisturePct}%</span>
                  <span className={`text-[8px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border ${
                    moisturePct >= 50 && moisturePct <= 70 
                      ? 'bg-brand-green/5 text-brand-green border-brand-green/10' 
                      : 'bg-brand-copper/5 text-brand-copper border-brand-copper/10'
                  }`}>
                    {moisturePct >= 50 && moisturePct <= 70 ? 'Ideal' : moisturePct < 50 ? 'Dry' : 'Saturated'}
                  </span>
                </div>
              </div>

              {/* Temperature Row */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101412]/40 border border-brand-green/10 hover:border-brand-green/30 transition-all duration-300 gap-3 group">
                <div className="flex items-center gap-3 min-w-[95px] sm:min-w-[140px]">
                  <div className="p-2 rounded-lg bg-brand-green/10 text-brand-green">
                    <Thermometer className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-200 block font-serif">Ambient Temp</span>
                    <span className="text-[8px] text-gray-500 block font-mono">Target: 20-35°C</span>
                  </div>
                </div>

                <div className="flex-1 max-w-[160px] h-1 bg-gray-950 rounded-full overflow-hidden border border-white/[0.02] hidden min-[380px]:block">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      state.tempC >= 20 && state.tempC <= 35 ? 'bg-brand-green' : 'bg-brand-copper'
                    }`}
                    style={{ width: `${Math.min((state.tempC / 50) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold font-serif text-white">{state.tempC.toFixed(1)}°C</span>
                  <span className={`text-[8px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border ${
                    state.tempC >= 20 && state.tempC <= 35 
                      ? 'bg-brand-green/5 text-brand-green border-brand-green/10' 
                      : 'bg-brand-copper/5 text-brand-copper border-brand-copper/10'
                  }`}>
                    {state.tempC >= 20 && state.tempC <= 35 ? 'Good' : 'Stress'}
                  </span>
                </div>
              </div>

              {/* Sunlight Row */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141410]/40 border border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-300 gap-3 group">
                <div className="flex items-center gap-3 min-w-[95px] sm:min-w-[140px]">
                  <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
                    <Sun className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-200 block font-serif">Luminous Flux</span>
                    <span className="text-[8px] text-gray-500 block font-mono">Target: 60%-90%</span>
                  </div>
                </div>

                <div className="flex-1 max-w-[160px] h-1 bg-gray-950 rounded-full overflow-hidden border border-white/[0.02] hidden min-[380px]:block">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      lightPct >= 60 && lightPct <= 90 ? 'bg-brand-gold' : 'bg-brand-copper'
                    }`}
                    style={{ width: `${lightPct}%` }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold font-serif text-white">{lightPct}%</span>
                  <span className={`text-[8px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border ${
                    lightPct >= 60 && lightPct <= 90 
                      ? 'bg-brand-green/5 text-brand-green border-brand-green/10' 
                      : 'bg-brand-gold/5 text-brand-gold border-brand-gold/10'
                  }`}>
                    {lightPct >= 60 && lightPct <= 90 ? 'Ideal' : 'Filtered'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Diagnosis and Action Panel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121317]/40 border border-gray-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
              <div className="flex-1">
                <span className="text-[8px] font-bold text-brand-gold uppercase tracking-widest block mb-1">
                  Predictive Inundation Calculator
                </span>
                <p className="text-xs font-semibold text-gray-200 mt-1 font-serif">
                  {predictedHours === 0 ? (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Critical soil dryness. Trigger local irrigation immediately.
                    </span>
                  ) : (
                    `Moisture depletion rate projects irrigation in ~${predictedHours} hours`
                  )}
                </p>
                <p className="text-[9px] text-gray-500 mt-1">
                  Calculated based on active leaf transpiration curves.
                </p>
              </div>

              <button
                onClick={waterPlant}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/10 active:scale-95 transition-all duration-200 uppercase tracking-widest"
              >
                <Droplet className="w-3.5 h-3.5 fill-white" />
                Water Specimen
              </button>
            </div>

            {/* Care guidelines summary */}
            <div className="p-4 rounded-xl bg-gray-900/10 border border-gray-900 grid grid-cols-2 gap-4 text-xs font-serif italic">
              <div>
                <span className="text-gray-500 text-[10px] font-sans uppercase font-bold tracking-wider block">Hydration Target</span>
                <span className="text-gray-300 font-bold mt-1 block">{profile.wateringInterval}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] font-sans uppercase font-bold tracking-wider block">Optimal Placement</span>
                <span className="text-gray-300 font-bold mt-1 block">{profile.placement}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Glowing Area Chart for 24-Hour logs */}
        <div className="bg-[#121317]/30 border border-gray-900 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-900 pb-4">
            <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              {getChartLabel()} &mdash; 24h Baseline Log
            </h3>
            
            {/* Chart Tab Navigation */}
            <div className="flex items-center gap-1 bg-gray-900/60 p-0.5 rounded-xl border border-gray-800/80 self-start sm:self-auto">
              {(['health', 'moisture', 'temp', 'light'] as MetricTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-brand-green text-black font-extrabold shadow-md' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-[220px] mt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData[activeTab]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getChartLineColor()} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={getChartLineColor()} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#16181d" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#475569" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10}
                    domain={activeTab === 'temp' ? [15, 45] : [0, 100]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#121317', 
                      borderColor: '#1d2026',
                      borderRadius: '12px',
                      color: '#f3f4f6',
                      fontSize: '11px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                    }}
                    itemStyle={{ color: getChartLineColor() }}
                    labelStyle={{ color: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke={getChartLineColor()} 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#chartGlow)"
                    dot={{ r: 2.5, strokeWidth: 1, fill: getChartLineColor() }}
                    activeDot={{ r: 4.5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900/10 rounded-lg text-gray-500 text-xs">
                Extracting telemetry logs...
              </div>
            )}
          </div>
        </div>

        {/* Collapsible ESP32 Terminal board */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsSimOpen((prev) => !prev)}
            className="w-full py-2.5 rounded-xl text-[10px] font-bold bg-[#14151a] hover:bg-[#191b22] text-gray-500 hover:text-gray-400 border border-gray-900 flex justify-center items-center gap-1.5 transition-colors uppercase tracking-widest"
          >
            <Cpu className="w-3.5 h-3.5" />
            {isSimOpen ? 'Close R.D.N.K. Diagnostic Console' : 'Open R.D.N.K. Diagnostic Console'}
          </button>
        </div>

        {/* ESP32 Sim Panel */}
        {isMounted && (
          <div className={`p-5 rounded-2xl bg-[#121317] border border-gray-900 shadow-2xl flex-col gap-5 ${isSimOpen ? 'flex animate-in fade-in slide-in-from-bottom duration-300' : 'hidden'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-gray-900">
              <span className="text-xs font-bold text-brand-green uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                🔌 R.D.N.K. Smart-Pot Core Terminal v2.4
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSensors({ isOffline: !state.isOffline })}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                    state.isOffline 
                      ? 'bg-rose-500 text-white shadow' 
                      : 'bg-[#181a22] text-gray-400 border border-gray-800 hover:text-white'
                  }`}
                >
                  {state.isOffline ? 'Link Online' : 'Sever Signal'}
                </button>
                <button
                  onClick={resetSimulation}
                  className="p-1.5 rounded-lg bg-[#181a22] border border-gray-800 text-gray-400 hover:text-white transition-all active:scale-95"
                  title="Flash Core Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Moisture Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Moisture ADC (GPIO34)</span>
                  <span className="font-bold text-blue-400 font-mono">{state.moistureRaw}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="4095" 
                  value={state.moistureRaw}
                  onChange={(e) => updateSensors({ moistureRaw: parseInt(e.target.value) })}
                  className="w-full accent-blue-500 h-1 bg-gray-850 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>Wet (500)</span>
                  <span>Dry (4095)</span>
                </div>
              </div>

              {/* Temp Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Temperature (GPIO4)</span>
                  <span className="font-bold text-red-400 font-mono">{state.tempC.toFixed(1)}°C</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="45" 
                  value={state.tempC}
                  step="0.1"
                  onChange={(e) => updateSensors({ tempC: parseFloat(e.target.value) })}
                  className="w-full accent-red-500 h-1 bg-gray-850 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>10°C</span>
                  <span>45°C</span>
                </div>
              </div>

              {/* Light Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Light LDR (GPIO35)</span>
                  <span className="font-bold text-brand-gold font-mono">{state.lightRaw}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1023" 
                  value={state.lightRaw}
                  onChange={(e) => updateSensors({ lightRaw: parseInt(e.target.value) })}
                  className="w-full accent-brand-gold h-1 bg-gray-850 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>Dark (0)</span>
                  <span>Bright (1023)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="text-gray-500 self-center mr-1">Telemetry Presets:</span>
              <button onClick={() => triggerPreset('perfect')} className="px-2.5 py-1.5 rounded bg-[#181a22] text-gray-300 border border-gray-800 hover:text-white transition-all active:scale-95">Perfect Baseline</button>
              <button onClick={() => triggerPreset('dry')} className="px-2.5 py-1.5 rounded bg-[#181a22] text-gray-300 border border-gray-800 hover:text-white transition-all active:scale-95">Dehydration</button>
              <button onClick={() => triggerPreset('heat')} className="px-2.5 py-1.5 rounded bg-[#181a22] text-gray-300 border border-gray-800 hover:text-white transition-all active:scale-95">Thermal stress</button>
              <button onClick={() => triggerPreset('shade')} className="px-2.5 py-1.5 rounded bg-[#181a22] text-gray-300 border border-gray-800 hover:text-white transition-all active:scale-95">Dim canopy</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
