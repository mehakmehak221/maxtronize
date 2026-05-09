'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type StatusTone = 'success' | 'warn' | 'purple' | 'neutral';

const statusToneClasses: Record<
  StatusTone,
  { pill: string; dot: string }
> = {
  success: {
    pill: 'bg-app-status-success-bg text-app-status-success-fg border-app-status-success-border',
    dot: 'bg-app-status-success-dot',
  },
  warn: {
    pill: 'bg-app-status-warn-bg text-app-status-warn-fg border-app-status-warn-border',
    dot: 'bg-app-status-warn-dot',
  },
  purple: {
    pill: 'bg-app-status-purple-bg text-app-status-purple-fg border-app-status-purple-border',
    dot: 'bg-app-status-purple-dot',
  },
  neutral: {
    pill: 'bg-app-status-neutral-bg text-app-status-neutral-fg border-app-status-neutral-border',
    dot: 'bg-app-status-neutral-dot',
  },
};

export default function ApplicationsPage() {
  const stats = [
    { label: 'Total Value', value: '$182.9M', trend: '+8.2%', sub: 'Across all applications' },
    { label: 'Active Raises', value: '2', trend: '+1 this month', sub: 'Currently fundraising' },
    { label: 'Tokens Issued', value: '18.19M', trend: '+15.4%', sub: 'On-chain supply' },
    { label: 'Avg. Completion', value: '54%', trend: '+6.2%', sub: 'Capital raise progress' },
  ];

  const applications = [
    {
      id: 'APP-001',
      name: 'Prime Office Tower — NYC',
      type: 'Commercial RE · US',
      valuation: '$42.5M',
      tokens: '4,250,000 tokens',
      raised: '$33.2M',
      progress: 78,
      network: 'Ethereum',
      status: 'Active Raise',
      statusTone: 'success' as const,
      filed: 'Oct 01, 2026',
      icon: '🏢',
    },
    {
      id: 'APP-002',
      name: 'Solar Farm Alpha — Texas',
      type: 'Infrastructure · US',
      valuation: '$18.2M',
      tokens: '1,820,000 tokens',
      raised: '$8.2M',
      progress: 45,
      network: 'Polygon',
      status: 'Under Review',
      statusTone: 'warn' as const,
      filed: 'Sep 15, 2026',
      icon: '⚡',
    },
    {
      id: 'APP-003',
      name: 'Logistics Hub DE',
      type: 'Commercial RE · EU',
      valuation: '$31.0M',
      tokens: '3,100,000 tokens',
      raised: '$31.0M',
      progress: 100,
      network: 'Ethereum',
      status: 'Completed',
      statusTone: 'purple' as const,
      filed: 'Jul 20, 2026',
      icon: '📦',
    },
    {
      id: 'APP-004',
      name: 'Riviera Residences',
      type: 'Residential RE · EU',
      valuation: '$9.8M',
      tokens: '980,000 tokens',
      raised: '$1.2M',
      progress: 12,
      network: 'Ethereum',
      status: 'Draft',
      statusTone: 'neutral' as const,
      filed: 'Oct 18, 2026',
      icon: '🏠',
    },
    {
      id: 'APP-005',
      name: 'Harbor Ports PE Fund',
      type: 'Private Equity · SG',
      valuation: '$75.0M',
      tokens: '7,500,000 tokens',
      raised: '$45.0M',
      progress: 60,
      network: 'Ethereum',
      status: 'Active Raise',
      statusTone: 'success' as const,
      filed: 'Aug 10, 2026',
      icon: '⚓',
    },
    {
      id: 'APP-006',
      name: 'Alpine Art Collection',
      type: 'Art & Collectibles · CH',
      valuation: '$5.4M',
      tokens: '540,000 tokens',
      raised: '$1.6M',
      progress: 30,
      network: 'Algorand',
      status: 'Under Review',
      statusTone: 'warn' as const,
      filed: 'Oct 05, 2026',
      icon: '🎨',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Applications</h1>
            <p className="text-sm text-ui-faint font-medium">
              Track tokenization applications across all jurisdictions and asset classes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-ui-card border border-ui-border rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group"
            >
              <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-ui-strong tracking-tight">{stat.value}</span>
                <span className="text-[11px] font-bold text-ui-success-icon flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
                  </svg>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[11px] text-ui-faint font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 p-1 bg-dash-filter-rail-bg rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-hide border border-ui-border/60">
            {[
              { name: 'All Applications', count: 6 },
              { name: 'Active', count: 2 },
              { name: 'Under Review', count: 2 },
              { name: 'Completed', count: 1 },
              { name: 'Draft', count: 1 },
            ].map((filter, i) => (
              <button
                key={filter.name}
                type="button"
                className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 shrink-0 ${
                  i === 0
                    ? 'bg-dash-filter-active-bg text-dash-filter-active-fg shadow-lg'
                    : 'text-dash-filter-inactive-fg hover:text-dash-filter-inactive-hover-fg'
                }`}
              >
                {filter.name}
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                    i === 0 ? 'bg-dash-filter-active-badge-bg' : 'bg-dash-filter-count-bg'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative group">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint group-focus-within:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-11 pr-6 py-3.5 bg-ui-card border border-ui-border rounded-2xl text-[13px] font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 w-full md:w-80 transition-all shadow-sm placeholder:text-ui-placeholder"
            />
          </div>
        </div>

        <div className="bg-ui-card border border-ui-border rounded-[32px] overflow-hidden shadow-sm overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-ui-muted-surface border-b border-ui-border">
                  <th className="px-8 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest">Asset</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest">Valuation</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest">Capital Raised</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest">Network</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest text-right">Filed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {applications.map((app) => {
                  const tone = statusToneClasses[app.statusTone];
                  return (
                    <tr key={app.id} className="hover:bg-ui-muted-surface/50 transition-colors group cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-ui-muted-deep flex items-center justify-center text-xl shadow-sm border border-ui-border group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                            {app.icon}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-ui-strong mb-0.5">{app.name}</p>
                            <p className="text-[10px] font-medium text-ui-faint tracking-wide uppercase">
                              <span className="text-primary font-bold">{app.id}</span> · {app.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-[13px] font-bold text-ui-strong">{app.valuation}</p>
                          <p className="text-[10px] font-medium text-ui-faint">{app.tokens}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="max-w-[140px] space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-bold text-ui-strong">{app.raised}</p>
                            <p className="text-[11px] font-bold text-ui-faint">{app.progress}%</p>
                          </div>
                          <div className="w-full h-1.5 bg-progress-track rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${app.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                              style={{ width: `${app.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1.5 bg-network-badge-bg text-network-badge-fg rounded-lg text-[11px] font-bold border border-network-badge-border">
                          {app.network}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-2 w-fit ${tone.pill}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-[12px] font-bold text-ui-faint">{app.filed}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
