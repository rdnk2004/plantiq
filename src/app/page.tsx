'use client';

import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { 
  Droplet, 
  Thermometer, 
  Sun, 
  Wifi, 
  WifiOff, 
  Settings, 
  AlertTriangle, 
  Activity,
  HeartPulse
} from 'lucide-react';

// Data points for the 24-hour charts
const trendData = {
  health: [
    { time: '12 AM', score: 74 },
    { time: '2 AM', score: 76 },
    { time: '4 AM', score: 75 },
    { time: '6 AM', score: 78 },
    { time: '8 AM', score: 80 },
    { time: '10 AM', score: 79 },
    { time: '12 PM', score: 76 },
    { time: '2 PM', score: 72 },
    { time: '4 PM', score: 68 },
    { time: '6 PM', score: 71 },
    { time: '8 PM', score: 74 },
    { time: '10 PM', score: 76 },
  ],
  moisture: [
    { time: '12 AM', score: 60 },
    { time: '2 AM', score: 61 },
    { time: '4 AM', score: 62 },
    { time: '6 AM', score: 63 },
    { time: '8 AM', score: 62 },
    { time: '10 AM', score: 64 },
    { time: '12 PM', score: 63 },
    { time: '2 PM', score: 62 },
    { time: '4 PM', score: 61 },
    { time: '6 PM', score: 62 },
    { time: '8 PM', score: 62 },
    { time: '10 PM', score: 62 },
  ],
  temp: [
    { time: '12 AM', score: 26 },
    { time: '2 AM', score: 26 },
    { time: '4 AM', score: 27 },
    { time: '6 AM', score: 27 },
    { time: '8 AM', score: 28 },
    { time: '10 AM', score: 28 },
    { time: '12 PM', score: 29 },
    { time: '2 PM', score: 29 },
    { time: '4 PM', score: 28 },
    { time: '6 PM', score: 28 },
    { time: '8 PM', score: 27 },
    { time: '10 PM', score: 28 },
  ],
  light: [
    { time: '12 AM', score: 0 },
    { time: '2 AM', score: 0 },
    { time: '4 AM', score: 10 },
    { time: '6 AM', score: 45 },
    { time: '8 AM', score: 70 },
    { time: '10 AM', score: 85 },
    { time: '12 PM', score: 90 },
    { time: '2 PM', score: 80 },
    { time: '4 PM', score: 60 },
    { time: '6 PM', score: 20 },
    { time: '8 PM', score: 0 },
    { time: '10 PM', score: 0 },
  ]
};

