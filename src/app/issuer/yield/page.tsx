'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Calendar,
  CalendarClock,
  Clock,
  Coins,
  Download,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const iconStroke = 1.75;

type YieldStatCard = {
  label: string;
  value: string;
  sub: string;
  Icon: LucideIcon;
  variant: 'primary' | 'default';
};

const YIELD_STATS: YieldStatCard[] = [
  {
    label: 'Total Distributed',
    value: '$6.98M',
    sub: 'All-time platform total',
    Icon: Coins,
    variant: 'primary',
  },
  {
    label: 'YTD Distributions',
    value: '$600K',
    sub: '+34.2% vs prior year',
    Icon: TrendingUp,
    variant: 'default',
  },
  {
    label: 'Portfolio Avg APY',
    value: '7.9%',
    sub: 'Weighted by NAV',
    Icon: BarChart3,
    variant: 'default',
  },
  {
    label: 'Next Distribution',
    value: 'Nov 01',
    sub: 'Riviera Residences · $2.1K',
    Icon: Calendar,
    variant: 'default',
  },
];

const APY_ASSETS = [
  { name: 'HPPE', pct: 12.3, dot: 'bg-[#7C3AED]', bar: 'bg-[#7C3AED]' },
  { name: 'PONYC', pct: 9.1, dot: 'bg-[#8B5CF6]', bar: 'bg-[#8B5CF6]' },
  { name: 'LHDE', pct: 8.6, dot: 'bg-[#A78BFA]', bar: 'bg-[#A78BFA]' },
  { name: 'SFATX', pct: 7.4, dot: 'bg-[#C4B5FD]', bar: 'bg-[#C4B5FD]' },
  { name: 'RVRE', pct: 5.8, dot: 'bg-[#DDD6FE]', bar: 'bg-[#DDD6FE]' },
  { name: 'AALP', pct: 4.2, dot: 'bg-[#EDE9FE]', bar: 'bg-[#EDE9FE]' },
];

const MAX_APY = 12.3;

const DIST_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const DIST_VALUES_K = [32, 38, 45, 28, 42, 48, 55, 62, 68, 74, 82, 95];
const DIST_MAX_K = 120;

const UPCOMING_PAYOUTS = [
  {
    name: 'Riviera Residences',
    type: 'Rent Yield',
    date: 'Nov 01',
    amount: '$2,100',
    highlight: true,
  },
  {
    name: 'Prime Office Tower',
    type: 'Q4 Distribution',
    date: 'Dec 31',
    amount: '$312,400',
    highlight: false,
  },
  {
    name: 'Solar Farm Alpha',
    type: 'Q4 Distribution',
    date: 'Dec 15',
    amount: '$78,200',
    highlight: false,
  },
  {
    name: 'Harbor Ports PE',
    type: 'Q4 Distribution',
    date: 'Jan 01',
    amount: '$892,000',
    highlight: false,
  },
];

type BreakdownStatus = 'Above Target' | 'On Track' | 'Below Target';

const BREAKDOWN: {
  name: string;
  tag: string;
  dot: string;
  apy: string;
  total: string;
  freq: string;
  last: string;
  next: string;
  status: BreakdownStatus;
}[] = [
  {
    name: 'Harbor Ports PE',
    tag: 'HPPE',
    dot: 'bg-[#7C3AED]',
    apy: '12.3%',
    total: '$3.42M',
    freq: 'Quarterly',
    last: 'Oct 01, 2026',
    next: 'Jan 01, 2027',
    status: 'Above Target',
  },
  {
    name: 'Prime Office Tower',
    tag: 'PONYC',
    dot: 'bg-[#8B5CF6]',
    apy: '9.1%',
    total: '$1.24M',
    freq: 'Quarterly',
    last: 'Sep 30, 2026',
    next: 'Dec 31, 2026',
    status: 'Above Target',
  },
  {
    name: 'Logistics Hub DE',
    tag: 'LHDE',
    dot: 'bg-[#A78BFA]',
    apy: '8.6%',
    total: '$2.08M',
    freq: 'Quarterly',
    last: 'Sep 30, 2026',
    next: 'Dec 31, 2026',
    status: 'On Track',
  },
  {
    name: 'Solar Farm Alpha',
    tag: 'SFATX',
    dot: 'bg-[#C4B5FD]',
    apy: '7.4%',
    total: '$186K',
    freq: 'Quarterly',
    last: 'Sep 15, 2026',
    next: 'Dec 15, 2026',
    status: 'On Track',
  },
  {
    name: 'Riviera Residences',
    tag: 'RVRE',
    dot: 'bg-[#DDD6FE]',
    apy: '5.8%',
    total: '$12K',
    freq: 'Monthly',
    last: 'Aug 01, 2026',
    next: 'Nov 01, 2026',
    status: 'On Track',
  },
  {
    name: 'Alpine Art Collection',
    tag: 'AALP',
    dot: 'bg-[#EDE9FE]',
    apy: '4.2%',
    total: '$42K',
    freq: 'Semi-Annual',
    last: 'Jun 30, 2026',
    next: 'Dec 31, 2026',
    status: 'Below Target',
  },
];

