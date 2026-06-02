"use client";

import {
  Briefcase,
  ExternalLink,
  Filter,
  Globe2,
  Lock,
  TrendingUp,
  Unlock,
  Users,
} from "lucide-react";
import Link from "next/link";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { MarketplaceAssetCover } from "@/components/investor/MarketplaceAssetCover";
import {
  aggregatePortfolioAssetStats,
  filterLabelToCategoryKey,
} from "@/lib/portfolio";
import {
  useGetPortfolioFiltersQuery,
  useGetPortfolioSummaryQuery,
  useGetPortfolioNavHistoryQuery,
  useListPortfolioAssetsQuery,
} from "@/store/api/portfolioApi";

function chartX(
  left: number,
  width: number,
  index: number,
  count: number,
): number {
  if (count <= 1) return left + width / 2;
  return left + (index / (count - 1)) * width;
}

function buildNavPath(
  values: number[],
  left: number,
  width: number,
  top: number,
  height: number,
  maxY: number,
): string {
  if (values.length === 0) return "";
  const safeMaxY = maxY > 0 ? maxY : 1;
  return values
    .map((v, i) => {
      const x = chartX(left, width, i, values.length);
      const y = top + height - (v / safeMaxY) * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildNavAreaPath(
  values: number[],
  left: number,
  width: number,
  top: number,
  height: number,
  maxY: number,
  baselineY: number,
): string {
  if (values.length === 0) return "";
  const safeMaxY = maxY > 0 ? maxY : 1;
  const pts = values.map((v, i) => {
    const x = chartX(left, width, i, values.length);
    const y = top + height - (v / safeMaxY) * height;
    return { x, y };
  });
  let d = `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${baselineY} Z`;
  return d;
}

const statusStyles = {
  Active: { dot: "bg-emerald-400", ring: "border-emerald-500/30" },
  Raising: { dot: "bg-sky-400", ring: "border-sky-500/35" },
  Locked: { dot: "bg-zinc-400", ring: "border-zinc-500/30" },
} as const;

export default function IssuerPortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All Assets");
  const { data: categories = [] } = useGetPortfolioFiltersQuery();
  const { data: summary } = useGetPortfolioSummaryQuery();
  const { data: navHistoryResult } = useGetPortfolioNavHistoryQuery();
  const navHistory = navHistoryResult?.points ?? [];
  const categoryKey = filterLabelToCategoryKey(categories, activeFilter);
  const { data: assetsResult, isLoading: assetsLoading } =
    useListPortfolioAssetsQuery({
      page: 1,
      limit: 50,
      category: categoryKey,
    });

  const filterLabels = useMemo(
    () =>
      categories.length > 0 ? categories.map((c) => c.label) : ["All Assets"],
    [categories],
  );

  const assets = assetsResult?.items ?? [];
  const navValues = useMemo(() => navHistory.map((p) => p.value), [navHistory]);
  const months = useMemo(() => navHistory.map((p) => p.label), [navHistory]);
  const yMax = useMemo(
    () => (navValues.length > 0 ? Math.max(...navValues, 1) * 1.1 : 1),
    [navValues],
  );

  const assetStats = useMemo(
    () => aggregatePortfolioAssetStats(assets),
    [assets],
  );
  const totalInvestors =
    summary?.totalInvestors ??
    (assetStats.totalInvestors > 0 ? assetStats.totalInvestors : null);
  const avgApyPercent = summary?.avgApyPercent ?? assetStats.avgApyPercent;

  const chartGeometry = useMemo(() => {
    const chartLeft = 40;
    const chartW = 520;
    const chartTop = 24;
    const chartH = 112;
    const chartBottom = chartTop + chartH;
    if (navValues.length === 0) {
      return {
        chartLeft,
        chartW,
        chartTop,
        chartH,
        chartBottom,
        linePath: "",
        areaPath: "",
      };
    }
    return {
      chartLeft,
      chartW,
      chartTop,
      chartH,
      chartBottom,
      linePath: buildNavPath(
        navValues,
        chartLeft,
        chartW,
        chartTop,
        chartH,
        yMax,
      ),
      areaPath: buildNavAreaPath(
        navValues,
        chartLeft,
        chartW,
        chartTop,
        chartH,
        yMax,
        chartBottom,
      ),
    };
  }, [navValues, yMax]);

  const {
    chartLeft,
    chartW,
    chartTop,
    chartH,
    chartBottom,
    linePath,
    areaPath,
  } = chartGeometry;

  return (
    <DashboardLayout>
      <div className="max-w-full min-w-0 space-y-8 pb-10 animate-in fade-in duration-700 md:space-y-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">
            Portfolio
          </h1>
          <p className="max-w-2xl text-base font-medium text-ui-faint md:text-[15px]">
            All tokenized assets under management, live on-chain.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-[#5b21b6] via-primary to-[#4c1d95] p-6 text-white shadow-lg md:rounded-3xl md:p-8 xl:col-span-3">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-violet-300/20 blur-2xl" />
            <div className="relative z-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/55">
                Total NAV
              </p>
              <p className="mb-1 text-3xl font-bold tracking-tight md:text-[2.75rem]">
                {summary?.totalNavFormatted ?? "—"}
              </p>
              <p className="mb-5 text-base font-medium text-white/60">
                {summary?.assetCount ?? assets.length} assets on-chain
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-200">
                ↗{" "}
                {summary
                  ? `${summary.ytdPercent >= 0 ? "+" : ""}${summary.ytdPercent.toFixed(1)}%`
                  : "—"}{" "}
                YTD
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-3xl md:p-7 xl:col-span-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-ui-strong md:text-[15px]">
                  NAV History
                </h2>
                <p className="text-xs font-medium text-ui-faint">
                  USD Millions · 7-month trend
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                {summary
                  ? `${summary.ytdPercent >= 0 ? "+" : ""}${summary.ytdPercent.toFixed(1)}%`
                  : "—"}{" "}
                YTD
              </span>
            </div>
            <div className="max-w-full min-w-0 overflow-hidden">
              {navHistory.length === 0 ? (
                <p className="flex h-36 items-center justify-center text-base font-medium text-ui-faint md:h-40">
                  No NAV history available yet.
                </p>
              ) : (
                <svg
                  className="h-36 w-full max-w-full md:h-40"
                  viewBox="0 0 600 168"
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label="NAV history seven month trend"
                >
                  <defs>
                    <linearGradient
                      id="issuerPortNavFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        className="[stop-color:var(--primary)]"
                        stopOpacity="0.22"
                      />
                      <stop
                        offset="100%"
                        className="[stop-color:var(--primary)]"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  {[0, Math.round(yMax / 2), Math.round(yMax)].map((tick) => {
                    const y = chartBottom - (tick / yMax) * chartH;
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
                          className="fill-ui-placeholder text-xs font-bold"
                        >
                          {tick === 0 ? "$0" : `$${tick}`}
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
                  {months.map((m, i) => {
                    const x =
                      months.length > 1
                        ? chartLeft + (i / (months.length - 1)) * chartW
                        : chartLeft + chartW / 2;
                    return (
                      <text
                        key={`${m}-${i}`}
                        x={x}
                        y="162"
                        textAnchor="middle"
                        className="fill-ui-placeholder text-xs font-bold"
                      >
                        {m}
                      </text>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1 xl:gap-5">
            <div className="flex items-center gap-4 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-3xl md:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-ui-faint">
                  Total Investors
                </p>
                <p className="text-2xl font-bold text-ui-strong md:text-3xl">
                  {totalInvestors != null
                    ? totalInvestors.toLocaleString("en-US")
                    : "—"}
                </p>
                <p className="text-xs font-medium text-ui-faint">
                  Across all assets
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-3xl md:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <TrendingUp
                  className="h-6 w-6"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-ui-faint">
                  Average Token Yield
                </p>
                <p className="text-2xl font-bold text-primary md:text-3xl">
                  {avgApyPercent != null ? `${avgApyPercent.toFixed(1)}%` : "—"}
                </p>
                <p className="text-xs font-medium text-ui-faint">
                  Annualized APY
                </p>
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
          {filterLabels.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2.5 text-left text-sm font-bold transition-all md:px-5 md:py-3 md:text-[13px] ${
                activeFilter === f
                  ? "bg-zinc-900 text-white shadow-md dark:bg-zinc-100 dark:text-zinc-900"
                  : "border border-ui-border bg-ui-card text-ui-muted-text shadow-sm hover:border-ui-border-strong hover:text-ui-strong"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {assetsLoading ? (
            <p className="col-span-full text-base text-ui-muted-text">
              Loading portfolio assets…
            </p>
          ) : assets.length === 0 ? (
            <div className="col-span-full overflow-hidden rounded-[28px] border border-ui-border bg-ui-card p-8 shadow-sm md:p-10">
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Briefcase className="h-8 w-8" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-ui-strong">
                  {activeFilter === "All Assets"
                    ? "No portfolio assets yet"
                    : `No assets in ${activeFilter} yet`}
                </h3>
                <p className="mt-2 max-w-xl text-base font-medium leading-relaxed text-ui-faint">
                  {activeFilter === "All Assets"
                    ? "Once you complete an investment, your portfolio positions will appear here with token value, yield, and lockup details."
                    : "Try another filter or browse available marketplace opportunities to build this part of your portfolio."}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/issuer/hub"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                  >
                    Explore Marketplace
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("All Assets")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ui-border px-5 py-3 text-base font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
                  >
                    View All Assets
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          {assets.map((asset) => {
            const st =
              statusStyles[asset.status as keyof typeof statusStyles] ??
              statusStyles.Active;
            const lockupLower = asset.lockup.toLowerCase();
            const isHardLocked = lockupLower === "locked";
            const isUnlocked = lockupLower === "unlocked";
            const lockupIsDuration =
              !isUnlocked && /month|year|week|day/i.test(asset.lockup);
            return (
              <article
                key={asset.id}
                className="group flex max-w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-ui-card shadow-sm transition-shadow hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 md:rounded-3xl"
              >
                <MarketplaceAssetCover
                  image={asset.image}
                  alt={asset.name}
                  assetType={asset.categoryLabel}
                  className="relative h-44 w-full min-h-44 md:h-48"
                  imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                >
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/10" />
                  <div
                    className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-md ${st.ring}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}`}
                    />
                    <span className="text-xs font-bold tracking-wide text-white">
                      {asset.status}
                    </span>
                  </div>
                  {asset.ticker !== "—" ? (
                    <div className="absolute right-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 px-2.5 backdrop-blur-md">
                      <span className="text-xs font-bold tracking-wider text-white">
                        {asset.ticker}
                      </span>
                    </div>
                  ) : null}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="mb-1 text-sm font-bold leading-tight text-white drop-shadow-md md:text-base">
                      {asset.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-[0.65rem] font-medium text-zinc-300">
                      <Globe2
                        className="h-3.5 w-3.5 shrink-0 text-zinc-400"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="line-clamp-2">
                        {asset.location} · {asset.compliance}
                      </span>
                    </p>
                  </div>
                </MarketplaceAssetCover>

                <div className="flex flex-1 flex-col bg-slate-50 p-5 dark:bg-zinc-900 md:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                        Token price
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                        {asset.tokenPrice}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 pt-1 text-base font-bold ${
                        asset.up
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {asset.up ? "↗" : "↘"} {asset.priceChange}
                    </span>
                  </div>

                  <div className="mb-5 grid grid-cols-3 gap-3 border-b border-slate-200 pb-5 dark:border-zinc-800">
                    {(
                      [
                        ["NAV", asset.nav],
                        ["APY", asset.apy],
                        ["INVESTORS", asset.investors],
                      ] as const
                    ).map(([label, val]) => (
                      <div key={label} className="min-w-0">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                          {label}
                        </p>
                        <p
                          className={`truncate text-base font-bold md:text-[15px] ${
                            label === "APY"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-900 dark:text-white"
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
                        <Briefcase
                          className="h-4 w-4 shrink-0"
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : isHardLocked ? (
                        <Lock
                          className="h-4 w-4 shrink-0"
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : (
                        <Unlock
                          className="h-4 w-4 shrink-0"
                          strokeWidth={2}
                          aria-hidden
                        />
                      )}
                      <span className="truncate text-xs font-semibold">
                        {asset.lockup}
                      </span>
                    </div>
                    <Link
                      href={`/issuer/portfolio/${asset.id}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-500/70 bg-transparent px-4 py-2 text-sm font-bold text-violet-600 transition-colors hover:bg-violet-500/10 dark:border-violet-400/60 dark:text-violet-300 dark:hover:bg-violet-500/15"
                    >
                      View Details
                      <ExternalLink
                        className="h-3.5 w-3.5 opacity-90"
                        strokeWidth={2}
                        aria-hidden
                      />
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
