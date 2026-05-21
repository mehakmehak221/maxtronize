'use client';

import {
  Activity,
  ArrowLeft,
  Building2,
  Eye,
  Heart,
  Share2,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useEffect, useMemo } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import {
  useAddOpportunityToWatchlistMutation,
  useGetSecondaryListingQuery,
  useGetSecondaryAssetChartQuery,
  usePlaceSecondaryOrderMutation,
  useRemoveOpportunityFromWatchlistMutation,
} from '@/store';

const iconStroke = 1.75;
const CHART_PERIODS = ['1H', '4H', '1D', '1W', '1M'] as const;

function MarketplaceDetailFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="h-8 w-24 animate-pulse rounded-lg bg-ui-muted-deep" />
      <div className="h-52 animate-pulse rounded-[32px] bg-ui-muted-deep md:h-72" />
      <div className="h-96 animate-pulse rounded-[28px] bg-ui-muted-deep" />
    </div>
  );
}

function MarketplaceDetailContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('id') ?? '';

  const [activeOrder, setActiveOrder] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [amount, setAmount] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [chartPeriod, setChartPeriod] = useState<(typeof CHART_PERIODS)[number]>('1D');
  const [favorited, setFavorited] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── API Queries ─────────────────────────────────────────────────────────────
  const {
    data: listing,
    isLoading: isListingLoading,
    isError: isListingError,
    refetch: refetchListing,
  } = useGetSecondaryListingQuery(listingId, { skip: !listingId });

  const assetIdForChart = listing?.assetId || listingId;
  const { data: chartData, isLoading: isChartLoading } = useGetSecondaryAssetChartQuery(
    {
      assetId: assetIdForChart,
      interval: chartPeriod,
    },
    {
      skip: !assetIdForChart,
    },
  );

  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceSecondaryOrderMutation();
  const [addWatchlist, { isLoading: isAddingWatchlist }] = useAddOpportunityToWatchlistMutation();
  const [removeWatchlist, { isLoading: isRemovingWatchlist }] =
    useRemoveOpportunityFromWatchlistMutation();

  // Prefill price input when listing details load
  useEffect(() => {
    if (listing) {
      const cleanPrice =
        listing.pricePerTokenValue ||
        parseFloat(listing.pricePerToken.replace(/[^0-9.]/g, ''));
      setPriceInput(isNaN(cleanPrice) ? '' : String(cleanPrice));
      setFavorited(Boolean(listing.watchlist));
    }
  }, [listing]);

  // Reset status messages when order details change
  useEffect(() => {
    setStatusMsg(null);
  }, [activeOrder, orderType, amount, priceInput]);

  const currentPriceNum = useMemo(() => {
    if (!listing) return 0;
    return (
      listing.pricePerTokenValue ||
      parseFloat(listing.pricePerToken.replace(/[^0-9.]/g, '')) ||
      0
    );
  }, [listing]);

  const activePrice = orderType === 'market' ? currentPriceNum : parseFloat(priceInput) || 0;
  const total = amount ? (parseFloat(amount) * activePrice).toFixed(2) : '0';
  const displayTotal = total === '0.00' ? '0' : total;

  // ── Dynamic SVG Chart Logic ──────────────────────────────────────────────────
  const chartPoints = chartData?.series ?? [];

  const svgPath = useMemo(() => {
    if (!chartPoints || chartPoints.length === 0) {
      return 'M0,75 Q200,68 400,58 T800,43 T1000,38'; // nice curved placeholder
    }
    const prices = chartPoints.map((p) => p.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const pts = chartPoints.map((pt, i) => {
      const x = (i / (chartPoints.length - 1)) * 1000;
      const y = 90 - ((pt.price - minPrice) / priceRange) * 80;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${pts.join(' L')}`;
  }, [chartPoints]);

  const svgFillPath = useMemo(() => {
    if (!chartPoints || chartPoints.length === 0) {
      return 'M0,75 Q200,68 400,58 T800,43 T1000,38 L1000,100 L0,100 Z'; // nice area placeholder
    }
    const prices = chartPoints.map((p) => p.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const pts = chartPoints.map((pt, i) => {
      const x = (i / (chartPoints.length - 1)) * 1000;
      const y = 90 - ((pt.price - minPrice) / priceRange) * 80;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${pts.join(' L')} L1000,100 L0,100 Z`;
  }, [chartPoints]);

  const yLabels = useMemo(() => {
    if (!chartPoints || chartPoints.length === 0) {
      const cleanPrice = listing ? parseFloat(listing.pricePerToken.replace(/[^0-9.]/g, '')) : 1240;
      return [
        `$${(cleanPrice * 1.15).toFixed(0)}`,
        `$${(cleanPrice * 1.05).toFixed(0)}`,
        `$${cleanPrice.toFixed(0)}`,
        `$${(cleanPrice * 0.95).toFixed(0)}`,
        '$0',
      ];
    }
    const prices = chartPoints.map((p) => p.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const step = (maxPrice - minPrice) / 4;
    return Array.from({ length: 5 }).map((_, i) => {
      const val = maxPrice - i * step;
      return `$${val.toFixed(0)}`;
    });
  }, [chartPoints, listing]);

  const xLabels = useMemo(() => {
    if (!chartPoints || chartPoints.length === 0) {
      return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    }
    const count = chartPoints.length;
    if (count <= 2) {
      return chartPoints.map((pt) => {
        const d = new Date(pt.recordedAt);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      });
    }
    const step = (count - 1) / 4;
    const indices = Array.from({ length: 5 }).map((_, i) => Math.round(i * step));
    return indices.map((idx) => {
      const pt = chartPoints[idx];
      if (!pt?.recordedAt) return '';
      try {
        const d = new Date(pt.recordedAt);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      } catch {
        return '';
      }
    });
  }, [chartPoints]);

  const priceStats = useMemo(() => {
    if (!listing) return [];
    return [
      { label: 'Current Price', val: listing.pricePerToken, sub: listing.change, up: listing.up },
      { label: 'Last Sale', val: listing.lastSale, sub: null, up: null },
      { label: '24h Volume', val: listing.vol24h, sub: null, up: null },
      { label: 'Available', val: listing.available, sub: null, up: null },
      { label: 'Total Value', val: listing.totalVal, sub: null, up: null },
    ];
  }, [listing]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!amount || isPlacingOrder) return;
    setStatusMsg(null);
    try {
      await placeOrder({
        id: listingId,
        side: activeOrder.toUpperCase() as 'BUY' | 'SELL',
        orderType: orderType.toUpperCase() as 'LIMIT' | 'MARKET',
        tokenAmount: parseFloat(amount),
        pricePerToken: activePrice,
      }).unwrap();

      setStatusMsg({
        type: 'success',
        text: `Successfully placed a ${activeOrder.toUpperCase()} order for ${amount} tokens of ${listing?.ticker} at $${activePrice.toFixed(2)} per token.`,
      });
      setAmount('');
      refetchListing();
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.data?.message || err?.message || 'Failed to place order. Please verify details and try again.',
      });
    }
  };

  const handleFavoriteToggle = async () => {
    if (!listing?.assetId || isAddingWatchlist || isRemovingWatchlist) return;
    if (favorited) {
      await removeWatchlist(listing.assetId).unwrap();
      setFavorited(false);
      return;
    }
    await addWatchlist(listing.assetId).unwrap();
    setFavorited(true);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
    } catch {
      setShareCopied(false);
    }
  };

  if (!listingId) {
    return (
      <div className="rounded-[24px] border border-ui-border bg-ui-card p-10 text-center">
        <p className="text-sm font-medium text-ui-muted-text">Select a secondary listing to trade.</p>
        <Link href="/investor/secondary-market" className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
          Browse Secondary Market
        </Link>
      </div>
    );
  }

  if (isListingLoading) {
    return <MarketplaceDetailFallback />;
  }

  if (isListingError || !listing) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-10 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
        <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Listing not found or unavailable.</p>
        <Link href="/investor/secondary-market" className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
          Back to Secondary Market
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
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
                {listing.name}
              </h1>
              <span className="rounded-lg bg-ui-muted-deep px-2.5 py-1 text-[11px] font-bold text-ui-body">
                {listing.ticker}
              </span>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[12px] font-medium text-ui-muted-text">
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-ui-faint" strokeWidth={iconStroke} />
                Sector: {listing.sector}
              </span>
              <span className="text-ui-placeholder">·</span>
              <span>Seller: {listing.seller}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 md:gap-3">
          <button
            type="button"
            onClick={() => void handleFavoriteToggle()}
            disabled={isAddingWatchlist || isRemovingWatchlist}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-ui-border text-ui-faint transition-colors hover:border-primary/30 hover:text-primary disabled:opacity-50"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-4 w-4 ${favorited ? 'fill-primary text-primary' : ''}`}
              strokeWidth={iconStroke}
            />
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              shareCopied
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-ui-border text-ui-faint hover:border-primary/30 hover:text-primary'
            }`}
            aria-label={shareCopied ? 'Link copied' : 'Share'}
          >
            <Share2 className="h-4 w-4" strokeWidth={iconStroke} />
          </button>
          <Link
            href={`/investor/asset-detail?id=${listing.assetId}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-[12px] font-bold text-primary transition-colors hover:bg-primary/15"
          >
            <Eye className="h-4 w-4" strokeWidth={iconStroke} />
            Asset Details
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {priceStats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
          >
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{s.label}</p>
            <p className="text-base font-bold tabular-nums text-ui-strong md:text-xl">{s.val}</p>
            {s.sub && (
              <p
                className={`mt-0.5 flex items-center gap-1 text-[10px] font-bold ${
                  s.up ? 'text-ui-success-text' : 'text-ui-danger-text'
                }`}
              >
                {s.up ? (
                  <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
                )}
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
              <div>
                <h3 className="text-base font-bold text-ui-strong md:text-lg">Price Chart ({chartPeriod})</h3>
                <p className="mt-1 text-[11px] font-medium text-ui-faint">
                  {isChartLoading ? 'Refreshing chart…' : 'Live market price history'}
                </p>
              </div>
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
                {yLabels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
              <div className="absolute bottom-0 left-12 right-0 top-0">
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
                    d={svgPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d={svgFillPath}
                    fill="url(#priceFill)"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex justify-between overflow-x-auto pl-12">
              {xLabels.map((t, idx) => (
                <span key={idx} className="text-[9px] font-bold uppercase text-ui-placeholder">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Details & Info Banner */}
          <div className="rounded-[24px] border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-[28px] md:p-8 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <h3 className="mb-3 text-base font-bold text-ui-strong md:text-lg">Escrow Protocol Details</h3>
            <p className="text-[13px] font-medium leading-relaxed text-ui-muted-text">
              Trading this token is managed directly by smart contract automation on {listing.liquidity}. Your funds will be locked in escrow until the seller transfers token rights, instantly clearing within 1-2 minutes of confirmation. Always verify Limit Order price bounds before final placement.
            </p>
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
                Buy {listing.ticker}
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
                Sell {listing.ticker}
              </button>
            </div>

            <div className="space-y-4 p-5">
              {/* Status feedback */}
              {statusMsg && (
                <div
                  className={`rounded-xl p-3.5 text-xs font-semibold leading-relaxed border ${
                    statusMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

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
                <div className="flex items-center overflow-hidden rounded-xl border border-ui-border bg-ui-muted-deep focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-colors">
                  <input
                    value={orderType === 'market' ? currentPriceNum.toFixed(2) : priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    disabled={orderType === 'market'}
                    type="number"
                    className="flex-1 bg-transparent px-4 py-3 text-[14px] font-bold text-ui-strong outline-none disabled:opacity-75"
                  />
                  <span className="px-4 text-[11px] font-bold text-ui-faint">USD</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  Amount (Tokens)
                </label>
                <div className="flex items-center overflow-hidden rounded-xl border border-ui-border bg-ui-muted-deep focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-colors">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    type="number"
                    min="1"
                    className="flex-1 bg-transparent px-4 py-3 text-[14px] font-bold text-ui-strong outline-none placeholder:text-ui-placeholder"
                  />
                  <span className="px-4 text-[11px] font-bold text-ui-faint">{listing.ticker}</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {['25', '50', '100', '250'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className="rounded-lg bg-ui-muted-deep py-1.5 text-[11px] font-bold text-ui-muted-text transition-all hover:bg-primary/10 hover:text-primary"
                    >
                      +{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-ui-divider py-3">
                <span className="text-[13px] font-bold text-ui-muted-text">Total</span>
                <span className="text-xl font-bold tabular-nums text-ui-strong">${parseFloat(displayTotal).toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!amount || isPlacingOrder}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeOrder === 'buy'
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25 hover:bg-emerald-600'
                    : 'bg-rose-500 text-white shadow-rose-500/25 hover:bg-rose-600'
                }`}
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={iconStroke} />
                {isPlacingOrder ? 'Processing...' : `Place ${activeOrder === 'buy' ? 'Buy' : 'Sell'} Order`}
              </button>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-ui-faint">Wallet Balance</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary transition-colors hover:text-primary/80"
                  >
                    <Wallet className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                    Connected
                  </button>
                </div>
                <p className="text-[10px] font-medium text-ui-placeholder">
                  Linked to standard platform custody wallet
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function MarketplaceDetailPage() {
  return (
    <InvestorLayout pageTitle="Secondary Market">
      <Suspense fallback={<MarketplaceDetailFallback />}>
        <MarketplaceDetailContent />
      </Suspense>
    </InvestorLayout>
  );
}