type MetricTab = 'health' | 'moisture' | 'temp' | 'light';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  // ESP32 Live Sensor States (ADC raw & standard values)
  const [moistureRaw, setMoistureRaw] = useState(1500); // 0-4095
  const [tempC, setTempC] = useState(28); // 10-45
  const [lightRaw, setLightRaw] = useState(725); // 0-1023
  
  // Dashboard Status States
  const [score, setScore] = useState(76);
  const [isOffline, setIsOffline] = useState(false);
  const [isSimOpen, setIsSimOpen] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(120);
  const [activeTab, setActiveTab] = useState<MetricTab>('health');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timer counting seconds since last update
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Algorithm 1: Health score (weighted sensor fusion)
  const calculateScore = (mRaw: number, tC: number, lRaw: number) => {
    // moistureScore
    let mScore = 100;
    if (mRaw >= 800 && mRaw <= 1800) {
      mScore = 100;
    } else if (mRaw < 800) {
      mScore = Math.max(0, Math.min(100, (mRaw / 800) * 100));
    } else {
      mScore = Math.max(0, Math.min(100, ((4095 - mRaw) / (4095 - 1800)) * 100));
    }

    // tempScore
    let tScore = 100;
    if (tC >= 18 && tC <= 30) {
      tScore = 100;
    } else if (tC < 18) {
      tScore = Math.max(0, Math.min(100, 100 - (18 - tC) * 5));
    } else {
      tScore = Math.max(0, Math.min(100, 100 - (tC - 30) * 5));
    }

    // lightScore
    let lScore = 100;
    if (lRaw >= 300 && lRaw <= 900) {
      lScore = 100;
    } else if (lRaw < 300) {
      lScore = Math.max(0, Math.min(100, (lRaw / 300) * 100));
    } else {
      lScore = Math.max(0, Math.min(100, ((1023 - lRaw) / (1023 - 900)) * 100));
    }

    return Math.round(mScore * 0.5 + tScore * 0.3 + lScore * 0.2);
  };

  // Update score when inputs change
  useEffect(() => {
    const computedScore = calculateScore(moistureRaw, tempC, lightRaw);
    setScore(computedScore);
  }, [moistureRaw, tempC, lightRaw]);

  // Simulated live random fluctuations every 30 seconds
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      if (isOffline) return;
      
      setMoistureRaw((prev) => {
        const currentPct = Math.round(((4095 - prev) / 4095) * 100);
        const newPct = Math.max(58, Math.min(66, currentPct + (Math.random() > 0.5 ? 1 : -1)));
        return Math.round(4095 - (newPct * 4095) / 100);
      });
      setTempC((prev) => Math.max(27, Math.min(29, prev + (Math.random() > 0.5 ? 0.5 : -0.5))));
      setLightRaw((prev) => {
        const currentPct = Math.round((prev / 1023) * 100);
        const newPct = Math.max(68, Math.min(74, currentPct + (Math.random() > 0.5 ? 1 : -1)));
        return Math.round((newPct * 1023) / 100);
      });
      setSecondsSinceUpdate(0);
    }, 30000);

    return () => clearInterval(sensorInterval);
  }, [isOffline]);

  // Map values to percentages
  const moisturePct = Math.round(((4095 - moistureRaw) / 4095) * 100);
  const lightPct = Math.round((lightRaw / 1023) * 100);

  // Algorithm 3: Predictive Watering Window
  const dryThreshold = 2000;
  const predictedHours = moistureRaw >= dryThreshold ? 0 : Math.round((dryThreshold - moistureRaw) / 100);

  // Format timer
  const getUpdatedText = () => {
    if (secondsSinceUpdate < 60) {
      return 'Just now';
    }
    const minutes = Math.floor(secondsSinceUpdate / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  const triggerScenario = (type: 'perfect' | 'dry' | 'heat' | 'shade') => {
    switch (type) {
      case 'perfect':
        setMoistureRaw(1500);
        setTempC(24);
        setLightRaw(650);
        break;
      case 'dry':
        setMoistureRaw(3500);
        break;
      case 'heat':
        setTempC(42);
        setLightRaw(950);
        break;
      case 'shade':
        setLightRaw(100);
        break;
    }
    setSecondsSinceUpdate(0);
  };

  // Constants for gauge styling
  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Gauge colors and descriptions
  let statusColor = 'text-[#1D9E75] bg-[#1D9E75]/10 border-[#1D9E75]/20';
  let glowColor = 'shadow-[#1D9E75]/20';
  let progressStrokeColor = 'stroke-[#1D9E75]';
  let healthText = 'Thriving';

  if (score < 40) {
    statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';
    glowColor = 'shadow-red-500/20';
    progressStrokeColor = 'stroke-red-500';
    healthText = 'Critical';
  } else if (score < 80) {
    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    glowColor = 'shadow-amber-500/20';
    progressStrokeColor = 'stroke-amber-500';
    healthText = 'Attention Required';
  }

  // Chart configuration based on active tab
  const getChartLineColor = () => {
    switch (activeTab) {
      case 'health': return '#1D9E75';
      case 'moisture': return '#3b82f6';
      case 'temp': return '#f87171';
      case 'light': return '#fbbf24';
    }
  };

  const getChartLabel = () => {
    switch (activeTab) {
      case 'health': return 'Health Score';
      case 'moisture': return 'Soil Moisture (%)';
      case 'temp': return 'Temperature (°C)';
      case 'light': return 'Sunlight Intensity (%)';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-100 font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col gap-8 py-4">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-gray-800 pb-5">
          <div className="text-left">
            <span className="text-[#1D9E75] font-black text-xl tracking-wider select-none">PlantIQ</span>
          </div>
          <div className="text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <h1 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
              🌿 Tulsi
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
              Ocimum tenuiflorum &bull; Pot #001
            </p>
          </div>
          <div className="hidden sm:flex justify-end gap-3">
            <button
              onClick={() => setIsSimOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/60 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Sim Panel
            </button>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isOffline ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-[#1D9E75]/10 text-[#1D9E75] border border-[#1D9E75]/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-400 animate-ping' : 'bg-[#1D9E75] animate-pulse'}`}></span>
              {isOffline ? 'Offline Failsafe' : 'Live Feed'}
            </span>
          </div>
        </header>

        {/* Offline Warning Banner */}
        {isOffline && (
          <section className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-start gap-3 shadow-md animate-pulse">
            <WifiOff className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Wi-Fi connection lost. Offline Failsafe Active.</p>
              <p className="text-xs text-red-400/80 mt-1">Reading logs stored locally in ESP32 flash memory (up to 72 hours). LED warning blink active.</p>
            </div>
          </section>
        )}

        {/* Center Health Score Circle */}
        <section className="flex flex-col items-center justify-center py-8">
          <div className={`relative flex items-center justify-center w-60 h-60 rounded-full bg-[#161922] border border-gray-800/40 shadow-2xl ${glowColor} transition-shadow duration-500`}>
            {/* Pulsing Backlight */}
            <div className="absolute inset-0 rounded-full bg-[#1D9E75]/5 blur-xl pointer-events-none" />
            
            <svg className="w-full h-full transform -rotate-90 scale-95" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-gray-800/40"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                className={`transition-all duration-700 ease-out ${progressStrokeColor}`}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-6xl font-black text-white tracking-tight">{score}</span>
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-1">Health Score</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${statusColor}`}>
              {healthText}
            </span>
            <p className="text-xs text-gray-400 mt-3.5 flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></span>
              Last updated: {getUpdatedText()}
            </p>
          </div>
        </section>

        {/* Three Sensor Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Moisture */}
          <div className="p-5 rounded-2xl bg-[#161922] border border-gray-800/40 flex flex-col justify-between shadow-lg hover:border-gray-700/50 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Droplet className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${moisturePct >= 50 && moisturePct <= 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {moisturePct >= 50 && moisturePct <= 70 ? 'Good' : moisturePct < 50 ? 'Dry' : 'Wet'}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Soil Moisture</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{moisturePct}%</h3>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800/30 text-xs text-gray-500 font-medium">
              Ideal Range: 50–70%
            </div>
          </div>

          {/* Card 2 — Temperature */}
          <div className="p-5 rounded-2xl bg-[#161922] border border-gray-800/40 flex flex-col justify-between shadow-lg hover:border-gray-700/50 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform duration-300">
                <Thermometer className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tempC >= 20 && tempC <= 35 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {tempC >= 20 && tempC <= 35 ? 'Good' : 'Stress'}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Temperature</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{tempC}°C</h3>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800/30 text-xs text-gray-500 font-medium">
              Ideal Range: 20–35°C
            </div>
          </div>

          {/* Card 3 — Light */}
          <div className="p-5 rounded-2xl bg-[#161922] border border-gray-800/40 flex flex-col justify-between shadow-lg hover:border-gray-700/50 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                <Sun className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lightPct >= 60 && lightPct <= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {lightPct >= 60 && lightPct <= 90 ? 'Good' : 'Suboptimal'}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sunlight</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{lightPct}%</h3>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800/30 text-xs text-gray-500 font-medium">
              Ideal Range: 60–90%
            </div>
          </div>
        </section>

        {/* Prediction Banner */}
        <section className="w-full">
          {predictedHours === 0 ? (
            <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-center gap-3 shadow-md animate-pulse">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-semibold">Moisture critical! Water your plant immediately to recover hydration.</p>
            </div>
          ) : (
            <div className="w-full p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-xl">⏱</span>
                <p className="text-sm font-medium tracking-wide">
                  Next watering recommended in approximately {predictedHours} hours
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Multi-Tab 24-Hour Trend Chart */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-lg flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/40 pb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]"></span>
              {getChartLabel()} &mdash; Last 24 Hours
            </h3>
            
            {/* Chart Tab Navigation */}
            <div className="flex items-center gap-1.5 bg-gray-900/60 p-1 rounded-xl border border-gray-800/60">
              <button
                onClick={() => setActiveTab('health')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === 'health' ? 'bg-[#1D9E75] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Health
              </button>
              <button
                onClick={() => setActiveTab('moisture')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === 'moisture' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Moisture
              </button>
              <button
                onClick={() => setActiveTab('temp')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === 'temp' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Temp
              </button>
              <button
                onClick={() => setActiveTab('light')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === 'light' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Light
              </button>
            </div>
          </div>
          
          <div className="w-full h-[280px] mt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData[activeTab]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252936" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11}
                    domain={activeTab === 'temp' ? [15, 45] : [0, 100]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#161922', 
                      borderColor: '#374151',
                      borderRadius: '12px',
                      color: '#f3f4f6',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                    }}
                    itemStyle={{ color: getChartLineColor() }}
                    labelStyle={{ color: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke={getChartLineColor()} 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1, fill: getChartLineColor() }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900/10 rounded-lg text-gray-500 text-sm">
                Loading chart...
              </div>
            )}
          </div>
        </section>

        {/* Collapsible Mobile Control trigger */}
        <div className="md:hidden flex justify-center mt-2">
          <button
            onClick={() => setIsSimOpen((prev) => !prev)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700/40 flex justify-center items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 animate-spin duration-3000" />
            {isSimOpen ? 'Close ESP32 Simulator Board' : 'Open ESP32 Simulator Board'}
          </button>
        </div>

        {/* ESP32 Simulation Console (Collapsible/Engineering Board style) */}
        {(isSimOpen || isMounted) && (
          <section className={`p-5 rounded-2xl bg-[#161922] border border-gray-800/60 shadow-xl flex-col gap-5 mt-2 ${isSimOpen ? 'flex' : 'hidden md:flex'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-gray-800/40">
              <span className="text-xs font-bold text-[#1D9E75] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                🔌 Simulated ESP32 Smart Board v1.0
              </span>
              <button 
                onClick={() => setIsOffline((prev) => !prev)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${isOffline ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}
              >
                {isOffline ? 'Reconnect Wi-Fi' : 'Disconnect Wi-Fi'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Moisture Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Moisture ADC (GPIO34)</span>
                  <span className="font-bold text-blue-400">{moistureRaw}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="4095" 
                  value={moistureRaw}
                  onChange={(e) => {
                    setMoistureRaw(parseInt(e.target.value));
                    setSecondsSinceUpdate(0);
                  }}
                  className="w-full accent-blue-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>0 (Waterlogged)</span>
                  <span>4095 (Damp)</span>
                </div>
              </div>

              {/* Temp Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Temp C (GPIO4)</span>
                  <span className="font-bold text-red-400">{tempC}°C</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="45" 
                  value={tempC}
                  onChange={(e) => {
                    setTempC(parseInt(e.target.value));
                    setSecondsSinceUpdate(0);
                  }}
                  className="w-full accent-red-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>10°C</span>
                  <span>45°C</span>
                </div>
              </div>

              {/* Light Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Light LDR (GPIO35)</span>
                  <span className="font-bold text-amber-400">{lightRaw}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1023" 
                  value={lightRaw}
                  onChange={(e) => {
                    setLightRaw(parseInt(e.target.value));
                    setSecondsSinceUpdate(0);
                  }}
                  className="w-full accent-amber-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>0 (Dark)</span>
                  <span>1023 (Sunlight)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="text-gray-500 self-center mr-1">Triggers:</span>
              <button onClick={() => triggerScenario('perfect')} className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700/60 hover:text-white transition-all">Perfect Condition</button>
              <button onClick={() => triggerScenario('dry')} className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700/60 hover:text-white transition-all">Dry Out</button>
              <button onClick={() => triggerScenario('heat')} className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700/60 hover:text-white transition-all">Heat Wave</button>
              <button onClick={() => triggerScenario('shade')} className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700/60 hover:text-white transition-all">Deep Shade</button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
