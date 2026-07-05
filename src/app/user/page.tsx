'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSimulation } from '@/utils/simulationState';
import {
  User,
  Shield,
  MapPin,
  Star,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Heart,
  Smartphone,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function UserPage() {
  const { state, healthScore } = useSimulation('tulsi');
  const [isMounted, setIsMounted] = useState(false);
  const [likesCount, setLikesCount] = useState(48);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-obsidian text-brand-green/80 flex items-center justify-center font-serif italic text-sm gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping"></span>
        Connecting conservatory terminal...
      </div>
    );
  }

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    }
  };



  return (
    <div className="min-h-screen bg-obsidian text-gray-100 font-sans flex flex-col justify-between p-4 sm:p-6 pb-28 md:pb-12 selection:bg-brand-green/20 selection:text-brand-green">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col gap-6 py-2">
        
        {/* Conservatory Brand Banner */}
        <section className="bg-gradient-to-br from-brand-copper/10 via-[#121317] to-[#121317] border border-gray-900 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-copper/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-copper/5 border border-brand-copper/20 flex items-center justify-center text-3xl shadow-inner select-none font-bold">
              🏡
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white font-serif tracking-tight">R.D.N.K. Botanicals</h1>
                <span className="w-fit inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase bg-brand-gold/10 text-brand-gold border border-brand-gold/25 font-mono">
                  <Star className="w-2.5 h-2.5 fill-brand-gold stroke-none" />
                  Premium Curator
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-medium flex items-center gap-1 font-serif italic">
                <MapPin className="w-3.5 h-3.5 text-brand-copper" />
                Sector 7, Greenhouse Block C, New Delhi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-950 border border-gray-900 px-3.5 py-2 rounded-xl font-mono">
              Cons. Code: RDNK-902
            </span>
          </div>
        </section>

        {/* Curator details & certificates */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Curator Profile & Specifications */}
          <div className="md:col-span-7 flex flex-col gap-5">
            {/* Curator profile card */}
            <div className="bg-[#121317]/40 border border-gray-900 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                Owner & Operator Profile
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-gold/5 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-bold select-none font-serif italic text-base">
                  R
                </div>
                <div>
                  <h4 className="text-sm font-bold font-serif text-white">R.D.N.K.</h4>
                  <p className="text-[9px] text-gray-450 uppercase tracking-wider font-mono">
                    Chief Conservator & Systems Architect
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                "Our private collection utilizes embedded micro-sensors to chart live plant cellular stress. By maintaining rigorous baselines, R.D.N.K. Botanicals guarantees robust leaf structures and calibrated root systems."
              </p>

              {/* Bio details badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider border-t border-gray-900 pt-4 mt-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                  Organic Soil
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                  IoT Certified
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                  Pathogen-Free
                </div>
              </div>
            </div>

            {/* Smart Purchase Actions */}
            <div className="bg-[#121317]/40 border border-gray-900 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-900">
                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block font-mono">
                    Specimen reference
                  </span>
                  <span className="text-sm font-bold font-serif text-white block mt-1">
                    Tulsi (Holy Basil) &mdash; Specimen #001
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block font-mono">
                    Acquisition Valuation
                  </span>
                  <span className="text-base font-black text-brand-green block mt-1">
                    ₹350
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Purchase conveys the certified organic Tulsi tissue culture, integrated terracotta smart-pot configured with GPIO34 capacitive sensors, air temperature semiconductors, and a pre-flashed ESP32 network bridge.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-1">
                <button 
                  onClick={handleLike}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 ${
                    hasLiked 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                      : 'bg-gray-950 border-gray-900 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{likesCount} Likes</span>
                </button>
                
                <button
                  onClick={() => alert("Simulation Transfer: Ownership transfer protocol initiated. Initializing ESP32 local broker handshake...")}
                  className="flex-grow inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-bold bg-brand-green hover:bg-brand-green/90 text-black tracking-widest uppercase transition-all duration-300 shadow-lg shadow-brand-green/5 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                  Acquire Specimen
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Holographic Gold-Foil Seal & QR Verification */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Gold foil Certificate of Authenticity */}
            <div className="bg-gradient-to-b from-[#1b1914] to-[#121317] border border-brand-gold/30 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden group hover:border-brand-gold/60 transition-all duration-500">
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
              
              <Award className="w-8 h-8 text-brand-gold animate-pulse mb-3" />
              
              <h3 className="text-xs font-bold text-brand-gold font-serif uppercase tracking-widest">
                Certificate of Authenticity
              </h3>
              
              <p className="text-[10px] text-gray-400 font-serif italic leading-relaxed mt-2.5 px-1">
                "This certifies that Specimen #001 is propagated under biological grade standards, configured with an active smart telemetry processor, and cataloged in the private R.D.N.K. ledger registry."
              </p>

              <div className="w-full border-t border-brand-gold/15 my-4 pt-3 flex flex-col items-center">
                <span className="text-[8px] font-bold text-brand-gold/75 tracking-widest uppercase font-mono">
                  Ingested: June 2026
                </span>
                <span className="text-[9px] text-gray-500 font-serif italic mt-0.5">
                  Verified by: Chief Operator R.D.N.K.
                </span>
              </div>
            </div>

            {/* Verification QR Code */}
            <div className="bg-[#121317]/30 border border-gray-900 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-md">
              <div className="p-3.5 rounded-2xl bg-white flex items-center justify-center relative shadow-inner">
                {/* SVG QR Code */}
                <svg width="120" height="120" viewBox="0 0 29 29" className="text-gray-900 fill-current">
                  <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm6-2h1v1H8zm1 1h1v1H9zm-1 1h1v1H8zm2 0h1v1h-1zm-2 1h1v1H8zm2 0h1v1h-1zm-2 1h1v1H8zm2 0h1v1h-1zm-2 1h1v1H8zm2 0h1v1h-1zm12-7h7v7h-7zm1 1v5h5V1zm1 1h3v3H22zM0 22h7v7H0zm1 1v5h5v-5zm1 1h3v3H2zm6-8h1v1H8zm1 1h1v1H9zm-1 1h1v1H8zm2 0h1v1h-1zm-2 1h1v1H8zm2 0h1v1h-1zm-2 1h1v1H8zm2 0h1v1h-1zm-2 1h1v1H8zm2 0h1v1h-1zm2-7h1v1h-1zm1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-2 1h1v1h-1zm2 0h1v1h-1zm-2 1h1v1h-1zm2 0h1v1h-1zm-2 1h1v1h-1zm2 0h1v1h-1zm2-6h1v1h-1zm1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-2 1h1v1h-1zm2 0h1v1h-1zm-2 1h1v1h-1zm2 0h1v1h-1zm-2 1h1v1h-1zm2 0h1v1h-1zm2-7h1v1H27zm0 2h1v1H27zm0 2h1v1H27zm0 2h1v1H27zm0 2h1v1H27z"/>
                </svg>
                <div className="absolute w-6.5 h-6.5 bg-white rounded-lg flex items-center justify-center shadow text-xs">
                  🌱
                </div>
              </div>

              <div className="mt-3.5 w-full">
                <span className="inline-flex items-center gap-1 text-[8px] font-bold text-gray-400 bg-gray-950 border border-gray-900 px-2 py-0.5 rounded font-mono">
                  QR-VERIFIED: RDNK-TULSI-001
                </span>
                <p className="text-[9px] text-gray-500 mt-2 font-mono">
                  Readings validated &bull; Ownership Transfer: Available
                </p>
              </div>
            </div>
          </div>

        </div>



      </div>
    </div>
  );
}
