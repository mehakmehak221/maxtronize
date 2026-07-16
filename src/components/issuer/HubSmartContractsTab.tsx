'use client';

import React from 'react';
import {
  Shield,
  Activity,
  Building2,
  CheckCircle2,
  Layers,
  Download,
  ExternalLink,
  Eye,
  Check,
  FileText,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

export function HubSmartContractsTab() {
  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="mb-1 text-lg font-bold text-foreground">Smart Contracts</h3>
        <p className="text-base text-text-muted">
          Manage blockchain contracts powering your tokenized assets.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Contract Status',
            value: '4 Active Contracts',
            valueClass: 'text-[#7C3AED]',
            icon: Shield,
            iconColor: 'text-[#7C3AED]',
            bgCircle: 'bg-purple-50 dark:bg-purple-950/20',
          },
          {
            label: 'Network',
            value: 'Ethereum Mainnet',
            valueClass: 'text-[#7C3AED]',
            icon: Layers,
            iconColor: 'text-[#7C3AED]',
            bgCircle: 'bg-purple-50 dark:bg-purple-950/20',
          },
          {
            label: 'Asset Tokenized',
            value: 'Crescent Peachtree',
            valueClass: 'text-[#7C3AED]',
            icon: Building2,
            iconColor: 'text-[#7C3AED]',
            bgCircle: 'bg-purple-50 dark:bg-purple-950/20',
          },
          {
            label: 'Token Status',
            value: '• Active',
            valueClass: 'text-emerald-500',
            icon: CheckCircle2,
            iconColor: 'text-emerald-500',
            bgCircle: 'bg-emerald-50 dark:bg-emerald-950/20',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${kpi.bgCircle}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{kpi.label}</p>
            </div>
            <div className="mt-4">
              <p className={`text-xl font-extrabold leading-none ${kpi.valueClass}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deployment Progression */}
      <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Deployment Progression</p>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center justify-between min-w-[900px] px-4 relative">
            {/* Background Line */}
            <div className="absolute top-[18px] left-[50px] right-[50px] h-[2px] bg-purple-100 dark:bg-purple-950/50 z-0" />
            
            {[
              { label: 'Property Approved', active: true },
              { label: 'SPV Created', active: true },
              { label: 'Token Configured', active: true },
              { label: 'Contracts Generated', active: true },
              { label: 'Contracts Deployed', active: true },
              { label: 'Blockchain Verified', active: true },
              { label: 'Asset Live', active: true, last: true },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2.5 z-10 relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#7C3AED] bg-purple-50 dark:bg-purple-950/30 text-[#7C3AED] transition-all">
                  {step.last ? (
                    <div className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                  ) : (
                    <Check className="h-4.5 w-4.5" strokeWidth={3} />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#7C3AED]">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Side Columns (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Core Contracts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Security Token Contract */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-foreground">Security Token Contract</h4>
                  <span className="text-[9px] font-black tracking-wider uppercase bg-[#F5F3FF] dark:bg-[#7C3AED]/20 text-[#7C3AED] px-2.5 py-1 rounded-md border border-[#DDD6FE] dark:border-[#7C3AED]/30">
                    ERC-1400
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-semibold mt-4">
                  The core logic governing asset tokenization, transfer rules, and total supply of the property tokens.
                </p>
              </div>
              <div className="pt-4 flex items-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1 text-[10px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Distribution Contract */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-foreground">Distribution Contract</h4>
                  <span className="text-[9px] font-black tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-md">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-semibold mt-4">
                  Handles Rental Income & Dividend Payments to all whitelisted token holders automatically every quarter.
                </p>
              </div>
              <div className="pt-4">
                <button type="button" className="text-[10px] font-black tracking-wider uppercase text-[#7C3AED] hover:underline">
                  VIEW HISTORY
                </button>
              </div>
            </div>

            {/* Governance Contract */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-foreground">Governance Contract</h4>
                  <span className="text-[9px] font-black tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-md">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-semibold mt-4">
                  Handles Voting Rights & Investor Decisions, enabling decentralized management of the physical asset.
                </p>
              </div>
              <div className="pt-4">
                <button type="button" className="text-[10px] font-black tracking-wider uppercase text-[#7C3AED] hover:underline">
                  12 ACTIVE PROPOSALS
                </button>
              </div>
            </div>

            {/* Redemption Contract */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-foreground">Redemption Contract</h4>
                  <span className="text-[9px] font-black tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-md">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-semibold mt-4">
                  Handles Buybacks & Token Redemptions during pre-defined exit periods or property liquidation events.
                </p>
              </div>
              <div className="pt-4">
                <button type="button" className="text-[10px] font-black tracking-wider uppercase text-[#7C3AED] hover:underline">
                  EXIT PERIOD CLOSED
                </button>
              </div>
            </div>

          </div>

          {/* Contract Details Explorer Table */}
          <div className="rounded-3xl border border-card-border bg-card shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between bg-[#E5E0FA] dark:bg-[#7C3AED]/10 border-b border-card-border">
              <h4 className="font-extrabold text-[#111827] dark:text-white text-base">
                Contract Details Explorer
              </h4>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-[#7C3AED]/20 bg-white dark:bg-[#1A1A1A] px-4 py-1.5 text-xs font-bold text-[#7C3AED] hover:bg-[#F5F3FF] transition-all"
              >
                <span>Filter</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            
            <div className="overflow-x-auto min-w-0">
              <table className="w-full whitespace-nowrap text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border bg-surface/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="px-6 py-4">Contract Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Network</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {[
                    {
                      type: 'Security Token Core',
                      status: 'LIVE',
                      network: 'Ethereum',
                    },
                    {
                      type: 'Income Distribution',
                      status: 'LIVE',
                      network: 'Ethereum',
                    },
                    {
                      type: 'SPV Governance',
                      status: 'LIVE',
                      network: 'Ethereum',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4 font-extrabold text-sm text-[#7C3AED] hover:underline cursor-pointer">
                        {row.type}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50 px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-text-muted">
                        {row.network}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-text-muted">
                          <button className="hover:text-primary transition-colors">
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <button className="hover:text-primary transition-colors">
                            <ExternalLink className="h-4.5 w-4.5" />
                          </button>
                          <button className="hover:text-primary transition-colors">
                            <Download className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contract Activity Feed */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">Contract Activity Feed</h4>

            <div className="relative border-l border-border dark:border-card-border pl-4 space-y-6 pt-1">
              {[
                {
                  title: 'Distribution Contract Executed',
                  time: 'May 12, 2026 • 14:23 UTC',
                  desc: '$45,200.00 distributed to 327 token holders via rental yield logic.',
                  color: 'bg-purple-600',
                  icon: Activity
                },
                {
                  title: 'Governance Proposal #12 Passed',
                  time: 'May 10, 2026 • 09:15 UTC',
                  desc: 'Investors approved capital improvement budget for HVAC upgrades.',
                  color: 'bg-[#7C3AED]',
                  icon: Shield
                },
                {
                  title: 'Compliance Whitelist Updated',
                  time: 'May 08, 2026 • 11:45 UTC',
                  desc: '4 new accredited investors added to the Security Token whitelist.',
                  color: 'bg-[#7C3AED]',
                  icon: CheckCircle2
                },
              ].map((act, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[25px] top-1 flex h-4 w-4 items-center justify-center rounded-full ${act.color} text-white ring-4 ring-card`}>
                    <act.icon className="h-2 w-2" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-foreground">{act.title}</h5>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-0.5">{act.time}</p>
                    <p className="text-xs text-text-muted leading-relaxed font-semibold mt-1">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Column (Span 1) */}
        <div className="space-y-6">
          
          {/* Token Specifications Card */}
          <div className="bg-[#7C3AED] text-white rounded-3xl p-6 shadow-md space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-200">Token Specifications</h4>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-base leading-none">Crescent Peachtree</p>
                <p className="text-xs text-purple-200 mt-1">Symbol: CPTT</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2">
              <div>
                <p className="text-[9px] text-purple-200 font-bold uppercase tracking-wider">Total Supply</p>
                <p className="text-base font-extrabold mt-0.5">1,000,000</p>
              </div>
              <div>
                <p className="text-[9px] text-purple-200 font-bold uppercase tracking-wider">Price Per Token</p>
                <p className="text-base font-extrabold mt-0.5">$5.00</p>
              </div>
              <div>
                <p className="text-[9px] text-purple-200 font-bold uppercase tracking-wider">Investors</p>
                <p className="text-base font-extrabold mt-0.5">327</p>
              </div>
              <div>
                <p className="text-[9px] text-purple-200 font-bold uppercase tracking-wider">Distributed</p>
                <p className="text-base font-extrabold mt-0.5">78%</p>
              </div>
            </div>

            <div className="pt-2 space-y-1.5">
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          {/* Institutional Compliance */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Institutional Compliance</h4>

            <ul className="space-y-4">
              {[
                { label: 'KYC Enabled' },
                { label: 'AML Monitoring' },
                { label: 'Wallet Whitelisting' },
                { label: 'Transfer Restrictions' },
                { label: 'Accredited Only' }
              ].map((step, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA]">
                  <span>{step.label}</span>
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50 dark:fill-transparent" />
                </li>
              ))}
            </ul>
          </div>

          {/* Blockchain Verification Card */}
          <div className="bg-[#10B981] text-white rounded-3xl p-6 shadow-md space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Blockchain Verification</h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-white shrink-0 mt-0.5" />
                <p className="text-xs font-bold">Contract Verified on Etherscan</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="h-4.5 w-4.5 text-white shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Audit Status: PASSED</p>
                  <p className="text-[10px] text-emerald-100 mt-0.5">Passed in May 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Controls Accordion */}
          <div className="bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border border-[#FEE2E2] dark:border-[#7F1D1D]/40 rounded-3xl p-5 shadow-xs flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#991B1B] dark:text-[#FCA5A5]">
                Advanced Controls
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-[#991B1B] dark:text-[#FCA5A5]" />
          </div>

        </div>

      </div>

    </div>
  );
}
