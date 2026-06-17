"use client";

import React from "react";
import { Cpu, AppWindow, Smartphone, Lock, Scale, Coins, CheckCircle2 } from "lucide-react";

export function StrategyTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950">PHASE 2 DELIVERY STRATEGY</h2>
        <p className="text-slate-500 text-xs mt-1">The roadmap is divided into three parallel tracks:</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Track A */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5 hover:shadow-2xl transition duration-300">
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5 text-[#6653AF]" />
          </div>
          <span className="text-[10px] uppercase font-bold text-[#6653AF] tracking-wider">Parallel Track</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Track A – Infrastructure Layer</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">Core Tokenization, Blockchain, Compliance, Custody, Banking, Security</p>
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
            {["Core Tokenization", "Blockchain", "Compliance", "Custody", "Banking", "Security"].map((s, i) => (
              <span key={i} className="text-[10px] font-semibold text-[#513C9E] bg-[#6653AF]/5 px-2.5 py-0.5 rounded border border-[#6653AF]/10">{s}</span>
            ))}
          </div>
        </div>

        {/* Track B */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5 hover:shadow-2xl transition duration-300">
          <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-4">
            <AppWindow className="w-5 h-5 text-cyan-600" />
          </div>
          <span className="text-[10px] uppercase font-bold text-cyan-600 tracking-wider">Parallel Track</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Track B – Web Platform</h3>
          <div className="mt-4 space-y-3 text-xs">
            <div>
              <strong className="text-slate-800 text-[11px]">Investor Portal:</strong>
              <p className="text-slate-500 text-[10px] mt-0.5">Investment Marketplace, Token Holdings, Wallet Management, Yield Dashboard, Document Center, Compliance Center</p>
            </div>
            <div>
              <strong className="text-slate-800 text-[11px]">Asset Issuer Portal:</strong>
              <p className="text-slate-500 text-[10px] mt-0.5">Asset Management, Tokenization Management, Investor Registry, Distribution Management, SPV Management</p>
            </div>
            <div>
              <strong className="text-slate-800 text-[11px]">Administration Portal:</strong>
              <p className="text-slate-500 text-[10px] mt-0.5">Compliance Operations, Custody Operations, Escrow Operations, Distribution Operations, Platform Governance</p>
            </div>
          </div>
        </div>

        {/* Track C */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5 hover:shadow-2xl transition duration-300">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
            <Smartphone className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Parallel Track</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Track C – Mobile Applications</h3>
          <div className="mt-4 space-y-3 text-xs">
            <div>
              <strong className="text-slate-800 text-[11px]">Investor App:</strong>
              <p className="text-slate-500 text-[10px] mt-0.5">Portfolio Tracking, Investments, Wallet, Yield Tracking, Documents, Notifications</p>
            </div>
            <div>
              <strong className="text-slate-800 text-[11px]">Asset Issuer App:</strong>
              <p className="text-slate-500 text-[10px] mt-0.5">Asset Monitoring, Investor Monitoring, Raise Progress, Distribution Status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RequirementsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950">FINAL GO-LIVE REQUIREMENTS</h2>
        <p className="text-slate-500 text-xs mt-1">Prerequisites and verification gates for institutional launch:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5">
          <div className="flex items-center gap-2 mb-4 text-[#6653AF] font-bold text-sm"><Lock className="w-4 h-4" />Technical</div>
          <ul className="space-y-2.5">
            {["Smart Contract Audit", "Penetration Testing", "Load Testing", "Disaster Recovery"].map((s, i) => (
              <li key={i} className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span className="text-xs font-semibold text-slate-800">{s}</span></li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Audit Partners</span>
            <div className="flex flex-wrap gap-1.5">
              {["CertiK", "OpenZeppelin Security", "Trail of Bits"].map((p, i) => (
                <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5">
          <div className="flex items-center gap-2 mb-4 text-cyan-600 font-bold text-sm"><Scale className="w-4 h-4" />Compliance</div>
          <ul className="space-y-2.5">
            {["KYC Live", "KYB Live", "AML Live", "Accreditation Verification Live"].map((s, i) => (
              <li key={i} className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span className="text-xs font-semibold text-slate-800">{s}</span></li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Providers</span>
            <div className="flex flex-wrap gap-1.5">
              {["Sumsub", "Persona", "VerifyInvestor"].map((p, i) => (
                <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold text-sm"><Coins className="w-4 h-4" />Banking, Custody & Mobile</div>
          <ul className="space-y-2.5">
            {["Escrow Accounts Active", "Fiat Rails Active", "Stablecoin Rails Active", "Fireblocks / BitGo Production Ready", "Android Production Release", "iOS Production Release"].map((s, i) => (
              <li key={i} className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span className="text-xs font-semibold text-slate-800">{s}</span></li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Infrastructure Providers</span>
            <div className="flex flex-wrap gap-1.5">
              {["Lead Bank", "Column Bank", "Circle", "Fireblocks", "BitGo"].map((p, i) => (
                <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FutureTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950">Executive Summary Timeline</h2>
        <p className="text-slate-500 text-xs mt-1">High-level view from Phase 2 infrastructure to Phase 3 secondary marketplace.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5">
          <div className="flex justify-between items-center pb-4 border-b border-purple-100 mb-4">
            <span className="text-xs font-bold text-[#6653AF] uppercase tracking-wider">Active Track</span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">12-16 Weeks</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Phase 2 – Core Infrastructure</h3>
          <ul className="mt-4 space-y-2">
            {["Tokenization Infrastructure", "Blockchain Infrastructure", "Compliance Infrastructure", "Wallet Compliance Layer", "SPV & Legal Infrastructure", "Custody Infrastructure", "Payments & Escrow", "Yield Distribution", "Security Infrastructure"].map((s, i) => (
              <li key={i} className="flex gap-2 items-center text-xs text-slate-700 font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#6653AF]" />{s}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 sm:p-6 rounded-2xl shadow-xl shadow-purple-900/5">
          <div className="flex justify-between items-center pb-4 border-b border-purple-100 mb-4">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Future Vision</span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">Phase 3</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Phase 3 – Liquidity & Secondary Market</h3>
          <ul className="mt-4 space-y-2">
            {["Secondary Marketplace", "Transfer Agent Services", "Institutional APIs", "Market Making", "Liquidity Programs"].map((s, i) => (
              <li key={i} className="flex gap-2 items-center text-xs text-slate-700 font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
