"use client";

import React from "react";
import { motion } from "framer-motion";
import { EPICS } from "../data";
import {
  FileText,
  Link2,
  UserCheck,
  Fingerprint,
  Briefcase,
  FolderLock,
  Wallet,
  Percent,
  Key,
  Layers,
  Check,
  Cpu,
  AppWindow,
  Smartphone
} from "lucide-react";

const getEpicIcon = (id: number) => {
  switch (id) {
    case 1: return FileText;
    case 2: return Link2;
    case 3: return UserCheck;
    case 4: return Fingerprint;
    case 5: return Briefcase;
    case 6: return FolderLock;
    case 7: return Wallet;
    case 8: return Percent;
    case 9: return Key;
    case 10: return Layers;
    default: return Layers;
  }
};

export default function EpicsTab() {
  return (
    <div className="relative w-full py-12 px-2 sm:px-4">
      {/* Glow aura behind the timeline */}
      <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-2.5 bg-gradient-to-b from-[#6653AF]/20 via-cyan-400/25 to-[#513C9E]/20 -translate-x-1/2 opacity-50 rounded-full blur-[3px] pointer-events-none" />
      
      {/* Main sharp timeline wire */}
      <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#6653AF] via-cyan-400 to-[#513C9E] -translate-x-1/2 opacity-35 rounded-full pointer-events-none" />

      <div className="space-y-16 lg:space-y-24 relative">
        {EPICS.map((epic, index) => {
          const EpicIcon = getEpicIcon(epic.id);
          const isEven = index % 2 === 0;

          return (
            <div
              key={epic.id}
              id={`epic-${epic.id}`}
              className="relative flex flex-col lg:flex-row items-stretch justify-between w-full min-h-[300px] rounded-3xl"
            >
              {/* Left Side: Card (odd index) or Metadata (even index) */}
              <div className="w-full lg:w-[46%] pl-16 lg:pl-0 flex flex-col justify-center">
                {isEven ? (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden lg:flex flex-col items-end text-right pr-12 space-y-3"
                  >
                    <div className="bg-white/60 border border-purple-200/50 backdrop-blur-md rounded-2xl p-4.5 shadow-lg shadow-purple-900/5 hover:bg-white/80 transition-colors duration-300">
                      <span className="text-xs uppercase tracking-widest font-extrabold text-[#6653AF] bg-[#6653AF]/10 px-3.5 py-1.5 rounded-full inline-block">
                        {epic.category}
                      </span>
                      {epic.dependency !== "None" && epic.dependency !== "Non" && (
                        <div className="flex items-center gap-2 mt-3.5 text-xs text-slate-600 font-bold justify-end">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                          <span>Requires: <span className="text-slate-900">{epic.dependency}</span></span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="pr-0 lg:pr-10"
                  >
                    <EpicCard epic={epic} isEven={isEven} />
                  </motion.div>
                )}
              </div>

              {/* Center Squircle Node */}
              <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 top-8 lg:top-1/2 lg:-translate-y-1/2 z-20">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ scale: 1.18, rotate: 8 }}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#513C9E] shadow-xl flex items-center justify-center relative hover:border-[#6653AF] transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[#6653AF]/10 rounded-2xl" />
                  <EpicIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#513C9E] relative z-10" />
                  <div className="absolute inset-0 rounded-2xl bg-[#6653AF]/25 -z-10 animate-ping opacity-60" />
                </motion.div>
              </div>

              {/* Right Side: Metadata (even index) or Card (odd index) */}
              <div className="w-full lg:w-[46%] pl-16 lg:pl-0 flex flex-col justify-center mt-6 lg:mt-0">
                {isEven ? (
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="pl-0 lg:pl-10"
                  >
                    <EpicCard epic={epic} isEven={isEven} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden lg:flex flex-col items-start text-left pl-12 space-y-3"
                  >
                    <div className="bg-white/60 border border-purple-200/50 backdrop-blur-md rounded-2xl p-4.5 shadow-lg shadow-purple-900/5 hover:bg-white/80 transition-colors duration-300">
                      <span className="text-xs uppercase tracking-widest font-extrabold text-[#6653AF] bg-[#6653AF]/10 px-3.5 py-1.5 rounded-full inline-block">
                        {epic.category}
                      </span>
                      {epic.dependency !== "None" && epic.dependency !== "Non" && (
                        <div className="flex items-center gap-2 mt-3.5 text-xs text-slate-600 font-bold">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                          <span>Requires: <span className="text-slate-900">{epic.dependency}</span></span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EpicCard({ epic, isEven }: { epic: any; isEven: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-full"
    >
      {/* Background neon border glow - permanently visible */}
      <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[#6653AF] via-cyan-400 to-[#513C9E] rounded-2xl opacity-25 blur-md pointer-events-none" />
      
      {/* Card Content body */}
      <div className="relative bg-white/75 border border-purple-200/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl shadow-purple-950/8 hover:shadow-2xl hover:shadow-purple-950/15 hover:border-purple-200/60 transition-all duration-300 overflow-hidden">
        
        {/* Background Watermark Grid - permanently visible */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.08] transition-all duration-500 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-purple-950 animate-[spin_45s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="50" cy="50" r="45" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="15" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line 
                key={i} 
                x1="50" 
                y1="50" 
                x2={50 + 40 * Math.cos((i * 30 * Math.PI) / 180)} 
                y2={50 + 40 * Math.sin((i * 30 * Math.PI) / 180)} 
              />
            ))}
          </svg>
        </div>

        {/* Dynamic gradient overlay - permanently blended */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-cyan-500/[0.03] pointer-events-none" />

        {/* Header Block */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6 border-b border-purple-100/70 pb-4">
          <div className="flex items-center gap-3.5">
            {/* Squircle Index Badge */}
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6653AF] to-[#513C9E] text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-purple-900/15 shrink-0">
              {epic.id}
            </span>
            <div>
              <h4 className="text-lg sm:text-2xl font-extrabold text-[#513C9E] tracking-tight transition-colors leading-tight">
                {epic.title}
              </h4>
              {/* Responsive Category tag for small viewports */}
              <span className="lg:hidden text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mt-1 block">
                {epic.category}
              </span>
            </div>
          </div>
          {epic.dependency !== "None" && epic.dependency !== "Non" && (
            <span className="lg:hidden text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200/50">
              Req: {epic.dependency}
            </span>
          )}
        </div>

        {/* Content Modules */}
        <div className="space-y-6">
          {/* Objective */}
          <div>
            <h5 className="text-[11px] uppercase tracking-widest text-[#6653AF] font-bold">Objective</h5>
            <p className="text-sm sm:text-base text-slate-700 mt-1.5 leading-relaxed font-semibold">
              {epic.objective}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h5 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-3">Key Features</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {epic.features.map((feature: string, idx: number) => (
                <div 
                  key={idx} 
                  className="flex gap-2.5 items-start p-3 rounded-xl bg-white/80 border border-purple-200/35 shadow-sm hover:bg-white/95 transition-all duration-200"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-[13px] text-slate-700 leading-normal font-semibold">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          {(epic.webDeliverables.length > 0 || epic.mobileDeliverables.length > 0) && (
            <div className="border-t border-purple-100/60 pt-5">
              <h5 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-3.5">Platform Deliverables</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {epic.webDeliverables.length > 0 && (
                  <div className="bg-white/85 border border-purple-200/40 p-4 rounded-xl shadow-sm hover:border-purple-200/60 transition-colors">
                    <div className="flex items-center gap-2 text-[#513C9E] font-extrabold text-xs mb-3">
                      <AppWindow className="w-4 h-4" />
                      Web Portal
                    </div>
                    <ul className="space-y-2">
                      {epic.webDeliverables.map((item: string, idx: number) => (
                        <li key={idx} className="text-xs sm:text-[13px] text-slate-600 font-semibold flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6653AF]/60 shrink-0 mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {epic.mobileDeliverables.length > 0 && (
                  <div className="bg-white/85 border border-cyan-200/40 p-4 rounded-xl shadow-sm hover:border-cyan-200/60 transition-colors">
                    <div className="flex items-center gap-2 text-cyan-700 font-extrabold text-xs mb-3">
                      <Smartphone className="w-4 h-4" />
                      Mobile App
                    </div>
                    <ul className="space-y-2">
                      {epic.mobileDeliverables.map((item: string, idx: number) => (
                        <li key={idx} className="text-xs sm:text-[13px] text-slate-600 font-semibold flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 shrink-0 mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vendors */}
          {epic.vendors.length > 0 && (
            <div className="border-t border-purple-100/60 pt-5">
              <h5 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-3">Third-Party Integration Stack</h5>
              <div className="flex flex-wrap gap-2">
                {epic.vendors.map((vendor: any, idx: number) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-slate-50/80 border border-purple-100/80 flex items-center gap-2 text-xs font-semibold hover:border-[#6653AF]/30 transition-colors duration-200"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#6653AF] shrink-0" />
                    <span className="font-extrabold text-slate-800">{vendor.name}</span>
                    <span className="text-slate-300 font-bold">•</span>
                    <span className="text-slate-600 font-medium">{vendor.purpose}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
