'use client';

import {
  Briefcase,
  ExternalLink,
  Filter,
  Globe2,
  Lock,
  TrendingUp,
  Unlock,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type FilterType =
  | 'All Assets'
  | 'Commercial RE'
  | 'Infrastructure'
  | 'Residential'
  | 'Private Equity'
  | 'Art & Col.';

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const NAV_M = [95, 100, 105, 108, 110, 115, 120];
const Y_MAX = 140;

function buildNavPath(
  values: number[],
  left: number,
  width: number,
  top: number,
  height: number,
  maxY: number,
) {
  const n = values.length;
  return values
    .map((v, i) => {
      const x = left + (i / (n - 1)) * width;
      const y = top + height - (v / maxY) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildNavAreaPath(
  values: number[],
  left: number,
  width: number,
  top: number,
  height: number,
  maxY: number,
  baselineY: number,
) {
  const n = values.length;
  const pts = values.map((v, i) => {
    const x = left + (i / (n - 1)) * width;
    const y = top + height - (v / maxY) * height;
    return { x, y };
  });
  let d = `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ` L ${pts[n - 1].x} ${baselineY} Z`;
  return d;
}

const DEMO_ASSETS = [
  {
    id: 'ponyc',
    name: 'Prime Office Tower',
    ticker: 'PONYC',
    location: 'New York, NY',
    compliance: 'US · Reg D',
    status: 'Active' as const,
    tokenPrice: '$7.83',
    priceChange: '+4.2%',
    up: true,
    nav: '$33.2M',
    apy: '9.1%',
    investors: '1,204',
    lockup: 'Unlocked',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    category: 'Commercial RE' as FilterType,
  },
  {
    id: 'sfatx',
    name: 'Solar Farm Alpha',
    ticker: 'SFATX',
    location: 'Austin, TX',
    compliance: 'US · Reg D',
    status: 'Raising' as const,
    tokenPrice: '$4.51',
    priceChange: '+2.1%',
    up: true,
    nav: '$8.2M',
    apy: '7.4%',
    investors: '512',
    lockup: '6 months',
    image:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
    category: 'Infrastructure' as FilterType,
  },
  {
    id: 'rivr',
    name: 'Riviera Residences',
    ticker: 'RVRE',
    location: "Côte d'Azur, FR",
    compliance: 'EU · MiCA',
    status: 'Raising' as const,
    tokenPrice: '$1.22',
    priceChange: '-0.4%',
    up: false,
    nav: '$1.2M',
    apy: '5.8%',
    investors: '89',
    lockup: '12 months',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    category: 'Residential' as FilterType,
  },
  {
    id: 'logde',
    name: 'Logistics Hub DE',
    ticker: 'LHDE',
    location: 'Frankfurt, DE',
    compliance: 'EU · MiCA',
    status: 'Locked' as const,
    tokenPrice: '$12.60',
    priceChange: '+1.3%',
    up: true,
    nav: '$21.8M',
    apy: '9.3%',
    investors: '419',
    lockup: 'Locked',
    image:
      'https://images.unsplash.com/photo-1494412574653-ff7b073067e4?auto=format&fit=crop&w=900&q=80',
    category: 'Infrastructure' as FilterType,
  },
  {
    id: 'hppe',
    name: 'Harbor Ports PE Fund',
    ticker: 'HPPE',
    location: 'Singapore, SG',
    compliance: 'SG · MAS',
    status: 'Active' as const,
    tokenPrice: '$48.20',
    priceChange: '+6.8%',
    up: true,
    nav: '$54.8M',
    apy: '15.5%',
    investors: '267',
    lockup: 'Unlocked',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    category: 'Private Equity' as FilterType,
  },
  {
    id: 'alp',
    name: 'Alpine Art Collection',
    ticker: 'ALPC',
    location: 'Zurich, CH',
    compliance: 'CH · FINMA',
    status: 'Raising' as const,
    tokenPrice: '$220.00',
    priceChange: '+0.8%',
    up: true,
    nav: '$3.5M',
    apy: '6.8%',
    investors: '47',
    lockup: '24 months',
    image:
      'https://images.unsplash.com/photo-1545989251-0ac6ebc74504?auto=format&fit=crop&w=900&q=80',
    category: 'Art & Col.' as FilterType,
  },
];

const FILTERS: FilterType[] = [
  'All Assets',
  'Commercial RE',
  'Infrastructure',
  'Residential',
  'Private Equity',
  'Art & Col.',
];

const statusStyles = {
  Active: { dot: 'bg-emerald-400', ring: 'border-emerald-500/30' },
  Raising: { dot: 'bg-sky-400', ring: 'border-sky-500/35' },
  Locked: { dot: 'bg-zinc-400', ring: 'border-zinc-500/30' },
} as const;

export default function IssuerPortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All Assets');

  const filtered = useMemo(
    () =>
      activeFilter === 'All Assets'
        ? DEMO_ASSETS
        : DEMO_ASSETS.filter((a) => a.category === activeFilter),
    [activeFilter],
  );

  const chartLeft = 40;
  const chartW = 520;
  const chartTop = 24;
  const chartH = 112;
  const chartBottom = chartTop + chartH;
  const linePath = buildNavPath(NAV_M, chartLeft, chartW, chartTop, chartH, Y_MAX);
  const areaPath = buildNavAreaPath(NAV_M, chartLeft, chartW, chartTop, chartH, Y_MAX, chartBottom);

  return (
    <DashboardLayout>
      <div className="max-w-full min-w-0 space-y-8 pb-10 animate-in fade-in duration-700 md:space-y-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Portfolio</h1>
          <p className="max-w-2xl text-sm font-medium text-ui-faint md:text-[15px]">
            All tokenized assets under management, live on-chain.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-[#5b21b6] via-primary to-[#4c1d95] p-6 text-white shadow-lg md:rounded-3xl md:p-8 xl:col-span-3">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-violet-300/20 blur-2xl" />
            <div className="relative z-10">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/55">Total NAV</p>
              <p className="mb-1 text-3xl font-bold tracking-tight md:text-[2.75rem]">$120.2M</p>
              <p className="mb-5 text-xs font-medium text-white/60">
                {DEMO_ASSETS.length} assets on-chain
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold text-emerald-200">
                ↗ +18.4% YTD
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-3xl md:p-7 xl:col-span-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-ui-strong md:text-[15px]">NAV History</h2>
                <p className="text-[11px] font-medium text-ui-faint">USD Millions · 7-month trend</p>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                +18.4% YTD
              </span>
            </div>
            <div className="max-w-full min-w-0 overflow-hidden">
              <svg
                className="h-36 w-full max-w-full md:h-40"
                viewBox="0 0 600 168"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="NAV history seven month trend"
              >
                <defs>
                  <linearGradient id="issuerPortNavFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" className="[stop-color:var(--primary)]" stopOpacity="0.22" />
                    <stop offset="100%" className="[stop-color:var(--primary)]" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 70, 140].map((tick) => {
                  const y = chartBottom - (tick / Y_MAX) * chartH;
                  return (
                    <g key={tick}>
                      <line
                        x1={chartLeft}
                        y1={y}
                        x2={chartLeft + chartW}
                        y2={y}
                        className="stroke-ui-border"
                        strokeWidth="1"
                        strokeDasharray="4 5"
                      />
                      <text
                        x="32"
                        y={y + 4}
                        textAnchor="end"
                        className="fill-ui-placeholder text-[10px] font-bold"
                      >
                        {tick === 0 ? '$0' : `$${tick}`}
                      </text>
                    </g>
                  );
                })}
                <path d={areaPath} fill="url(#issuerPortNavFill)" />
                <path
                  d={linePath}
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {MONTHS.map((m, i) => {
                  const x = chartLeft + (i / (MONTHS.length - 1)) * chartW;
                  return (
                    <text
                      key={m}
                      x={x}
                      y="162"
                      textAnchor="middle"
                      className="fill-ui-placeholder text-[10px] font-bold"
                    >
                      {m}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1 xl:gap-5">
            <div className="flex items-center gap-4 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-3xl md:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  Total Investors
                </p>
                <p className="text-2xl font-bold text-ui-strong md:text-3xl">3,004</p>
                <p className="text-[11px] font-medium text-ui-faint">Across all assets</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-3xl md:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  Avg. Token Yield
                </p>
                <p className="text-2xl font-bold text-primary md:text-3xl">7.9%</p>
                <p className="text-[11px] font-medium text-ui-faint">Annualized APY</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2 md:gap-2.5">
          <span
            className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ui-border bg-ui-card text-ui-muted-text shadow-sm"
            aria-hidden
          >
            <Filter className="h-4 w-4" strokeWidth={2} />
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2.5 text-left text-[12px] font-bold transition-all md:px-5 md:py-3 md:text-[13px] ${
                activeFilter === f
                  ? 'bg-zinc-900 text-white shadow-md dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border border-ui-border bg-ui-card text-ui-muted-text shadow-sm hover:border-ui-border-strong hover:text-ui-strong'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {filtered.map((asset) => {
            const st = statusStyles[asset.status];
            const lockupLower = asset.lockup.toLowerCase();
            const isHardLocked = lockupLower === 'locked';
            const isUnlocked = lockupLower === 'unlocked';
            const lockupIsDuration =
              !isUnlocked && /month|year|week|day/i.test(asset.lockup);
            return (
              <article
                key={asset.id}
                className="group flex max-w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 md:rounded-3xl"
              >
                <div className="relative h-44 w-full min-h-44 overflow-hidden md:h-48">
                  <Image
                    src={asset.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/10" />
                  <div
                    className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-md ${st.ring}`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}`} />
                    <span className="text-[10px] font-bold tracking-wide text-white">{asset.status}</span>
                  </div>
                  <div className="absolute right-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 px-2.5 backdrop-blur-md">
                    <span className="text-[10px] font-bold tracking-wider text-white">{asset.ticker}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="mb-1 text-lg font-bold leading-tight text-white drop-shadow-md md:text-xl">
                      {asset.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300">
                      <Globe2 className="h-3.5 w-3.5 shrink-0 text-zinc-400" strokeWidth={2} aria-hidden />
                      <span className="line-clamp-2">
                        {asset.location} · {asset.compliance}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col bg-slate-50 p-5 dark:bg-zinc-900 md:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                        Token price
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                        {asset.tokenPrice}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 pt-1 text-sm font-bold ${
                        asset.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {asset.up ? '↗' : '↘'} {asset.priceChange}
                    </span>
                  </div>

                  <div className="mb-5 grid grid-cols-3 gap-3 border-b border-slate-200 pb-5 dark:border-zinc-800">
                    {(
                      [
                        ['NAV', asset.nav],
                        ['APY', asset.apy],
                        ['INVESTORS', asset.investors],
                      ] as const
                    ).map(([label, val]) => (
                      <div key={label} className="min-w-0">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                          {label}
                        </p>
                        <p
                          className={`truncate text-sm font-bold md:text-[15px] ${
                            label === 'APY'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                      {lockupIsDuration ? (
                        <Briefcase className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                      ) : isHardLocked ? (
                        <Lock className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                      ) : (
                        <Unlock className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                      )}
                      <span className="truncate text-[11px] font-semibold">{asset.lockup}</span>
                    </div>
                    <Link
                      href="/issuer/hub"
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/70 bg-transparent px-4 py-2 text-[12px] font-bold text-violet-600 transition-colors hover:bg-violet-500/10 dark:border-violet-400/60 dark:text-violet-300 dark:hover:bg-violet-500/15"
                    >
                      View Details
                      <ExternalLink className="h-3.5 w-3.5 opacity-90" strokeWidth={2} aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
