'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Percent,
  Download,
  CheckCircle2,
  ChevronDown,
  Calculator,
  ShieldCheck,
  MoreHorizontal,
  Building2
} from 'lucide-react';

export function HubDistributionsTab() {
  const [distributionType, setDistributionType] = useState('Rental Income');
  const [frequency, setFrequency] = useState('Monthly');
  const [paymentMethod, setPaymentMethod] = useState('USDC');
  const [targetDate, setTargetDate] = useState('');

  const [grossRevenue, setGrossRevenue] = useState('500,000');
  const [operatingExpenses, setOperatingExpenses] = useState('45,000');

  // Calculates pool and yield dynamically
  const gross = parseFloat(grossRevenue.replace(/,/g, '')) || 0;
  const expenses = parseFloat(operatingExpenses.replace(/,/g, '')) || 0;
  const distributablePool = Math.max(0, gross - expenses);
  const expectedYield = gross > 0 ? ((distributablePool / gross) * 10).toFixed(1) : '0.0';

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500 relative pb-28">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="mb-1 text-lg font-bold text-foreground">Yield Distribution</h3>
          <p className="text-base text-text-muted">
            Configure and automate rental income and investor distributions.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] px-5 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/10 transition-all"
        >
          <Calendar className="h-4.5 w-4.5 text-purple-100" />
          <span>Schedule Distribution</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Distributed',
            value: '$4,285,900',
            sub: '+12.5% from last month',
            trendGreen: true,
          },
          {
            label: 'Next Distribution',
            value: 'Oct 15, 2023',
            sub: 'In 12 days',
          },
          {
            label: 'Active Investors',
            value: '1,248',
            sub: '24 new this period',
            showUserIcon: true,
          },
          {
            label: 'Average Yield',
            value: '8.42%',
            sub: 'Net APY after expenses',
            valueClass: 'text-[#7C3AED]'
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[120px]"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{kpi.label}</p>
              <p className={`text-2xl font-extrabold mt-2 leading-none ${kpi.valueClass || 'text-foreground'}`}>{kpi.value}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {kpi.trendGreen && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
              {kpi.showUserIcon && <Users className="h-3.5 w-3.5 text-text-muted" />}
              <span className={`text-[10px] font-bold ${kpi.trendGreen ? 'text-emerald-500' : 'text-text-muted'}`}>
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content split grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Left column: Configuration, Yield Calculator, Compliance Status */}
        <div className="space-y-8">

          {/* Configuration Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Configuration</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">
                  Distribution Type
                </label>
                <div className="relative">
                  <select
                    value={distributionType}
                    onChange={(e) => setDistributionType(e.target.value)}
                    className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground appearance-none focus:outline-none focus:border-primary"
                  >
                    <option value="Rental Income">Rental Income</option>
                    <option value="Dividend Yield">Dividend Yield</option>
                    <option value="Capital Return">Capital Return</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">
                    Frequency
                  </label>
                  <div className="relative">
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground appearance-none focus:outline-none focus:border-primary"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground appearance-none focus:outline-none focus:border-primary"
                    >
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="Bank">Bank Wire</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-text-muted block">
                  Target Date
                </label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Yield Calculator Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]">
                <Calculator className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Yield Calculator</h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted">Gross Revenue</span>
                <div className="relative max-w-[120px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">$</span>
                  <input
                    type="text"
                    value={grossRevenue}
                    onChange={(e) => setGrossRevenue(e.target.value)}
                    className="w-full text-right bg-surface border border-card-border rounded-xl pl-6 pr-3 py-1.5 text-xs font-extrabold text-foreground focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted">Operating Expenses</span>
                <div className="relative max-w-[120px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">$</span>
                  <input
                    type="text"
                    value={operatingExpenses}
                    onChange={(e) => setOperatingExpenses(e.target.value)}
                    className="w-full text-right bg-surface border border-card-border rounded-xl pl-6 pr-3 py-1.5 text-xs font-extrabold text-foreground focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-card-border flex items-center justify-between">
                <span className="text-xs font-black text-foreground">Distributable Pool</span>
                <span className="text-base font-black text-emerald-500">
                  ${distributablePool.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-foreground">Expected Yield</span>
                <span className="text-base font-black text-[#7C3AED]">{expectedYield}%</span>
              </div>
            </div>
          </div>

          {/* Compliance Status Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-base text-foreground">Compliance Status</h4>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Tax Reporting', badge: 'READY', badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50' },
                { label: 'KYC Status', badge: '98.2% VERIFIED', badgeClass: 'bg-purple-50 text-[#7C3AED] dark:bg-purple-950/30 border border-[#DDD6FE] dark:border-purple-900/50' },
                { label: 'AML Screening', badge: 'CLEAR', badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-text-muted">{item.label}</span>
                  <span className={`rounded-md px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Execution Timeline & Investor Preview */}
        <div className="lg:col-span-2 space-y-8">

          {/* Execution Timeline Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Execution Timeline</h4>

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center py-2 px-2">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-purple-100 dark:bg-purple-950/30 md:left-4 md:right-4 md:top-4 md:h-0.5 md:w-auto" />

              {[
                { label: 'COMPLETED', date: 'Sep 15 Distribution', status: 'completed' },
                { label: 'PROCESSING', date: 'Oct 01 Prep', status: 'processing' },
                { label: 'UPCOMING', date: 'Oct 15 Payment', status: 'upcoming', icon: Calendar },
                { label: 'UPCOMING', date: 'Nov 15 Payment', status: 'upcoming', icon: Clock },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative flex items-center gap-4 md:flex-col md:gap-3 md:text-center flex-1 z-10">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${step.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : step.status === 'processing'
                          ? 'border-[#7C3AED] bg-[#7C3AED] text-white ring-4 ring-purple-100 dark:ring-purple-950/40'
                          : 'border-card-border bg-card text-text-muted'
                        }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      ) : step.status === 'processing' ? (
                        <div className="h-4.5 w-4.5 flex items-center justify-center font-bold text-xs select-none">↻</div>
                      ) : (
                        Icon && <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-wider block ${step.status === 'completed' ? 'text-emerald-500' : step.status === 'processing' ? 'text-[#7C3AED]' : 'text-text-muted'
                        }`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted mt-0.5 block">{step.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Investor Distribution Preview Card */}
          <div className="rounded-3xl border border-card-border bg-card shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-card-border bg-card">
              <h4 className="font-extrabold text-foreground text-base">
                Investor Distribution Preview
              </h4>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto min-w-0">
              <table className="w-full whitespace-nowrap text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border bg-surface/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="px-6 py-4">Investor</th>
                    <th className="px-6 py-4">Ownership %</th>
                    <th className="px-6 py-4">Distribution</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {[
                    {
                      name: 'Global Fund Alpha',
                      addr: '0x71C...4f9',
                      code: 'GF',
                      bg: 'bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED]',
                      ownership: '14.56%',
                      distribution: '$65,975.00',
                      method: 'USDC',
                      status: 'ELIGIBLE',
                      statusClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50',
                    },
                    {
                      name: 'Liberty Management',
                      addr: '0x220...12A',
                      code: 'LM',
                      bg: 'bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED]',
                      ownership: '8.28%',
                      distribution: '$37,310.00',
                      method: 'Bank',
                      status: 'ELIGIBLE',
                      statusClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50',
                    },
                    {
                      name: 'Summit Capital',
                      addr: '0x448...99F',
                      code: 'SC',
                      bg: 'bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED]',
                      ownership: '5.75%',
                      distribution: '$26,162.50',
                      method: 'USDT',
                      status: 'PENDING KYC',
                      statusClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-100 dark:border-amber-900/50',
                    },
                    {
                      name: 'Private Investor #42',
                      addr: '0x11A...08E',
                      code: 'PI',
                      bg: 'bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED]',
                      ownership: '1.26%',
                      distribution: '$5,460.00',
                      method: 'USDC',
                      status: 'ELIGIBLE',
                      statusClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs ${row.bg}`}>
                            {row.code}
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-foreground">{row.name}</p>
                            <span className="font-mono text-[9px] text-text-muted">{row.addr}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-text-muted">
                        {row.ownership}
                      </td>
                      <td className="px-6 py-4 text-xs font-extrabold text-[#7C3AED]">
                        {row.distribution}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs font-semibold text-text-muted">
                          {row.method === 'Bank' ? (
                            <Building2 className="h-3.5 w-3.5 text-text-muted" />
                          ) : (
                            <div className="h-3.5 w-3.5 flex items-center justify-center font-bold text-[9px] rounded-full border border-gray-400 leading-none text-text-muted select-none">B</div>
                          )}
                          <span>{row.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-black tracking-wider uppercase border ${row.statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-text-muted hover:text-foreground transition-colors p-1">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-card-border p-4 bg-card text-center">
              <button
                type="button"
                className="text-[10px] font-black tracking-widest text-[#7C3AED] hover:underline uppercase transition-colors"
              >
                VIEW ALL 1,248 INVESTORS
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Action Bar / Bottom-Right confirmation */}
      <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-3xl border border-card-border bg-card p-5 shadow-2xl flex items-center justify-between gap-6 animate-in slide-in-from-bottom-5 duration-500">
        <div>
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
            Review distribution totals before scheduling.
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs font-bold text-text-muted">Total Batch:</span>
            <span className="text-base font-black text-[#7C3AED]">
              ${distributablePool.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-purple-500/10 transition-all whitespace-nowrap"
        >
          Finalize & Schedule
        </button>
      </div>

    </div>
  );
}
