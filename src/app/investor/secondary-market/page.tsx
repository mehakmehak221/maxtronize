'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Building2,
  Filter,
  Globe,
  Info,
  Pickaxe,
  Search,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import InvestorLayout from '@/components/InvestorLayout';

const iconStroke = 1.75;

type StatCard = {
  label: string;
  val: string;
  trend: string;
  up: boolean;
};

const STATS: StatCard[] = [
  { label: '24H Volume', val: '$2.8M', trend: '+12.4%', up: true },
  { label: 'Total Listings', val: '847', trend: '+42', up: true },
  { label: 'Avg. Price Change', val: '+3.2%', trend: '+0.8%', up: true },
  { label: 'Active Traders', val: '1,284', trend: '+156', up: true },
];

type LiquidityLevel = 'High Liquidity' | 'Medium Liquidity' | 'Low Liquidity';

type Listing = {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  seller: string;
  liquidity: LiquidityLevel;
  pricePerToken: string;
  change: string;
  up: boolean;
  vol24h: string;
  lastSale: string;
  available: string;
  totalVal: string;
  Icon: LucideIcon;
  iconWell: string;
};

const LISTINGS: Listing[] = [
  {
    id: 'ponyc',
    name: 'Prime Office Tower NYC',
    ticker: 'PONYC',
    sector: 'Real Estate',
    seller: 'Investor #4728',
    liquidity: 'High Liquidity',
    pricePerToken: '$1,240',
    change: '+5.1%',
    up: true,
    vol24h: '$12,400',
    lastSale: '$1,235',
    available: '150 tokens',
    totalVal: '$186,000',
    Icon: Building2,
    iconWell: 'bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  {
    id: 'sfatx',
    name: 'Solar Farm Alpha TX',
    ticker: 'SFATX',
    sector: 'Energy',
    seller: 'Investor #2891',
    liquidity: 'Medium Liquidity',
    pricePerToken: '$285',
    change: '-5%',
    up: false,
    vol24h: '$8,900',
    lastSale: '$288',
    available: '320 tokens',
    totalVal: '$91,200',
    Icon: Zap,
    iconWell: 'bg-amber-500/12 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400',
  },
  {
    id: 'hppe',
    name: 'Harbor Ports PE Fund',
    ticker: 'HPPE',
    sector: 'Private Equity',
    seller: 'Investor #1044',
    liquidity: 'Low Liquidity',
    pricePerToken: '$4,820',
    change: '+15.5%',
    up: true,
    vol24h: '$24,100',
    lastSale: '$4,800',
    available: '28 tokens',
    totalVal: '$134,960',
    Icon: Globe,
    iconWell: 'bg-blue-500/12 text-blue-600 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400',
  },
  {
    id: 'cmrf',
    name: 'Copper Mining Royalty',
    ticker: 'CMRF',
    sector: 'Commodities',
    seller: 'Investor #3312',
    liquidity: 'Medium Liquidity',
    pricePerToken: '$960',
    change: '-4%',
    up: false,
    vol24h: '$5,760',
    lastSale: '$968',
    available: '75 tokens',
    totalVal: '$72,000',
    Icon: Pickaxe,
    iconWell: 'bg-orange-500/12 text-orange-600 ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:text-orange-400',
  },
];

const LIQUIDITY_STYLES: Record<LiquidityLevel, string> = {
  'High Liquidity':
    'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
  'Medium Liquidity':
    'border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400',
  'Low Liquidity':
    'border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400',
};

