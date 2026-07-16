'use client';

import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Building2,
  CheckCircle2,
  Layers,
  Download,
  Eye,
  Check,
  FileText,
  AlertTriangle,
  ChevronDown,
  PlusCircle,
  XCircle,
  HelpCircle,
  Sliders,
  Filter
} from 'lucide-react';

export function HubTokenOperationsTab() {
  const [mintAmount, setMintAmount] = useState('0.00');
  const [mintDestination, setMintDestination] = useState('');
  const [mintReason, setMintReason] = useState('Asset Appreciation');
  
  const [burnAmount, setBurnAmount] = useState('0.00');
  const [burnReason, setBurnReason] = useState('');

  const [reissueName, setReissueName] = useState('');
  const [reissueOldWallet, setReissueOldWallet] = useState('');
  const [reissueNewWallet, setReissueNewWallet] = useState('');

  const [freezeWallet, setFreezeWallet] = useState('');
  const [freezeName, setFreezeName] = useState('');
  const [freezeDuration, setFreezeDuration] = useState('24 Hours');
  const [freezeReason, setFreezeReason] = useState('Compliance Review');

  const [transfersActive, setTransfersActive] = useState(true);

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="mb-1 text-lg font-bold text-foreground">Token Operations</h3>
        <p className="text-base text-text-muted">
          Manage the lifecycle of deployed security tokens and perform administrative token actions.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: 'Total Supply',
            value: '1,000,000',
            sub: '• Stable',
            subClass: 'text-emerald-500 font-bold',
            icon: Layers,
            bgCircle: 'bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]',
          },
          {
            label: 'Circulating',
            value: '875,000',
            sub: '87.5%',
            isProgress: true,
            progressVal: 87.5,
            icon: Activity,
            bgCircle: 'bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]',
          },
          {
            label: 'Burned Tokens',
            value: '50,000',
            sub: 'PERMANENTLY REMOVED',
            subClass: 'text-rose-500 font-bold text-[8px] tracking-wider',
            icon: Shield,
            bgCircle: 'bg-rose-50 dark:bg-rose-950/20 text-rose-500',
          },
          {
            label: 'Frozen Tokens',
            value: '25,000',
            sub: 'LOCKED IN WALLETS',
            subClass: 'text-indigo-500 font-bold text-[8px] tracking-wider',
            icon: Shield,
            bgCircle: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500',
          },
          {
            label: 'Active Investors',
            value: '327',
            sub: '• 12 this week',
            subClass: 'text-emerald-500 font-bold',
            icon: Building2,
            bgCircle: 'bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${kpi.bgCircle}`}>
                <kpi.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{kpi.label}</p>
            </div>
            <div className="mt-4">
              <p className="text-xl font-extrabold leading-none text-foreground">{kpi.value}</p>
              <div className="mt-2">
                {kpi.isProgress ? (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7C3AED]" style={{ width: `${kpi.progressVal}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-[#7C3AED] shrink-0">{kpi.sub}</span>
                  </div>
                ) : (
                  <span className={`text-[10px] ${kpi.subClass}`}>{kpi.sub}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Left form columns / Middle column / Right column */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Forms for Mint, Burn, Reissue, Activity */}
        <div className="space-y-8">
          
          {/* Mint Tokens Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]">
                <PlusCircle className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Mint Tokens</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">Amount</label>
                <input
                  type="text"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">Destination Wallet</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={mintDestination}
                  onChange={(e) => setMintDestination(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">Reason</label>
                <div className="relative">
                  <select
                    value={mintReason}
                    onChange={(e) => setMintReason(e.target.value)}
                    className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground appearance-none focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="Asset Appreciation">Asset Appreciation</option>
                    <option value="Additional Raise">Additional Raise</option>
                    <option value="Compliance Adjustment">Compliance Adjustment</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div className="p-3 bg-[#F5F3FF] dark:bg-[#7C3AED]/10 border border-[#DDD6FE] dark:border-[#7C3AED]/20 rounded-xl flex items-start gap-2">
                <Shield className="h-4 w-4 text-[#7C3AED] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#7C3AED] font-semibold leading-relaxed">
                  Minting increases total token supply. This action will be logged for compliance.
                </p>
              </div>

              <button
                type="button"
                className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-center text-xs transition-all shadow-md"
              >
                Mint Tokens
              </button>
            </div>
          </div>

          {/* Burn Tokens Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500">
                <XCircle className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Burn Tokens</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">Amount</label>
                <input
                  type="text"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Asset liquidation"
                  value={burnReason}
                  onChange={(e) => setBurnReason(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="p-3 bg-[#FEF2F2] dark:bg-rose-950/10 border border-[#FEE2E2] dark:border-rose-900/20 rounded-xl flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#EF4444] font-semibold leading-relaxed">
                  Burning permanently removes tokens from circulation. This action is irreversible.
                </p>
              </div>

              <button
                type="button"
                className="w-full py-3 border border-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#EF4444]/10 text-[#EF4444] font-bold rounded-xl text-center text-xs transition-all"
              >
                Burn Tokens
              </button>
            </div>
          </div>

          {/* Reissue Tokens Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Reissue Tokens</h4>
            </div>

            <p className="text-xs text-text-muted leading-relaxed font-semibold">
              Used when investors lose wallet access. This will burn tokens in the old wallet and mint them in the new one.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Investor Name"
                value={reissueName}
                onChange={(e) => setReissueName(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="Old Wallet Address"
                value={reissueOldWallet}
                onChange={(e) => setReissueOldWallet(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="New Wallet Address"
                value={reissueNewWallet}
                onChange={(e) => setReissueNewWallet(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none"
              />

              <button
                type="button"
                className="w-full py-3 bg-[#E5E0FA] dark:bg-[#7C3AED]/20 hover:bg-[#D8D0F5] text-[#7C3AED] dark:text-purple-300 font-bold rounded-xl text-center text-xs transition-all"
              >
                Reissue Tokens
              </button>
            </div>
          </div>

          {/* Activity Feed Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">Activity Feed</h4>

            <div className="relative border-l border-border dark:border-card-border pl-4 space-y-6 pt-1">
              {[
                {
                  title: 'Mint Action Initiated',
                  time: 'Just Now',
                  desc: '2,500 tokens minted for wallet 0x3E...7e21',
                  color: 'bg-[#7C3AED]',
                },
                {
                  title: 'Wallet Frozen',
                  time: '2 hours ago',
                  desc: 'Compliance freeze applied to investor Mark Thompson',
                  color: 'bg-gray-400 dark:bg-gray-600',
                },
                {
                  title: 'Tokens Burned',
                  time: '5 hours ago',
                  desc: '100 tokens removed from circulating supply',
                  color: 'bg-[#EF4444]',
                },
                {
                  title: 'Token Reissue',
                  time: 'Yesterday',
                  desc: 'Tokens successfully reissued to verified wallet.',
                  color: 'bg-[#7C3AED]',
                },
              ].map((act, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[21px] top-1 flex h-2 w-2 rounded-full ring-4 ring-card ${act.color}`} />
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{act.time}</p>
                  <h5 className="font-extrabold text-xs text-foreground mt-0.5">{act.title}</h5>
                  <p className="text-xs text-text-muted leading-relaxed font-semibold mt-1">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Middle Column: Freeze Wallet, Transfers Control, Compliance Controls */}
        <div className="space-y-8">
          
          {/* Freeze Wallet Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Freeze Wallet</h4>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Wallet Address (0x...)"
                value={freezeWallet}
                onChange={(e) => setFreezeWallet(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none"
              />
              
              <input
                type="text"
                placeholder="Investor Name"
                value={freezeName}
                onChange={(e) => setFreezeName(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-text-muted">Duration</label>
                  <div className="relative">
                    <select
                      value={freezeDuration}
                      onChange={(e) => setFreezeDuration(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-foreground appearance-none"
                    >
                      <option value="24 Hours">24 Hours</option>
                      <option value="7 Days">7 Days</option>
                      <option value="Permanent">Permanent</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-text-muted">Reason</label>
                  <div className="relative">
                    <select
                      value={freezeReason}
                      onChange={(e) => setFreezeReason(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-foreground appearance-none"
                    >
                      <option value="Compliance Review">Compliance Review</option>
                      <option value="Suspicious Activity">Suspicious Activity</option>
                      <option value="Lost Credentials">Lost Credentials</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 bg-[#E5E0FA] dark:bg-[#7C3AED]/20 hover:bg-[#D8D0F5] text-[#7C3AED] dark:text-purple-300 font-bold rounded-xl text-center text-xs transition-all"
              >
                Freeze Wallet
              </button>
            </div>
          </div>

          {/* Transfers Control Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#EF4444]">
                  <Activity className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-base text-foreground">Transfers Control</h4>
              </div>
              <span className="rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 px-2 py-0.5 text-[9px] font-black tracking-wider uppercase">
                LIVE
              </span>
            </div>

            <div className="bg-[#F5F3FF] dark:bg-[#7C3AED]/10 border border-[#DDD6FE] dark:border-[#7C3AED]/20 rounded-2xl p-6 text-center space-y-1">
              <p className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider">Global Status</p>
              <p className="text-2xl font-extrabold text-[#7C3AED]">Transfers Active</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTransfersActive(false)}
                className="py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded-xl text-xs transition-all text-center"
              >
                Pause Transfers
              </button>
              <button
                type="button"
                disabled
                className="py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 font-bold rounded-xl text-xs transition-all text-center cursor-not-allowed"
              >
                Resume
              </button>
            </div>

            <div className="flex items-start gap-2 text-text-muted">
              <AlertTriangle className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed font-semibold">
                Pausing transfers affects all token holders globally. Only use in confirmed security breaches.
              </p>
            </div>
          </div>

          {/* Compliance Controls Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Compliance Controls</h4>
            </div>

            <ul className="space-y-4">
              {[
                { label: 'KYC Verification', checked: true },
                { label: 'AML Monitoring', checked: true },
                { label: 'Wallet Whitelisting', checked: true },
                { label: 'Accredited Investor Rules', checked: true },
                { label: 'Transfer Restrictions', checked: false },
                { label: 'Geographic Restrictions', checked: false }
              ].map((step, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                  <span>{step.label}</span>
                  {step.checked ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50 dark:fill-transparent" />
                  ) : (
                    <div className="h-4.5 w-4.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent" />
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column: Asset card, Compliance Score, Smart Contracts checklist */}
        <div className="space-y-6">
          
          {/* Crescent Peachtree Tower Card */}
          <div className="rounded-3xl border border-card-border bg-card overflow-hidden shadow-sm">
            <div className="relative h-44 w-full bg-gray-200">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/building-peachtree.jpg')" }} />
              {/* Fallback pattern if image fails */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-white/50" />
              </div>
              <span className="absolute top-4 right-4 rounded-md bg-emerald-500 text-white px-2 py-0.5 text-[9px] font-black tracking-wider uppercase">
                ACTIVE
              </span>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-extrabold text-base text-foreground leading-none">Crescent Peachtree Tower</h4>
                <p className="text-xs text-text-muted mt-2">Commercial Real Estate • Atlanta, GA</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-card-border pt-4">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-wider">Asset Value</p>
                  <p className="text-sm font-extrabold text-foreground">$25.4M</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-wider">Standard</p>
                  <p className="text-sm font-extrabold text-foreground">ERC-3643</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-wider">Network</p>
                  <p className="text-sm font-extrabold text-foreground">Ethereum</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-wider">Liquidity</p>
                  <p className="text-sm font-extrabold text-emerald-500">High</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Score Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col items-center space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted text-center w-full">Compliance Score</h4>
            
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#7C3AED" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.96)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-foreground">96%</span>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">INSTITUTIONAL</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              • FULLY COMPLIANT
            </span>
          </div>

          {/* Smart Contracts List Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">Smart Contracts</h4>

            <ul className="space-y-3.5">
              {[
                { label: 'Security' },
                { label: 'Distribution' },
                { label: 'Governance' },
                { label: 'Redemption' }
              ].map((step, idx) => (
                <li key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-card-border bg-surface/40 hover:bg-surface/70 transition-all text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4.5 w-4.5 text-[#7C3AED]" />
                    <span className="text-foreground">{step.label}</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                    ACTIVE <Check className="h-3 w-3" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Transaction History (Spans full width) */}
      <div className="rounded-3xl border border-card-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-card-border bg-card flex items-center justify-between">
          <h4 className="font-extrabold text-foreground text-base">Transaction History</h4>
          <div className="flex items-center gap-3 text-text-muted">
            <button className="hover:text-primary transition-colors p-1.5 rounded-lg border border-card-border bg-surface/50">
              <Filter className="h-4 w-4" />
            </button>
            <button className="hover:text-primary transition-colors p-1.5 rounded-lg border border-card-border bg-surface/50">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-w-0">
          <table className="w-full whitespace-nowrap text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-surface/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Investor</th>
                <th className="px-6 py-4">Wallet</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {[
                { date: 'May 12, 14:32', action: 'Mint', actor: 'David Wright', wallet: '0x712...dfb3', amount: '12,500.00', status: 'COMPLETED', statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30' },
                { date: 'May 12, 11:05', action: 'Burn', actor: 'Treasury Wallet', wallet: '0x234...bc22', amount: '5,000.00', status: 'PENDING', statusClass: 'bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30' },
                { date: 'May 11, 09:45', action: 'Freeze', actor: 'Elena Rossi', wallet: '0x7d0...d013', amount: '25,000.00', status: 'FROZEN', statusClass: 'bg-gray-100 text-gray-500 border border-border dark:bg-gray-800 dark:border-card-border' },
                { date: 'May 10, 16:20', action: 'Re-issue', actor: 'Alpha Fund', wallet: '0x284...1c88', amount: '100,000.00', status: 'REJECTED', statusClass: 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30' },
                { date: 'May 10, 10:15', action: 'Mint', actor: 'Beta Corp', wallet: '0x992...28b0', amount: '45,000.00', status: 'COMPLETED', statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30' },
              ].map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-surface/30">
                  <td className="px-6 py-4 text-xs font-semibold text-text-muted">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        row.action === 'Mint' ? 'bg-[#7C3AED]' : row.action === 'Burn' ? 'bg-[#EF4444]' : 'bg-gray-400'
                      }`} />
                      {row.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-foreground">{row.actor}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-muted">{row.wallet}</td>
                  <td className="px-6 py-4 text-xs font-extrabold text-foreground">{row.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-md px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase border ${row.statusClass}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer operations bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-card-border pt-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            System operational. All smart contracts synced with Ethereum Mainnet.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2.5 border border-card-border hover:bg-surface text-text-muted font-bold rounded-xl text-xs transition-all"
          >
            Advanced Controls
          </button>
          <button
            type="button"
            className="px-4 py-2.5 border border-card-border hover:bg-surface text-text-muted font-bold rounded-xl text-xs transition-all"
          >
            Export Audit Report
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs transition-all shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>

    </div>
  );
}
