'use client';

import React, { useState } from 'react';
import InvestorLayout from '@/components/InvestorLayout';

export default function InvestorWalletPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 2000);
  };

  const wallets = [
    { name: 'Platform Wallet', network: 'Ethereum', address: '0x8f4d...4a8c', balance: '$184,230', icon: '⬡', iconBg: 'bg-blue-500', connected: true },
    { name: 'Custody Wallet', network: 'Ethereum', address: '0x6e5b...6b7a', balance: '2.84 ETH', icon: '≡', iconBg: 'bg-gray-700', connected: true },
    { name: 'Polygon Bridge', network: 'Polygon', address: '0x9c3a...1b2e', balance: '14,820 MATIC', icon: '⬟', iconBg: 'bg-purple-500', connected: true },
  ];

  const holdings = [
    { ticker: 'PONYC', name: 'Prime Office Tower', val: '$33.3M', change: '+4.2%', up: true, color: 'bg-purple-500', pct: 35 },
    { ticker: 'HPPE', name: 'Harbor Ports PE Fund', val: '$27.0M', change: '+6.8%', up: true, color: 'bg-blue-500', pct: 28 },
    { ticker: 'LHDE', name: 'Logistics Hub DE', val: '$31.0M', change: '0%', up: true, color: 'bg-gray-500', pct: 32 },
    { ticker: 'SFATX', name: 'Solar Farm Alpha TX', val: '$3.7M', change: '+2.1%', up: true, color: 'bg-green-500', pct: 4 },
  ];

  const txns = [
    { label: 'Capital Raise Deposit', amount: '+$1,200,000', time: 'Today, 10:42 AM', type: 'in', status: '' },
    { label: 'Q3 Yield Distribution', amount: '+$312,400', time: 'Oct 01, 9:15 AM', type: 'in', status: '' },
    { label: 'Capital Raise Deposit', amount: '+$850,000', time: 'Sep 29, 7:30 PM', type: 'in', status: 'Pending' },
    { label: 'Monthly Rent Distribution', amount: '+$2,100', time: 'Sep 15, 8:00 AM', type: 'in', status: '' },
    { label: 'Compliance Fee', amount: '-$4,500', time: 'Sep 13, 11:20 AM', type: 'out', status: '' },
    { label: 'Q3 Distribution', amount: '+$892,000', time: 'Sep 10, 9:00 AM', type: 'in', status: '' },
  ];

  const actions = [
    { label: 'Deposit', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { label: 'Withdraw', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l4-4m0 0l-4-4m4 4H4' },
    { label: 'Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  ];

  return (
    <InvestorLayout pageTitle="Wallet">
      <div className="space-y-6 animate-in fade-in duration-700">

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Wallet</h1>
          <p className="text-sm text-ui-faint mt-1 font-medium">Connected wallets, token holdings, and on-chain transaction history.</p>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-[#1A1A2E] rounded-[24px] md:rounded-[32px] p-6 md:p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Portfolio Value</p>
              </div>
              <p className="text-4xl md:text-6xl font-bold tracking-tight mb-1">$95.3M</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-20 h-0.5 bg-primary rounded-full" />
                <div className="w-8 h-0.5 bg-primary/30 rounded-full" />
              </div>
              <p className="text-[11px] text-white/40 font-medium">3 connected wallets · 4 token positions</p>
              <p className="text-[12px] font-bold text-green-400 mt-1 flex items-center gap-1">↗ +$4.2M (4.6%) this month</p>
            </div>
            <div className="flex flex-row md:flex-col gap-3">
              {actions.map((a, i) => (
                <button key={i} className="flex items-center gap-2 px-5 py-3 bg-ui-card/10 hover:bg-ui-card/20 border border-background/10 rounded-2xl text-[13px] font-bold text-white transition-all backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={a.icon} /></svg>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">

          {/* Connected Wallets */}
          <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] shadow-sm overflow-hidden">
            <div className="p-5 md:p-7 border-b border-ui-divider flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-ui-strong">Connected Wallets</h3>
              <button className="w-7 h-7 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-lg font-bold hover:bg-primary/10 transition-colors">+</button>
            </div>
            <div className="p-4 space-y-3">
              {wallets.map((w, i) => (
                <div key={i} className="flex items-center gap-3 p-3 md:p-4 bg-ui-muted-deep rounded-2xl hover:bg-ui-muted-deep transition-colors group">
                  <div className={`w-10 h-10 rounded-xl ${w.iconBg} text-white flex items-center justify-center text-lg font-bold shrink-0`}>{w.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-ui-strong truncate">{w.name}</p>
                      {w.connected && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-ui-faint font-medium">{w.network}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] font-bold text-ui-body truncate">{w.balance}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[9px] text-ui-placeholder font-mono truncate">{w.address}</p>
                      <button
                        onClick={() => copyAddress(w.address)}
                        className="text-ui-faint hover:text-primary transition-colors shrink-0"
                      >
                        {copied === w.address
                          ? <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        }
                      </button>
                    </div>
                  </div>
                  <button className="text-ui-placeholder hover:text-primary transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mx-4 mb-4 p-3 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <div>
                <p className="text-[10px] font-bold text-green-700">All wallets secured</p>
                <p className="text-[9px] text-green-600/70 font-medium">Multi-sig enabled · Hardware wallet verified</p>
              </div>
            </div>
          </div>

          {/* Token Holdings */}
          <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] shadow-sm overflow-hidden">
            <div className="p-5 md:p-7 border-b border-ui-divider flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-ui-strong">Token Holdings</h3>
              <span className="text-[11px] font-bold text-primary">{holdings.length} positions</span>
            </div>
            <div className="p-5 md:p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">Portfolio Distribution</p>
                  <p className="text-[11px] font-bold text-ui-strong">$95.0M total</p>
                </div>
                {/* Stacked bar */}
                <div className="w-full h-2.5 rounded-full overflow-hidden flex">
                  {holdings.map((h, i) => (
                    <div key={i} className={`${h.color} h-full`} style={{ width: `${h.pct}%` }} />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                {holdings.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-ui-muted-deep transition-colors group cursor-pointer">
                    <div className={`w-9 h-9 rounded-xl ${h.color} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                      {h.ticker.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-ui-strong truncate">{h.ticker}</p>
                      <p className="text-[10px] text-ui-faint font-medium truncate">{h.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-bold text-ui-strong">{h.val}</p>
                      <p className={`text-[10px] font-bold ${h.up ? 'text-green-500' : 'text-red-500'}`}>↗ {h.change}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 border border-ui-border rounded-2xl text-[12px] font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center justify-center gap-2">
                All Holdings
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] shadow-sm overflow-hidden">
            <div className="p-5 md:p-7 border-b border-ui-divider flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-ui-strong">Transactions</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="divide-y divide-ui-divider">
              {txns.map((tx, i) => (
                <div key={i} className="flex items-center gap-3 px-5 md:px-6 py-4 hover:bg-ui-muted-surface transition-colors group cursor-pointer">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'in' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                        tx.type === 'in' ? 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                          : 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l4-4m0 0l-4-4m4 4H4'
                      } />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-ui-strong truncate group-hover:text-primary transition-colors">{tx.label}</p>
                    <p className="text-[10px] text-ui-faint font-medium">{tx.time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-[13px] font-bold ${tx.type === 'in' ? 'text-green-500' : 'text-red-500'}`}>{tx.amount}</p>
                    {tx.status && (
                      <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                        {tx.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 md:p-5 border-t border-ui-divider">
              <button className="w-full py-3 border border-ui-border rounded-2xl text-[12px] font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center justify-center gap-2">
                Full History
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </InvestorLayout>
  );
}
