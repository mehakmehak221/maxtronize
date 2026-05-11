'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const REGISTRY_CHIP_CLASS: Record<number, string> = {
  1: 'bg-inv-chip-1-bg text-inv-chip-1-fg',
  2: 'bg-inv-chip-2-bg text-inv-chip-2-fg',
  3: 'bg-inv-chip-3-bg text-inv-chip-3-fg',
  4: 'bg-inv-chip-4-bg text-inv-chip-4-fg',
  5: 'bg-inv-chip-5-bg text-inv-chip-5-fg',
  6: 'bg-inv-chip-6-bg text-inv-chip-6-fg',
};

const CAP_CHIP_CLASS: Record<string, string> = {
  yt: 'bg-cap-chip-yt-bg text-cap-chip-yt-fg',
  sl: 'bg-cap-chip-sl-bg text-cap-chip-sl-fg',
  ad: 'bg-cap-chip-ad-bg text-cap-chip-ad-fg',
  ro: 'bg-cap-chip-ro-bg text-cap-chip-ro-fg',
  mo: 'bg-cap-chip-mo-bg text-cap-chip-mo-fg',
  cw: 'bg-cap-chip-cw-bg text-cap-chip-cw-fg',
  eh: 'bg-cap-chip-eh-bg text-cap-chip-eh-fg',
};

const ASSET_BAR_CLASS: Record<string, string> = {
  a: 'bg-issuer-asset-bar-1',
  b: 'bg-issuer-asset-bar-2',
  c: 'bg-issuer-asset-bar-3',
  draft: 'bg-issuer-asset-bar-draft',
};

type TabType = 'overview' | 'assets' | 'cap-table' | 'investors' | 'distributions' | 'compliance' | 'analytics' | 'ai-assistant';

