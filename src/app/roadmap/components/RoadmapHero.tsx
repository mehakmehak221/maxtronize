"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const pillars = [
  { title: "Security Token\nIssuance", epicId: 1, color: "border-purple-200 text-purple-700 bg-purple-50/80" },
  { title: "Regulatory\nCompliance", epicId: 3, color: "border-cyan-200 text-cyan-700 bg-cyan-50/80" },
  { title: "Institutional\nCustody", epicId: 6, color: "border-indigo-200 text-indigo-700 bg-indigo-50/80" },
  { title: "SPV\nStructures", epicId: 5, color: "border-pink-200 text-pink-700 bg-pink-50/80" },
  { title: "Escrow &\nBanking", epicId: 7, color: "border-amber-200 text-amber-700 bg-amber-50/80" },
  { title: "Yield\nDistribution", epicId: 8, color: "border-emerald-200 text-emerald-700 bg-emerald-50/80" },
  { title: "Multi-Chain\nOwnership", epicId: 2, color: "border-blue-200 text-blue-700 bg-blue-50/80" },
  { title: "Institutional\nInvestors", epicId: 10, color: "border-violet-200 text-violet-700 bg-violet-50/80" },
];

interface Props {
  onPillarClick: (epicId: number) => void;
}

export default function RoadmapHero({ onPillarClick }: Props) {
  const containerSize = 640;
  const center = containerSize / 2;
  const outerRadius = 280; 
  const ringR1 = 180; 
  const ringR2 = 140;
  const ringR3 = 100;
  const dotCount = 8;

  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden z-10">
   
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EAE6F5_1px,transparent_1px),linear-gradient(to_bottom,#EAE6F5_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 text-center relative z-10">
       
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6653AF]/20 bg-[#6653AF]/5 text-[#513C9E] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6 backdrop-blur-md"
        >
          <Shield className="w-4 h-4 text-[#6653AF]" />
          RWA Tokenization Infrastructure & Institutional Launch
        </motion.div>

      
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#111111] leading-tight"
        >
          MAXTRONIZE <span className="text-[#513C9E]">PHASE 2</span> ROADMAP
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
        >
          Phase 1 established the core Maxtronize platform, including Asset Issuer, Investor, Marketplace, Portfolio Management, Analytics, Wallet Management, Compliance Workflows, and Administration.
          <br />
          <span className="font-semibold text-slate-800 mt-2 block">
            Phase 2 focuses on transforming Maxtronize into a fully compliant Real World Asset (RWA) Tokenization Platform.
          </span>
        </motion.p>

       
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:block relative mx-auto mt-16 mb-4"
          style={{ width: containerSize, height: containerSize }}
        >
  
          <svg
            viewBox={`0 0 ${containerSize} ${containerSize}`}
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            <defs>
              <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6653AF" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6653AF" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#6653AF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="spokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6653AF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.08" />
              </linearGradient>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6653AF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6653AF" stopOpacity="0" />
              </radialGradient>
            </defs>

         
            <circle cx={center} cy={center} r="60" fill="url(#centerGlow)" />

           
            <circle
              cx={center} cy={center} r={ringR1}
              stroke="url(#ringGrad1)" strokeWidth="1.5" strokeDasharray="8 6"
              className="animate-[spin_50s_linear_infinite]"
              style={{ transformOrigin: "center" }}
            />

           
            <circle
              cx={center} cy={center} r={ringR2}
              stroke="url(#ringGrad2)" strokeWidth="1"
              className="animate-[spin_35s_linear_infinite_reverse]"
              style={{ transformOrigin: "center" }}
            />

    
            <circle
              cx={center} cy={center} r={ringR3}
              stroke="#6653AF" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.2"
            />

           
            {Array.from({ length: dotCount }).map((_, i) => {
              const angle = (i * 360) / dotCount - 90;
              const rad = (angle * Math.PI) / 180;
              const x2 = center + Math.cos(rad) * (ringR1 - 10);
              const y2 = center + Math.sin(rad) * (ringR1 - 10);
              return (
                <line
                  key={`spoke-${i}`}
                  x1={center} y1={center}
                  x2={x2} y2={y2}
                  stroke="url(#spokeGrad)" strokeWidth="1" strokeDasharray="3 5"
                />
              );
            })}

     
            {Array.from({ length: dotCount }).map((_, i) => {
              const angle = (i * 360) / dotCount - 90;
              const rad = (angle * Math.PI) / 180;
              const cx = center + Math.cos(rad) * ringR1;
              const cy2 = center + Math.sin(rad) * ringR1;
              return (
                <circle
                  key={`dot-${i}`}
                  cx={cx} cy={cy2} r="4"
                  fill="#6653AF" opacity="0.3"
                />
              );
            })}

         
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const cx = center + Math.cos(rad) * ringR2;
              const cy2 = center + Math.sin(rad) * ringR2;
              return (
                <circle
                  key={`mid-dot-${i}`}
                  cx={cx} cy={cy2} r="1.5"
                  fill="#22d3ee" opacity="0.3"
                />
              );
            })}
          </svg>

          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6653AF] to-[#513C9E] shadow-2xl shadow-purple-500/40 flex items-center justify-center border-2 border-white/30">
              <div className="text-center">
                <span className="text-white font-bold text-[10px] tracking-widest block">PHASE</span>
                <span className="text-white font-extrabold text-2xl leading-none block">2</span>
              </div>
            </div>
          </div>

         
          {pillars.map((p, i) => {
            const angle = (i * 360) / pillars.length - 90;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * outerRadius;
            const y = Math.sin(rad) * outerRadius;

            return (
              <motion.button
                key={i}
                onClick={() => onPillarClick(p.epicId)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.15, zIndex: 50 }}
                whileTap={{ scale: 0.92 }}
                className={`absolute px-3 py-2 rounded-xl border text-[10px] font-bold backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer text-center leading-tight z-20 ${p.color}`}
                style={{
                  left: center + x,
                  top: center + y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {p.title.split("\n").map((line, li) => (
                  <span key={li} className="block">{line}</span>
                ))}
              </motion.button>
            );
          })}
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:hidden mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {pillars.map((p, i) => (
            <motion.button
              key={i}
              onClick={() => onPillarClick(p.epicId)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`p-3 border rounded-lg text-[11px] font-semibold text-center backdrop-blur-md shadow-sm cursor-pointer ${p.color}`}
            >
              {p.title.replace("\n", " ")}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
