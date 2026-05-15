'use client';

import React from 'react';
import Link from 'next/link';
import { DASHBOARD_KPI_CARDS } from '@/components/dashboard/dashboardKpis';
import { OverviewHero } from '@/components/dashboard/OverviewHero';
import { OverviewKpiGrid } from '@/components/dashboard/OverviewKpiGrid';
import DashboardLayout from '@/components/DashboardLayout';
import {
  IconChartBar,
  IconClock,
  IconNavShield,
  IconNavSparkles,
  IconNavTrendingUp,
  IconNavUsers,
  IconPulseActivity,
} from '@/components/IssuerNavIcons';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8 md:space-y-10">
        <OverviewHero
          variant="issuer"
          greeting="Good morning, Alex"
          date="Oct 25, 2049"
          value="$14,820,303"
          subtitle="Total capital raised across all active offerings."
          badges={[
            { type: 'positive', text: '+12.5% vs last quarter' },
            { type: 'neutral', text: '$42.5M tokenized · 6 assets' },
          ]}
          pillars={[
            { label: 'Active Raises', value: '2', Icon: IconPulseActivity },
            { label: 'Investors', value: '2.4k', Icon: IconNavUsers },
            { label: 'Avg Yield', value: '8.4%', Icon: IconNavTrendingUp },
          ]}
          tokens={[
            { sym: 'PONYC', ch: '+4.2%', dotClass: 'bg-emerald-400' },
            { sym: 'HPPE', ch: '+6.8%', dotClass: 'bg-sky-400' },
            { sym: 'SFATX', ch: '+2.1%', dotClass: 'bg-amber-400' },
          ]}
        />

        <OverviewKpiGrid cards={DASHBOARD_KPI_CARDS} />

        {/* Capital raised + allocation */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="min-w-0 xl:col-span-2 overflow-hidden rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-center">
              <div>
                <h3 className="mb-1 text-lg font-bold text-ui-strong md:text-xl">Capital Raised</h3>
                <p className="text-xs font-medium text-ui-muted-text">Cumulative vs. target · USD millions</p>
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
                  <linearGradient id="dash-capital-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,82 C120,78 240,68 400,52 S720,28 1000,12 L1000,100 L0,100 Z"
                  fill="url(#dash-capital-area)"
                />
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
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m) => (
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
              ].map((item, i) => (
                <div key={i}>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">{item.label}</p>
                  <p className={`text-xl font-bold tabular-nums ${item.color ?? 'text-ui-strong'}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
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
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-ui-card dark:bg-ui-card">
                  <p className="text-2xl font-bold tabular-nums text-ui-strong md:text-3xl">100%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">Total</p>
                </div>
              </div>

              <div className="w-full space-y-3.5">
                {[
                  { label: 'Commercial RE', val: '54%', swatch: 'bg-[#5b21b6]' },
                  { label: 'Private Equity', val: '22%', swatch: 'bg-[#4338ca]' },
                  { label: 'Infrastructure', val: '14%', swatch: 'bg-[#3b82f6]' },
                  { label: 'Residential', val: '7%', swatch: 'bg-[#7c3aed]' },
                  { label: 'Art & Col.', val: '3%', swatch: 'bg-[#c4b5fd]' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
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

        {/* Activity + upcoming — stack until xl so iPad (with sidebar) gets full-width columns */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="min-w-0 xl:col-span-2 rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] sm:p-6 md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-bold text-ui-strong md:text-xl">Recent Activity</h3>
              <button
                type="button"
                className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-dark"
              >
                View all <span aria-hidden>→</span>
              </button>
            </div>

            <div className="space-y-1">
              {[
                {
                  name: 'Prime Office Tower NYC',
                  id: 'TX-901',
                  amount: '+$1.20M',
                  time: 'Today',
                  region: 'US',
                  tone: 'emerald' as const,
                  done: true,
                },
                {
                  name: 'Solar Farm Alpha TX',
                  id: 'TX-902',
                  amount: '+$850K',
                  time: 'Yesterday',
                  region: 'US',
                  tone: 'amber' as const,
                  done: false,
                },
                {
                  name: 'Harbor Ports Fund',
                  id: 'TX-903',
                  amount: '+$3.40M',
                  time: 'Oct 8',
                  region: 'SG',
                  tone: 'emerald' as const,
                  done: true,
                },
                {
                  name: 'Logistics Hub DE',
                  id: 'TX-904',
                  amount: '+$280K',
                  time: 'Oct 1',
                  region: 'EU',
                  tone: 'amber' as const,
                  done: false,
                },
                {
                  name: 'Riviera Residences',
                  id: 'TX-905',
                  amount: '+$2.1K',
                  time: 'Sep 30',
                  region: 'EU',
                  tone: 'emerald' as const,
                  done: true,
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-ui-border hover:bg-ui-muted-deep/80 sm:flex-row sm:items-center sm:gap-3 md:gap-5 md:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      activity.tone === 'amber'
                        ? 'bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                        : 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                    }`}
                  >
                    {activity.done ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <IconClock className="!h-5 !w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 line-clamp-2 text-[13px] font-bold leading-snug text-ui-strong sm:truncate sm:line-clamp-none">{activity.name}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-faint">{activity.id}</p>
                  </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:block sm:text-right">
                    <p className="text-[13px] font-bold text-ui-success-text sm:mb-0.5">{activity.amount}</p>
                    <div className="flex items-center gap-2 sm:justify-end">
                      <span className="rounded bg-ui-muted-deep px-1.5 py-0.5 text-[8px] font-bold uppercase text-ui-muted-text">
                        {activity.region}
                      </span>
                      <p className="text-[10px] font-medium text-ui-placeholder">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-col rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] sm:p-6 md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-bold text-ui-strong md:text-xl">Upcoming</h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              {[
                { date: 'Oct 28', label: 'Yield Distribution', pill: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
                { date: 'Nov 2', label: 'KYC Review', pill: 'bg-amber-500/15 text-amber-800 dark:text-amber-300' },
                { date: 'Nov 15', label: 'Lock-up Expiry', pill: 'bg-sky-500/15 text-sky-800 dark:text-sky-300' },
                { date: 'Nov 20', label: 'New Onboarding', pill: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300' },
              ].map((event, i) => {
                const [mo, day] = event.date.split(' ');
                return (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-ui-border p-3.5 transition-all hover:border-primary/35 hover:bg-ui-muted-deep/50 md:gap-4 md:p-4"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-center md:h-12 md:w-12 md:rounded-2xl ${event.pill}`}
                    >
                      <p className="text-[8px] font-bold uppercase leading-none opacity-90">{mo}</p>
                      <p className="text-sm font-bold leading-tight">{day}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-snug text-ui-strong xl:line-clamp-2">{event.label}</p>
                      <p className="text-[10px] font-medium text-ui-muted-text">Coming soon</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-2xl border border-ui-border bg-ui-muted-deep/50 py-3.5 text-[11px] font-bold uppercase tracking-widest text-ui-muted-text transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary md:mt-8"
            >
              Full Calendar <span aria-hidden>→</span>
            </button>
          </div>
        </section>

        {/* Quick actions — outline icon set: sparkles, bars, shield, trend */}
        <section className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:pb-12">
          {[
            {
              href: '/issuer/tokenize-asset',
              label: 'Tokenize New Asset',
              sub: 'Start a new offering',
              Icon: IconNavSparkles,
              well: 'bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/35',
            },
            {
              href: '/issuer/hub',
              label: 'Issuer Hub',
              sub: 'Manage assets & raises',
              Icon: IconChartBar,
              well: 'bg-gradient-to-br from-qa-hub-from to-qa-hub-to shadow-lg shadow-indigo-500/25',
            },
            // {
            //   href: '/issuer/ai-intelligence',
            //   label: 'AI Intelligence',
            //   sub: 'Predictive analytics',
            //   Icon: IconNavShield,
            //   well: 'bg-gradient-to-br from-qa-ai-from to-qa-ai-to shadow-lg shadow-violet-500/25',
            // },
            {
              href: '/issuer/yield',
              label: 'Yield Center',
              sub: 'Distributions & payouts',
              Icon: IconNavTrendingUp,
              well: 'bg-gradient-to-br from-qa-yield-from to-qa-yield-to shadow-lg shadow-amber-500/20',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col gap-5 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.14)] md:gap-6 md:rounded-[26px] md:p-7 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-200 group-hover:scale-[1.05] md:h-14 md:w-14 md:rounded-[18px] ${action.well}`}
              >
                <action.Icon className="!h-6 !w-6 text-white md:!h-7 md:!w-7" />
              </div>
              <div>
                <h4 className="mb-1 text-[13px] font-bold text-ui-strong md:text-sm">{action.label}</h4>
                <p className="text-[10px] font-medium leading-relaxed text-ui-muted-text md:text-[11px]">{action.sub}</p>
              </div>
            </Link>
          ))}
        </section>

      </div>
    </DashboardLayout>
  );
}
