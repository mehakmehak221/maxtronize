'use client';

import React, { type ComponentType, type SVGProps } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import {
  OverviewHeroPulse,
  OverviewKpiBarChart,
  OverviewKpiInvestors,
  OverviewKpiWallet,
  ReturnIcon,
  SuccessIcon,
  Wallet,
} from '@/app/VectorImages';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

export default function InvestorOverviewPage() {
  const platformStats: {
    label: string;
    val: string;
    trend: string;
    sub: string;
    up: boolean;
    Icon: NavSvg;
  }[] = [
    { label: 'Total Raised', val: '$14.82M', trend: '+12.5%', sub: 'vs $13.17M last quarter', up: true, Icon: OverviewKpiWallet },
    { label: 'Assets Tokenized', val: '$42.5M', trend: '+8.2%', sub: '6 assets · 4 jurisdictions', up: true, Icon: OverviewKpiBarChart },
    { label: 'Active Investors', val: '2,403', trend: '+15.3%', sub: '89% KYC verified', up: true, Icon: OverviewKpiInvestors },
    { label: 'Platform Yield', val: '8.4%', trend: '-0.2%', sub: 'Weighted avg. APY', up: false, Icon: ReturnIcon },
  ];

  const allocation = [
    { label: 'Commercial RE', val: '54%', color: 'bg-primary' },
    { label: 'Private Equity', val: '22%', color: 'bg-purple-500' },
    { label: 'Infrastructure', val: '14%', color: 'bg-purple-400' },
    { label: 'Residential', val: '7%', color: 'bg-purple-300' },
    { label: 'Art & Col.', val: '3%', color: 'bg-purple-200' },
  ];

  const activity = [
    { name: 'Prime Office Tower NYC', id: 'TX-901', type: 'Capital Raise', region: 'US', amount: '+$1.20M', time: 'Today, 10:42 AM', color: 'bg-green-50 text-green-500 dark:bg-emerald-950/35 dark:text-emerald-400', amountClass: 'text-green-600 dark:text-emerald-400' },
    { name: 'Solar Farm Alpha TX', id: 'TX-902', type: 'Capital Raise', region: 'US', amount: '+$850K', time: 'Yesterday, 2:30 PM', color: 'bg-amber-50 text-amber-500 dark:bg-amber-950/35 dark:text-amber-400', amountClass: 'text-amber-600 dark:text-amber-400' },
    { name: 'Harbor Ports PE Fund', id: 'TX-903', type: 'Distribution', region: 'SG', amount: '+$3.40M', time: 'Oct 5, 9:10 AM', color: 'bg-green-50 text-green-500 dark:bg-emerald-950/35 dark:text-emerald-400', amountClass: 'text-green-600 dark:text-emerald-400' },
    { name: 'Logistics Hub DE', id: 'TX-904', type: 'Yield Payout', region: 'EU', amount: '+$280K', time: 'Oct 1, 6:00 AM', color: 'bg-green-50 text-green-500 dark:bg-emerald-950/35 dark:text-emerald-400', amountClass: 'text-green-600 dark:text-emerald-400' },
    { name: 'Riviera Residences', id: 'TX-906', type: 'Monthly Yield', region: 'EU', amount: '+$2.1K', time: 'Sep 30, 8:00 AM', color: 'bg-green-50 text-green-500 dark:bg-emerald-950/35 dark:text-emerald-400', amountClass: 'text-green-600 dark:text-emerald-400' },
  ];

  const upcoming = [
    { date: 'Oct 28', label: 'Q3 Yield Distribution', sub: 'Prime Office Tower', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300', dot: 'bg-purple-500' },
    { date: 'Nov 2', label: 'KYC Review Deadline', sub: 'Riviera Residences', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300', dot: 'bg-amber-500' },
    { date: 'Nov 15', label: 'Token Lock-up Expiry', sub: 'Harbor Ports PE Fund', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300', dot: 'bg-blue-500' },
    { date: 'Nov 20', label: 'New Investor Onboarding', sub: 'BlackRock RE Partners', color: 'text-green-500 bg-green-50 dark:bg-emerald-950/40 dark:text-emerald-300', dot: 'bg-green-500' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const capW = 1000;
  const capH = 200;
  const capPadT = 14;
  const capPadB = 10;
  const capInnerH = capH - capPadT - capPadB;
  const yAtM = (m: number) => capPadT + ((16 - m) / 16) * capInnerH;
  const capXs = [0, 125, 250, 375, 500, 625, 750, 875, 1000];
  const capActualM = [2, 3.4, 5.1, 6.9, 8.5, 10.2, 11.8, 13.5, 15.2];
  const capTargetM = [2.2, 4, 5.8, 7.6, 9.4, 11.2, 13, 14.6, 16];
  const capSmoothLine = (xs: number[], ms: number[]) => {
    const pts = xs.map((x, i) => [x, yAtM(ms[i])] as const);
    if (pts.length < 2) return '';
    const tension = 0.38;
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      d += ` C ${x0 + tension * (x1 - x0)} ${y0}, ${x1 - tension * (x1 - x0)} ${y1}, ${x1} ${y1}`;
    }
    return d;
  };
  const capitalActualLineD = capSmoothLine(capXs, capActualM);
  const capitalTargetLineD = capSmoothLine(capXs, capTargetM);
  const capitalAreaD = `${capitalActualLineD} L ${capW} ${capH} L 0 ${capH} Z`;

  const heroMiniStats: { label: string; val: string; Icon: NavSvg }[] = [
    { label: 'Monthly Income', val: '$14.2K', Icon: Wallet },
    { label: 'Active Positions', val: '7', Icon: OverviewHeroPulse },
    { label: 'Avg Yield', val: '10.8%', Icon: ReturnIcon },
  ];

  return (
    <InvestorLayout pageTitle="Investor Overview">
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-[#1e1b4b] via-[#312e81] to-[#5b21b6] p-6 text-white shadow-xl md:rounded-[32px] md:p-10 md:shadow-2xl">
          <div className="absolute inset-0 bg-mesh opacity-50" />
          <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-violet-500/25 blur-[120px]" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Good afternoon, Marcus · May 1, 2026</p>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">$248,650</h1>
                <p className="text-white/50 text-sm mt-2 font-medium">Total portfolio value across all investments</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-[11px] font-bold border border-green-500/20 flex items-center gap-1.5">
                  <ReturnIcon className="h-4 w-4 shrink-0" /> +9.45% Annual Return
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/70">
                  7 investments · 4 asset classes
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/35">Active Tokens</p>
                <div className="flex flex-wrap gap-2">
                  {['PONYC +4.2%', 'HPPE +6.8%', 'SFATX +2.1%'].map((token, i) => (
                    <div key={i} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-1">
                      <div className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span className="flex items-center gap-1 text-[10px] font-bold text-white">
                        <SuccessIcon className="h-3.5 w-3.5 shrink-0 text-white/90" aria-hidden />
                        {token}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right mini-stats — glass cards: icon, value, label */}
            <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 lg:max-w-[22rem] lg:shrink-0">
              {heroMiniStats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/20 bg-white/[0.12] px-2 py-2 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:px-2.5 "
                >
                  <s.Icon className="h-5 w-5 shrink-0 text-white" aria-hidden />
                  <p className="text-sm font-bold tracking-tight text-white sm:text-base">{s.val}</p>
                  <p className="max-w-[5.5rem] text-[7px] font-bold uppercase leading-snug tracking-widest text-white/55 sm:max-w-none sm:text-[8px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {platformStats.map((stat, i) => (
            <div key={i} className="space-y-3 rounded-[22px] border border-ui-border bg-ui-card p-4 shadow-sm transition-shadow hover:shadow-md md:space-y-5 md:rounded-[28px] md:p-7">
              <div className="flex items-start justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl md:h-10 md:w-10 ${
                  i === 0
                    ? 'bg-dash-kpi-violet-soft text-dash-kpi-violet-fg'
                    : i === 1
                      ? 'bg-dash-kpi-blue-soft text-dash-kpi-blue-fg'
                      : i === 2
                        ? 'bg-dash-kpi-green-soft text-dash-kpi-green-fg'
                        : 'bg-dash-kpi-orange-soft text-dash-kpi-orange-fg'
                }`}>
                  <stat.Icon className="h-5 w-5 shrink-0" />
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold md:text-[10px] ${
                    stat.up
                      ? 'bg-green-50 text-green-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                  }`}
                >
                  <ReturnIcon className={`h-3.5 w-3.5 shrink-0 ${stat.up ? '' : 'rotate-180'}`} />
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl md:text-3xl font-bold text-ui-strong">{stat.val}</p>
                <p className="text-[10px] text-ui-faint mt-1 font-medium hidden sm:block">{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Capital Chart */}
          <div className="rounded-[28px] border border-ui-border bg-ui-card p-6 shadow-sm lg:col-span-2 md:rounded-[32px] md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-base font-bold text-ui-strong mb-1">Capital Raised</h3>
                <p className="text-xs text-ui-faint">Cumulative vs. target · USD Millions</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-6 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px w-6 shrink-0 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                  <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Target</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 md:gap-3">
              <div className="flex w-9 shrink-0 flex-col justify-between py-1 text-right text-[9px] font-medium text-ui-placeholder md:w-10">
                {['$16M', '$12M', '$8M', '$4M', '$0M'].map(l => (
                  <span key={l}>{l}</span>
                ))}
              </div>
              <div className="relative min-h-[12rem] flex-1 motion-chart md:min-h-[14rem]">
                <svg
                  className="h-full w-full overflow-visible"
                  viewBox={`0 0 ${capW} ${capH}`}
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="capital-raised-area-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                      <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 4, 8, 12, 16].map(m => (
                    <line
                      key={m}
                      x1="0"
                      x2={capW}
                      y1={yAtM(m)}
                      y2={yAtM(m)}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                      className="text-slate-200 dark:text-slate-700"
                    />
                  ))}
                  <path d={capitalAreaD} fill="url(#capital-raised-area-fill)" className="text-primary" />
                  <path
                    d={capitalTargetLineD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-300 dark:text-slate-600"
                  />
                  <path
                    d={capitalActualLineD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex justify-between pl-11 md:pl-12">
              {months.map(m => (
                <span key={m} className="text-[9px] font-bold text-ui-placeholder uppercase tracking-widest">
                  {m}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-ui-divider">
              {[
                { label: 'Current Month', val: '$14.82M' },
                { label: 'Target Gap', val: '$0.18M' },
                { label: 'Completion', val: '98.8%', color: 'text-[#009966] dark:text-emerald-400' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[9px] font-bold text-ui-placeholder uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color || 'text-ui-strong'}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation */}
          <div className="flex flex-col rounded-[28px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[32px] md:p-10">
            <h3 className="text-base font-bold text-ui-strong mb-1">Allocation</h3>
            <p className="text-xs text-ui-faint mb-8">By asset class</p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative h-36 w-36 motion-chart">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ui-divider-strong)" strokeWidth="14" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#7C3AED" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="116" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="192" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#A78BFA" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="227" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#C4B5FD" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="245" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-ui-strong">100%</p>
                  <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">Total</p>
                </div>
              </div>
              <div className="w-full space-y-3">
                {allocation.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[11px] font-medium text-ui-muted-text">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-ui-strong">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activity + Upcoming */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Activity */}
          <div className="rounded-[28px] border border-ui-border bg-ui-card p-6 shadow-sm lg:col-span-2 md:rounded-[32px] md:p-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-ui-strong">Recent Activity</h3>
                <p className="text-xs text-ui-faint mt-0.5">Capital flows & distributions</p>
              </div>
              <button className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
                View all <span>›</span>
              </button>
            </div>
            <div className="space-y-1">
              {activity.map((item, i) => (
                <div key={i} className="group flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-ui-muted-deep md:gap-5 md:p-4">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm md:h-10 md:w-10 ${item.color}`}>
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-ui-strong md:text-[13px]">{item.name}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-ui-faint">{item.id} · {item.type}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-[12px] font-bold md:text-[13px] ${item.amountClass}`}>{item.amount}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="hidden sm:inline-block px-1.5 py-0.5 bg-ui-muted-deep text-ui-faint text-[8px] font-bold rounded uppercase">{item.region}</span>
                      <p className="text-[10px] text-ui-placeholder font-medium">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="flex flex-col rounded-[28px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[32px] md:p-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-ui-strong">Upcoming</h3>
                <p className="text-xs text-ui-faint mt-0.5">Deadlines & events</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-300">
                📅
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {upcoming.map((event, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 md:p-4 rounded-2xl border border-ui-divider hover:border-ui-border transition-all cursor-pointer`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 ${event.color}`}>
                    <p className="text-[8px] font-bold uppercase">{event.date.split(' ')[0]}</p>
                    <p className="text-xs md:text-sm font-bold">{event.date.split(' ')[1]}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] md:text-[13px] font-bold text-ui-strong truncate">{event.label}</p>
                    <p className="text-[10px] text-ui-faint font-medium truncate">{event.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-200 dark:bg-ui-muted-deep dark:text-ui-faint dark:hover:bg-ui-muted-deep">
              Full Calendar <span>›</span>
            </button>
          </div>
        </section>

      </div>
    </InvestorLayout>
  );
}