const STATUS_STYLES: Record<
  BreakdownStatus,
  { pill: string; dot: string }
> = {
  'Above Target': {
    pill: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg',
    dot: 'bg-emerald-500',
  },
  'On Track': {
    pill: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  'Below Target': {
    pill: 'border-app-status-warn-border bg-app-status-warn-bg text-app-status-warn-fg',
    dot: 'bg-amber-500',
  },
};

function YieldStatCardUI({ stat }: { stat: YieldStatCard }) {
  const isPrimary = stat.variant === 'primary';
  const Icon = stat.Icon;

  return (
    <div
      className={
        isPrimary
          ? 'flex min-h-[168px] flex-col justify-between rounded-[24px] bg-linear-to-br from-[#9810FA] to-[#4F39F6] p-7 shadow-[0_16px_40px_-12px_rgba(152,16,250,0.45)] md:p-8'
          : 'flex min-h-[168px] flex-col justify-between rounded-[24px] border border-ui-border bg-ui-card p-7 shadow-sm md:p-8'
      }
    >
      <div
        className={
          isPrimary
            ? 'flex h-11 w-11 items-center justify-center rounded-xl bg-ui-card/20 text-white'
            : 'flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED]'
        }
      >
        <Icon className="h-5 w-5" strokeWidth={iconStroke} />
      </div>
      <div>
        <p
          className={`mb-2 text-[10px] font-bold uppercase tracking-[0.12em] ${
            isPrimary ? 'text-white/70' : 'text-ui-faint'
          }`}
        >
          {stat.label}
        </p>
        <p className={`text-[32px] font-bold leading-none tracking-tight ${isPrimary ? 'text-white' : 'text-ui-strong'}`}>
          {stat.value}
        </p>
        <p className={`mt-2 text-[13px] font-medium ${isPrimary ? 'text-white/65' : 'text-ui-faint'}`}>
          {stat.sub}
        </p>
      </div>
    </div>
  );
}

function buildAreaPath(
  values: number[],
  chartLeft: number,
  chartW: number,
  chartTop: number,
  chartH: number,
  maxVal: number,
  baselineY: number,
) {
  const n = values.length;
  const pts = values.map((v, i) => {
    const x = chartLeft + (i / (n - 1)) * chartW;
    const y = chartTop + chartH - (v / maxVal) * chartH;
    return { x, y };
  });
  let d = `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ` L ${pts[n - 1].x} ${baselineY} Z`;
  return d;
}

function DistributionScheduleChart({ mode }: { mode: 'bar' | 'area' }) {
  const chartLeft = 48;
  const chartW = 572;
  const chartTop = 20;
  const chartH = 140;
  const chartBottom = chartTop + chartH;
  const barW = 28;
  const n = DIST_VALUES_K.length;
  const gap = chartW / n;

  const yTicks = [0, 30, 60, 90, 120];

  const areaPath = buildAreaPath(
    DIST_VALUES_K,
    chartLeft,
    chartW,
    chartTop,
    chartH,
    DIST_MAX_K,
    chartBottom,
  );

  return (
    <div className="motion-chart relative min-w-0 overflow-x-auto">
      <svg
        className="block h-auto min-h-[200px] w-full max-w-full"
        viewBox="0 0 640 200"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Monthly distribution schedule"
      >
        <defs>
          <linearGradient id="yieldDistAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9810FA" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9810FA" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((k) => {
          const y = chartBottom - (k / DIST_MAX_K) * chartH;
          return (
            <g key={k}>
              <line
                x1={chartLeft}
                y1={y}
                x2={chartLeft + chartW}
                y2={y}
                stroke="var(--ui-border)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <text x={chartLeft - 6} y={y + 4} textAnchor="end" fill="#9CA3AF" className="text-[10px] font-bold">
                {k === 0 ? '$0K' : `$${k}K`}
              </text>
            </g>
          );
        })}

        {mode === 'area' ? (
          <>
            <path d={areaPath} fill="url(#yieldDistAreaFill)" />
            <path
              d={buildLinePath(DIST_VALUES_K, chartLeft, chartW, chartTop, chartH, DIST_MAX_K)}
              fill="none"
              stroke="#9810FA"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {DIST_VALUES_K.map((v, i) => {
              const x = chartLeft + (i / (n - 1)) * chartW;
              const y = chartTop + chartH - (v / DIST_MAX_K) * chartH;
              return <circle key={i} cx={x} cy={y} r="4" fill="#9810FA" />;
            })}
          </>
        ) : (
          DIST_VALUES_K.map((v, i) => {
            const barH = (v / DIST_MAX_K) * chartH;
            const x = chartLeft + i * gap + (gap - barW) / 2;
            const y = chartBottom - barH;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx="4"
                ry="4"
                fill="#9810FA"
                className="motion-bar-grow"
                style={{ animationDelay: `${i * 40}ms` }}
              />
            );
          })
        )}

        {DIST_MONTHS.map((m, i) => {
          const x = chartLeft + i * gap + gap / 2;
          return (
            <text
              key={m}
              x={x}
              y={chartBottom + 22}
              textAnchor="middle"
              fill="#9CA3AF"
              className="text-[10px] font-bold uppercase"
            >
              {m}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function buildLinePath(
  values: number[],
  chartLeft: number,
  chartW: number,
  chartTop: number,
  chartH: number,
  maxVal: number,
) {
  const n = values.length;
  return values
    .map((v, i) => {
      const x = chartLeft + (i / (n - 1)) * chartW;
      const y = chartTop + chartH - (v / maxVal) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function YieldPage() {
  const [chartMode, setChartMode] = useState<'bar' | 'area'>('bar');

  return (
    <DashboardLayout>
      <div className="animate-page-enter space-y-8 md:space-y-10">
        <div className="animate-slide-up space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Yield</h1>
          <p className="text-sm font-medium text-ui-muted-text">
            Track distributions, APY performance, and upcoming payout schedules.
          </p>
        </div>

        <div className="motion-stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {YIELD_STATS.map((stat) => (
            <YieldStatCardUI key={stat.label} stat={stat} />
          ))}
        </div>

        {/* APY + Distribution chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="animate-slide-up delay-100 rounded-[24px] border border-ui-border bg-ui-card p-7 shadow-sm md:p-8 lg:col-span-1">
            <div className="mb-8">
              <h3 className="mb-1 text-[15px] font-bold text-ui-strong">APY by Asset</h3>
              <p className="text-xs font-medium text-ui-faint">Annualized yield performance</p>
            </div>
            <div className="space-y-5">
              {APY_ASSETS.map((asset) => (
                <div key={asset.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${asset.dot}`} />
                      <span className="text-[12px] font-bold text-ui-body">{asset.name}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#7C3AED]">{asset.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ui-muted-deep">
                    <div
                      className={`h-full rounded-full ${asset.bar}`}
                      style={{ width: `${(asset.pct / MAX_APY) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slide-up delay-200 lg:col-span-2 flex flex-col rounded-[24px] border border-ui-border bg-ui-card p-7 shadow-sm md:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="mb-1 text-[15px] font-bold text-ui-strong">Distribution Schedule</h3>
                <p className="text-xs font-medium text-ui-faint">
                  Monthly distributions vs. projected (USD Thousands)
                </p>
              </div>
              <div className="flex shrink-0 gap-1 rounded-lg bg-ui-muted-deep p-1">
                <button
                  type="button"
                  onClick={() => setChartMode('bar')}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition-all ${
                    chartMode === 'bar'
                      ? 'bg-ui-card text-ui-strong shadow-sm'
                      : 'text-ui-faint hover:text-ui-muted-text'
                  }`}
                >
                  Bar
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('area')}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition-all ${
                    chartMode === 'area'
                      ? 'bg-ui-card text-ui-strong shadow-sm'
                      : 'text-ui-faint hover:text-ui-muted-text'
                  }`}
                >
                  Area
                </button>
              </div>
            </div>

            <DistributionScheduleChart mode={chartMode} />

            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-ui-border pt-6 sm:grid-cols-3 sm:gap-8 sm:pt-8">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  Distributed YTD
                </p>
                <p className="text-xl font-bold text-ui-strong">$600K</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  EOY Projection
                </p>
                <p className="text-xl font-bold text-ui-strong">$1.04M</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  Achievement Rate
                </p>
                <p className="text-xl font-bold text-ui-success-text">57.7%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Payouts */}
        <div className="animate-slide-up delay-300 rounded-[24px] border border-ui-border bg-ui-card p-7 shadow-sm md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED]">
              <CalendarClock className="h-5 w-5" strokeWidth={iconStroke} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-ui-strong">Upcoming Payouts</h3>
              <p className="text-xs font-medium text-ui-faint">Scheduled distributions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {UPCOMING_PAYOUTS.map((p) =>
              p.highlight ? (
                <div
                  key={p.name}
                  className="relative flex flex-col justify-between rounded-[20px] border border-amber-200/80 bg-[#FFFBEB] dark:border-amber-900/40 dark:bg-amber-950/25 p-6"
                >
                  <Clock
                    className="absolute right-5 top-5 h-4 w-4 text-amber-500"
                    strokeWidth={iconStroke}
                    aria-hidden
                  />
                  <div className="space-y-1 pr-8">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-amber-600">
                      {p.date}
                    </span>
                    <h4 className="truncate text-sm font-bold text-ui-strong">{p.name}</h4>
                    <p className="text-[11px] font-medium text-ui-muted-text">{p.type}</p>
                  </div>
                  <p className="mt-6 text-2xl font-bold text-ui-success-text">{p.amount}</p>
                </div>
              ) : (
                <div
                  key={p.name}
                  className="flex flex-col justify-between rounded-[20px] border border-ui-border bg-ui-card p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-[#7C3AED]">
                      {p.date}
                    </span>
                    <h4 className="truncate text-sm font-bold text-ui-strong">{p.name}</h4>
                    <p className="text-[11px] font-medium text-ui-muted-text">{p.type}</p>
                  </div>
                  <p className="mt-6 text-2xl font-bold text-ui-success-text">{p.amount}</p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Asset Yield Breakdown */}
        <div className="animate-slide-up delay-400 overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-ui-border px-7 py-6 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-7">
            <div>
              <h3 className="mb-1 text-[15px] font-bold text-ui-strong">Asset Yield Breakdown</h3>
              <p className="text-xs font-medium text-ui-faint">
                Individual APY performance and distribution schedules
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ui-border bg-ui-card px-5 py-2.5 text-[11px] font-bold text-ui-body shadow-sm transition-colors hover:bg-ui-muted"
            >
              <Download className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-ui-border bg-ui-muted">
                  {['Asset', 'APY', 'Total Distributed', 'Frequency', 'Last Payout', 'Next Payout', 'Status'].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ui-faint first:pl-8 last:pr-8 md:px-8 md:py-5"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {BREAKDOWN.map((row) => {
                  const statusStyle = STATUS_STYLES[row.status];
                  return (
                    <tr key={row.tag} className="transition-colors hover:bg-ui-muted">
                      <td className="px-6 py-5 first:pl-8 md:px-8 md:py-6">
                        <div className="flex items-center gap-3">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${row.dot}`} />
                          <div>
                            <p className="text-[13px] font-bold text-ui-strong">{row.name}</p>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                              {row.tag}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <span className="text-[13px] font-bold text-ui-success-text">{row.apy}</span>
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <span className="text-[13px] font-bold text-ui-strong">{row.total}</span>
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <span className="inline-flex rounded-lg border border-ui-border bg-ui-muted-deep px-3 py-1 text-[10px] font-bold text-ui-body">
                          {row.freq}
                        </span>
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <span className="text-[12px] font-medium text-ui-muted-text">{row.last}</span>
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <span className="text-[12px] font-bold text-ui-strong">{row.next}</span>
                      </td>
                      <td className="px-6 py-5 last:pr-8 md:px-8 md:py-6">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold ${statusStyle.pill}`}
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyle.dot}`} />
                          {row.status}
                        </span>
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
