"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Cpu, AppWindow, Smartphone, Lock, Scale, Coins, CheckCircle2 } from "lucide-react";

// Animation configurations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 18 
    } 
  }
};

export function StrategyTab() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-[#513C9E] bg-clip-text text-transparent">
          PHASE 2 DELIVERY STRATEGY
        </h2>
        <p className="text-slate-600 text-sm font-medium mt-2">
          The roadmap is divided into three parallel tracks:
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {/* Track A */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          className="relative h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[#6653AF] via-cyan-400 to-[#513C9E] rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-purple-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-purple-950/8 hover:shadow-2xl hover:shadow-purple-950/15 hover:border-purple-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 shadow-sm hover:scale-105 transition-transform duration-300">
                <Cpu className="w-6 h-6 text-[#6653AF]" />
              </div>
              <span className="text-[11px] uppercase font-bold text-[#6653AF] tracking-widest bg-purple-50/80 px-2.5 py-1 rounded">
                Parallel Track
              </span>
              <h3 className="text-xl font-extrabold text-[#513C9E] mt-3.5 tracking-tight">
                Track A – Infrastructure Layer
              </h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-semibold">
                Core Tokenization, Blockchain, Compliance, Custody, Banking, Security
              </p>
            </div>
            
            <div className="mt-8 pt-5 border-t border-purple-100/50 flex flex-wrap gap-2">
              {["Core Tokenization", "Blockchain", "Compliance", "Custody", "Banking", "Security"].map((s, i) => (
                <span 
                  key={i} 
                  className="text-xs font-bold text-[#513C9E] bg-[#6653AF]/5 px-3 py-1 rounded-full border border-[#6653AF]/15 hover:bg-[#6653AF]/10 transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Track B */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          className="relative h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-cyan-400 via-[#6653AF] to-cyan-500 rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-cyan-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-cyan-950/8 hover:shadow-2xl hover:shadow-cyan-950/15 hover:border-cyan-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-5 shadow-sm hover:scale-105 transition-transform duration-300">
                <AppWindow className="w-6 h-6 text-cyan-600" />
              </div>
              <span className="text-[11px] uppercase font-bold text-cyan-600 tracking-widest bg-cyan-50/80 px-2.5 py-1 rounded">
                Parallel Track
              </span>
              <h3 className="text-xl font-extrabold text-cyan-700 mt-3.5 tracking-tight">
                Track B – Web Platform
              </h3>
              
              <div className="space-y-4 mt-5">
                {[
                  { title: "Investor Portal", desc: "Investment Marketplace, Token Holdings, Wallet Management, Yield Dashboard, Document Center, Compliance Center", color: "text-[#6653AF]", border: "border-purple-200/35" },
                  { title: "Asset Issuer Portal", desc: "Asset Management, Tokenization Management, Investor Registry, Distribution Management, SPV Management", color: "text-cyan-600", border: "border-cyan-200/35" },
                  { title: "Administration Portal", desc: "Compliance Operations, Custody Operations, Escrow Operations, Distribution Operations, Platform Governance", color: "text-slate-700", border: "border-slate-200/45" }
                ].map((p, i) => (
                  <div key={i} className={`p-3.5 bg-white/80 border ${p.border} rounded-xl hover:bg-white/95 transition-all duration-200 shadow-sm`}>
                    <strong className={`text-xs sm:text-sm font-extrabold ${p.color} block mb-1`}>{p.title}</strong>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Track C */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          className="relative h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-[#6653AF] rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-emerald-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-emerald-950/8 hover:shadow-2xl hover:shadow-emerald-950/15 hover:border-emerald-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 shadow-sm hover:scale-105 transition-transform duration-300">
                <Smartphone className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-[11px] uppercase font-bold text-emerald-600 tracking-widest bg-emerald-50/80 px-2.5 py-1 rounded">
                Parallel Track
              </span>
              <h3 className="text-xl font-extrabold text-emerald-700 mt-3.5 tracking-tight">
                Track C – Mobile Applications
              </h3>
              
              <div className="space-y-4 mt-5">
                {[
                  { title: "Investor App", desc: "Portfolio Tracking, Investments, Wallet, Yield Tracking, Documents, Notifications", color: "text-emerald-600", border: "border-emerald-200/35" },
                  { title: "Asset Issuer App", desc: "Asset Monitoring, Investor Monitoring, Raise Progress, Distribution Status", color: "text-teal-600", border: "border-teal-200/35" }
                ].map((p, i) => (
                  <div key={i} className={`p-3.5 bg-white/80 border ${p.border} rounded-xl hover:bg-white/95 transition-all duration-200 shadow-sm`}>
                    <strong className={`text-xs sm:text-sm font-extrabold ${p.color} block mb-1`}>{p.title}</strong>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function RequirementsTab() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-[#513C9E] bg-clip-text text-transparent">
          FINAL GO-LIVE REQUIREMENTS
        </h2>
        <p className="text-slate-600 text-sm font-medium mt-2">
          Prerequisites and verification gates for institutional launch:
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {/* Technical */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative group h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[#6653AF] via-purple-400 to-[#513C9E] rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-purple-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-purple-950/8 hover:shadow-2xl hover:shadow-purple-950/15 hover:border-purple-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 text-[#6653AF] font-extrabold text-base border-b border-purple-100/60 pb-3">
                <Lock className="w-5 h-5" />
                Technical
              </div>
              
              <ul className="space-y-3">
                {["Smart Contract Audit", "Penetration Testing", "Load Testing", "Disaster Recovery"].map((s, i) => (
                  <li 
                    key={i} 
                    className="flex gap-3 items-center p-3 bg-white/80 border border-purple-200/35 rounded-xl hover:bg-white/95 transition-all duration-200 shadow-sm group/item"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 group-hover/item:scale-105 transition-transform duration-200" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 pt-5 border-t border-purple-100/60">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 block mb-2.5">
                Audit Partners
              </span>
              <div className="flex flex-wrap gap-2">
                {["CertiK", "OpenZeppelin Security", "Trail of Bits"].map((p, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-bold bg-slate-50/90 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-default"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compliance */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative group h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-cyan-400 via-cyan-500 to-[#6653AF] rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-cyan-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-cyan-950/8 hover:shadow-2xl hover:shadow-cyan-950/15 hover:border-cyan-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 text-cyan-700 font-extrabold text-base border-b border-purple-100/60 pb-3">
                <Scale className="w-5 h-5" />
                Compliance
              </div>
              
              <ul className="space-y-3">
                {["KYC Live", "KYB Live", "AML Live", "Accreditation Verification Live"].map((s, i) => (
                  <li 
                    key={i} 
                    className="flex gap-3 items-center p-3 bg-white/80 border border-cyan-200/35 rounded-xl hover:bg-white/95 transition-all duration-200 shadow-sm group/item"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 group-hover/item:scale-105 transition-transform duration-200" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 pt-5 border-t border-purple-100/60">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 block mb-2.5">
                Providers
              </span>
              <div className="flex flex-wrap gap-2">
                {["Sumsub", "Persona", "VerifyInvestor"].map((p, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-bold bg-slate-50/90 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-default"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Banking, Custody & Mobile */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative group h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-[#6653AF] rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-emerald-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-emerald-950/8 hover:shadow-2xl hover:shadow-emerald-950/15 hover:border-emerald-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 text-emerald-700 font-extrabold text-base border-b border-purple-100/60 pb-3">
                <Coins className="w-5 h-5" />
                Banking, Custody & Mobile
              </div>
              
              <ul className="space-y-3">
                {[
                  "Escrow Accounts Active",
                  "Fiat Rails Active",
                  "Stablecoin Rails Active",
                  "Fireblocks / BitGo Ready",
                  "Android Production Release",
                  "iOS Production Release"
                ].map((s, i) => (
                  <li 
                    key={i} 
                    className="flex gap-3 items-center p-3 bg-white/80 border border-emerald-200/35 rounded-xl hover:bg-white/95 transition-all duration-200 shadow-sm group/item"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 group-hover/item:scale-105 transition-transform duration-200" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 pt-5 border-t border-purple-100/60">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 block mb-2.5">
                Infrastructure Providers
              </span>
              <div className="flex flex-wrap gap-2">
                {["Lead Bank", "Column Bank", "Circle", "Fireblocks", "BitGo"].map((p, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-bold bg-slate-50/90 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-default"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function FutureTab() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-[#513C9E] bg-clip-text text-transparent">
          EXECUTIVE SUMMARY TIMELINE
        </h2>
        <p className="text-slate-600 text-sm font-medium mt-2">
          High-level view from Phase 2 infrastructure to Phase 3 secondary marketplace:
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      >
        {/* Phase 2 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative group h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[#6653AF] via-cyan-400 to-[#513C9E] rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-purple-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-purple-950/8 hover:shadow-2xl hover:shadow-purple-950/15 hover:border-purple-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-purple-100/60 mb-5">
                <span className="text-xs font-extrabold text-[#6653AF] uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-100/60">
                  Active Track
                </span>
              </div>
              
              <h3 className="text-xl font-extrabold text-[#513C9E] tracking-tight">
                Phase 2 – Core Infrastructure
              </h3>
              
              <ul className="mt-5 space-y-3">
                {[
                  "Tokenization Infrastructure",
                  "Blockchain Infrastructure",
                  "Compliance Infrastructure",
                  "Wallet Compliance Layer",
                  "SPV & Legal Infrastructure",
                  "Custody Infrastructure",
                  "Payments & Escrow",
                  "Yield Distribution",
                  "Security Infrastructure"
                ].map((s, i) => (
                  <li 
                    key={i} 
                    className="flex gap-3 items-center text-xs sm:text-sm text-slate-700 font-bold p-3 bg-white/80 border border-purple-200/35 rounded-xl hover:bg-white/95 hover:border-[#6653AF]/30 transition-all duration-200"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6653AF] shrink-0 shadow-xs" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Phase 3 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative group h-full"
        >
          {/* Neon Border Glow - Permanent */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-cyan-400 via-[#6653AF] to-cyan-500 rounded-2xl opacity-25 blur-md pointer-events-none" />
          
          <div className="relative h-full bg-white/70 border border-cyan-200/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-cyan-950/8 hover:shadow-2xl hover:shadow-cyan-950/15 hover:border-cyan-200/60 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-purple-100/60 mb-5">
                <span className="text-xs font-extrabold text-cyan-700 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100/60">
                  Future Vision
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
                  Phase 3
                </span>
              </div>
              
              <h3 className="text-xl font-extrabold text-cyan-700 tracking-tight">
                Phase 3 – Liquidity & Secondary Market
              </h3>
              
              <ul className="mt-5 space-y-3">
                {[
                  "Secondary Marketplace",
                  "Transfer Agent Services",
                  "Institutional APIs",
                  "Market Making",
                  "Liquidity Programs"
                ].map((s, i) => (
                  <li 
                    key={i} 
                    className="flex gap-3 items-center text-xs sm:text-sm text-slate-700 font-bold p-3 bg-white/80 border border-cyan-200/35 rounded-xl hover:bg-white/95 hover:border-cyan-500/30 transition-all duration-200"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0 shadow-xs" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
