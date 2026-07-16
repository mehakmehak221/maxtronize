'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  ArrowLeftRight,
  GitFork,
  Minimize2,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Mail,
  Bell,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export function HubCorporateActionsTab() {
  // Buyback Program State
  const [buybackAmount, setBuybackAmount] = useState('5,000,000');
  
  // Redemption Program State
  const [redemptionWindow, setRedemptionWindow] = useState('Q3 - 2024');

  // Token Split State
  const [splitRatioLeft, setSplitRatioLeft] = useState('1');
  const [splitRatioRight, setSplitRatioRight] = useState('10');

  // Interactive ownership math based on split or buyback input
  const buybackVal = parseFloat(buybackAmount.replace(/,/g, '')) || 0;
  const reductionPct = Math.min(40, (buybackVal / 25000000) * 100); // Mock circulating reduction
  const afterCirculating = Math.max(50, 100 - reductionPct).toFixed(0);

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="mb-1 text-lg font-bold text-foreground">Corporate actions panel</h3>
        <p className="text-base text-text-muted">
          Execute buybacks, redemptions, and capital restructuring with full audit compliance.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'ACTIVE ACTIONS',
            value: '12',
            sub: '+2 from last month',
            subClass: 'text-emerald-500 font-bold flex items-center gap-1',
            icon: ArrowUpRight,
            iconClass: 'h-3.5 w-3.5',
          },
          {
            label: 'COMPLETED ACTIONS',
            value: '148',
            sub: 'LTD Volume: $42.5M',
            subClass: 'text-text-muted font-medium',
          },
          {
            label: 'PENDING APPROVALS',
            value: '3',
            sub: 'Requires Board Review',
            subClass: 'text-rose-500 font-bold',
            valClass: 'text-rose-500',
          },
          {
            label: 'AFFECTED INVESTORS',
            value: '1,240',
            sub: '94% KYC Verified',
            subClass: 'text-purple-500 dark:text-purple-400 font-bold',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[110px]"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
                {kpi.label}
              </span>
              <span className={`text-3xl font-extrabold text-foreground mt-2 block ${kpi.valClass || ''}`}>
                {kpi.value}
              </span>
            </div>
            <div className={`text-xs mt-3 flex items-center gap-1 ${kpi.subClass}`}>
              {kpi.icon && <kpi.icon className={kpi.iconClass} />}
              <span>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Actions + Right Columns */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        
        {/* Left Side: Corporate Actions + Ownership Impact (8 cols) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* 2x2 Grid of Actions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Card 1: Buyback Program */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                    Standard
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">Buyback Program</h4>
                <p className="text-xs text-text-muted leading-relaxed mb-6">
                  Reacquire tokens from the secondary market to reduce circulating supply.
                </p>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Target Amount (USD)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={buybackAmount}
                    onChange={(e) => setBuybackAmount(e.target.value)}
                    className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Redemption Program */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
                    <ArrowLeftRight className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                    Compliance
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">Redemption Program</h4>
                <p className="text-xs text-text-muted leading-relaxed mb-6">
                  Allow investors to redeem digital tokens for underlying physical assets or cash.
                </p>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Redemption Window
                </label>
                <input
                  type="text"
                  value={redemptionWindow}
                  onChange={(e) => setRedemptionWindow(e.target.value)}
                  className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Card 3: Token Split */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400">
                    <GitFork className="h-6 w-6" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">Token Split</h4>
                <p className="text-xs text-text-muted leading-relaxed mb-6">
                  Increase the number of tokens in circulation by splitting each share into multiple parts.
                </p>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Ratio
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={splitRatioLeft}
                    onChange={(e) => setSplitRatioLeft(e.target.value)}
                    className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <span className="font-bold text-text-muted">:</span>
                  <input
                    type="text"
                    value={splitRatioRight}
                    onChange={(e) => setSplitRatioRight(e.target.value)}
                    className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Reverse Split */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                    <Minimize2 className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">Reverse Split</h4>
                <p className="text-xs text-text-muted leading-relaxed mb-6">
                  Consolidate the number of existing tokens into fewer, more valuable units.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-muted">Current Supply</span>
                  <span className="text-foreground">1,000,000 NEX</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-muted">Post-Split Supply</span>
                  <span className="text-foreground">100,000 NEX</span>
                </div>
              </div>
            </div>

          </div>

          {/* Ownership Impact Preview */}
          <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-base font-extrabold text-foreground">Ownership Impact Preview</h4>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin-hover" />
                <span>Re-calculate</span>
              </button>
            </div>

            {/* Circular Progress Side by Side */}
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              
              {/* BEFORE Circle */}
              <div className="flex flex-col items-center">
                <div className="relative h-44 w-44 flex items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-card-border" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-emerald-500" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="0" strokeLinecap="round" />
                  </svg>
                  <div className="text-center z-10">
                    <span className="text-[10px] font-black tracking-widest text-text-muted block uppercase">Before</span>
                    <span className="text-3xl font-black text-foreground">100%</span>
                    <span className="text-[9px] font-bold text-text-muted block mt-0.5">Existing Supply</span>
                  </div>
                </div>
              </div>

              {/* AFTER Circle */}
              <div className="flex flex-col items-center">
                <div className="relative h-44 w-44 flex items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-card-border" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-blue-500" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * Number(afterCirculating)) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="text-center z-10">
                    <span className="text-[10px] font-black tracking-widest text-text-muted block uppercase">After</span>
                    <span className="text-3xl font-black text-foreground">{afterCirculating}%</span>
                    <span className="text-[9px] font-bold text-text-muted block mt-0.5">Circulating Supply</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Legend & Details */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-xl mx-auto mt-8 pt-8 border-t border-card-border">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-text-muted">Founders</span>
                </div>
                <span className="text-foreground">45.0%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-cyan-400" />
                  <span className="text-text-muted">Foundry (Adjusted)</span>
                </div>
                <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5">
                  56.2% <ArrowUpRight className="h-3.5 w-3.5 inline" />
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span className="text-text-muted">Public Float</span>
                </div>
                <span className="text-foreground">55.0%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span className="text-text-muted">Public Float</span>
                </div>
                <span className="text-text-muted flex items-center gap-0.5">
                  43.8% <ArrowDownRight className="h-3.5 w-3.5 inline" />
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Workflow & Communication Center (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Corporate Workflow */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
            <h4 className="text-sm font-extrabold text-foreground mb-6">Corporate Workflow</h4>
            
            {/* Timeline */}
            <div className="relative border-l border-card-border pl-6 space-y-6 ml-3">
              {[
                { title: 'Initiated', sub: 'Jun 12, 10:45 AM', completed: true },
                { title: 'Compliance & Legal Review', sub: 'Verified by Legal AI', completed: true },
                { title: 'Awaiting Board Approval', sub: '2 of 5 signatures collected', active: true },
                { title: 'Execution & Smart Contract Trigger', sub: 'Pending approval', pending: true },
                { title: 'Completed & Settlement', sub: 'Expected Q3 Close', pending: true },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-[37px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border bg-card ${
                    step.completed
                      ? 'border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-950/40'
                      : step.active
                        ? 'border-purple-600 text-purple-600 ring-4 ring-purple-100 dark:ring-purple-950/20'
                        : 'border-card-border text-text-muted'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : step.active ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                    ) : (
                      <div className="h-1 w-1 rounded-full bg-card-border" />
                    )}
                  </span>
                  <div>
                    <h5 className={`text-xs font-bold leading-tight ${step.pending ? 'text-text-muted' : 'text-foreground'}`}>
                      {step.title}
                    </h5>
                    <p className="text-[10px] text-text-muted mt-0.5">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Approval Status Grid */}
            <div className="mt-8 pt-6 border-t border-card-border">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-4">
                Approval Status
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Compliance</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Legal</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 px-3 py-2 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Board</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-card-border px-3 py-2 text-[10px] font-bold text-text-muted">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span>Execution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Communication Center */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-extrabold text-foreground">Communication Center</h4>
              <Mail className="h-4 w-4 text-text-muted" />
            </div>

            <div className="space-y-4">
              {/* Investor Email Preview */}
              <div className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/30 p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#7C3AED]">
                    Investor Email Preview
                  </span>
                  <span className="rounded-full bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-bold text-[#7C3AED]">
                    Ready to Send
                  </span>
                </div>
                <h5 className="text-xs font-bold text-foreground mb-1">
                  Subject: Mandatory Buyback Election Notice
                </h5>
                <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">
                  Dear Investor, Nexus RWA is initiating a voluntary buyback program for...
                </p>
              </div>

              {/* In-app Notification */}
              <div className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/30 p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[8px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                    In-App Notification
                  </span>
                  <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/40 px-2 py-0.5 text-[8px] font-bold text-cyan-700 dark:text-cyan-400">
                    Scheduled
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
                    <Bell className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold text-foreground leading-snug mt-1">
                    New Corporate Action available for your portfolio.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Audit Trail Card */}
      <div className="rounded-3xl border border-card-border bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-card-border">
          <h4 className="font-extrabold text-foreground text-base">Audit Trail</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-card-border bg-slate-50 dark:bg-slate-900/20">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Event ID</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Action Type</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Initiator</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {[
                { id: '#TX-88219', action: 'Quarterly Buyback', initiator: 'Compliance Officer 02', status: 'SUCCESS', hash: '0x4a...d9e1' },
                { id: '#TX-88184', action: 'Series B Token Issuance', initiator: 'System Admin', status: 'SUCCESS', hash: '0x9c...f4a8' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-text-muted">{row.id}</td>
                  <td className="px-6 py-4 text-xs font-extrabold text-foreground">{row.action}</td>
                  <td className="px-6 py-4 text-xs font-bold text-text-muted">{row.initiator}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-text-muted font-mono">{row.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
