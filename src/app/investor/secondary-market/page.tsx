'use client';

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
import {
  useGetSecondaryFiltersQuery,
  useListSecondaryListingsQuery,
  useGetSecondaryStatsQuery,
} from '@/store';
import type { LiquidityLevel } from '@/lib/secondaryMarket';

const iconStroke = 1.75;

type StatCard = {
  label: string;
  val: string;
  trend: string;
  up: boolean;
};

const LIQUIDITY_STYLES: Record<LiquidityLevel, string> = {
  'High Liquidity':
    'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
  'Medium Liquidity':
    'border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400',
  'Low Liquidity':
    'border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400',
};

const ICON_MAP: Record<string, typeof Building2> = {
  building: Building2,
  energy: Zap,
  pe: Globe,
  commodities: Pickaxe,
};

function getIconWellStyle(iconType: string): string {
  switch (iconType) {
    case 'energy':
      return 'bg-amber-500/12 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400';
    case 'pe':
      return 'bg-blue-500/12 text-blue-600 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400';
    case 'commodities':
      return 'bg-orange-500/12 text-orange-600 ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:text-orange-400';
    default:
      return 'bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400';
  }
}

function StatKpiCard({ stat }: { stat: StatCard }) {
  return (
    <div className="rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-sm transition-shadow hover:shadow-md md:rounded-[28px] md:p-6 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary md:h-11 md:w-11 md:rounded-2xl">
          <TrendingUp className="h-5 w-5" strokeWidth={iconStroke} />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            stat.up ? 'bg-ui-success-bg-soft text-ui-success-text' : 'bg-ui-danger-soft text-ui-danger-text'
          }`}
        >
          <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
          {stat.trend}
        </span>
      </div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-ui-faint">{stat.label}</p>
      <p className="text-2xl font-bold tabular-nums tracking-tight text-ui-strong md:text-3xl">{stat.val}</p>
    </div>
  );
}

function formatVolume(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function formatSignedValue(value: number | null | undefined, suffix = ''): string {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}${suffix}`;
}

function formatSignedPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}%`;
}

export default function SecondaryMarketPage() {
  const [search, setSearch] = useState('');
  const [selectedLiquidity, setSelectedLiquidity] = useState('');

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: filtersData } = useGetSecondaryFiltersQuery();
  const { data: stats } = useGetSecondaryStatsQuery();
  const { data: listingsResult, isLoading: listingsLoading } = useListSecondaryListingsQuery({
    search: search || undefined,
    liquidityLevel: selectedLiquidity || undefined,
    limit: 50,
  });

  const listings = listingsResult?.items ?? [];
  const liquidityLevels = filtersData?.liquidityLevels ?? [];

  const activeStats = useMemo(() => {
    return [
      {
        label: '24-Hour Volume',
        val: formatVolume(stats?.volume24h.amount),
        trend: formatSignedPercent(stats?.volume24h.changePercent),
        up: (stats?.volume24h.changePercent ?? 0) >= 0,
      },
      {
        label: 'Total Listings',
        val: stats ? String(stats.totalListings.count) : '—',
        trend: formatSignedValue(stats?.totalListings.change),
        up: (stats?.totalListings.change ?? 0) >= 0,
      },
      {
        label: 'Average Price Change',
        val: formatSignedPercent(stats?.avgPriceChange.percent),
        trend: formatSignedPercent(stats?.avgPriceChange.changePercent),
        up: (stats?.avgPriceChange.changePercent ?? 0) >= 0,
      },
      {
        label: 'Active Traders',
        val: stats ? stats.activeTraders.count.toLocaleString() : '—',
        trend: formatSignedValue(stats?.activeTraders.change),
        up: (stats?.activeTraders.change ?? 0) >= 0,
      },
    ];
  }, [stats]);
  const marketIsOpen = stats?.marketOpen ?? false;

  return (
    <InvestorLayout pageTitle="Secondary Market">
      <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Secondary Market</h1>
            <p className="mt-1 text-base font-medium text-ui-muted-text">
              Trade tokenized assets peer-to-peer with instant settlement
            </p>
          </div>
          <div className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-4 py-2 ${
            marketIsOpen
              ? 'border-emerald-200/80 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10'
              : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900'
          }`}>
            <span className="relative flex h-2 w-2">
              {marketIsOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${
                marketIsOpen ? 'bg-emerald-500' : 'bg-zinc-400'
              }`} />
            </span>
            <span className={`text-sm font-bold ${
              marketIsOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500'
            }`}>
              {marketIsOpen ? 'Market Open' : 'Market Closed'}
            </span>
          </div>
        </div>

        {/* KPI row */}
        <section className="grid grid-cols-2 gap-4 md:gap-5 2xl:grid-cols-4">
          {activeStats.map((stat) => (
            <StatKpiCard key={stat.label} stat={stat} />
          ))}
        </section>

        {/* Search + filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
              className="w-full rounded-2xl border border-ui-border bg-ui-card py-3.5 pl-11 pr-4 text-base font-medium text-ui-strong shadow-sm outline-none transition-shadow placeholder:text-ui-placeholder focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <select
            value={selectedLiquidity}
            onChange={(e) => setSelectedLiquidity(e.target.value)}
            className="w-full sm:w-48 rounded-2xl border border-ui-border bg-ui-card px-4 py-3.5 text-base font-bold text-ui-muted-text shadow-sm outline-none focus:ring-4 focus:ring-primary/10"
            aria-label="Filter by liquidity level"
          >
            <option value="">All Liquidity Levels</option>
            {liquidityLevels.map((lvl) => (
              <option key={lvl.key} value={lvl.key}>
                {lvl.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedLiquidity('');
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-ui-border bg-ui-card px-5 py-3.5 text-base font-bold text-ui-muted-text shadow-sm transition-colors hover:bg-ui-muted-deep/80"
          >
            <Filter className="h-4 w-4" strokeWidth={iconStroke} />
            Reset
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3.5 rounded-2xl border border-primary/15 bg-primary/5 p-4 md:gap-4 md:rounded-[22px] md:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary md:h-10 md:w-10">
            <Info className="h-5 w-5" strokeWidth={iconStroke} />
          </div>
          <div className="min-w-0">
            <h4 className="mb-1 text-base font-bold text-ui-strong md:text-base">About Secondary Market</h4>
            <p className="text-sm font-medium leading-relaxed text-ui-muted-text md:text-[13px]">
              The secondary market allows investors to trade tokenized assets peer-to-peer before maturity. Prices are
              set by sellers and may differ from the original offering price. All trades are settled instantly on-chain
              with automated escrow protection.
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-4 md:space-y-5">
          {listingsLoading ? (
            <p className="py-12 text-center text-base font-medium text-ui-muted-text">Loading listings...</p>
          ) : listings.map((listing) => {
            const ListingIcon = ICON_MAP[listing.iconType] ?? Building2;
            const iconWellStyle = getIconWellStyle(listing.iconType);
            return (
              <article
                key={listing.id}
                className="rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-sm transition-all hover:shadow-md md:rounded-[28px] md:p-6 lg:p-5 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6 xl:gap-8">
                  {/* Asset identity */}
                  <div className="flex min-w-0 items-start gap-4 lg:w-[min(100%,260px)] lg:shrink-0 xl:w-[280px]">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl md:h-[52px] md:w-[52px] ${iconWellStyle}`}
                    >
                      <ListingIcon className="h-6 w-6" strokeWidth={iconStroke} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-bold text-ui-strong md:text-base">{listing.name}</h3>
                      <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-ui-faint">
                        {listing.ticker} · {listing.sector}
                      </p>
                      <p className="mt-1 text-xs font-medium text-ui-muted-text">Seller: {listing.seller}</p>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${LIQUIDITY_STYLES[listing.liquidity] ?? LIQUIDITY_STYLES['High Liquidity']}`}
                      >
                        {listing.liquidity}
                      </span>
                    </div>
                  </div>

                  {/* Price + availability — grouped on laptop+, not stretched edge-to-edge */}
                  <div className="grid grid-cols-2 gap-5 border-t border-ui-divider pt-5 sm:gap-8 lg:flex lg:flex-1 lg:items-center lg:justify-start lg:gap-10 lg:border-t-0 lg:pt-0 xl:gap-14">
                    <div className="min-w-0 lg:max-w-[200px]">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Price per token</p>
                      <p className="text-2xl font-bold tabular-nums text-ui-strong lg:text-[1.65rem] xl:text-3xl">{listing.pricePerToken}</p>
                      <p
                        className={`mt-1 flex items-center gap-1 text-base font-bold ${
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
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs lg:mt-2.5">
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

                    <div className="min-w-0 lg:max-w-[180px]">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Available</p>
                      <p className="text-2xl font-bold tabular-nums text-ui-strong lg:text-[1.65rem] xl:text-3xl">{listing.available}</p>
                      <p className="mt-2 text-xs lg:mt-2.5">
                        <span className="font-bold uppercase tracking-wider text-ui-faint">Total </span>
                        <span className="font-bold text-ui-strong">{listing.totalVal}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions — right column on laptop+ */}
                  <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:min-w-[148px] lg:flex-col lg:items-stretch">
                    <Link
                      href={`/investor/marketplace-detail?id=${listing.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5b21b6] to-[#4338ca] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-105 lg:px-4"
                    >
                      <Zap className="h-4 w-4" strokeWidth={iconStroke} />
                      Trade Now
                    </Link>
                    <Link
                      href={`/investor/marketplace-detail?id=${listing.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-ui-border bg-ui-card px-5 py-2.5 text-sm font-bold text-ui-muted-text transition-colors hover:bg-ui-muted-deep/80 lg:px-4"
                    >
                      <BarChart3 className="h-4 w-4" strokeWidth={iconStroke} />
                      View Chart
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {!listingsLoading && listings.length === 0 && (
            <p className="py-12 text-center text-base font-medium text-ui-muted-text">No listings match your search.</p>
          )}
        </div>
      </div>
    </InvestorLayout>
  );
}
