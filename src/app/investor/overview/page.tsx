'use client';

import {
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import React from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import {
  IconPulseActivity,
  IssuerStatIconBars,
  IssuerStatIconTrend,
  IssuerStatIconUsers,
  IssuerStatIconWallet,
} from '@/components/IssuerNavIcons';

const iconStroke = 1.75;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

const ALLOCATION = [
  { label: 'Commercial RE', val: '54%', swatch: 'bg-[#5b21b6]' },
  { label: 'Private Equity', val: '22%', swatch: 'bg-[#4338ca]' },
  { label: 'Infrastructure', val: '14%', swatch: 'bg-[#3b82f6]' },
  { label: 'Residential', val: '7%', swatch: 'bg-[#7c3aed]' },
  { label: 'Art & Col.', val: '3%', swatch: 'bg-[#c4b5fd]' },
];

const KPI_CARDS = [
  {
    label: 'Total Raised',
    val: '$14.82M',
    trend: '↗ +12.5%',
    sub: 'vs $13.17M last quarter',
    up: true,
    Icon: IssuerStatIconWallet,
    well: 'bg-dash-kpi-violet-soft text-dash-kpi-violet-fg ring-1 ring-dash-kpi-violet-ring',
  },
  {
    label: 'Assets Tokenized',
    val: '$42.5M',
    trend: '↗ +8.2%',
    sub: '6 assets · 4 jurisdictions',
    up: true,
    Icon: IssuerStatIconBars,
    well: 'bg-dash-kpi-blue-soft text-dash-kpi-blue-fg ring-1 ring-dash-kpi-blue-ring',
  },
  {
    label: 'Active Investors',
    val: '2,403',
    trend: '↗ +15.3%',
    sub: '89% KYC verified',
    up: true,
    Icon: IssuerStatIconUsers,
    well: 'bg-dash-kpi-green-soft text-dash-kpi-green-fg ring-1 ring-dash-kpi-green-ring',
  },
  {
    label: 'Platform Yield',
    val: '8.4%',
    trend: '↘ -0.2%',
    sub: 'Weighted avg. APY',
    up: false,
    Icon: IssuerStatIconTrend,
    well: 'bg-dash-kpi-orange-soft text-dash-kpi-orange-fg ring-1 ring-dash-kpi-orange-ring',
  },
];

const ACTIVITY = [
  {
    name: 'Prime Office Tower NYC',
    id: 'TX-901',
    type: 'Capital Raise',
    region: 'US',
    amount: '+$1.20M',
    time: 'Today, 10:42 AM',
    done: true,
  },
  {
    name: 'Solar Farm Alpha TX',
    id: 'TX-902',
    type: 'Capital Raise',
    region: 'US',
    amount: '+$850K',
    time: 'Yesterday, 2:30 PM',
    done: false,
  },
  {
    name: 'Harbor Ports PE Fund',
    id: 'TX-903',
    type: 'Distribution',
    region: 'SG',
    amount: '+$3.40M',
    time: 'Oct 5, 9:10 AM',
    done: true,
  },
  {
    name: 'Logistics Hub DE',
    id: 'TX-904',
    type: 'Yield Payout',
    region: 'EU',
    amount: '+$280K',
    time: 'Oct 1, 6:00 AM',
    done: true,
  },
  {
    name: 'Riviera Residences',
    id: 'TX-906',
    type: 'Monthly Yield',
    region: 'EU',
    amount: '+$2.1K',
    time: 'Sep 30, 8:00 AM',
    done: true,
  },
];

const UPCOMING = [
  { date: 'Oct 28', label: 'Q3 Yield Distribution', sub: 'Prime Office Tower', pill: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
  { date: 'Nov 2', label: 'KYC Review Deadline', sub: 'Riviera Residences', pill: 'bg-amber-500/15 text-amber-800 dark:text-amber-300' },
  { date: 'Nov 15', label: 'Token Lock-up Expiry', sub: 'Harbor Ports PE Fund', pill: 'bg-sky-500/15 text-sky-800 dark:text-sky-300' },
  { date: 'Nov 20', label: 'New Investor Onboarding', sub: 'BlackRock RE Partners', pill: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300' },
];

const HERO_TOKENS = [
  { sym: 'PONYC', ch: '+4.2%', Icon: Building2 },
  { sym: 'HPPE', ch: '+6.8%', Icon: Globe },
  { sym: 'SFATX', ch: '+2.1%', Icon: Zap },
];

export default function InvestorOverviewPage() {
  return (
    <InvestorLayout pageTitle="Investor Overview">
      <div className="mx-auto w-full max-w-7xl space-y-8 animate-page-enter md:space-y-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#312e81] via-[#4c1d95] to-[#581c87] p-7 text-white shadow-[0_28px_64px_-24px_rgba(49,46,129,0.55)] ring-1 ring-white/10 md:rounded-[32px] md:p-11">
          <div className="pointer-events-none absolute inset-0 bg-mesh opacity-35" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.07]" aria-hidden />
          <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-violet-400/20 blur-[100px]" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-indigo-400/15 blur-[90px]" aria-hidden />

          <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:gap-12">
            <div className="min-w-0 space-y-5 md:space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 md:text-[11px]">
                Good afternoon, Marcus · May 1, 2026
              </p>
              <div className="space-y-2 md:space-y-3">
                <h1 className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl lg:text-6xl">$248,650</h1>
                <p className="max-w-xl text-sm font-medium leading-relaxed text-white/60 md:text-base">
                  Total portfolio value across all investments
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1 md:gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-3.5 py-2 backdrop-blur-md md:px-4">
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-emerald-200" strokeWidth={iconStroke} />
                  <span className="text-[11px] font-bold text-emerald-200 md:text-sm">+9.45% Annual Return</span>
                </div>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 backdrop-blur-md md:px-4">
                  <span className="text-[11px] font-medium text-white/50 md:text-sm">7 investments · 4 asset classes</span>
                </div>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-3 gap-2.5 sm:gap-3 lg:w-[min(100%,22rem)] lg:max-w-sm">
              {[
                { label: 'Monthly Income', val: '$14.2K', Icon: Wallet },
                { label: 'Active Positions', val: '7', Icon: IconPulseActivity },
                { label: 'Avg Yield', val: '10.8%', Icon: TrendingUp },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.08] p-3 shadow-inner shadow-black/10 backdrop-blur-xl sm:gap-2 sm:p-4 md:rounded-3xl md:p-5"
                >
                  <stat.Icon className="!h-6 !w-6 text-white/75 md:!h-7 md:!w-7" />
                  <p className="text-lg font-bold tabular-nums sm:text-xl md:text-2xl">{stat.val}</p>
                  <p className="text-center text-[8px] font-bold uppercase leading-tight tracking-widest text-white/45 sm:text-[9px] md:text-[10px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-7 flex flex-col gap-4 border-t border-white/10 pt-7 md:mt-10 md:flex-row md:items-center md:gap-8 md:pt-9">
            <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Active Tokens</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {HERO_TOKENS.map((t) => (
                <div
                  key={t.sym}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-black/20 px-3 py-1.5 backdrop-blur-md md:px-4"
                >
                  <t.Icon className="h-3.5 w-3.5 shrink-0 text-white/80" strokeWidth={iconStroke} />
                  <span className="text-[10px] font-bold tracking-wide text-white/95 md:text-[11px]">
                    {t.sym}{' '}
                    <span className="font-semibold text-emerald-200/95">{t.ch}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KPI row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {KPI_CARDS.map((stat) => (
            <div
              key={stat.label}
              className="space-y-5 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm transition-shadow hover:shadow-md md:space-y-6 md:rounded-3xl md:p-7 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl md:h-12 md:w-12 ${stat.well}`}>
                  <stat.Icon className="!h-5 !w-5 md:!h-[22px] md:!w-[22px]" />
                </div>
                <div
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    stat.up ? 'bg-ui-success-bg-soft text-ui-success-text' : 'bg-ui-danger-soft text-ui-danger-text'
                  }`}
                >
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ui-faint">{stat.label}</p>
                <p className="mb-1.5 text-2xl font-bold tabular-nums tracking-tight text-ui-strong md:text-3xl">{stat.val}</p>
                <p className="text-xs font-medium leading-relaxed text-ui-muted-text">{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 overflow-hidden rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-center">
              <div>
                <h3 className="mb-1 text-lg font-bold text-ui-strong md:text-xl">Capital Raised</h3>
                <p className="text-xs font-medium text-ui-muted-text">Cumulative vs. target · USD Millions</p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ui-muted-text">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0 w-4 border-t-2 border-dashed border-ui-border-strong" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ui-muted-text">Target</span>
                </div>
              </div>
            </div>

            <div className="relative mt-2 h-52 motion-chart md:h-64">
              <svg className="absolute inset-0 h-full w-full text-primary" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="inv-capital-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,82 C120,78 240,68 400,52 S720,28 1000,12 L1000,100 L0,100 Z" fill="url(#inv-capital-area)" />
                <path
                  d="M0,58 C140,52 280,42 440,32 S760,18 1000,8"
                  fill="none"
                  stroke="rgb(148 163 184)"
                  strokeOpacity="0.9"
                  strokeWidth="2.5"
                  strokeDasharray="14 10"
                  strokeLinecap="round"
                  className="dark:stroke-slate-500"
                />
                <path
                  d="M0,82 C120,78 240,68 400,52 S720,28 1000,12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-5 flex justify-between overflow-x-auto px-0.5 pb-1">
              {MONTHS.map((m) => (
                <span key={m} className="text-[10px] font-bold uppercase tracking-widest text-ui-placeholder">
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-ui-divider pt-8 sm:grid-cols-3 sm:gap-8">
              {[
                { label: 'Current Month', val: '$14.82M' },
                { label: 'Target Gap', val: '$0.18M' },
                { label: 'Completion', val: '98.8%', color: 'text-ui-success-text' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">{item.label}</p>
                  <p className={`text-xl font-bold tabular-nums ${item.color ?? 'text-ui-strong'}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 md:mb-8">
              <h3 className="mb-1 text-lg font-bold text-ui-strong md:text-xl">Allocation</h3>
              <p className="text-xs font-medium text-ui-muted-text">By asset class</p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-8 md:gap-10">
              <div
                className="relative h-44 w-44 shrink-0 rounded-full p-[14px] shadow-inner shadow-black/5 md:h-48 md:w-48 md:p-4"
                style={{
                  background:
                    'conic-gradient(from -90deg, #5b21b6 0deg 194.4deg, #4338ca 194.4deg 273.6deg, #3b82f6 273.6deg 324deg, #7c3aed 324deg 349.2deg, #c4b5fd 349.2deg 360deg)',
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-ui-card">
                  <p className="text-2xl font-bold tabular-nums text-ui-strong md:text-3xl">100%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">Total</p>
                </div>
              </div>

              <div className="w-full space-y-3.5">
                {ALLOCATION.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 text-[12px]">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.swatch} ring-1 ring-black/5 dark:ring-white/10`} />
                      <span className="truncate font-medium text-ui-muted-text">{item.label}</span>
                    </div>
                    <span className="shrink-0 font-bold tabular-nums text-ui-strong">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activity + Upcoming */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between md:mb-8">
              <div>
                <h3 className="text-lg font-bold text-ui-strong md:text-xl">Recent Activity</h3>
                <p className="mt-0.5 text-xs font-medium text-ui-muted-text">Capital flows & distributions</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
              >
                View all
                <ChevronRight className="h-4 w-4" strokeWidth={iconStroke} />
              </button>
            </div>

            <div className="space-y-1">
              {ACTIVITY.map((item) => (
                <div
                  key={item.id}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-ui-border hover:bg-ui-muted-deep/80 md:gap-5 md:p-5"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-11 md:w-11 ${
                      item.done
                        ? 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                        : 'bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5" strokeWidth={iconStroke} />
                    ) : (
                      <Clock className="h-5 w-5" strokeWidth={iconStroke} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 truncate text-[13px] font-bold text-ui-strong">{item.name}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-faint">
                      {item.id} · {item.type}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="mb-0.5 text-[13px] font-bold text-ui-success-text">{item.amount}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="hidden rounded bg-ui-muted-deep px-1.5 py-0.5 text-[8px] font-bold uppercase text-ui-muted-text sm:inline-block">
                        {item.region}
                      </span>
                      <p className="text-[10px] font-medium text-ui-placeholder">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between md:mb-8">
              <div>
                <h3 className="text-lg font-bold text-ui-strong md:text-xl">Upcoming</h3>
                <p className="mt-0.5 text-xs font-medium text-ui-muted-text">Deadlines & events</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" strokeWidth={iconStroke} />
              </div>
            </div>

            <div className="flex flex-1 flex-col space-y-3">
              {UPCOMING.map((event) => {
                const [mo, day] = event.date.split(' ');
                return (
                  <div
                    key={event.date + event.label}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-ui-border p-3.5 transition-all hover:border-primary/35 hover:bg-ui-muted-deep/50 md:gap-4 md:p-4"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-center md:h-12 md:w-12 md:rounded-2xl ${event.pill}`}
                    >
                      <p className="text-[8px] font-bold uppercase leading-none opacity-90">{mo}</p>
                      <p className="text-sm font-bold leading-tight">{day}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-ui-strong">{event.label}</p>
                      <p className="text-[10px] font-medium text-ui-muted-text">{event.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center gap-1 rounded-2xl border border-ui-border bg-ui-muted-deep/50 py-3.5 text-[11px] font-bold uppercase tracking-widest text-ui-muted-text transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary md:mt-8"
            >
              Full Calendar
              <ChevronRight className="h-4 w-4" strokeWidth={iconStroke} />
            </button>
          </div>
        </section>
      </div>
    </InvestorLayout>
  );
}
