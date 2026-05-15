'use client';

import { Building2, Calendar, CheckCircle2, ChevronRight, Clock, Globe, TrendingUp, Wallet, Zap } from 'lucide-react';
import React from 'react';
import { OverviewHero } from '@/components/dashboard/OverviewHero';
import { DASHBOARD_KPI_CARDS } from '@/components/dashboard/dashboardKpis';
import { OverviewKpiGrid } from '@/components/dashboard/OverviewKpiGrid';
import InvestorLayout from '@/components/InvestorLayout';
import { IconPulseActivity } from '@/components/IssuerNavIcons';

const iconStroke = 1.75;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

const ALLOCATION = [
  { label: 'Commercial RE', val: '54%', swatch: 'bg-[#5b21b6]' },
  { label: 'Private Equity', val: '22%', swatch: 'bg-[#4338ca]' },
  { label: 'Infrastructure', val: '14%', swatch: 'bg-[#3b82f6]' },
  { label: 'Residential', val: '7%', swatch: 'bg-[#7c3aed]' },
  { label: 'Art & Col.', val: '3%', swatch: 'bg-[#c4b5fd]' },
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
      <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8 md:space-y-10">
        <OverviewHero
          greeting="Good afternoon, Marcus"
          date="May 1, 2026"
          value="$248,650"
          subtitle="Total portfolio value across all investments"
          badges={[
            { type: 'positive', text: '+9.45% Annual Return' },
            { type: 'neutral', text: '7 investments · 4 asset classes' },
          ]}
          pillars={[
            { label: 'Monthly Income', value: '$14.2K', Icon: Wallet },
            { label: 'Active Positions', value: '7', Icon: IconPulseActivity },
            { label: 'Avg Yield', value: '10.8%', Icon: TrendingUp },
          ]}
          tokens={HERO_TOKENS}
        />

        <OverviewKpiGrid cards={DASHBOARD_KPI_CARDS} />


        {/* Charts */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="xl:col-span-2 overflow-hidden rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
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
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="xl:col-span-2 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
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
                  className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-ui-border hover:bg-ui-muted-deep/80 sm:flex-row sm:items-center md:gap-5 md:p-5"
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
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:block sm:text-right">
                    <p className="text-[13px] font-bold text-ui-success-text sm:mb-0.5">{item.amount}</p>
                    <div className="flex items-center gap-2 sm:justify-end">
                      <span className="rounded bg-ui-muted-deep px-1.5 py-0.5 text-[8px] font-bold uppercase text-ui-muted-text">
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
