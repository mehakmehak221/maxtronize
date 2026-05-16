'use client';

import { Building2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { countActiveOfferings, type HubAsset } from '@/lib/issuerHub';
import {
  useGetIssuerHubAssetsSummaryQuery,
  useListIssuerHubAssetsQuery,
} from '@/store/api/issuerHubApi';

const iconStroke = 1.75;

const ASSET_BAR_CLASS: Record<string, string> = {
  a: 'bg-issuer-asset-bar-1',
  b: 'bg-issuer-asset-bar-2',
  c: 'bg-issuer-asset-bar-3',
  draft: 'bg-issuer-asset-bar-draft',
};

const HUB_ASSET_STATUS_FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Live', value: 'Live' },
  { label: 'Funded', value: 'Funded' },
  { label: 'Draft', value: 'Draft' },
] as const;

function MetricIconCircle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

function HubAssetStatusBadge({ status }: { status: HubAsset['displayStatus'] }) {
  if (status === 'Live') {
    return (
      <span className="rounded-md border border-status-live-border bg-status-live-bg px-2 py-0.5 text-[10px] font-bold text-status-live-text">
        Live
      </span>
    );
  }
  if (status === 'Funded') {
    return (
      <span className="rounded-md border border-status-funded-border bg-status-funded-bg px-2 py-0.5 text-[10px] font-bold text-status-funded-text">
        Funded
      </span>
    );
  }
  return (
    <span className="rounded-md border border-status-draft-border bg-status-draft-bg px-2 py-0.5 text-[10px] font-bold text-status-draft-text">
      {status}
    </span>
  );
}

type HubAssetsTabProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function HubAssetsTab({ search, onSearchChange }: HubAssetsTabProps) {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [displayStatus, setDisplayStatus] = useState<string | undefined>();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: assetsSummary } = useGetIssuerHubAssetsSummaryQuery();
  const { data, isLoading, isFetching } = useListIssuerHubAssetsQuery({
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
    displayStatus,
  });

  const assets = data?.items ?? [];
  const pagination = data?.pagination;
  const totalAssets = assetsSummary?.totalAssets ?? pagination?.total ?? assets.length;
  const activeOfferingCount =
    assetsSummary?.activeOfferings ?? countActiveOfferings(assets);
  const loading = isLoading || isFetching;

  return (
    <div className="max-w-full min-w-0 space-y-6 animate-in fade-in duration-500 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Asset Portfolio</h3>
          <p className="text-xs text-text-muted">
            {totalAssets} asset{totalAssets === 1 ? '' : 's'} · {activeOfferingCount}{' '}
            active offering{activeOfferingCount === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/issuer/tokenize-asset"
          className="inline-flex justify-center rounded-full bg-primary px-6 py-2 text-[13px] font-bold text-white transition-colors hover:bg-issuer-primary-hover"
        >
          + New Asset
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {HUB_ASSET_STATUS_FILTERS.map((filter) => {
          const active = displayStatus === filter.value;
          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => setDisplayStatus(filter.value)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-card-border bg-card text-text-muted hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="relative md:hidden">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search assets..."
          className="h-9 w-full rounded-full border border-card-border bg-card py-1.5 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-3xl border border-card-border bg-surface"
            />
          ))
        ) : assets.length > 0 ? (
          assets.map((asset) => (
            <div
              key={asset.id}
              className="group flex cursor-pointer flex-col gap-4 rounded-3xl border border-card-border bg-card p-6 shadow-sm transition-colors hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
                    <Building2 className="h-5 w-5" strokeWidth={iconStroke} />
                  </MetricIconCircle>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {asset.name}
                      </h4>
                      <HubAssetStatusBadge status={asset.displayStatus} />
                      <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                        {asset.tag}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-text-muted">
                      Valuation: {asset.valuation} · Yield:{' '}
                      <span className="font-bold text-foreground">{asset.yield}</span> · Investors:{' '}
                      {asset.investors} · {asset.regulation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-foreground">{asset.progress}%</span>
                  <svg
                    className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 text-[10px] font-medium text-text-muted">
                  {asset.raised} raised of {asset.target}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className={`h-full ${ASSET_BAR_CLASS[asset.barKey] ?? ASSET_BAR_CLASS.draft}`}
                    style={{ width: `${asset.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-card-border bg-card px-6 py-14 text-center">
            <p className="text-sm font-bold text-foreground">No assets found</p>
            <p className="mt-1 text-xs text-text-muted">
              {debouncedSearch || displayStatus
                ? 'Try adjusting your search or filters.'
                : 'Create your first tokenized asset to get started.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
