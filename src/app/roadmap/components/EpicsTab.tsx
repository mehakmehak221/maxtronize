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
    <div className="relative w-full py-8">
  
      <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#6653AF] via-cyan-400 to-[#513C9E] -translate-x-1/2 opacity-25 rounded-full pointer-events-none" />

      <div className="space-y-12 lg:space-y-20 relative">
        {EPICS.map((epic, index) => {
          const EpicIcon = getEpicIcon(epic.id);
          const isEven = index % 2 === 0;



          return (
            <div
              key={epic.id}
              id={`epic-${epic.id}`}
              className="relative flex flex-col lg:flex-row items-stretch justify-between w-full min-h-[280px] transition-all duration-300 rounded-2xl"
            >
           
              <div className="w-full lg:w-[46%] pl-14 lg:pl-0 flex flex-col justify-center">
                {isEven ? (
                 
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="hidden lg:flex flex-col items-end text-right pr-8 space-y-2"
                  >
                    {/* <span className="text-sm font-bold text-[#6653AF] bg-[#6653AF]/10 px-3 py-1 rounded-full">
                      {epic.weeks}
                    </span> */}
                    <p className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mt-2">
                      {epic.category}
                    </p>
                    {epic.dependency !== "None" && epic.dependency !== "Non" && (
                      <p className="text-[10px] font-semibold text-slate-500 mt-1">
                        Requires: {epic.dependency}
                      </p>
                    )}
                  </motion.div>
                ) : (
              
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="pr-0 lg:pr-8"
                  >
                    <EpicCard epic={epic} isEven={isEven} />
                  </motion.div>
                )}
              </div>

        
              <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 top-8 lg:top-1/2 lg:-translate-y-1/2 z-20">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="w-10 h-10 rounded-full bg-white border-4 border-[#6653AF] shadow-lg flex items-center justify-center relative hover:border-[#513C9E] transition-colors duration-300"
                >
                  <EpicIcon className="w-4 h-4 text-[#6653AF]" />
              
                  <div className="absolute inset-0 rounded-full bg-[#6653AF]/20 -z-10 animate-ping opacity-75" />
                </motion.div>
              </div>

           
              <div className="w-full lg:w-[46%] pl-14 lg:pl-0 flex flex-col justify-center mt-4 lg:mt-0">
                {isEven ? (
                 
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="pl-0 lg:pl-8"
                  >
                    <EpicCard epic={epic} isEven={isEven} />
                  </motion.div>
                ) : (
               
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="hidden lg:flex flex-col items-start text-left pl-8 space-y-2"
                  >
                    {/* <span className="text-sm font-bold text-[#6653AF] bg-[#6653AF]/10 px-3 py-1 rounded-full">
                      {epic.weeks}
                    </span> */}
                    <p className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mt-2">
                      {epic.category}
                    </p>
                    {epic.dependency !== "None" && epic.dependency !== "Non" && (
                      <p className="text-[10px] font-semibold text-slate-500 mt-1">
                        Requires: {epic.dependency}
                      </p>
                    )}
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
    <div className="bg-white/40 border border-white/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:border-[#6653AF]/25 transition-all duration-300 relative overflow-hidden group">
      
  
      <div className="absolute -bottom-8 -right-8 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-purple-950 animate-[spin_30s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="50" y1="50" x2={50 + 30 * Math.cos((i * 30 * Math.PI) / 180)} y2={50 + 30 * Math.sin((i * 30 * Math.PI) / 180)} />
          ))}
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      
      <div className="flex items-start justify-between flex-wrap gap-2 mb-4 border-b border-purple-100/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#6653AF]/10 text-[#513C9E] font-bold text-xs flex items-center justify-center shrink-0">
            {epic.id}
          </span>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-[#6653AF] transition-colors leading-tight">
              {epic.title}
            </h4>
            <span className="lg:hidden text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-0.5 block">
              {epic.category} • 
            </span>
          </div>
        </div>
        {epic.dependency !== "None" && epic.dependency !== "Non" && (
          <span className="lg:hidden text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Req: {epic.dependency}
          </span>
        )}
      </div>


      <div className="space-y-4 text-xs sm:text-sm">
        <div>
          <h5 className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">Objective</h5>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed font-semibold">
            {epic.objective}
          </p>
        </div>

    
        <div>
          <h5 className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-2">Key Features</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {epic.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-start p-2.5 rounded-lg bg-white/50 border border-slate-200/50 shadow-sm">
                {/* <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> */}
                <span className="text-[11px] text-slate-700 leading-normal font-semibold">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

  
        {(epic.webDeliverables.length > 0 || epic.mobileDeliverables.length > 0) && (
          <div className="border-t border-purple-100/60 pt-4">
            <h5 className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-2.5">Platform Deliverables</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {epic.webDeliverables.length > 0 && (
                <div className="bg-white/55 border border-slate-200/50 p-3 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1.5 text-[#6653AF] font-bold text-[10px] mb-2">
                    <AppWindow className="w-3.5 h-3.5" />
                    Web Portal
                  </div>
                  <ul className="space-y-1">
                    {epic.webDeliverables.map((item: string, idx: number) => (
                      <li key={idx} className="text-[11px] text-slate-600 font-semibold flex items-start gap-1.5 leading-snug">
                        <span className="w-1 h-1 rounded-full bg-[#6653AF]/60 shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {epic.mobileDeliverables.length > 0 && (
                <div className="bg-white/55 border border-slate-200/50 p-3 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1.5 text-cyan-600 font-bold text-[10px] mb-2">
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile App
                  </div>
                  <ul className="space-y-1">
                    {epic.mobileDeliverables.map((item: string, idx: number) => (
                      <li key={idx} className="text-[11px] text-slate-600 font-semibold flex items-start gap-1.5 leading-snug">
                        <span className="w-1 h-1 rounded-full bg-cyan-500/60 shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

     
        {epic.vendors.length > 0 && (
          <div className="border-t border-purple-100/60 pt-4">
            <h5 className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-2">Third-Party Integration Stack</h5>
            <div className="flex flex-wrap gap-1.5">
              {epic.vendors.map((vendor: any, idx: number) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded bg-slate-100/80 border border-slate-200/70 flex items-center gap-1.5 text-[10px] font-semibold"
                >
                  <Cpu className="w-3 h-3 text-[#6653AF] shrink-0" />
                  <span className="font-bold text-slate-800">{vendor.name}</span>
                  <span className="text-slate-400 font-bold">•</span>
                  <span className="text-slate-600">{vendor.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
