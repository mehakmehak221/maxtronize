'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  IconChartBar,
  IconClock,
  IconNavShield,
  IconNavSparkles,
  IconNavTrendingUp,
  IconNavUsers,
  IconPulseActivity,
  IssuerStatIconBars,
  IssuerStatIconTrend,
  IssuerStatIconUsers,
  IssuerStatIconWallet,
} from '@/components/IssuerNavIcons';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-700 md:space-y-10">
        {/* Hero — indigo / violet glass, outline stat icons */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#312e81] via-[#4c1d95] to-[#581c87] p-7 text-white shadow-[0_28px_64px_-24px_rgba(49,46,129,0.55)] ring-1 ring-white/10 md:rounded-[32px] md:p-11">
          <div className="pointer-events-none absolute inset-0 bg-mesh opacity-35" />
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.07]" />
          <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-violet-400/20 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-indigo-400/15 blur-[90px]" />

          <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:gap-12">
            <div className="min-w-0 space-y-5 md:space-y-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 md:text-[11px]">
                  Good morning, Alex
                </p>
                <span className="hidden text-white/25 sm:inline" aria-hidden>
                  ·
                </span>
                <p className="text-[10px] font-semibold text-white/40 md:text-[11px]">Oct 25, 2049</p>
              </div>
              <div className="space-y-2 md:space-y-3">
                <h1 className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl lg:text-6xl">$14,820,303</h1>
                <p className="max-w-xl text-sm font-medium leading-relaxed text-white/60 md:text-base">
                  Total capital raised across all active offerings.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1 md:gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-3.5 py-2 backdrop-blur-md md:px-4">
                  <span className="text-[11px] font-bold text-emerald-200 md:text-sm">↗ +12.5% vs last quarter</span>
                </div>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 backdrop-blur-md md:px-4">
                  <span className="text-[11px] font-medium text-white/50 md:text-sm">$42.5M tokenized · 6 assets</span>
                </div>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-3 gap-2.5 sm:gap-3 lg:w-[min(100%,22rem)] lg:max-w-sm">
              {[
                { label: 'Active Raises', val: '2', Icon: IconPulseActivity },
                { label: 'Investors', val: '2.4k', Icon: IconNavUsers },
                { label: 'Avg Yield', val: '8.4%', Icon: IconNavTrendingUp },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.08] p-3 shadow-inner shadow-black/10 backdrop-blur-xl sm:gap-2 sm:p-4 md:rounded-3xl md:p-5"
                >
                  <stat.Icon className="mb-0.5 !h-6 !w-6 text-white/75 md:!h-7 md:!w-7" />
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
              {[
                { sym: 'PONYC', ch: '+4.2%', dot: 'bg-emerald-400' },
                { sym: 'HPPE', ch: '+6.8%', dot: 'bg-sky-400' },
                { sym: 'SFATX', ch: '+2.1%', dot: 'bg-amber-400' },
              ].map((t) => (
                <div
                  key={t.sym}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-black/20 px-3 py-1.5 backdrop-blur-md md:px-4"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${t.dot} ring-2 ring-white/20`} aria-hidden />
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
          {[
            {
              label: 'Total Raised',
              val: '$14.82M',
              trend: '↗ +12.5%',
              sub: 'vs $13.17M last quarter',
              Icon: IssuerStatIconWallet,
              well: 'bg-dash-kpi-violet-soft text-dash-kpi-violet-fg ring-1 ring-dash-kpi-violet-ring',
            },
            {
              label: 'Assets Tokenized',
              val: '$42.5M',
              trend: '↗ +8.2%',
              sub: '6 assets · 4 jurisdictions',
              Icon: IssuerStatIconBars,
              well: 'bg-dash-kpi-blue-soft text-dash-kpi-blue-fg ring-1 ring-dash-kpi-blue-ring',
            },
            {
              label: 'Active Investors',
              val: '2,403',
              trend: '↗ +15.3%',
              sub: '89% KYC verified',
              Icon: IssuerStatIconUsers,
              well: 'bg-dash-kpi-green-soft text-dash-kpi-green-fg ring-1 ring-dash-kpi-green-ring',
            },
            {
              label: 'Platform Yield',
              val: '8.4%',
              trend: '↘ -0.2%',
              sub: 'Weighted avg. APY',
              Icon: IssuerStatIconTrend,
              well: 'bg-dash-kpi-orange-soft text-dash-kpi-orange-fg ring-1 ring-dash-kpi-orange-ring',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="space-y-5 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_36px_-14px_rgba(15,23,42,0.12)] md:space-y-6 md:rounded-3xl md:p-7 dark:border-ui-border dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl md:h-12 md:w-12 ${stat.well}`}>
                  <stat.Icon className="!h-5 !w-5 md:!h-[22px] md:!w-[22px]" />
                </div>
                <div
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    stat.trend.startsWith('↗')
                      ? 'bg-ui-success-bg-soft text-ui-success-text'
                      : 'bg-ui-danger-soft text-ui-danger-text'
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

        {/* Capital raised + allocation */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 overflow-hidden rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
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

        {/* Activity + upcoming */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between md:mb-8">
              <h3 className="text-lg font-bold text-ui-strong md:text-xl">Recent Activity</h3>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-dark"
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
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-ui-border hover:bg-ui-muted-deep/80 md:gap-5 md:rounded-2xl md:p-5"
                >
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
                    <p className="mb-0.5 truncate text-[13px] font-bold text-ui-strong">{activity.name}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-faint">{activity.id}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="mb-0.5 text-[13px] font-bold text-ui-success-text">{activity.amount}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="hidden rounded bg-ui-muted-deep px-1.5 py-0.5 text-[8px] font-bold uppercase text-ui-muted-text sm:inline-block">
                        {activity.region}
                      </span>
                      <p className="text-[10px] font-medium text-ui-placeholder">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between md:mb-8">
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

            <div className="flex flex-1 flex-col space-y-3">
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
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-ui-strong">{event.label}</p>
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
        <section className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:pb-12">
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
