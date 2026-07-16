'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  MessageSquare,
  Phone,
  FileText,
  ShieldCheck,
  RefreshCw,
  Wallet,
  Building2,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import InvestorLayout from '@/components/InvestorLayout';
import Link from 'next/link';

export default function SettlementDetailPage() {
  const [secondsLeft, setSecondsLeft] = useState(15);

  // Auto-refresh timer mock
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev === 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <InvestorLayout pageTitle="Trade Settlement Status">
      <div className="mx-auto w-full max-w-7xl space-y-6 animate-in fade-in duration-500 pb-28">
        
        {/* Top Header Card: Success Confirmation banner */}
        <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground leading-snug">Trade Successfully Submitted</h2>
              <p className="text-xs text-text-muted mt-0.5">Your order has been matched and is currently progressing through settlement.</p>
            </div>
          </div>

          {/* Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-6 border-t border-card-border text-xs font-bold text-text-muted">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block">Asset</span>
              <span className="text-foreground text-xs font-extrabold block mt-1 leading-tight">Prime Office Tower NYC</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block">Order Type</span>
              <span className="text-[#7C3AED] text-xs font-extrabold block mt-1">Buy Order</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block">Quantity</span>
              <span className="text-foreground text-xs font-extrabold block mt-1">10,000 Tokens</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block">Execution Price</span>
              <span className="text-foreground text-xs font-extrabold block mt-1">$1.24</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block">Value</span>
              <span className="text-foreground text-xs font-extrabold block mt-1">$12,400.00</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block">Fee</span>
              <span className="text-foreground text-xs font-extrabold block mt-1">$12.40</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block">Total</span>
              <span className="text-[#7C3AED] text-sm font-black block mt-1">$12,412.40</span>
            </div>
          </div>
        </div>

        {/* Settlement Progress Timeline */}
        <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">Settlement Progress</h4>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 py-4 px-2">
            {/* Timeline connectors */}
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800 md:left-4 md:right-4 md:top-1/2 md:-translate-y-1/2 md:h-0.5 md:w-auto" />
            <div className="absolute left-1/2 top-4 bottom-1/2 w-0.5 bg-[#7C3AED] md:left-4 md:right-1/2 md:top-1/2 md:-translate-y-1/2 md:h-0.5 md:w-auto" />

            {[
              { label: 'Order Submitted', done: true },
              { label: 'Matched', done: true },
              { label: 'Compliance', done: true },
              { label: 'Blockchain Settlement', active: true },
              { label: 'Token Delivery', pending: true },
              { label: 'Complete', pending: true },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  step.done
                    ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                    : step.active
                      ? 'border-[#7C3AED] bg-card text-[#7C3AED] ring-4 ring-purple-100 dark:ring-purple-950/20'
                      : 'border-card-border bg-card text-text-muted'
                }`}>
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : step.active ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-card-border" />
                  )}
                </span>
                <span className={`text-[10px] font-bold mt-2 ${step.pending ? 'text-text-muted font-normal' : 'text-foreground font-black'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          
          {/* Left Column (8 cols): Trade Summary, Payment Details, Portfolio Impact, Compliance, Activity, Help */}
          <div className="xl:col-span-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trade Summary */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Trade Summary</h4>
                <div className="space-y-3 text-xs font-bold">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Token Symbol</span>
                    <span className="text-[#7C3AED] font-black">POT-NYC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Network</span>
                    <span className="text-foreground">Polygon POS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Settlement Date</span>
                    <span className="text-foreground">Oct 24, 2023</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">Smart Contract</span>
                    <div className="rounded-xl border border-card-border bg-slate-50 dark:bg-slate-900/30 px-3 py-2 text-[10px] text-text-muted font-mono select-all">
                      0x7C5bbA6FC73c68bDF54a6eB70281F0E014abAFf7
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Payment Details</h4>
                
                {/* Method row */}
                <div className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] flex items-center justify-center shrink-0">
                      <Wallet className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-foreground block">USDC Stablecoin</span>
                      <span className="text-[9px] text-text-muted font-bold block uppercase mt-0.5">Polygon Network</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-foreground">0.12 USDC</span>
                    <span className="text-[9px] text-text-muted font-bold block">Processing Fee</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-card-border bg-purple-50/20 dark:bg-purple-950/10 p-4 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Clock className="h-4 w-4 text-[#7C3AED]" />
                    <span>Time to Complete</span>
                  </div>
                  <span className="text-[#7C3AED] font-black">~2 Minutes</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Portfolio Impact */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Portfolio Impact</h4>
                <div className="flex items-center gap-6">
                  {/* Gauge */}
                  <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-card-border" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-[#7C3AED]" strokeDasharray="75, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span className="text-xs font-black text-foreground z-10">75%</span>
                  </div>
                  <div className="flex-1 space-y-2 text-xs font-bold">
                    <div className="flex justify-between items-center text-text-muted">
                      <span>Current</span>
                      <span className="text-foreground">10,000</span>
                    </div>
                    <div className="flex justify-between items-center text-text-muted">
                      <span>New Total</span>
                      <span className="text-[#7C3AED] font-black">20,000</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7C3AED]" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Status */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Compliance Status</h4>
                <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-text-muted">
                  {[
                    { label: 'KYC Verified' },
                    { label: 'AML Screened' },
                    { label: 'Whitelist Approved' },
                    { label: 'Eligibility Check' },
                    { label: 'Jurisdiction Clear' },
                    { label: 'Transfer Rules' },
                  ].map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{comp.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6">Activity Feed</h4>
              <div className="relative border-l border-card-border pl-6 space-y-6 ml-2.5">
                <div className="relative">
                  <span className="absolute -left-[30px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-[#7C3AED] ring-4 ring-purple-100 dark:ring-purple-950/20" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Validating Blockchain Transaction</h5>
                    <p className="text-[10px] text-text-muted mt-0.5">10:45 AM - Block #49,203,124</p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[32px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Compliance Attestation Signed</h5>
                    <p className="text-[10px] text-text-muted mt-0.5">10:44 AM - Digital Signature Hash: af2...91c</p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[32px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Trade Order Matched</h5>
                    <p className="text-[10px] text-text-muted mt-0.5">10:42 AM - Liquidity Provider: Maxtronize LP1</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Center Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white p-6 shadow-md border border-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="text-sm font-extrabold">Help Center</h5>
                <p className="text-[11px] text-purple-100 mt-1">Our settlement desk is available 24/7 for institutional assistance.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button type="button" className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </button>
                <button type="button" className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all">
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Asset Detail Card & Documents */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Asset Detail Card */}
            <div className="rounded-3xl border border-card-border bg-card overflow-hidden shadow-sm">
              <div className="h-36 bg-slate-200 relative overflow-hidden">
                {/* Mock Image placeholder for office tower */}
                <div className="absolute inset-0 bg-slate-900/20 z-10" />
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600')` }} />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-foreground">Prime Office Tower NYC</h4>
                  <span className="text-[10px] text-text-muted font-bold block uppercase mt-0.5">Commercial Real Estate · New York</span>
                </div>
                
                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/30 p-3">
                    <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">Price</span>
                    <span className="text-sm font-black text-foreground mt-1 block">$1.24</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/30 p-3">
                    <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">24H Change</span>
                    <span className="text-sm font-black text-emerald-500 mt-1 block flex items-center gap-0.5">
                      <TrendingUp className="h-3.5 w-3.5" /> +2.4%
                    </span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/30 p-3">
                    <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">Yield</span>
                    <span className="text-sm font-black text-foreground mt-1 block">8.4% APY</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/30 p-3">
                    <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">Market Cap</span>
                    <span className="text-sm font-black text-foreground mt-1 block">$42.5M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents List Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-extrabold text-foreground">Documents</h4>
                <FileText className="h-4 w-4 text-text-muted" />
              </div>
              
              <div className="space-y-3">
                {[
                  'Settlement Receipt',
                  'Trade Confirmation',
                  'Transaction Ledger',
                  'Transfer Agreement',
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/10 p-3 flex items-center justify-between text-xs font-bold text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#7C3AED] shrink-0" />
                      <span>{doc}</span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-text-muted hover:text-foreground shrink-0" />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Bottom Sticky Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-between gap-4 rounded-3xl border border-card-border bg-card/90 backdrop-blur-md px-6 py-4 shadow-xl z-50 w-[90%] max-w-4xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-text-muted">Auto-refreshing in {secondsLeft}s</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/investor/portfolio"
            className="inline-flex items-center justify-center rounded-2xl border border-card-border bg-card px-5 py-3 text-xs font-bold text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all shadow-sm"
          >
            View Portfolio
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-card-border bg-card px-5 py-3 text-xs font-bold text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all shadow-sm"
          >
            Download Receipt
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] px-6 py-3 text-xs font-black tracking-wider uppercase text-white shadow-md shadow-purple-500/10 transition-all"
          >
            <span>Track Settlement</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </InvestorLayout>
  );
}
