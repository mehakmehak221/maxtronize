'use client';

import { Check } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import { MarketplaceAssetCard } from '@/components/investor/MarketplaceAssetCard';
import { FeaturedStarOutlineIcon } from '@/app/VectorImages';
import {
  useGetMarketplaceFeaturedQuery,
  useGetMarketplaceFiltersQuery,
  useGetMarketplaceStatsQuery,
  useListMarketplaceOpportunitiesQuery,
} from '@/store/api/investorMarketplaceApi';
import type { MarketplaceFilterOption } from '@/lib/investorMarketplace';

function formatStatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedMinBucket, setSelectedMinBucket] = useState('');

  // ── API calls ───────────────────────────────────────────────────────────────
  const { data: featured = [], isLoading: featuredLoading } =
    useGetMarketplaceFeaturedQuery();
  const { data: filters } = useGetMarketplaceFiltersQuery();
  const { data: stats } = useGetMarketplaceStatsQuery();

  const opportunityParams = useMemo(
    () => ({
      search: search || undefined,
      assetType: selectedAssetTypes[0] || undefined,
      riskLevel: selectedRiskLevels[0] || undefined,
      minInvestmentBucket: selectedMinBucket || undefined,
      limit: 50,
    }),
    [search, selectedAssetTypes, selectedRiskLevels, selectedMinBucket],
  );

  const {
    data: opportunitiesResult,
    isLoading: oppsLoading,
    isError: oppsError,
    refetch,
  } = useListMarketplaceOpportunitiesQuery(opportunityParams);

  const allOpps = opportunitiesResult?.data ?? [];
  const isLoading = featuredLoading || oppsLoading;
  const hasActiveFilters =
    Boolean(search.trim()) ||
    selectedAssetTypes.length > 0 ||
    selectedRiskLevels.length > 0 ||
    Boolean(selectedMinBucket);

  const displayFeatured =
    !hasActiveFilters && featured.length > 0
      ? featured
      : allOpps.filter((a) => a.featured).slice(0, 3);

  const displayAll =
    !hasActiveFilters && featured.length > 0
      ? allOpps.filter((a) => !featured.some((f) => f.id === a.id))
      : allOpps.filter((a) => !a.featured);

  const totalShown = displayFeatured.length + displayAll.length;

  // ── Filter helpers ──────────────────────────────────────────────────────────
  function toggleAssetType(key: string) {
    setSelectedAssetTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }
  function toggleRiskLevel(key: string) {
    setSelectedRiskLevels((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }
  function clearAll() {
    setSelectedAssetTypes([]);
    setSelectedRiskLevels([]);
    setSelectedMinBucket('');
    setSearch('');
  }

  return (
    <InvestorLayout pageTitle="Primary Marketplace">
      <div className="mx-auto w-full max-w-7xl space-y-5 animate-in fade-in duration-700 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-3xl lg:text-4xl">
              Primary Marketplace
            </h1>
            <p className="mt-1 text-sm font-medium text-ui-faint md:text-[15px]">
              Discover new investment opportunities across multiple asset classes
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-[12px] font-bold text-ui-muted-text">
              Available opportunities:{' '}
              <span className="text-ui-strong">
                {isLoading ? '…' : (stats?.availableOpportunities ?? totalShown)}
              </span>
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ui-faint"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search by name, type, or location..."
            className="w-full rounded-2xl border border-ui-border bg-ui-card py-3.5 pl-11 pr-6 text-sm font-medium shadow-sm outline-none transition-all focus:ring-4 focus:ring-primary/5 md:py-4 md:text-[15px]"
          />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-[240px] lg:max-w-[35%] xl:w-64 2xl:w-72">
            <div className="space-y-4 rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm lg:sticky lg:top-20 lg:space-y-5 lg:rounded-[24px] lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-ui-strong">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Asset Type */}
              {(filters?.assetTypes.length ?? 0) > 0 && (
                <div className="space-y-2.5 border-t border-ui-divider pt-4 md:space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint md:text-[11px]">
                    Asset Type
                  </p>
                  {filters!.assetTypes.map((item: MarketplaceFilterOption) => (
                    <label
                      key={item.key}
                      className="group flex min-h-[40px] cursor-pointer items-center gap-3 md:min-h-[44px]"
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selectedAssetTypes.includes(item.key)}
                        onChange={() => toggleAssetType(item.key)}
                      />
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-ui-border bg-ui-card transition-colors group-has-[:checked]:border-primary group-has-[:checked]:bg-primary md:h-5 md:w-5">
                        <Check
                          className="h-3 w-3 text-white opacity-0 transition-opacity group-has-[:checked]:opacity-100 md:h-3.5 md:w-3.5"
                          strokeWidth={3}
                          aria-hidden
                        />
                      </span>
                      <span className="text-[13px] font-medium leading-snug text-ui-body md:text-sm">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Risk Level */}
              {(filters?.riskLevels.length ?? 0) > 0 && (
                <div className="space-y-2.5 border-t border-ui-divider pt-4 md:space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint md:text-[11px]">
                    Risk Level
                  </p>
                  {filters!.riskLevels.map((item: MarketplaceFilterOption) => (
                    <label
                      key={item.key}
                      className="group flex min-h-[40px] cursor-pointer items-center gap-3 md:min-h-[44px]"
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selectedRiskLevels.includes(item.key)}
                        onChange={() => toggleRiskLevel(item.key)}
                      />
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-ui-border bg-ui-card transition-colors group-has-[:checked]:border-primary group-has-[:checked]:bg-primary md:h-5 md:w-5">
                        <Check
                          className="h-3 w-3 text-white opacity-0 transition-opacity group-has-[:checked]:opacity-100 md:h-3.5 md:w-3.5"
                          strokeWidth={3}
                          aria-hidden
                        />
                      </span>
                      <span className="text-[13px] font-medium leading-snug text-ui-body md:text-sm">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Min Investment Buckets */}
              {(filters?.minInvestmentBuckets.length ?? 0) > 0 && (
                <div className="space-y-2.5 border-t border-ui-divider pt-4 md:space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint md:text-[11px]">
                    Minimum Investment
                  </p>
                  {filters!.minInvestmentBuckets.map(
                    (item: MarketplaceFilterOption) => (
                      <label
                        key={item.key}
                        className="group flex min-h-[40px] cursor-pointer items-center gap-3 md:min-h-[44px]"
                      >
                        <input
                          type="radio"
                          name="minBucket"
                          className="sr-only"
                          checked={selectedMinBucket === item.key}
                          onChange={() =>
                            setSelectedMinBucket((prev) =>
                              prev === item.key ? '' : item.key,
                            )
                          }
                        />
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-ui-border bg-ui-card transition-colors group-has-[:checked]:border-primary group-has-[:checked]:bg-primary md:h-5 md:w-5">
                          <span className="h-1.5 w-1.5 rounded-full bg-white opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
                        </span>
                        <span className="text-[13px] font-medium leading-snug text-ui-body md:text-sm">
                          {item.label}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              )}

              {/* Stats card */}
              <div className="-mx-1 mt-2 space-y-4 rounded-2xl bg-primary p-5 text-white">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <FeaturedStarOutlineIcon className="h-4 w-4 shrink-0 text-white" />
                  Marketplace Stats
                </p>
                {[
                  ['Total Raised (30d)', formatStatCurrency(stats?.totalRaised30d)],
                  ['New Listings (30d)', stats ? String(stats.newListings30d) : '—'],
                  ['Available Opportunities', stats ? String(stats.availableOpportunities) : String(totalShown || '—')],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-white/70">{l}</span>
                    <span className="text-[11px] font-bold tabular-nums">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-10">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 2xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[420px] animate-pulse rounded-[24px] border border-ui-border bg-ui-muted-deep/60"
                  />
                ))}
              </div>
            ) : oppsError ? (
              <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                  Could not load marketplace assets.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 text-sm font-bold text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : totalShown === 0 ? (
              <div className="rounded-[24px] border border-ui-border bg-ui-card p-12 text-center">
                <p className="text-sm font-medium text-ui-muted-text">
                  {search ||
                  selectedAssetTypes.length ||
                  selectedRiskLevels.length ||
                  selectedMinBucket
                    ? 'No assets match your filters.'
                    : 'No published assets available yet.'}
                </p>
              </div>
            ) : (
              <>
                {!hasActiveFilters && displayFeatured.length > 0 && (
                  <section>
                    <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold text-ui-strong md:text-xl">
                      <FeaturedStarOutlineIcon
                        className="h-5 w-5 shrink-0 text-[#FE9A00] md:h-6 md:w-6"
                        aria-hidden
                      />
                      Featured Opportunities
                    </h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 2xl:grid-cols-3">
                      {displayFeatured.map((asset) => (
                        <MarketplaceAssetCard
                          key={asset.id}
                          asset={asset}
                          featured
                        />
                      ))}
                    </div>
                  </section>
                )}

                {displayAll.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h2 className="text-lg font-bold text-ui-strong md:text-xl">
                        All Opportunities
                      </h2>
                      <span className="text-[11px] font-medium text-ui-faint">
                        {displayAll.length} listings
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 2xl:grid-cols-3">
                      {displayAll.map((asset) => (
                        <MarketplaceAssetCard key={asset.id} asset={asset} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}
