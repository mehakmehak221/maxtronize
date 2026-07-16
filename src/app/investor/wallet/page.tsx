'use client';

import React, { useState } from 'react';
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Plus,
  ArrowRight,
  Clock,
  Shield,
  UserCheck,
  AlertTriangle,
  Globe,
  Settings,
  Bell,
} from 'lucide-react';
import InvestorLayout from '@/components/InvestorLayout';

export default function WalletPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const wallets = [
    {
      name: 'Platform Wallet',
      chain: 'Ethereum',
      address: '0x7a2f89c314092b3a56e01234b9d0092c4efc789a',
      displayAddress: '0x7a2f...4efc',
      balance: '$184,230',
      iconBg: 'bg-blue-500/10 text-blue-500',
    },
    {
      name: 'Custody Wallet',
      chain: 'Ethereum',
      address: '0xd02ca314092b3a56e01234b9d0092c4efc782d2a',
      displayAddress: '0xd02c...2d2a',
      balance: '2.84 ETH',
      iconBg: 'bg-slate-700/10 text-slate-700 dark:text-slate-300 dark:bg-slate-800/40',
    },
    {
      name: 'Polygon Bridge',
      chain: 'Polygon',
      address: '0xd39fa314092b3a56e01234b9d0092c4efc7897bce',
      displayAddress: '0xd39f...7bce',
      balance: '14,820 MATIC',
      iconBg: 'bg-purple-600/10 text-purple-600 dark:text-purple-400 dark:bg-purple-950/30',
    },
  ];

  return (
    <InvestorLayout pageTitle="Wallet Connect & Whitelist Status">
      <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-card-border pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <span>Platform</span>
              <span>&gt;</span>
              <span className="text-[#7C3AED]">Wallet</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Wallet Connect & Whitelist Status</h1>
            <p className="text-base text-text-muted">
              Connect your wallet and manage whitelist eligibility for tokenized asset investments.
            </p>
          </div>

          {/* Need Help Box */}
          <div className="flex items-start gap-3 rounded-2xl border border-card-border bg-card p-4 max-w-xs shrink-0 shadow-sm">
            <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] flex items-center justify-center shrink-0">
              <HelpCircle className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">Need Help?</span>
              <p className="text-[10px] text-text-muted mt-0.5 leading-snug">Learn how wallet connection and whitelisting works.</p>
              <button type="button" className="text-[10px] font-black text-[#7C3AED] hover:underline uppercase tracking-wider mt-1.5 inline-flex items-center gap-0.5">
                <span>View Guide</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 KPI Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Wallet Status',
              value: 'Connected',
              sub: '0x71a3...9deE',
              badge: 'ACTIVE',
              badgeClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
              icon: CheckCircle2,
              iconColor: 'text-emerald-500',
            },
            {
              label: 'Whitelist Status',
              value: 'Whitelisted',
              sub: 'Eligible for investments',
              badge: 'VERIFIED',
              badgeClass: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30',
              icon: ShieldCheck,
              iconColor: 'text-blue-500',
            },
            {
              label: 'Verification Level',
              value: 'Level 2',
              sub: 'Enhanced verification',
              badge: 'VERIFIED',
              badgeClass: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30',
              icon: UserCheck,
              iconColor: 'text-blue-500',
            },
            {
              label: 'Last Verified',
              value: 'May 20, 2024',
              sub: '3:15 PM UTC',
              badge: 'UP TO DATE',
              badgeClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30',
              icon: Clock,
              iconColor: 'text-amber-500',
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[125px] relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">{kpi.label}</span>
                  <span className="text-xl font-extrabold text-foreground mt-2 block">{kpi.value}</span>
                </div>
                <div className={`h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center ${kpi.iconColor}`}>
                  <kpi.icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[10px] font-bold text-text-muted">{kpi.sub}</span>
                <span className={`rounded-lg px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${kpi.badgeClass}`}>
                  {kpi.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mid Section Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          
          {/* Column 1 (4 cols): Connected Wallets */}
          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Connected Wallets</h4>
                <button type="button" className="h-7 w-7 rounded-xl border border-card-border bg-card flex items-center justify-center text-text-muted hover:text-[#7C3AED] hover:border-[#7C3AED] transition-all shadow-sm">
                  <Plus className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-3">
                {wallets.map((wallet, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/10 p-4 relative flex flex-col justify-between min-h-[95px]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${wallet.iconBg}`}>
                          <Wallet className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-foreground block">{wallet.name}</span>
                          <span className="text-[9px] text-text-muted font-bold block uppercase mt-0.5">{wallet.chain}</span>
                        </div>
                      </div>
                      <a
                        href={`https://etherscan.io/address/${wallet.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-muted hover:text-foreground transition-colors shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <div className="flex justify-between items-baseline mt-4">
                      <span className="text-sm font-black text-foreground">{wallet.balance}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(wallet.address, idx)}
                        className="text-[10px] font-bold text-text-muted hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <span>{wallet.displayAddress}</span>
                        <Copy className="h-3 w-3" />
                        {copiedIndex === idx && <span className="text-[8px] text-emerald-500 font-bold">Copied</span>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Secured Banner */}
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-3.5 flex items-start gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 block uppercase tracking-wider">All wallets secured</span>
                  <p className="text-[9px] text-text-muted leading-tight mt-0.5">Multi-sig enabled · Hardware wallet verified.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 (4 cols): Whitelist & Compliance */}
          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6">Whitelist & Compliance</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'KYC Verification', tag: 'Verified' },
                    { label: 'AML Screening', tag: 'Cleared' },
                    { label: 'Accredited Investor Status', tag: 'Verified' },
                    { label: 'Jurisdiction Check', tag: 'Compliant' },
                    { label: 'Wallet Whitelisted', tag: 'Yes' },
                    { label: 'Investment Eligibility', tag: 'Eligible' },
                  ].map((comp, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold border-b border-card-border/60 pb-3 last:border-b-0">
                      <div className="flex items-center gap-2 text-text-muted font-bold">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                        <span>{comp.label}</span>
                      </div>
                      <span className="text-emerald-500 font-extrabold">{comp.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" className="text-xs font-black tracking-widest text-[#7C3AED] hover:underline uppercase pt-6 border-t border-card-border mt-4 w-full flex items-center justify-center gap-1.5">
                <span>View Whitelist Criteria</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Column 3 (4 cols): What You Can Do & Security Tips */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Actions Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">What You Can Do</h4>
              
              <div className="space-y-3">
                {[
                  { title: 'View Whitelist Criteria', desc: 'See requirements and eligibility' },
                  { title: 'Update KYC Information', desc: 'Update your identity documents' },
                  { title: 'Manage Wallet Permissions', desc: 'Control investment permissions' },
                  { title: 'View Compliance Reports', desc: 'Download your compliance status' },
                ].map((act, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/10 p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-all"
                  >
                    <div>
                      <h5 className="text-xs font-extrabold text-foreground">{act.title}</h5>
                      <span className="text-[10px] text-text-muted mt-0.5 block">{act.desc}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Security Tips */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-[#7C3AED]" />
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Security Tips</h4>
              </div>

              <ul className="space-y-2.5 text-xs font-bold text-text-muted leading-relaxed list-disc list-inside pl-1">
                <li>Only connect wallets you own and trust</li>
                <li>Never share your private key or seed phrase</li>
                <li>Ensure you are on the official Maxtronize platform</li>
                <li>Enable two-factor authentication</li>
                <li>Report any suspicious activity immediately</li>
              </ul>

              <button type="button" className="text-[10px] font-black text-[#7C3AED] hover:underline uppercase tracking-wider mt-4 inline-flex items-center gap-1">
                <span>Learn more about wallet security</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Recent Activity Card */}
        <div className="rounded-3xl border border-card-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-card-border">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Recent Activity</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-card-border bg-slate-50 dark:bg-slate-900/20 text-[9px] font-black uppercase tracking-widest text-text-muted">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-xs font-bold text-text-muted">
                {[
                  { date: 'May 20, 2024 3:15 PM', act: 'Wallet Connected', status: 'Success', details: 'Connected 0x71a3...9deE to Platform', statCol: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                  { date: 'May 20, 2024 2:45 PM', act: 'KYC Verification Completed', status: 'Verified', details: 'Level 2 verification completed', statCol: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                  { date: 'May 20, 2024 2:30 PM', act: 'AML Screening Completed', status: 'Cleared', details: 'No issues found', statCol: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                  { date: 'May 20, 2024 2:10 PM', act: 'Wallet Whitelisted', status: 'Verified', details: 'Approved for investments', statCol: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-normal text-[10px]">{row.date}</td>
                    <td className="px-6 py-4 text-foreground font-black">{row.act}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-[8px] font-black tracking-wider uppercase ${row.statCol}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-normal">{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-card-border">
            <button type="button" className="text-xs font-black tracking-widest text-[#7C3AED] hover:underline uppercase inline-flex items-center gap-1.5">
              <span>View All Activity</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </InvestorLayout>
  );
}