export default function IssuerHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'assets', name: 'Assets', icon: '🏢' },
    { id: 'cap-table', name: 'Cap Table', icon: '📋' },
    { id: 'investors', name: 'Investors', icon: '👥' },
    { id: 'distributions', name: 'Distributions', icon: '💰' },
    { id: 'compliance', name: 'Compliance', icon: '🛡️' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'ai-assistant', name: 'AI Assistant', icon: '🤖', tag: 'AI' },
  ];

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-[32px] bg-primary p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="relative z-10 space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ui-card/10 text-xl">💰</div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/60">Total Capital Raised</p>
              <h3 className="text-4xl font-bold tracking-tight">$14,820,000</h3>
              <p className="mt-2 text-xs font-medium text-white/60">across 3 active offerings</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <span className="flex items-center gap-2 text-[11px] font-bold text-issuer-hero-trend-fg">
                ↗ +$1.24M this week
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-card-border bg-card p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-info/10 text-xl text-info">🏢</div>
            <span className="rounded-full bg-ui-success-bg-soft px-2 py-1 text-[10px] font-bold text-ui-success-text">
              ↗ +1 this quarter
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Active Assets</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">3</h3>
            <p className="mt-2 text-xs font-medium text-text-muted">2 in funding · 1 fully funded</p>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-card-border bg-card p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ui-accent-tint text-xl text-primary">👥</div>
            <span className="rounded-full bg-ui-success-bg-soft px-2 py-1 text-[10px] font-bold text-ui-success-text">
              ↗ +12 this month
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Investors</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">148</h3>
            <p className="mt-2 text-xs font-medium text-text-muted">134 funded · 14 committed</p>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] bg-issuer-yield-card p-8 text-issuer-yield-card-fg shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-xl text-issuer-yield-card-fg">
              📈
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-issuer-yield-card-fg/80">Blended Yield</p>
            <h3 className="text-4xl font-bold tracking-tight">11.8%</h3>
            <p className="mt-2 text-xs font-medium text-issuer-yield-card-fg/80">weighted avg across portfolio</p>
          </div>
          <div className="border-t border-white/20 pt-4">
            <span className="flex items-center gap-2 text-[11px] font-bold text-issuer-yield-card-fg">
              ↗ +0.3% vs last quarter
            </span>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-warning/20 bg-issuer-pending-kyc-bg p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-warning/10 text-xl text-warning">🕒</div>
            <span className="rounded-full bg-warning/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-warning">
              Action
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-warning/90">Pending KYC</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">7</h3>
            <p className="mt-2 text-xs font-medium text-warning">
              5 awaiting docs · 2 in review
              <br />
              <span className="text-ui-danger-text">3 overdue {'>'}5 days</span>
            </p>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-card-border bg-card p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ui-accent-tint text-xl text-primary">📅</div>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Next Distribution</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">$186,400</h3>
            <p className="mt-2 text-xs font-medium text-text-muted">Scheduled May 01, 2026 · 148 investors</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-[40px] border border-card-border bg-card p-10 shadow-sm lg:col-span-2">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-bold text-foreground">Capital Velocity</h3>
              <p className="text-xs text-text-muted">Raised vs. committed capital — last 12 weeks</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-issuer-chart-line-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Raised</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-palette-success" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Committed</span>
              </div>
            </div>
          </div>
          <div className="relative mt-8 h-64">
            <svg
              className="absolute inset-0 h-full w-full text-issuer-chart-line-primary"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
            >
              <path d="M0,80 Q250,75 500,60 T1000,20" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-issuer-chart-line-primary-fill to-transparent" />
            <div className="absolute bottom-0 flex w-full justify-between text-[10px] font-bold uppercase text-text-muted">
              {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-[40px] border border-card-border bg-card p-10 shadow-sm">
          <h3 className="mb-1 text-lg font-bold text-foreground">Recent Activity</h3>
          <p className="mb-8 text-xs text-text-muted">Investor actions & compliance events</p>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Eleanor Hayes committed $150,000 to Peachtree Tower', time: '18 min ago', icon: '💰', color: 'bg-ui-accent-tint text-primary' },
              { label: 'Priya Mehta KYC documents submitted for review', time: '2 hr ago', icon: '📄', color: 'bg-activity-info-bg text-activity-info-fg' },
              { label: 'Q1 distribution of $92,000 queued for Summit Credit', time: '5 hr ago', icon: '📊', color: 'bg-ui-success-bg-soft text-ui-success-text' },
              { label: 'OFAC screening flagged 1 name — manual review required', time: 'Yesterday', icon: '⚠️', color: 'bg-ui-danger-soft text-ui-danger-text' },
              { label: 'Chen Wei committed $200,000 to Summit Credit', time: 'Yesterday', icon: '💰', color: 'bg-ui-accent-tint text-primary' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer hover:bg-surface p-2 -mx-2 rounded-xl transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm shadow-sm ${activity.color}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{activity.label}</p>
                  <p className="text-[10px] text-text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Asset Portfolio</h3>
          <p className="text-xs text-text-muted">4 assets · 3 active offerings</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-primary px-6 py-2 text-[13px] font-bold text-white transition-colors hover:bg-issuer-primary-hover"
        >
          + New Asset
        </button>
      </div>
      <div className="space-y-4">
        {[
          { name: 'Peachtree Tower — Atlanta, GA', status: 'Live' as const, tag: 'PTAT', val: '$12.5M', yield: '9.2%', investors: '62', reg: 'Reg D 506(c)', progress: 84, raised: '$4.20M', target: '$5.0M', bar: 'a' },
          { name: 'Summit Industrial Credit Facility', status: 'Live' as const, tag: 'SICF', val: '$8.0M', yield: '11.5%', investors: '54', reg: 'Reg D 506(b)', progress: 85, raised: '$6.80M', target: '$8.0M', bar: 'b' },
          { name: 'Apex Data Center — Phoenix, AZ', status: 'Funded' as const, tag: 'ADCP', val: '$22.0M', yield: '13.1%', investors: '32', reg: 'Reg S', progress: 100, raised: '$4.00M', target: '$4.0M', bar: 'c' },
          { name: 'Crescent Gold Reserve Fund I', status: 'Draft' as const, tag: 'CGRF', val: '$19.8M', yield: '—', investors: '0', reg: 'Pending', progress: 0, raised: '$0.00M', target: '$6.0M', bar: 'draft' },
        ].map((asset, i) => (
          <div
            key={i}
            className="group flex cursor-pointer flex-col gap-4 rounded-3xl border border-card-border bg-card p-6 shadow-sm transition-colors hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-lg">🏢</div>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">{asset.name}</h4>
                    {asset.status === 'Live' ? (
                      <span className="rounded-md border border-status-live-border bg-status-live-bg px-2 py-0.5 text-[10px] font-bold text-status-live-text">
                        Live
                      </span>
                    ) : asset.status === 'Funded' ? (
                      <span className="rounded-md border border-status-funded-border bg-status-funded-bg px-2 py-0.5 text-[10px] font-bold text-status-funded-text">
                        Funded
                      </span>
                    ) : (
                      <span className="rounded-md border border-status-draft-border bg-status-draft-bg px-2 py-0.5 text-[10px] font-bold text-status-draft-text">
                        {asset.status}
                      </span>
                    )}
                    <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      {asset.tag}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-text-muted">
                    Valuation: {asset.val} · Yield: <span className="font-bold text-foreground">{asset.yield}</span> · Investors:{' '}
                    {asset.investors} · {asset.reg}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-foreground">{asset.progress}%</span>
                <svg
                  className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-[10px] font-medium text-text-muted">
                {asset.raised} raised of {asset.target}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full ${ASSET_BAR_CLASS[asset.bar] ?? ASSET_BAR_CLASS.draft}`}
                  style={{ width: `${asset.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-ui-success-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-success-text text-ui-success-text">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-ui-success-text">7</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ui-success-text">KYC Approved</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-alert-warn-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-alert-warn-icon text-alert-warn-icon">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-alert-warn-title">2</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-alert-warn-title">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-ui-danger-muted/40 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-danger-text text-ui-danger-text">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-ui-danger-text">1</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ui-danger-text">Action Required</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 mt-8">
        <h3 className="text-lg font-bold text-foreground">Investor Registry</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search investors..." className="pl-9 pr-4 py-2 bg-card border border-card-border rounded-full text-xs outline-none focus:border-primary text-foreground w-64" />
          </div>
          <button className="px-4 py-2 bg-card border border-card-border hover:bg-surface transition-colors rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </button>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface border-b border-card-border">
            <tr>
              {['Investor', 'KYC Status', 'Accreditation', 'Commitment', 'Asset', 'Jurisdiction', 'Source', 'Join Date'].map(h => (
                <th key={h} className="px-6 py-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { init: 'EH', chip: 1, name: 'Eleanor Hayes', email: 'e.hayes@thornfund.com', status: 'KYC Approved', acc: 'KYC Approved', val: '$150,000', asset: 'Peachtree Tower', jur: 'New York, US', source: 'Direct', date: '03/12/2026' },
              { init: 'MO', chip: 2, name: 'Marcus Osei', email: 'm.osei@capitalgroup.com', status: 'KYC Approved', acc: 'KYC Approved', val: '$250,000', asset: 'Peachtree Tower', jur: 'California, US', source: 'Referral', date: '03/05/2026' },
              { init: 'YT', chip: 3, name: 'Yuki Tanaka', email: 'y.tanaka@nomura-private.jp', status: 'KYC Approved', acc: 'KYC Approved', val: '$500,000', asset: 'Summit Credit', jur: 'Japan', source: 'Reg S', date: '02/18/2026' },
              { init: 'PM', chip: 4, name: 'Priya Mehta', email: 'p.mehta@crescentfamily.com', status: 'KYC Pending', acc: 'KYC Pending', val: '$80,000', asset: 'Peachtree Tower', jur: 'Texas, US', source: 'Direct', date: '04/01/2026' },
              { init: 'RO', chip: 5, name: 'Raymond Okafor', email: 'r.okafor@oakridge.io', status: 'KYC Approved', acc: 'KYC Approved', val: '$300,000', asset: 'Summit Credit', jur: 'Georgia, US', source: 'Platform', date: '02/28/2026' },
              { init: 'SL', chip: 6, name: 'Sophia Lindqvist', email: 's.lindqvist@nordicvc.se', status: 'KYC Approved', acc: 'KYC Approved', val: '$400,000', asset: 'Apex Data Ctr', jur: 'Sweden', source: 'Reg S', date: '01/15/2026' },
            ].map((inv, i) => (
              <tr key={i} className="transition-colors hover:bg-surface">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${REGISTRY_CHIP_CLASS[inv.chip]}`}
                    >
                      {inv.init}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{inv.name}</p>
                      <p className="text-[10px] text-text-muted">{inv.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      inv.status.includes('Approved')
                        ? 'border-ui-success-border/60 bg-ui-success-bg-soft text-ui-success-text'
                        : 'border-alert-warn-border bg-alert-warn-bg text-alert-warn-title'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      inv.acc.includes('Approved')
                        ? 'border-ui-success-border/60 bg-ui-success-bg-soft text-ui-success-text'
                        : 'border-alert-warn-border bg-alert-warn-bg text-alert-warn-title'
                    }`}
                  >
                    {inv.acc}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{inv.val}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.asset}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.jur}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.source}</td>
                <td className="px-6 py-4 text-[11px] text-text-muted">{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCapTable = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Cap Table</h3>
          <p className="text-xs text-text-muted">10 investors · $2.41M invested · $119K distributed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search investor..." className="pl-9 pr-4 py-2 bg-card border border-card-border rounded-full text-xs outline-none focus:border-primary text-foreground w-64" />
          </div>
          <button className="px-4 py-2 bg-card border border-card-border hover:bg-surface transition-colors rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface border-b border-card-border">
            <tr>
              {['Investor', 'Asset / Token', 'Tokens', 'Ownership %', 'Invested', 'Distributions', 'Jurisdiction', 'Join Date', 'Status'].map(h => (
                <th key={h} className="px-6 py-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { init: 'YT', cap: 'yt', name: 'Yuki Tanaka', email: 'y.tanaka@nomura-private.jp', asset: 'Summit Credit', token: 'SICF', tokens: '5,000', own: 6.25, inv: '$500,000', dist: '$28,750', jur: 'Japan (Reg S)', date: '02/18/2026', status: 'Funded' as const },
              { init: 'SL', cap: 'sl', name: 'Sophia Lindqvist', email: 's.lindqvist@nordicvc.se', asset: 'Apex Data Ctr', token: 'ADCP', tokens: '4,000', own: 10.0, inv: '$400,000', dist: '$26,200', jur: 'Sweden (Reg S)', date: '01/15/2026', status: 'Funded' as const },
              { init: 'AD', cap: 'ad', name: 'Amara Diallo', email: 'a.diallo@westlakeadv.com', asset: 'Apex Data Ctr', token: 'ADCP', tokens: '3,500', own: 8.75, inv: '$350,000', dist: '$22,925', jur: 'Illinois, US', date: '01/22/2026', status: 'Funded' as const },
              { init: 'RO', cap: 'ro', name: 'Raymond Okafor', email: 'r.okafor@oakridge.io', asset: 'Summit Credit', token: 'SICF', tokens: '3,000', own: 3.75, inv: '$300,000', dist: '$17,250', jur: 'Georgia, US', date: '02/28/2026', status: 'Funded' as const },
              { init: 'MO', cap: 'mo', name: 'Marcus Osei', email: 'm.osei@capitalgroup.com', asset: 'Peachtree Tower', token: 'PTAT', tokens: '2,500', own: 5.0, inv: '$250,000', dist: '$11,500', jur: 'California, US', date: '03/05/2026', status: 'Funded' as const },
              { init: 'CW', cap: 'cw', name: 'Chen Wei', email: 'c.wei@horizonasset.hk', asset: 'Summit Credit', token: 'SICF', tokens: '2,000', own: 2.5, inv: '$200,000', dist: '—', jur: 'Hong Kong (Reg S)', date: '04/10/2026', status: 'Committed' as const },
              { init: 'EH', cap: 'eh', name: 'Eleanor Hayes', email: 'e.hayes@thornfund.com', asset: 'Peachtree Tower', token: 'PTAT', tokens: '1,500', own: 3.0, inv: '$150,000', dist: '$6,900', jur: 'New York, US', date: '03/12/2026', status: 'Funded' as const },
            ].map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-surface">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${CAP_CHIP_CLASS[row.cap]}`}
                    >
                      {row.init}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{row.name}</p>
                      <p className="text-[10px] text-text-muted">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[12px] font-medium text-foreground mb-1">{row.asset}</p>
                  <span className="px-1.5 py-0.5 bg-surface border border-card-border text-text-muted text-[9px] font-bold rounded uppercase tracking-wider">{row.token}</span>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.tokens}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${row.own * 4}%` }}></div>
                    </div>
                    <span className="text-[12px] font-bold text-text-muted">{row.own.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.inv}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-ui-success-text">{row.dist}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{row.jur}</td>
                <td className="px-6 py-4 text-[11px] text-text-muted">{row.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      row.status === 'Funded'
                        ? 'border-status-funded-border bg-status-funded-bg text-status-funded-text'
                        : 'border-primary/25 bg-ui-accent-tint text-primary'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="p-10 bg-card border border-card-border rounded-[32px] shadow-sm text-center">
      <h3 className="text-lg font-bold text-foreground mb-2">Compliance Engine</h3>
      <p className="text-sm text-text-muted">Real-time OFAC and KYC monitoring active across all assets.</p>
    </div>
  );

  const renderDistributions = () => (
    <div className="p-10 bg-card border border-card-border rounded-[32px] shadow-sm text-center">
      <h3 className="text-lg font-bold text-foreground mb-2">Distributions</h3>
      <p className="text-sm text-text-muted">Yield calculation and payout engine.</p>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-10 bg-card border border-card-border rounded-[32px] shadow-sm text-center">
      <h3 className="text-lg font-bold text-foreground mb-2">Portfolio Analytics</h3>
      <p className="text-sm text-text-muted">Advanced performance metrics and risk analysis.</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <header className="-mx-6 mb-6 flex flex-col gap-3 border-b border-ui-border px-6 py-4 md:-mx-10 md:mb-8 md:flex md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:px-10 md:py-0 lg:mb-10">
          <div className="flex min-w-0 flex-col gap-0.5 md:flex-row md:items-baseline md:gap-2.5">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">Issuer Dashboard</h1>
            <span className="truncate text-xs font-semibold text-primary">Crescent Capital Partners LLC</span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end md:gap-4">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Updated Apr 23, 2026 · 5:24 AM ET</span>
            </div>
            <div className="relative w-full min-w-0 md:w-auto md:max-w-[16rem]">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search investors, assets..."
                className="h-9 w-full rounded-full border border-card-border bg-card py-1.5 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary md:w-64"
              />
            </div>
          </div>
        </header>

        <div className="flex overflow-x-auto border-b border-border pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-6 py-4 transition-all ${
                activeTab === tab.id
                  ? 'border-primary font-bold text-primary'
                  : 'border-transparent font-medium text-text-muted hover:text-foreground'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[13px]">{tab.name}</span>
              {tab.id === 'ai-assistant' && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_2px_var(--card)]" aria-hidden />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'assets' && renderAssets()}
          {activeTab === 'investors' && renderInvestors()}
          {activeTab === 'cap-table' && renderCapTable()}
          {activeTab === 'compliance' && renderCompliance()}
          {activeTab === 'distributions' && renderDistributions()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'ai-assistant' && (
            <div className="space-y-6 rounded-[40px] bg-ui-muted-deep p-20 text-center">
              <div className="text-5xl">🤖</div>
              <h3 className="text-xl font-bold text-foreground">Institutional AI Assistant</h3>
              <p className="text-text-muted max-w-sm mx-auto">Analyze portfolio risk, generate compliance reports, and optimize offering structures with Maxtronize AI.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
