'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const investorsData = [
  { id: 1, name: 'Eleanor Hayes', email: 'eleanor@hayescap.com', type: 'Accredited', status: 'Approved', investment: '$450,000', assets: 3, lastActive: '2 hours ago' },
  { id: 2, name: 'Marcus Osei', email: 'marcus.osei@gmail.com', type: 'Qualified Purchaser', status: 'Approved', investment: '$1,200,000', assets: 5, lastActive: '5 mins ago' },
  { id: 3, name: 'Sarah Jenkins', email: 'sarah@jenkins.co', type: 'Accredited', status: 'Pending', investment: '$150,000', assets: 1, lastActive: '1 day ago' },
  { id: 4, name: 'David Chen', email: 'd.chen@chenfamily.office', type: 'Institutional', status: 'Approved', investment: '$3,500,000', assets: 12, lastActive: '12 mins ago' },
  { id: 5, name: 'Amara Okafor', email: 'amara@okafor.dev', type: 'Accredited', status: 'Action Required', investment: '$50,000', assets: 0, lastActive: '3 days ago' },
];

const statusStyles: Record<string, { dot: string; text: string }> = {
  Approved: { dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
  Pending: { dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  'Action Required': { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
};

function InvestorAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-primary/5 text-xs font-bold text-primary"
      aria-hidden
    >
      {name
        .split(' ')
        .map((n) => n[0])
        .join('')}
    </div>
  );
}

export default function InvestorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = investorsData.filter(
    (inv) =>
      inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filterBar = (
    <>
      <div className="relative min-w-0 w-full xl:max-w-md xl:flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ui-faint" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          placeholder="Search by name, email, or type..."
          className="w-full rounded-xl border border-transparent bg-ui-muted-deep py-3 pl-12 pr-4 text-[13px] font-medium text-ui-strong outline-none transition-all focus:border-primary/20 focus:bg-ui-input-focus"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:shrink-0">
        <select className="w-full rounded-lg border border-transparent bg-ui-muted-deep px-4 py-2.5 text-xs font-bold text-ui-muted-text outline-none sm:w-auto">
          <option>All Status</option>
          <option>Approved</option>
          <option>Pending</option>
        </select>
        <select className="w-full rounded-lg border border-transparent bg-ui-muted-deep px-4 py-2.5 text-xs font-bold text-ui-muted-text outline-none sm:w-auto">
          <option>All Types</option>
          <option>Accredited</option>
          <option>Institutional</option>
        </select>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6 animate-in fade-in duration-700 sm:space-y-8">
        <header className="flex flex-col gap-4 sm:gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 space-y-1 sm:space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-ui-strong sm:text-3xl xl:text-4xl">Investors</h1>
            <p className="text-sm font-medium text-ui-faint sm:text-base">
              Manage your institutional and accredited investor base.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap xl:w-auto xl:justify-end">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-ui-border bg-ui-card px-5 py-3 text-[13px] font-bold text-ui-strong shadow-sm transition-all hover:bg-ui-muted-deep sm:w-auto sm:px-6"
            >
              <span aria-hidden>📥</span> Export List
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl sm:w-auto sm:px-6"
            >
              <span aria-hidden>➕</span> Invite Investor
            </button>
          </div>
        </header>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
          {[
            { label: 'Total Investors', val: '1,284', trend: '+12%', color: 'text-primary' },
            { label: 'Active Capital', val: '$94.2M', trend: '+$4.1M', color: 'text-green-600 dark:text-green-400' },
            { label: 'Pending KYC', val: '42', trend: '-5', color: 'text-orange-500' },
            { label: 'Avg. Ticket Size', val: '$73.3K', trend: '+8%', color: 'text-purple-600 dark:text-purple-400' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm transition-all hover:border-primary/20 sm:rounded-3xl sm:p-6 xl:rounded-[32px] xl:p-8"
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ui-faint">{stat.label}</p>
              <div className="flex items-end justify-between gap-3">
                <h3 className="text-2xl font-bold tracking-tight tabular-nums text-ui-strong">{stat.val}</h3>
                <span
                  className={`shrink-0 text-[10px] font-bold ${stat.trend.startsWith('+') ? stat.color : 'text-ui-faint'}`}
                >
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet / mobile: search + card list */}
        <div className="space-y-4 lg:hidden">
          <div className="flex flex-col gap-4 rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm sm:p-5">
            {filterBar}
            <p className="text-center text-[11px] font-medium text-ui-faint sm:text-left">
              Showing {filtered.length} of 1,284 investors
            </p>
          </div>

          <div className="space-y-3">
            {filtered.map((inv) => {
              const status = statusStyles[inv.status] ?? statusStyles.Pending;
              return (
                <article
                  key={inv.id}
                  className="rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm sm:p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <InvestorAvatar name={inv.name} />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-ui-strong">{inv.name}</p>
                        <p className="truncate text-[10px] font-medium text-ui-faint">{inv.email}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden />
                      <span className={`text-[10px] font-bold ${status.text}`}>{inv.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-ui-divider pt-3 text-[11px]">
                    <div>
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Type</p>
                      <p className="font-bold text-ui-body">{inv.type}</p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Assets</p>
                      <p className="font-bold text-ui-strong">{inv.assets} Assets</p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Investment</p>
                      <p className="font-bold tabular-nums text-ui-strong">{inv.investment}</p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Last active</p>
                      <p className="font-medium text-ui-faint">{inv.lastActive}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Desktop: table */}
        <div className="hidden min-w-0 overflow-hidden rounded-2xl border border-ui-border bg-ui-card shadow-sm sm:rounded-3xl lg:block xl:rounded-[32px]">
          <div className="flex flex-col gap-4 border-b border-ui-divider p-5 sm:gap-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between xl:p-8">
            {filterBar}
          </div>

          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="border-b border-ui-divider bg-ui-muted-surface">
                <tr>
                  {['Investor', 'Type', 'Status', 'Active Assets', 'Total Investment', 'Last Active', ''].map((h) => (
                    <th
                      key={h || 'actions'}
                      className={`px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-ui-faint xl:px-8 xl:py-5 ${
                        h === 'Investor' ? 'sticky left-0 z-10 bg-ui-muted-surface' : ''
                      } ${h === 'Last Active' ? 'hidden xl:table-cell' : ''} ${h === 'Type' ? 'hidden md:table-cell' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {filtered.map((inv) => {
                  const status = statusStyles[inv.status] ?? statusStyles.Pending;
                  return (
                    <tr key={inv.id} className="group transition-all hover:bg-ui-muted-surface">
                      <td className="sticky left-0 z-10 bg-ui-card px-4 py-5 group-hover:bg-ui-muted-surface xl:px-8 xl:py-6">
                        <div className="flex min-w-[200px] items-center gap-3">
                          <InvestorAvatar name={inv.name} />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-ui-strong">{inv.name}</p>
                            <p className="truncate text-[10px] font-medium text-ui-faint">{inv.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-5 md:table-cell xl:px-8 xl:py-6">
                        <span className="inline-block max-w-[140px] truncate rounded-full bg-ui-muted-deep px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ui-body">
                          {inv.type}
                        </span>
                      </td>
                      <td className="px-4 py-5 xl:px-8 xl:py-6">
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${status.dot}`} aria-hidden />
                          <span className={`whitespace-nowrap text-[11px] font-bold ${status.text}`}>{inv.status}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-[13px] font-bold text-ui-strong xl:px-8 xl:py-6">
                        {inv.assets} Assets
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-[13px] font-bold tabular-nums text-ui-strong xl:px-8 xl:py-6">
                        {inv.investment}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-5 text-[11px] font-medium text-ui-faint xl:table-cell xl:px-8 xl:py-6">
                        {inv.lastActive}
                      </td>
                      <td className="px-4 py-5 text-right xl:px-8 xl:py-6">
                        <button
                          type="button"
                          className="p-2 text-ui-placeholder opacity-0 transition-all hover:text-primary group-hover:opacity-100"
                          aria-label={`Actions for ${inv.name}`}
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-ui-divider bg-ui-muted-deep/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 xl:p-8">
            <p className="text-center text-[11px] font-medium text-ui-faint sm:text-left">
              Showing {filtered.length} of 1,284 investors
            </p>
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-ui-border bg-ui-card p-2 text-ui-faint"
                aria-label="Previous page"
              >
                ←
              </button>
              <button type="button" className="h-8 w-8 rounded-lg bg-primary text-[11px] font-bold text-white shadow-sm">
                1
              </button>
              <button
                type="button"
                className="h-8 w-8 rounded-lg border border-ui-border bg-ui-card text-[11px] font-bold text-ui-faint"
              >
                2
              </button>
              <button
                type="button"
                className="h-8 w-8 rounded-lg border border-ui-border bg-ui-card text-[11px] font-bold text-ui-faint"
              >
                3
              </button>
              <button
                type="button"
                className="rounded-lg border border-ui-border bg-ui-card p-2 text-ui-faint"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
