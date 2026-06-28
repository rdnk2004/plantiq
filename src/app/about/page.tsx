'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-100 font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto w-full flex-grow flex flex-col gap-6 md:gap-8 justify-center py-6">
        
        {/* Header / Back Link */}
        <header className="flex items-center gap-3">
          <Link 
            href="/"
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all duration-200"
            aria-label="Back to dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Plant Passport</span>
        </header>

        {/* Top Section - Identity */}
        <section className="text-center flex flex-col items-center">
          <div className="text-6xl select-none animate-bounce duration-1000">🌿</div>
          <h1 className="text-3xl font-extrabold text-white mt-4">Tulsi</h1>
          <p className="text-sm font-semibold text-[#1D9E75] italic mt-1">Ocimum tenuiflorum</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Holy Basil &bull; Sacred Basil &bull; Vrinda
          </p>
          <div className="mt-4 flex flex-col items-center gap-1 text-xs text-gray-500">
            <span>Origin: Indian Subcontinent</span>
            <span>Pot ID: #001 &bull; Monitored since June 2026</span>
          </div>
        </section>

        {/* Health Passport Card (Teal Border) */}
        <section className="p-5 rounded-2xl bg-[#161922] border border-[#1D9E75]/40 shadow-lg relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#1D9E75]/5 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            📊 Health Passport
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center justify-between pb-3 border-b border-gray-800/40">
              <span className="text-sm text-gray-400 font-semibold">Current Health Score</span>
              <span className="text-lg font-black text-[#1D9E75]">76/100</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Status</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5">Healthy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Days Monitored</span>
              <span className="text-sm font-bold text-white mt-0.5">14</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Total Alerts</span>
              <span className="text-sm font-bold text-amber-500 mt-0.5">3</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Water Events</span>
              <span className="text-sm font-bold text-blue-400 mt-0.5">8</span>
            </div>
          </div>
        </section>

        {/* Care Requirements Table */}
        <section className="p-5 rounded-2xl bg-[#161922] border border-gray-800/40 shadow-md">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            📋 Care Profile & Hardware Mapping
          </h3>
          <div className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2">
                  <th className="pb-2">Parameter</th>
                  <th className="pb-2 text-center">Hardware Pin</th>
                  <th className="pb-2 text-right">Ideal Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                <tr>
                  <td className="py-2.5 text-gray-300 font-medium">Soil Moisture</td>
                  <td className="py-2.5 text-center text-xs text-blue-400 font-semibold uppercase">GPIO34 (ADC)</td>
                  <td className="py-2.5 text-right font-semibold text-[#1D9E75]">50–70%</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-gray-300 font-medium">Temperature</td>
                  <td className="py-2.5 text-center text-xs text-red-400 font-semibold uppercase">GPIO4 (DHT22)</td>
                  <td className="py-2.5 text-right font-semibold text-[#1D9E75]">20–35°C</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-gray-300 font-medium">Sunlight</td>
                  <td className="py-2.5 text-center text-xs text-amber-400 font-semibold uppercase">GPIO35 (ADC LDR)</td>
                  <td className="py-2.5 text-right font-semibold text-[#1D9E75]">6+ hours/day</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-gray-300 font-medium">Watering</td>
                  <td className="py-2.5 text-center text-xs text-emerald-400 font-semibold uppercase">GPIO26 (Relay)</td>
                  <td className="py-2.5 text-right font-semibold text-[#1D9E75]">Every 2–3 days</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-gray-300 font-medium">Humidity</td>
                  <td className="py-2.5 text-center text-xs text-purple-400 font-semibold uppercase">GPIO4 (DHT22)</td>
                  <td className="py-2.5 text-right font-semibold text-[#1D9E75]">40–60%</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-gray-300 font-medium">Soil Type</td>
                  <td className="py-2.5 text-center text-xs text-gray-500 font-semibold">Physical Pot</td>
                  <td className="py-2.5 text-right font-semibold text-gray-400">Well-draining loamy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Significance Card (Amber Border) */}
        <section className="p-5 rounded-2xl bg-[#161922] border border-amber-500/25 shadow-md relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            ✨ Why Tulsi?
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed font-normal">
            Tulsi is one of the most sacred plants in Indian culture and one of the most medicinally significant herbs in Ayurveda. It is also highly sensitive to environmental changes &mdash; making it the perfect plant to demonstrate PlantIQ&apos;s multi-sensor health monitoring. A small change in temperature or moisture immediately reflects in its health score.
          </p>
        </section>

        {/* QR Code Section (Gray Card) */}
        <section className="p-5 rounded-2xl bg-[#161922]/60 border border-gray-800/40 shadow-md flex flex-col items-center text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Scan to view live dashboard
          </p>
          <div className="w-40 h-40 bg-gray-900 border border-gray-800/80 rounded-xl flex items-center justify-center overflow-hidden shadow-inner p-2">
            {/* Image tag pointing to /qr.png */}
            {/* Falls back cleanly to styling / border representation if qr.png does not exist */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/qr.png" 
              alt="Live Dashboard QR Code"
              width="144"
              height="144"
              className="rounded-lg object-contain"
              onError={(e) => {
                // If qr.png fails to load, display a clean fallback placeholder representation
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full flex flex-col items-center justify-center text-gray-600 text-[10px] font-bold p-2 border border-dashed border-gray-700/60 rounded-lg';
                  fallback.innerHTML = '[ QR Code ]<br/>qr.png placeholder';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <span className="text-xs font-semibold text-[#1D9E75] mt-4 tracking-wide">
            plantiq.vercel.app
          </span>
        </section>

        {/* Back to Dashboard link at bottom */}
        <section className="flex justify-center">
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
          PlantIQ &bull; IOPT 2026
        </p>
      </footer>
    </div>
  );
}
