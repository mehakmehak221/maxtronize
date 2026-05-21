'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Briefcase,
  Building2,
  DollarSign,
  Eye,
  FileText,
  MapPin,
  Share2,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import {
  formatPortfolioTokenPrice,
  type PortfolioAsset,
} from '@/lib/portfolio';
import { useGetPortfolioAssetQuery } from '@/store/api/portfolioApi';

const iconStroke = 1.75;

type TabId = 'overview' | 'financials' | 'details';

type TabDef = {
  id: TabId;
  label: string;
  Icon: LucideIcon;
};

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview', Icon: Eye },
  { id: 'financials', label: 'Financials', Icon: BarChart3 },
  { id: 'details', label: 'Details', Icon: FileText },
];

const statusRing: Record<string, string> = {
  Active: 'border-emerald-500/30',
  Raising: 'border-sky-500/35',
  Locked: 'border-zinc-500/30',
};

function formatUpdatedAt(iso: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function buildAboutText(asset: PortfolioAsset): string {
  const parts = [
    asset.name,
    asset.categoryLabel !== asset.categoryKey ? asset.categoryLabel : null,
    asset.location !== '—' ? asset.location : null,
    asset.compliance !== '—' ? asset.compliance : null,
    asset.blockchainNetwork !== '—'
      ? `Tokenized on ${asset.blockchainNetwork}`
      : null,
    asset.lockup !== '—' ? `Lock period: ${asset.lockup}` : null,
  ].filter(Boolean);
  if (parts.length === 0) {
    return 'Details for this asset will appear here once provided by the issuer.';
  }
  return `${parts.join('. ')}. This asset is currently ${asset.status.toLowerCase()} on the Maxtronize platform with a net asset value of ${asset.nav} and target yield of ${asset.apy} APY.`;
}

export type PortfolioAssetDetailViewProps = {
  assetId: string;
  backHref: string;
  backLabel?: string;
  manageHref?: string;
  manageLabel?: string;
};

export function PortfolioAssetDetailView({
  assetId,
  backHref,
  backLabel = 'Back',
  manageHref = '/issuer/hub',
  manageLabel = 'Manage in Hub',
}: PortfolioAssetDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [shareCopied, setShareCopied] = useState(false);
  const skip = !assetId;

  const {
    data: asset,
    isLoading,
    isError,
  } = useGetPortfolioAssetQuery(assetId, { skip });
  const isVerified =
    asset?.status.toLowerCase() === 'active' ||
    asset?.status.toLowerCase() === 'funded';

  const heroMetrics = useMemo(() => {
    if (!asset) return [];
    return [
      {
        label: 'Current Price',
        val: formatPortfolioTokenPrice(asset.tokenPriceRaw, asset.currency),
        Icon: DollarSign,
        valClass: 'text-white',
      },
      {
        label: 'Annual Yield',
        val: asset.apy,
        Icon: TrendingUp,
        valClass: 'text-emerald-400',
      },
      {
        label: 'NAV',
        val: asset.nav,
        Icon: Target,
        valClass: 'text-white',
      },
      {
        label: 'Investors',
        val: asset.investors,
        Icon: Users,
        valClass: 'text-white',
      },
    ];
  }, [asset]);

  if (!assetId) {
    return (
      <div className="rounded-[24px] border border-ui-border bg-ui-card p-10 text-center">
        <p className="text-sm font-medium text-ui-muted-text">
          Select an asset from your portfolio to view details.
        </p>
        <Link href={backHref} className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
          Back to portfolio
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-ui-muted-deep" />
        <div className="h-52 animate-pulse rounded-[32px] bg-ui-muted-deep md:h-72" />
        <div className="h-96 animate-pulse rounded-[28px] bg-ui-muted-deep" />
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-10 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
        <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
          Asset not found or unavailable.
        </p>
        <Link href={backHref} className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
          {backLabel}
        </Link>
      </div>
    );
  }

  const subtitleParts = [asset.location, asset.categoryLabel].filter(
    (p) => p && p !== '—',
  );
  const ring = statusRing[asset.status] ?? statusRing.Active;

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

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-2 text-[13px] font-bold text-ui-muted-text transition-colors hover:text-ui-strong"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={iconStroke} />
        {backLabel}
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 md:h-16 md:w-16 md:rounded-[18px]">
            <Building2 className="h-7 w-7 md:h-8 md:w-8" strokeWidth={iconStroke} />
          </div>
          <div className="min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-ui-strong md:text-2xl">
                {asset.name}
              </h1>
              {isVerified ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 ${ring} bg-emerald-50 dark:bg-emerald-500/10`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                  {asset.status}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ui-border bg-ui-muted-deep px-2.5 py-1 text-[10px] font-bold text-ui-muted-text">
                  {asset.status}
                </span>
              )}
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-ui-muted-text">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-ui-faint" strokeWidth={iconStroke} />
                {subtitleParts.join(' · ') || asset.location}
              </span>
              {asset.ticker !== '—' ? (
                <>
                  <span className="text-ui-placeholder" aria-hidden>
                    ·
                  </span>
                  <span className="font-bold text-primary">{asset.ticker}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 md:gap-3">
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
            href={manageHref}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-105"
          >
            <DollarSign className="h-4 w-4" strokeWidth={iconStroke} />
            {manageLabel}
          </Link>
        </div>
      </div>

      <div className="relative h-52 overflow-hidden rounded-[24px] shadow-xl md:h-72 md:rounded-[32px]">
        <Image
          src={asset.image}
          alt={asset.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-md md:left-6 md:top-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-white">{asset.status}</span>
        </div>
        {asset.ticker !== '—' ? (
          <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 backdrop-blur-md md:right-6 md:top-6">
            <span className="text-[10px] font-bold tracking-wider text-white">{asset.ticker}</span>
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {heroMetrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md md:p-4"
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <m.Icon
                    className={`h-3.5 w-3.5 ${m.valClass === 'text-emerald-400' ? 'text-emerald-400' : 'text-white/60'}`}
                    strokeWidth={iconStroke}
                  />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">
                    {m.label}
                  </p>
                </div>
                <p className={`text-lg font-bold tabular-nums md:text-xl ${m.valClass}`}>
                  {m.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="-mt-4 rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:-mt-6 md:rounded-[28px]">
        <div className="border-b border-ui-border p-4 md:p-6">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all ${
                    active
                      ? 'bg-primary/10 text-primary ring-1 ring-primary/15'
                      : 'text-ui-muted-text hover:bg-ui-muted-deep/80 hover:text-ui-body'
                  }`}
                >
                  <tab.Icon className="h-4 w-4" strokeWidth={iconStroke} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 md:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-base font-bold text-ui-strong md:text-lg">
                  About This Asset
                </h3>
                <p className="text-[13px] font-medium leading-relaxed text-ui-muted-text md:text-sm">
                  {buildAboutText(asset)}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-ui-strong md:text-lg">
                    Offering Snapshot
                  </h3>
                  <span className="text-base font-bold text-primary">{asset.apy}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ui-muted-deep">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: asset.apyPercent > 0 ? `${Math.min(asset.apyPercent, 100)}%` : '0%' }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-medium text-ui-faint">
                  <span>{asset.investors} investors</span>
                  <span>{asset.lockup !== '—' ? asset.lockup : 'No lock period'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: 'Token Price', val: asset.tokenPrice, sub: asset.ticker },
                  { label: 'Price Change', val: asset.priceChange, sub: '24h' },
                  { label: 'NAV', val: asset.nav, sub: asset.currency },
                  { label: 'APY', val: asset.apy, sub: 'Target yield' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-4"
                  >
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                      {s.label}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        s.label === 'APY' ? 'text-emerald-600 dark:text-emerald-400' : 'text-ui-strong'
                      }`}
                    >
                      {s.val}
                    </p>
                    <p className="text-[10px] font-medium text-ui-faint">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-4 text-base font-bold text-ui-strong md:text-lg">
                  Asset Location
                </h3>
                <div className="flex h-40 items-center justify-center rounded-2xl border border-ui-border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <div className="max-w-md px-6 text-center">
                    <MapPin
                      className="mx-auto mb-2 h-8 w-8 text-ui-faint"
                      strokeWidth={iconStroke}
                    />
                    <p className="text-[13px] font-bold text-ui-strong">{asset.location}</p>
                    <p className="text-[11px] font-medium text-ui-faint">
                      {asset.compliance !== '—' ? asset.compliance : asset.categoryLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: 'Net Asset Value (NAV)', val: asset.nav },
                { label: 'Token Price', val: asset.tokenPrice },
                { label: 'Annual Yield (APY)', val: asset.apy },
                { label: 'Price Change', val: asset.priceChange },
                { label: 'Total Investors', val: asset.investors },
                { label: 'Currency', val: asset.currency },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-5"
                >
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                    {f.label}
                  </p>
                  <p className="text-xl font-bold text-ui-strong">{f.val}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { label: 'Asset ID', val: asset.id },
                  { label: 'Ticker', val: asset.ticker },
                  { label: 'Category', val: asset.categoryLabel },
                  { label: 'Status', val: asset.status },
                  { label: 'Blockchain', val: asset.blockchainNetwork },
                  { label: 'Lock Period', val: asset.lockup },
                  { label: 'Last Updated', val: formatUpdatedAt(asset.updatedAt) },
                  { label: 'Regulation / Compliance', val: asset.compliance },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-5"
                  >
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                      {row.label}
                    </p>
                    <p className="break-all text-sm font-bold text-ui-strong">{row.val}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-ui-border bg-ui-muted-deep/30 px-4 py-3 text-[12px] font-medium text-ui-muted-text">
                <Briefcase className="h-4 w-4 shrink-0 text-ui-faint" strokeWidth={iconStroke} />
                Manage distributions, investors, and compliance from the Issuer Hub.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
