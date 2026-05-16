'use client';

import React, { useState, type ComponentType, type SVGProps } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import { HubDistributionsTab } from '@/components/issuer/HubDistributionsTab';
import {
  AnalyticIcon,
  AnalyticsTargetIcon,
  AssetIntelligenceIcon,
  BuyIcon,
  Document,
  DistributionsIcon,
  Help,
  IncomeIcon,
  InvestmentIcon,
  LexaAiIcon,
  Overview,
  OverviewHeroPulse,
  PendingIcon,
  ReturnIcon,
  SecondaryMarket,
  SellIcon,
  SuccessIcon,
  YieldIcon,
} from '@/app/VectorImages';

type TabType = 'overview' | 'investments' | 'transactions' | 'distributions' | 'documents' | 'analytics' | 'lexa' | 'asset-intelligence';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

export default function InvestorHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; Icon: NavSvg; count?: number }[] = [
    { id: 'overview', label: 'Overview', Icon: Overview },
    { id: 'investments', label: 'My Investments', Icon: InvestmentIcon, count: 4 },
    { id: 'transactions', label: 'Transactions', Icon: SecondaryMarket },
    { id: 'distributions', label: 'Distributions', Icon: DistributionsIcon },
    { id: 'documents', label: 'Documents', Icon: Document },
    { id: 'analytics', label: 'Analytics', Icon: AnalyticIcon },
    { id: 'lexa', label: 'Lexa AI', Icon: LexaAiIcon, count: 0 },
    { id: 'asset-intelligence', label: 'Asset Intelligence', Icon: AssetIntelligenceIcon },
  ];

  const investments = [
    { name: 'Prime Office Tower NYC', ticker: 'PONYC', sector: 'Real Estate', Icon: SuccessIcon, iconBg: 'bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-300', currentVal: '$92,140', gain: '+$7,140', gainPct: '+8.4%', invested: '$85,000', status: 'Active', up: true },
    { name: 'Solar Farm Alpha TX', ticker: 'SFATX', sector: 'Renewable Energy', Icon: SuccessIcon, iconBg: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-300', currentVal: '$44,520', gain: '+$2,520', gainPct: '+6%', invested: '$42,000', status: 'Active', up: true },
    { name: 'Harbor Ports PE Fund', ticker: 'HPPE', sector: 'Private Equity', Icon: SuccessIcon, iconBg: 'bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-300', currentVal: '$138,600', gain: '+$18,600', gainPct: '+15.5%', invested: '$120,000', status: 'Active', up: true },
    { name: 'Copper Mining Royalty', ticker: 'CMRF', sector: 'Commodities', Icon: SuccessIcon, iconBg: 'bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-300', currentVal: '$26,880', gain: '-$1,120', gainPct: '-4%', invested: '$28,000', status: 'Active', up: false },
  ];

  const transactions: {
    name: string;
    id: string;
    type: string;
    Icon: NavSvg;
    iconClass?: string;
    iconBg: string;
    amount: string;
    date: string;
  }[] = [
    { name: 'Prime Office Tower NYC', id: 'TX-5421', type: 'Buy', Icon: BuyIcon, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', amount: '+$15,000', date: 'May 1, 2026' },
    { name: 'Harbor Ports PE Fund', id: 'TX-5420', type: 'Yield', Icon: YieldIcon, iconBg: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400', amount: '+$2,840', date: 'Apr 30, 2026' },
    { name: 'Solar Farm Alpha TX', id: 'TX-5419', type: 'Buy', Icon: BuyIcon, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', amount: '+$8,000', date: 'Apr 28, 2026' },
    { name: 'Residential REIT Bundle', id: 'TX-5418', type: 'Sell', Icon: SellIcon, iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400', amount: '-$12,000', date: 'Apr 25, 2026' },
    { name: 'Prime Office Tower NYC', id: 'TX-5417', type: 'Yield', Icon: YieldIcon, iconBg: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400', amount: '+$1,240', date: 'Apr 15, 2026' },
  ];

  const statsOverview: {
    label: string;
    val: string;
    sub: string;
    trend: string;
    Icon: NavSvg;
    up: boolean;
    iconBg: string;
  }[] = [
    {
      label: 'Monthly Income',
      val: '$14,218',
      sub: 'Passive earnings',
      trend: '+8.2%',
      Icon: IncomeIcon,
      up: true,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      label: 'Annual Return',
      val: '9.45%',
      sub: 'YTD performance',
      trend: '+1.8%',
      Icon: AnalyticIcon,
      up: true,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    },
    {
      label: 'Active Investments',
      val: '7',
      sub: 'Across 4 sectors',
      trend: '+2',
      Icon: OverviewHeroPulse,
      up: true,
      iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
    },
    {
      label: 'Pending Approvals',
      val: '3',
      sub: 'Under review',
      trend: '',
      Icon: PendingIcon,
      up: false,
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  // ── Tab Content ──────────────────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 2xl:grid-cols-4">
        {statsOverview.map((stat, i) => (
          <div
            key={i}
            className="rounded-[20px] border border-ui-border bg-ui-card p-4 shadow-sm transition-shadow hover:shadow-md md:rounded-[24px] md:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11 ${stat.iconBg}`}
              >
                <stat.Icon className="h-5 w-5" />
              </div>
              {stat.trend ? (
                <span
                  className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold md:text-[10px] ${
                    stat.up ? 'bg-green-50 text-green-600 dark:bg-green-950/35 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/35 dark:text-amber-400'
                  }`}
                >
                  <ReturnIcon className="h-3 w-3 shrink-0" />
                  {stat.trend}
                </span>
              ) : (
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-200 ring-2 ring-amber-100/80 dark:bg-amber-400/50 dark:ring-amber-900/50"
                  aria-hidden
                />
              )}
            </div>
            <p className="mb-1 text-xl font-bold tracking-tight text-ui-strong md:text-2xl lg:text-3xl">{stat.val}</p>
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{stat.label}</p>
            <p className="text-[10px] font-medium text-ui-faint">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 md:gap-8">
        {/* Earnings Chart */}
        <div className="xl:col-span-2 bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-base font-bold text-ui-strong">Monthly Earnings</h3>
              <p className="text-xs text-ui-faint mt-0.5">Earnings vs. passive income · USD</p>
            </div>
            <div className="flex gap-5">
              {[
                ['Earnings', 'bg-primary'],
                ['Passive', 'bg-blue-400'],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-2">
                  <div className={`h-1 w-6 rounded-full ${c}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Y-axis + chart */}
          <div className="relative h-48 md:h-56">
            <div className="absolute bottom-0 left-0 top-0 flex flex-col justify-between text-[9px] font-medium text-ui-placeholder">
              {['$16k', '$12k', '$8k', '$4k', '$0k'].map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <div className="absolute inset-y-0 left-8 right-0 motion-chart">
              <svg className="absolute inset-0 h-full w-full text-primary" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="hub-earnings-area-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,55 Q200,48 400,38 T800,22 T1000,18 L1000,100 L0,100 Z"
                  fill="url(#hub-earnings-area-fill)"
                />
                <path
                  d="M0,55 Q200,48 400,38 T800,22 T1000,18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full text-blue-500"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0,68 Q200,62 400,55 T800,48 T1000,42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-between mt-4 pl-8 overflow-x-auto pb-1">
            {months.map(m => (
              <span key={m} className="text-[9px] font-bold text-ui-placeholder uppercase tracking-widest">{m}</span>
            ))}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="flex flex-col rounded-[24px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[32px] md:p-10">
          <h3 className="text-base font-bold text-ui-strong mb-1">Asset Allocation</h3>
          <p className="text-xs text-ui-faint mb-6">By investment type</p>
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className="relative h-36 w-36 motion-chart md:h-40 md:w-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ui-divider-strong)" strokeWidth="14" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#7C3AED" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="96" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="202" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#A78BFA" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="232" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#C4B5FD" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="252" />
              </svg>
            </div>
            <div className="w-full space-y-3">
              {[
                { l: 'Real Estate', v: '62%', c: 'bg-primary' },
                { l: 'Private Credit', v: '18%', c: 'bg-purple-500' },
                { l: 'Commodities', v: '12%', c: 'bg-purple-400' },
                { l: 'Art & Collectibles', v: '8%', c: 'bg-purple-300' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.c}`} />
                    <span className="text-[11px] font-medium text-ui-muted-text">{item.l}</span>
                  </div>
                  <span className="text-[11px] font-bold text-ui-strong">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvestments = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="mb-2">
        <h3 className="text-base font-bold text-ui-strong">All Investments</h3>
        <p className="text-xs text-ui-faint mt-0.5">{investments.length} active positions</p>
      </div>
      {investments.map((inv, i) => (
        <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] p-5 md:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          {/* Top row */}
          <div className="flex items-center justify-between gap-4 mb-5 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 ${inv.iconBg}`}>
                <inv.Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <h4 className="text-[13px] md:text-base font-bold text-ui-strong group-hover:text-primary transition-colors">{inv.name}</h4>
                <p className="text-[10px] text-ui-faint font-medium uppercase tracking-widest">{inv.ticker} · {inv.sector}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg md:text-2xl font-bold text-ui-strong">{inv.currentVal}</p>
              <p className={`text-[11px] md:text-sm font-bold flex items-center justify-end gap-1 ${inv.up ? 'text-green-500' : 'text-red-500'}`}>
                <span>{inv.up ? '↗' : '↙'}</span> {inv.gainPct}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 md:gap-8 border-t border-ui-divider pt-5 md:pt-6">
            <div>
              <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Invested</p>
              <p className="text-sm md:text-base font-bold text-ui-strong">{inv.invested}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Gain / Loss</p>
              <p className={`text-sm md:text-base font-bold ${inv.up ? 'text-green-500' : 'text-red-500'}`}>{inv.gain}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700 dark:border-emerald-800/60 dark:bg-emerald-950/45 dark:text-emerald-300">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {inv.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTransactions = () => (
    <div className="animate-in fade-in duration-500">
      <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-ui-divider flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-ui-strong">Transaction History</h3>
            <p className="text-xs text-ui-faint mt-0.5">All buy, sell, and yield transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-ui-border rounded-xl text-[12px] font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-ui-border rounded-xl text-[12px] font-bold text-primary hover:bg-primary/5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>
        <div className="divide-y divide-ui-divider">
          {transactions.map((tx, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-6 px-5 md:px-8 py-4 md:py-5 hover:bg-ui-muted-surface transition-colors group cursor-pointer">
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.iconBg}`}>
                <tx.Icon className={`h-4 w-4 md:h-5 md:w-5 ${tx.iconClass ?? ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors truncate">{tx.name}</p>
                <p className="text-[10px] text-ui-faint font-medium uppercase tracking-widest">{tx.id} · {tx.type}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[13px] md:text-base font-bold ${tx.amount.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                  {tx.amount}
                </p>
                <p className="text-[10px] text-ui-faint font-medium">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const renderDocuments = () => (
    <div className="animate-in fade-in duration-500">
      <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-ui-divider flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-ui-strong">Investment Documents</h3>
            <p className="text-xs text-ui-faint mt-0.5">Statements, prospectuses, and legal documents</p>
          </div>
          <button className="flex items-center gap-2 text-[12px] font-bold text-primary hover:gap-3 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download All
          </button>
        </div>
        <div className="divide-y divide-ui-divider">
          {[
            { name: 'Q1 2026 Portfolio Statement', type: 'Statement', size: '2.4 MB', date: 'Apr 1, 2026' },
            { name: 'Prime Office Tower – Offering Memorandum', type: 'Prospectus', size: '8.7 MB', date: 'Mar 18, 2026' },
            { name: 'Tax Document – 1099-DIV', type: 'Tax', size: '156 KB', date: 'Feb 25, 2026' },
            { name: 'KYC Verification Certificate', type: 'Compliance', size: '89 KB', date: 'Jan 10, 2026' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-6 px-5 md:px-8 py-5 md:py-6 hover:bg-ui-muted-surface transition-colors group cursor-pointer">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-ui-muted-deep text-ui-faint group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors truncate">{doc.name}</p>
                <p className="text-[10px] text-ui-faint font-medium">{doc.type} · {doc.size} · {doc.date}</p>
              </div>
              <svg className="w-4 h-4 text-ui-placeholder group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* KPI row — matches analytics reference: tinted circle + icon, caps label, bold value, faint sub */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 2xl:grid-cols-4">
        {[
          {
            label: 'Total Return',
            val: '+9.45%',
            sub: 'Since inception',
            Icon: ReturnIcon,
            iconBg: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400',
          },
          {
            label: 'Sharpe Ratio',
            val: '1.82',
            sub: 'Risk-adjusted',
            Icon: AnalyticsTargetIcon,
            iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
          },
          {
            label: 'Volatility',
            val: '12.4%',
            sub: 'Standard deviation',
            Icon: OverviewHeroPulse,
            iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
          },
          {
            label: 'Beta',
            val: '0.76',
            sub: 'vs. market',
            Icon: AnalyticIcon,
            iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
          },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-[24px] md:p-7"
          >
            <div
              className={`mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11 ${m.iconBg}`}
            >
              <m.Icon className="h-5 w-5" />
            </div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{m.label}</p>
            <p className="text-2xl font-bold tracking-tight text-ui-strong md:text-3xl">{m.val}</p>
            <p className="mt-1 text-[10px] font-medium text-ui-faint">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Portfolio performance — purple line, $65k Y ticks, faint horizontal grid */}
      <div className="rounded-[20px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-10">
        <h3 className="text-base font-bold text-ui-strong">Portfolio Performance</h3>
        <p className="mt-0.5 text-xs text-ui-faint">Your portfolio vs. benchmark (S&amp;P 500)</p>

        <div className="relative mt-8 h-52 md:h-72">
          <div className="absolute bottom-0 left-0 top-0 flex w-11 flex-col justify-between pb-0 pt-0 text-[9px] font-medium text-ui-placeholder md:w-12">
            {['$260k', '$195k', '$130k', '$65k', '$0k'].map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>

          <div className="absolute inset-y-0 left-11 right-0 motion-chart md:left-12">
            <div className="pointer-events-none absolute inset-0">
              {[0, 25, 50, 75, 100].map(pct => (
                <div
                  key={pct}
                  className="absolute left-0 right-0 border-t border-dashed border-slate-200 dark:border-slate-700/90"
                  style={{ top: `${pct}%` }}
                />
              ))}
            </div>

            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="hub-analytics-perf-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,25 C180,22 420,14 700,8 S900,3 1000,2.2 L1000,100 L0,100 Z"
                fill="url(#hub-analytics-perf-fill)"
              />
              <path
                d="M0,25 C180,22 420,14 700,8 S900,3 1000,2.2"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="nonScalingStroke"
              />
            </svg>
          </div>
        </div>

        <div className="mt-4 flex justify-between overflow-x-auto pb-1 pl-11 md:pl-12">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map(mo => (
            <span key={mo} className="text-[9px] font-bold uppercase tracking-widest text-ui-placeholder">
              {mo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const [lexaInput, setLexaInput] = React.useState('');
  const chatMessages = [
    { role: 'user', text: 'What are the tax implications of receiving yield distributions?' },
    { role: 'ai', text: 'Yield distributions from tokenized real estate assets are typically treated as ordinary income and reported on Form 1099-DIV. The specific tax treatment depends on:\n\n1. **Asset Type**: Real estate yields may qualify for REIT-like treatment  2. **Holding Period**: Long-term vs short-term capital gains  3. **Jurisdiction**: Your tax residency and where the asset is located\n\nI recommend consulting with a tax professional for personalized advice. Would you like me to generate a tax estimation report for your current holdings?' },
    { role: 'user', text: 'Yes, please generate that report.' },
    { role: 'ai', text: "I'll prepare a comprehensive tax estimation report based on your current portfolio. This will include estimated tax liabilities for each asset class and suggested withholding strategies. The report will be ready in your Documents tab within 2–3 minutes." },
  ];

  const renderLexa = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-purple-500 rounded-[20px] md:rounded-[28px] p-6 md:p-8 text-white flex items-center gap-5">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-ui-card/10 border border-background/20 flex items-center justify-center shrink-0 text-white">
          <LexaAiIcon className="h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">Lexa Legal Assistant</h3>
          <p className="text-white/70 text-xs md:text-sm mt-1 leading-relaxed">Your AI-powered legal and compliance advisor. Ask questions about tax implications, regulatory requirements, investment structures, and legal documentation.</p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-ui-divider">
          <h4 className="text-[13px] font-bold text-ui-strong">Conversation</h4>
        </div>
        <div className="p-4 md:p-6 space-y-5 max-h-[420px] overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-ui-muted-deep text-ui-muted-text'
              }`}>
                {msg.role === 'ai' ? <LexaAiIcon className="h-4 w-4" /> : <span className="text-[11px] font-bold">You</span>}
              </div>
              <div className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-ui-muted-deep text-ui-body rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, j) => <p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p>)}
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="p-4 md:p-5 border-t border-ui-divider flex gap-3">
          <input
            type="text"
            value={lexaInput}
            onChange={e => setLexaInput(e.target.value)}
            placeholder="Ask Lexa about legal or compliance matters…"
            className="flex-1 px-4 py-3 bg-ui-muted-deep border border-ui-border rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
          />
          <button className="px-5 py-3 bg-primary text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderAssetIntelligence = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-purple-500 rounded-[20px] md:rounded-[28px] p-6 md:p-8 text-white flex items-center gap-5">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-ui-card/10 border border-background/20 flex items-center justify-center shrink-0 text-white">
          <AssetIntelligenceIcon className="h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">AI Asset Intelligence</h3>
          <p className="text-white/70 text-xs md:text-sm mt-1 leading-relaxed">Predictive analytics, market insights, and AI-powered recommendations for your investment portfolio.</p>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="space-y-4">
        {[
          {
            title: 'Prime Office Tower Undervalued',
            desc: 'Market analysis suggests 12–15% upside based on comparable NYC properties and recent transactions.',
            confidence: 92,
            confidenceColor: 'text-green-500',
            action: 'Consider increasing position',
            actionColor:
              'bg-green-50 text-green-600 border-green-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
            Icon: AssetIntelligenceIcon,
            iconBg: 'bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-300',
          },
          {
            title: 'Solar Farm Revenue Forecast',
            desc: 'Energy price trends and grid demand indicate 8–10% yield increase over next 12 months.',
            confidence: 87,
            confidenceColor: 'text-primary',
            action: 'Monitor quarterly',
            actionColor: 'bg-primary/5 text-primary border-primary/10 dark:bg-primary/15 dark:text-primary dark:border-primary/25',
            Icon: AnalyticIcon,
            iconBg: 'bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-300',
          },
          {
            title: 'Copper Price Volatility Risk',
            desc: 'Mining royalty asset exposed to commodity price swings. Consider hedging or rebalancing.',
            confidence: 78,
            confidenceColor: 'text-amber-500',
            action: 'Review allocation',
            actionColor:
              'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
            Icon: Help,
            iconBg: 'bg-orange-50 text-orange-400 dark:bg-orange-950/40 dark:text-orange-300',
          },
        ].map((insight, i) => (
          <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${insight.iconBg}`}>
                <insight.Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h4 className="text-[13px] md:text-base font-bold text-ui-strong">{insight.title}</h4>
                  <span className={`text-[11px] font-bold shrink-0 flex items-center gap-1.5 ${insight.confidenceColor}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {insight.confidence}% confidence
                  </span>
                </div>
                <p className="text-[12px] md:text-[13px] text-ui-muted-text font-medium leading-relaxed">{insight.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-14">
              <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${insight.actionColor}`}>{insight.action}</span>
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-ui-faint hover:text-primary transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabContent: Record<TabType, React.ReactNode> = {
    overview: renderOverview(),
    investments: renderInvestments(),
    transactions: renderTransactions(),
    distributions: <HubDistributionsTab />,
    documents: renderDocuments(),
    analytics: renderAnalytics(),
    lexa: renderLexa(),
    'asset-intelligence': renderAssetIntelligence(),
  };

  return (
    <InvestorLayout pageTitle="Investor Hub">
      <div className="space-y-6 animate-in fade-in duration-700">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Investor Hub</h1>
            <p className="text-sm text-ui-faint mt-1 font-medium">Manage your portfolio, track performance, and access AI-powered insights</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-1">Total Portfolio Value</p>
            <p className="text-2xl md:text-4xl font-bold text-ui-strong">$248,650</p>
            <p className="text-sm font-bold text-green-500 flex items-center justify-end gap-1 mt-1">
              <ReturnIcon className="h-4 w-4 shrink-0" /> +9.45% Annual
            </p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="border-b border-ui-border overflow-x-auto scrollbar-hide -mx-4 md:-mx-0">
          <div className="flex items-center px-4 md:px-0 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 text-[13px] font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-ui-faint hover:text-ui-body hover:border-ui-border-strong'
                }`}
              >
                <tab.Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-ui-muted-deep text-ui-faint'}`}>
                    {tab.count}
                  </span>
                )}
                {tab.id === 'lexa' && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>{tabContent[activeTab]}</div>

      </div>
    </InvestorLayout>
  );
}