function StatKpiCard({ stat }: { stat: StatCard }) {
  return (
    <div className="rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-sm transition-shadow hover:shadow-md md:rounded-[28px] md:p-6 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary md:h-11 md:w-11 md:rounded-2xl">
          <TrendingUp className="h-5 w-5" strokeWidth={iconStroke} />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            stat.up ? 'bg-ui-success-bg-soft text-ui-success-text' : 'bg-ui-danger-soft text-ui-danger-text'
          }`}
        >
          <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
          {stat.trend}
        </span>
      </div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ui-faint">{stat.label}</p>
      <p className="text-2xl font-bold tabular-nums tracking-tight text-ui-strong md:text-3xl">{stat.val}</p>
    </div>
  );
}

export default function SecondaryMarketPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LISTINGS;
    return LISTINGS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.ticker.toLowerCase().includes(q) ||
        l.sector.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <InvestorLayout pageTitle="Secondary Market">
      <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Secondary Market</h1>
            <p className="mt-1 text-sm font-medium text-ui-muted-text">
              Trade tokenized assets peer-to-peer with instant settlement
            </p>
          </div>
          <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-4 py-2 dark:border-emerald-500/25 dark:bg-emerald-500/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">Market Open</span>
          </div>
        </div>

        {/* KPI row */}
        <section className="grid grid-cols-2 gap-4 md:gap-5 2xl:grid-cols-4">
          {STATS.map((stat) => (
            <StatKpiCard key={stat.label} stat={stat} />
          ))}
        </section>

        {/* Search + filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ui-faint"
              strokeWidth={iconStroke}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search by asset name or symbol..."
              className="w-full rounded-2xl border border-ui-border bg-ui-card py-3.5 pl-11 pr-4 text-[13px] font-medium text-ui-strong shadow-sm outline-none transition-shadow placeholder:text-ui-placeholder focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <input
            type="text"
            aria-label="Additional filter"
            className="hidden w-36 rounded-2xl border border-ui-border bg-ui-card px-4 py-3.5 text-[13px] font-medium shadow-sm outline-none focus:ring-4 focus:ring-primary/10 sm:block"
          />
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-ui-border bg-ui-card px-5 py-3.5 text-[13px] font-bold text-ui-muted-text shadow-sm transition-colors hover:bg-ui-muted-deep/80"
          >
            <Filter className="h-4 w-4" strokeWidth={iconStroke} />
            Filters
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3.5 rounded-2xl border border-primary/15 bg-primary/5 p-4 md:gap-4 md:rounded-[22px] md:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary md:h-10 md:w-10">
            <Info className="h-5 w-5" strokeWidth={iconStroke} />
          </div>
          <div className="min-w-0">
            <h4 className="mb-1 text-[13px] font-bold text-ui-strong md:text-sm">About Secondary Market</h4>
            <p className="text-[12px] font-medium leading-relaxed text-ui-muted-text md:text-[13px]">
              The secondary market allows investors to trade tokenized assets peer-to-peer before maturity. Prices are
              set by sellers and may differ from the original offering price. All trades are settled instantly on-chain
              with automated escrow protection.
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-4 md:space-y-5">
          {filtered.map((listing) => (
            <article
              key={listing.id}
              className="rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-sm transition-all hover:shadow-md md:rounded-[28px] md:p-7 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
            >
              <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-start 2xl:justify-between 2xl:gap-8">
                {/* Asset identity */}
                <div className="flex min-w-0 flex-1 items-start gap-4 2xl:max-w-[38%]">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl md:h-[52px] md:w-[52px] ${listing.iconWell}`}
                  >
                    <listing.Icon className="h-6 w-6" strokeWidth={iconStroke} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold text-ui-strong md:text-base">{listing.name}</h3>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                      {listing.ticker} · {listing.sector}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-ui-muted-text">Seller: {listing.seller}</p>
                    <span
                      className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${LIQUIDITY_STYLES[listing.liquidity]}`}
                    >
                      {listing.liquidity}
                    </span>
                  </div>
                </div>

                {/* Price + availability */}
                <div className="grid grid-cols-2 gap-5 sm:gap-8 md:gap-10 2xl:flex 2xl:flex-1 2xl:items-center 2xl:justify-center 2xl:gap-14">
                  <div>
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Price per token</p>
                    <p className="text-2xl font-bold tabular-nums text-ui-strong md:text-3xl">{listing.pricePerToken}</p>
                    <p
                      className={`mt-1 flex items-center gap-1 text-sm font-bold ${
                        listing.up ? 'text-ui-success-text' : 'text-ui-danger-text'
                      }`}
                    >
                      {listing.up ? (
                        <TrendingUp className="h-4 w-4" strokeWidth={iconStroke} />
                      ) : (
                        <TrendingDown className="h-4 w-4" strokeWidth={iconStroke} />
                      )}
                      {listing.change}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-[11px]">
                      <div>
                        <span className="font-bold uppercase tracking-wider text-ui-faint">24h Volume </span>
                        <span className="font-bold text-ui-strong">{listing.vol24h}</span>
                      </div>
                      <div>
                        <span className="font-bold uppercase tracking-wider text-ui-faint">Last Sale </span>
                        <span className="font-bold text-ui-strong">{listing.lastSale}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Available</p>
                    <p className="text-2xl font-bold tabular-nums text-ui-strong md:text-3xl">{listing.available}</p>
                    <p className="mt-3 text-[11px]">
                      <span className="font-bold uppercase tracking-wider text-ui-faint">Total Value </span>
                      <span className="font-bold text-ui-strong">{listing.totalVal}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row 2xl:flex-col 2xl:items-stretch">
                  <Link
                    href="/investor/marketplace-detail"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5b21b6] to-[#4338ca] px-6 py-3 text-[12px] font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-105"
                  >
                    <Zap className="h-4 w-4" strokeWidth={iconStroke} />
                    Trade Now
                  </Link>
                  <Link
                    href="/investor/marketplace-detail"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-ui-border bg-ui-card px-5 py-3 text-[12px] font-bold text-ui-muted-text transition-colors hover:bg-ui-muted-deep/80"
                  >
                    <BarChart3 className="h-4 w-4" strokeWidth={iconStroke} />
                    View Chart
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm font-medium text-ui-muted-text">No listings match your search.</p>
          )}
        </div>
      </div>
    </InvestorLayout>
  );
}
