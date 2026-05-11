'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  IconBolt,
  IconNavBuilding,
  IconNavShield,
  IconNavSparkles,
  IconNavTrendingUp,
  IconNavUsers,
  IssuerStatIconBars,
  IssuerStatIconTrend,
  IssuerStatIconUsers,
  IssuerStatIconWallet,
} from '@/components/IssuerNavIcons';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        
        {/* Main Banner */}
        <section className="relative overflow-hidden rounded-[28px] bg-primary-deep p-8 text-white shadow-[0_24px_60px_-20px_rgba(26,0,51,0.65)] md:rounded-[36px] md:p-12">
          <div className="absolute inset-0 scale-110 bg-mesh opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.09]" />
          
          <div className="relative z-10 flex flex-col justify-between gap-12 lg:flex-row">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-palette-success-light" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/55 md:text-xs">
                  Good morning, Alex · Oct 25, 2049
                </p>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">$14,820,303</h1>
                <p className="max-w-lg text-sm font-medium tracking-wide text-white/55 md:text-lg">
                  Total capital raised across all active offerings.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md md:px-5">
                  <span className="text-[11px] font-bold text-palette-success-light md:text-sm">↗ +12.5% vs last quarter</span>
                </div>
                <div className="flex items-center rounded-full border border-white/5 bg-white/[0.06] px-4 py-2 md:px-5">
                  <span className="text-[11px] font-medium text-white/45 md:text-sm">$42.5M tokenized · 6 assets</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 lg:w-[38%] lg:max-w-md">
              {[
                { label: 'Active Raises', val: '2', Icon: IconBolt },
                { label: 'Investors', val: '2.4k', Icon: IconNavUsers },
                { label: 'Avg Yield', val: '8.4%', Icon: IconNavTrendingUp },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:rounded-3xl md:p-6"
                >
                  <stat.Icon className="mb-0.5 h-6 w-6 text-white/70 md:h-7 md:w-7" />
                  <p className="text-xl font-bold md:text-2xl">{stat.val}</p>
                  <p className="text-center text-[8px] font-bold uppercase tracking-widest text-white/40 md:text-[10px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 hidden items-center gap-6 border-t border-white/10 pt-8 md:mt-12 md:flex md:gap-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Active Tokens</p>
            <div className="flex flex-wrap gap-3">
              {['PONYC +4.2%', 'HPPE +6.8%', 'SFATX +2.1%'].map((token, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-1.5"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-lg shadow-primary/60" />
                  <span className="text-[11px] font-bold tracking-wide">{token}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              className="space-y-6 rounded-3xl border border-card-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.well}`}>
                  <stat.Icon className="h-6 w-6" />
                </div>
                <div
                  className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                    stat.trend.startsWith('↗')
                      ? 'bg-ui-success-bg-soft text-ui-success-text'
                      : 'bg-ui-danger-soft text-ui-danger-text'
                  }`}
                >
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</p>
                <p className="mb-2 text-3xl font-bold text-foreground">{stat.val}</p>
                <p className="text-xs font-medium text-text-muted">{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 overflow-hidden rounded-[28px] border border-card-border bg-card p-6 shadow-sm md:rounded-[36px] md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Capital Raised</h3>
                <p className="text-xs text-text-muted">Cumulative vs. target · USD Millions</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-primary rounded-full"></div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 border border-dashed border-border rounded-full"></div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Target</span>
                </div>
              </div>
            </div>
            
            <div className="h-48 md:h-64 relative mt-8">
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {[4, 6, 8, 12, 16, 22, 28, 35, 42].map((h, i) => (
                  <div key={i} className="w-6 md:w-12 bg-primary/5 border-t-2 border-primary/20" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
              <svg className="absolute inset-0 w-full h-full text-primary" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path d="M0,80 Q250,70 500,50 T1000,10" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div className="flex justify-between mt-6 px-2 overflow-x-auto pb-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m) => (
                <span key={m} className="text-[10px] font-bold text-text-muted opacity-50 uppercase tracking-widest">{m}</span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              {[
                { label: 'Current Month', val: '$14.82M' },
                { label: 'Target Gap', val: '$0.18M' },
                { label: 'Completion', val: '98.8%', color: 'text-ui-success-text' }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color || 'text-foreground'}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[28px] border border-card-border bg-card p-6 shadow-sm md:rounded-[36px] md:p-10">
            <h3 className="text-lg font-bold text-foreground mb-1">Allocation</h3>
            <p className="text-xs text-text-muted mb-8 md:mb-12">By asset class</p>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="125" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--chart-donut-2)" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="200" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--chart-donut-3)" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="230" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl md:text-2xl font-bold text-foreground">100%</p>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total</p>
                </div>
              </div>

              <div className="w-full space-y-4">
                {[
                  { label: 'Commercial RE', val: '54%', color: 'bg-primary' },
                  { label: 'Private Equity', val: '22%', color: 'bg-chart-alloc-legend-2' },
                  { label: 'Infrastructure', val: '14%', color: 'bg-chart-alloc-legend-3' },
                  { label: 'Residential', val: '7%', color: 'bg-chart-alloc-legend-4' },
                  { label: 'Art & Col.', val: '3%', color: 'bg-chart-alloc-legend-5' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      <span className="text-[11px] font-medium text-text-muted">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-foreground">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activity & Events Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-[28px] border border-card-border bg-card p-6 shadow-sm md:rounded-[36px] md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
              <button className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                View all <span>→</span>
              </button>
            </div>
            
            <div className="space-y-1">
              {[
                { name: 'Prime Office Tower NYC', id: 'TX-901', amount: '+$1.20M', time: 'Today', region: 'US', tone: 'emerald' as const },
                { name: 'Solar Farm Alpha TX', id: 'TX-902', amount: '+$850K', time: 'Yesterday', region: 'US', tone: 'amber' as const },
                { name: 'Harbor Ports Fund', id: 'TX-903', amount: '+$3.40M', time: 'Oct 8', region: 'SG', tone: 'emerald' as const },
                { name: 'Logistics Hub DE', id: 'TX-904', amount: '+$280K', time: 'Oct 1', region: 'EU', tone: 'amber' as const },
                { name: 'Riviera Residences', id: 'TX-905', amount: '+$2.1K', time: 'Sep 30', region: 'EU', tone: 'emerald' as const },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-ui-border hover:bg-ui-muted-deep md:gap-6 md:rounded-3xl md:p-6"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      activity.tone === 'amber'
                        ? 'bg-app-status-warn-bg text-app-status-warn-fg'
                        : 'bg-ui-success-bg-soft text-ui-success-text'
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground mb-0.5 truncate">{activity.name}</p>
                    <p className="text-[10px] text-text-muted font-medium tracking-wide uppercase">{activity.id}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold text-ui-success-text mb-0.5">{activity.amount}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="hidden sm:inline-block px-1.5 py-0.5 bg-surface text-text-muted text-[8px] font-bold rounded uppercase">{activity.region}</span>
                      <p className="text-[10px] text-text-muted opacity-60 font-medium">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[28px] border border-card-border bg-card p-6 shadow-sm md:rounded-[36px] md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-foreground">Upcoming</h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-issuer-calendar-icon-bg text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { date: 'Oct 28', label: 'Yield Distribution', color: 'text-event-violet-fg bg-event-violet-bg' },
                { date: 'Nov 2', label: 'KYC Review', color: 'text-event-amber-fg bg-event-amber-bg' },
                { date: 'Nov 15', label: 'Lock-up Expiry', color: 'text-event-blue-fg bg-event-blue-bg' },
                { date: 'Nov 20', label: 'New Onboarding', color: 'text-event-green-fg bg-event-green-bg' },
              ].map((event, i) => (
                <div key={i} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-card-border p-4 transition-all hover:border-primary/40 md:rounded-3xl">
                  <div className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl text-center md:h-12 md:rounded-2xl ${event.color}`}>
                    <p className="text-[8px] md:text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</p>
                    <p className="text-xs md:text-sm font-bold">{event.date.split(' ')[1]}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{event.label}</p>
                    <p className="text-[10px] text-text-muted font-medium">Coming soon</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-4 mt-8 bg-surface text-text-muted rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
              Full Calendar <span>→</span>
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: '/issuer/tokenize-asset',
              label: 'Tokenize New Asset',
              sub: 'Start a new offering',
              Icon: IconNavSparkles,
              well: 'bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/30',
            },
            {
              href: '/issuer/hub',
              label: 'Issuer Hub',
              sub: 'Manage assets & raises',
              Icon: IconNavBuilding,
              well: 'bg-gradient-to-br from-qa-hub-from to-qa-hub-to shadow-lg shadow-primary/25',
            },
            {
              href: '/issuer/ai-intelligence',
              label: 'AI Intelligence',
              sub: 'Predictive analytics',
              Icon: IconNavShield,
              well: 'bg-gradient-to-br from-qa-ai-from to-qa-ai-to shadow-lg shadow-primary/25',
            },
            {
              href: '/issuer/yield',
              label: 'Yield Center',
              sub: 'Distributions & payouts',
              Icon: IconNavTrendingUp,
              well: 'bg-gradient-to-br from-qa-yield-from to-qa-yield-to shadow-lg shadow-warning/25',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex cursor-pointer flex-col gap-6 rounded-[24px] border border-card-border bg-card p-6 shadow-sm transition-all hover:shadow-lg md:rounded-[32px] md:p-8"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-200 group-hover:scale-[1.06] md:h-14 md:w-14 md:rounded-[18px] ${action.well}`}
              >
                <action.Icon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div>
                <h4 className="mb-1 text-[13px] font-bold text-foreground md:text-sm">{action.label}</h4>
                <p className="text-[10px] font-medium text-text-muted md:text-[11px]">{action.sub}</p>
              </div>
            </Link>
          ))}
        </section>

      </div>
    </DashboardLayout>
  );
}
