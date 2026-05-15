'use client';

import {
  Activity,
  ArrowLeft,
  Building2,
  Eye,
  Heart,
  Share2,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import InvestorLayout from '@/components/InvestorLayout';

const iconStroke = 1.75;
const TICKER = 'PONYC';
const PRICE = 1240;

const CHART_PERIODS = ['1H', '4H', '1D', '1W', '1M'] as const;
const TIMES = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
const VOLUME_HISTORY = [2.1, 1.8, 2.4, 3.1, 2.8, 3.5, 2.9, 4.1, 3.3, 2.7, 3.0, 2.8];
const Y_LABELS = ['$1400', '$1050', '$700', '$350', '$0'];

const PRICE_STATS = [
  { label: 'Current Price', val: '$1240', sub: '+5.1%', up: true },
  { label: '24h High', val: '$1255', sub: null, up: null },
  { label: '24h Low', val: '$1220', sub: null, up: null },
  { label: 'Circulating Supply', val: '50,000', sub: null, up: null },
  { label: 'Total Supply', val: '100,000', sub: null, up: null },
];

export default function MarketplaceDetailPage() {
  const [activeOrder, setActiveOrder] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [amount, setAmount] = useState('');
  const [chartPeriod, setChartPeriod] = useState<(typeof CHART_PERIODS)[number]>('1D');
  const [favorited, setFavorited] = useState(false);

  const total = amount ? (parseFloat(amount) * PRICE).toFixed(2) : '0';
  const displayTotal = total === '0.00' ? '0' : total;

  return (
    <InvestorLayout pageTitle="Secondary Market">
      <div className="mx-auto w-full max-w-7xl space-y-6 animate-page-enter md:space-y-8">
        <Link
          href="/investor/secondary-market"
          className="inline-flex w-fit items-center gap-2 text-[13px] font-bold text-ui-muted-text transition-colors hover:text-ui-strong"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={iconStroke} />
          Back to Market
        </Link>

        {/* Asset header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 md:h-14 md:w-14 md:rounded-[18px]">
              <Building2 className="h-6 w-6 md:h-7 md:w-7" strokeWidth={iconStroke} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                <h1 className="text-xl font-bold tracking-tight text-ui-strong md:text-2xl">
                  Prime Office Tower NYC
                </h1>
                <span className="rounded-lg bg-ui-muted-deep px-2.5 py-1 text-[11px] font-bold text-ui-body">
                  {TICKER}
                </span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[12px] font-medium text-ui-muted-text">
                <span className="inline-flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-ui-faint" strokeWidth={iconStroke} />
                  24h Volume: $284.5K
                </span>
                <span className="text-ui-placeholder">·</span>
                <span>Market Cap: $62.0M</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 md:gap-3">
            <button
              type="button"
              onClick={() => setFavorited((f) => !f)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ui-border text-ui-faint transition-colors hover:border-primary/30 hover:text-primary"
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`h-4 w-4 ${favorited ? 'fill-primary text-primary' : ''}`}
                strokeWidth={iconStroke}
              />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ui-border text-ui-faint transition-colors hover:border-primary/30 hover:text-primary"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" strokeWidth={iconStroke} />
            </button>
            <Link
              href="/investor/asset-detail"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-[12px] font-bold text-primary transition-colors hover:bg-primary/15"
            >
              <Eye className="h-4 w-4" strokeWidth={iconStroke} />
              Asset Details
            </Link>
          </div>
        </div>

        {/* KPI row */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {PRICE_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
            >
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{s.label}</p>
              <p className="text-base font-bold tabular-nums text-ui-strong md:text-xl">{s.val}</p>
              {s.sub && (
                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-ui-success-text">
                  <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                  {s.sub}
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Chart + trading panel */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-4 md:space-y-5">
            {/* Price chart */}
            <div className="rounded-[24px] border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-[28px] md:p-8 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h3 className="text-base font-bold text-ui-strong md:text-lg">Price Chart (24h)</h3>
                <div className="flex flex-wrap gap-1">
                  {CHART_PERIODS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setChartPeriod(p)}
                      className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                        chartPeriod === p
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-ui-muted-deep text-ui-muted-text hover:bg-ui-muted-deep/80'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-48 md:h-64">
                <div className="absolute bottom-0 left-0 top-0 flex flex-col justify-between pr-2 text-[9px] font-medium text-ui-placeholder">
                  {Y_LABELS.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
                <div className="absolute bottom-0 left-10 right-0 top-0">
                  <svg
                    className="absolute inset-0 h-full w-full text-emerald-500"
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {[25, 50, 75].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="1000"
                        y2={y}
                        stroke="var(--ui-border)"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                      />
                    ))}
                    <path
                      d="M0,75 Q100,72 200,65 T400,55 T600,45 T800,40 T1000,35"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,75 Q100,72 200,65 T400,55 T600,45 T800,40 T1000,35 L1000,100 L0,100 Z"
                      fill="url(#priceFill)"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex justify-between overflow-x-auto pl-10">
                {TIMES.map((t) => (
                  <span key={t} className="text-[9px] font-bold uppercase text-ui-placeholder">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Volume chart */}
            <div className="rounded-[24px] border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-[28px] md:p-8 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
              <h3 className="mb-6 text-base font-bold text-ui-strong md:text-lg">Volume (24h)</h3>
              <div className="flex h-24 items-end gap-1 md:h-28">
                {VOLUME_HISTORY.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/20 transition-colors hover:bg-primary/40"
                    style={{ height: `${(v / 4.5) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order panel */}
          <aside className="w-full shrink-0 lg:w-[320px] xl:w-[340px]">
            <div className="sticky top-20 overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
              {/* Buy / Sell tabs */}
              <div className="grid grid-cols-2 border-b border-ui-border">
                <button
                  type="button"
                  onClick={() => setActiveOrder('buy')}
                  className={`py-4 text-[13px] font-bold transition-all ${
                    activeOrder === 'buy'
                      ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'text-ui-faint hover:bg-ui-muted-deep/50 hover:text-ui-muted-text'
                  }`}
                >
                  Buy {TICKER}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOrder('sell')}
                  className={`py-4 text-[13px] font-bold transition-all ${
                    activeOrder === 'sell'
                      ? 'border-b-2 border-rose-500 text-rose-600 dark:text-rose-400'
                      : 'text-ui-faint hover:bg-ui-muted-deep/50 hover:text-ui-muted-text'
                  }`}
                >
                  Sell {TICKER}
                </button>
              </div>

              <div className="space-y-4 p-5">
                {/* Order type */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-ui-muted-deep p-1">
                  {(['limit', 'market'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOrderType(t)}
                      className={`rounded-lg py-2.5 text-[12px] font-bold transition-all ${
                        orderType === t
                          ? 'border border-ui-border bg-ui-card text-ui-strong shadow-sm'
                          : 'text-ui-muted-text hover:text-ui-body'
                      }`}
                    >
                      {t === 'limit' ? 'Limit Order' : 'Market Order'}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                    Price (USD)
                  </label>
                  <div className="flex items-center overflow-hidden rounded-xl border border-ui-border bg-ui-muted-deep">
                    <input
                      defaultValue={String(PRICE)}
                      className="flex-1 bg-transparent px-4 py-3 text-[14px] font-bold text-ui-strong outline-none"
                    />
                    <span className="px-4 text-[11px] font-bold text-ui-faint">USD</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                    Amount (Tokens)
                  </label>
                  <div className="flex items-center overflow-hidden rounded-xl border border-ui-border bg-ui-muted-deep">
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="flex-1 bg-transparent px-4 py-3 text-[14px] font-bold text-ui-strong outline-none placeholder:text-ui-placeholder"
                    />
                    <span className="px-4 text-[11px] font-bold text-ui-faint">{TICKER}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {['25%', '50%', '75%', '100%'].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        className="rounded-lg bg-ui-muted-deep py-1.5 text-[11px] font-bold text-ui-muted-text transition-all hover:bg-primary/10 hover:text-primary"
                      >
                        {pct}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-ui-divider py-3">
                  <span className="text-[13px] font-bold text-ui-muted-text">Total</span>
                  <span className="text-xl font-bold tabular-nums text-ui-strong">${displayTotal}</span>
                </div>

                <button
                  type="button"
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold shadow-lg transition-all hover:shadow-xl ${
                    activeOrder === 'buy'
                      ? 'bg-emerald-500 text-white shadow-emerald-500/25 hover:bg-emerald-600'
                      : 'bg-rose-500 text-white shadow-rose-500/25 hover:bg-rose-600'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" strokeWidth={iconStroke} />
                  Place {activeOrder === 'buy' ? 'Buy' : 'Sell'} Order
                </button>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-ui-faint">Wallet Balance</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary transition-colors hover:text-primary/80"
                    >
                      <Wallet className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                      Connect
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-ui-placeholder">
                    Connect wallet to view balance and trade
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </InvestorLayout>
  );
}
