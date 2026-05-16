'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Brain,
  Building2,
  Check,
  DollarSign,
  Download,
  Eye,
  FileText,
  Heart,
  MapPin,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useMemo, useState } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import type { AssetDocument, AssetOffering, AssetTokenization } from '@/lib/assets';
import {
  useGetAssetDocumentsQuery,
  useGetAssetOfferingQuery,
  useGetAssetQuery,
  useGetAssetTokenizationQuery,
} from '@/store';

const iconStroke = 1.75;

type TabId = 'overview' | 'financials' | 'ai' | 'documents';

type TabDef = {
  id: TabId;
  label: string;
  Icon: LucideIcon;
  aiBadge?: boolean;
};

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview', Icon: Eye },
  { id: 'financials', label: 'Financials', Icon: BarChart3 },
  { id: 'ai', label: 'AI Intelligence', Icon: Brain, aiBadge: true },
  { id: 'documents', label: 'Documents', Icon: FileText },
];

const FALLBACK_FINANCIALS = [
  { label: 'Net Operating Income', val: '—' },
  { label: 'Cap Rate', val: '—' },
  { label: 'Occupancy Rate', val: '—' },
];

const AI_INSIGHTS = [
  {
    title: 'Undervaluation Signal',
    confidence: 92,
    desc: 'Token price is 12–15% below comparable assets. Strong buy signal based on DCF analysis.',
    color: 'text-ui-success-text',
    tag: 'Consider increasing position',
    tagClass:
      'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  {
    title: 'Tenant Risk Assessment',
    confidence: 88,
    desc: 'Fortune 500 tenant mix with 8.2yr avg lease term presents low default risk scenario.',
    color: 'text-primary',
    tag: 'Low Risk',
    tagClass: 'border-primary/20 bg-primary/5 text-primary',
  },
  {
    title: 'Market Timing',
    confidence: 76,
    desc: 'NYC office market showing recovery indicators. Q4 2026 expected to see 4–6% price appreciation.',
    color: 'text-amber-600 dark:text-amber-400',
    tag: 'Monitor quarterly',
    tagClass:
      'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400',
  },
];

function formatRaisedMillions(raised: number, target: number): { raisedLabel: string; targetLabel: string } {
  return {
    raisedLabel: `$${raised}M raised`,
    targetLabel: `Target: $${target}M`,
  };
}

function mergeOffering(
  assetPct: number,
  assetRaised: number,
  assetTarget: number,
  offering: AssetOffering | null | undefined,
) {
  const pct = offering?.progressPct ?? assetPct;
  const raised =
    offering?.raisedAmount != null
      ? offering.raisedAmount / (offering.raisedAmount > 1000 ? 1_000_000 : 1)
      : assetRaised;
  const target =
    offering?.targetRaise != null
      ? offering.targetRaise / (offering.targetRaise > 1000 ? 1_000_000 : 1)
      : assetTarget;
  return { pct, raised, target };
}

function AssetDetailContent() {
  const searchParams = useSearchParams();
  const assetId = searchParams.get('id') ?? '';
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [favorited, setFavorited] = useState(false);

  const skip = !assetId;
  const { data: asset, isLoading: assetLoading, isError: assetError } = useGetAssetQuery(assetId, { skip });
  const { data: offering } = useGetAssetOfferingQuery(assetId, { skip });
  const { data: tokenization } = useGetAssetTokenizationQuery(assetId, { skip });
  const { data: documents = [], isLoading: docsLoading } = useGetAssetDocumentsQuery(assetId, { skip });

  const progress = useMemo(() => {
    if (!asset) return { pct: 0, raised: 0, target: 0 };
    return mergeOffering(asset.pct, asset.raised, asset.target, offering);
  }, [asset, offering]);

  const heroMetrics = useMemo(() => {
    if (!asset) return [];
    const price = tokenization?.tokenPrice ?? '—';
    const apy = offering?.apy ?? asset.apy;
    const minInv = offering?.minInvestment ?? asset.minInv;
    const investors = String(offering?.investorCount ?? asset.investors);
    return [
      { label: 'Current Price', val: price, Icon: DollarSign, valClass: 'text-white' },
      { label: 'Annual Yield', val: apy, Icon: TrendingUp, valClass: 'text-emerald-400' },
      { label: 'Min. Investment', val: minInv, Icon: Target, valClass: 'text-white' },
      { label: 'Investors', val: investors, Icon: Users, valClass: 'text-white' },
    ];
  }, [asset, offering, tokenization]);

  const highlights = useMemo(() => {
    const fromAsset = asset?.highlights ?? [];
    const fromOffering = offering?.highlights ?? [];
    const merged = [...fromAsset, ...fromOffering];
    return merged.length > 0 ? [...new Set(merged)] : [];
  }, [asset, offering]);

  const financials = asset?.financials?.length ? asset.financials : FALLBACK_FINANCIALS;
  const { raisedLabel, targetLabel } = formatRaisedMillions(progress.raised, progress.target);

  if (!assetId) {
    return (
      <div className="rounded-[24px] border border-ui-border bg-ui-card p-10 text-center">
        <p className="text-sm font-medium text-ui-muted-text">Select an asset from the marketplace to view details.</p>
        <Link href="/investor/marketplace" className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
          Browse marketplace
        </Link>
      </div>
    );
  }

  if (assetLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-ui-muted-deep" />
        <div className="h-52 animate-pulse rounded-[32px] bg-ui-muted-deep md:h-72" />
        <div className="h-96 animate-pulse rounded-[28px] bg-ui-muted-deep" />
      </div>
    );
  }

  if (assetError || !asset) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-10 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
        <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Asset not found or unavailable.</p>
        <Link href="/investor/marketplace" className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const tokenTicker = tokenization?.ticker ?? '—';
  const daysLeft = offering?.closingDays ?? asset.daysLeft;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
      <Link
        href="/investor/marketplace"
        className="inline-flex w-fit items-center gap-2 text-[13px] font-bold text-ui-muted-text transition-colors hover:text-ui-strong"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={iconStroke} />
        Back
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 md:h-16 md:w-16 md:rounded-[18px]">
            <Building2 className="h-7 w-7 md:h-8 md:w-8" strokeWidth={iconStroke} />
          </div>
          <div className="min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-ui-strong md:text-2xl">{asset.name}</h1>
              {asset.verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <BadgeCheck className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                  Verified
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-ui-muted-text">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-ui-faint" strokeWidth={iconStroke} />
                {asset.location}
              </span>
              <span className="text-ui-placeholder" aria-hidden>
                ·
              </span>
              <span>{asset.type}</span>
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
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-105"
          >
            <DollarSign className="h-4 w-4" strokeWidth={iconStroke} />
            Invest Now
          </button>
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
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">{m.label}</p>
                </div>
                <p className={`text-lg font-bold tabular-nums md:text-xl ${m.valClass}`}>{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="-mt-4 rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:-mt-6 md:rounded-[28px] dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
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
                  {tab.aiBadge ? (
                    <span className="rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      AI
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 md:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-base font-bold text-ui-strong md:text-lg">About This Asset</h3>
                <p className="text-[13px] font-medium leading-relaxed text-ui-muted-text md:text-sm">
                  {asset.description ??
                    'Details for this asset will appear here once provided by the issuer.'}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-ui-strong md:text-lg">Fundraising Progress</h3>
                  <span className="text-base font-bold text-primary">{progress.pct}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ui-muted-deep">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${progress.pct}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-medium text-ui-faint">
                  <span>{raisedLabel}</span>
                  <span>{targetLabel}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: 'Token Price', val: tokenization?.tokenPrice ?? '—', sub: tokenTicker },
                  { label: 'Total Tokens', val: tokenization?.totalSupply ?? '—', sub: 'Supply' },
                  { label: 'Investors', val: String(offering?.investorCount ?? asset.investors), sub: 'Count' },
                  {
                    label: 'Closing',
                    val: daysLeft > 0 ? `${daysLeft} days` : '—',
                    sub: 'Remaining',
                  },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-4">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{s.label}</p>
                    <p className="text-lg font-bold text-ui-strong">{s.val}</p>
                    <p className="text-[10px] font-medium text-ui-faint">{s.sub}</p>
                  </div>
                ))}
              </div>

              {highlights.length > 0 ? (
                <div>
                  <h3 className="mb-4 text-base font-bold text-ui-strong md:text-lg">Key Highlights</h3>
                  <ul className="space-y-3">
                    {highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <p className="text-[13px] font-medium text-ui-body">{h}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <h3 className="mb-4 text-base font-bold text-ui-strong md:text-lg">Asset Location</h3>
                <div className="flex h-40 items-center justify-center rounded-2xl border border-ui-border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-ui-faint" strokeWidth={iconStroke} />
                    <p className="text-[13px] font-bold text-ui-strong">{asset.location}</p>
                    <p className="text-[11px] font-medium text-ui-faint">{asset.type}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {financials.map((f) => (
                  <div key={f.label} className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-5">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{f.label}</p>
                    <p className="text-xl font-bold text-ui-strong">{f.val}</p>
                  </div>
                ))}
              </div>
              {tokenization?.network ? (
                <div className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-5">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Tokenization</p>
                  <p className="text-sm font-medium text-ui-body">
                    {tokenization.network}
                    {tokenization.standard ? ` · ${tokenization.standard}` : ''}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="rounded-[24px] bg-gradient-to-r from-primary to-violet-600 p-6 text-white md:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <Sparkles className="h-5 w-5" strokeWidth={iconStroke} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">AI Asset Analysis</h3>
                    <p className="text-[11px] text-white/70">Powered by Maxtronize Intelligence Engine</p>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-white/85">
                  AI insights for {asset.name} are generated from market data and offering fundamentals.
                </p>
              </div>
              {AI_INSIGHTS.map((insight) => (
                <div
                  key={insight.title}
                  className="rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm md:p-6"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h4 className="text-[13px] font-bold text-ui-strong">{insight.title}</h4>
                    <span className={`flex shrink-0 items-center gap-1.5 text-[11px] font-bold ${insight.color}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  <p className="mb-3 text-[12px] font-medium leading-relaxed text-ui-muted-text">{insight.desc}</p>
                  <span className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold ${insight.tagClass}`}>
                    {insight.tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <DocumentsTab documents={documents} loading={docsLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({
  documents,
  loading,
}: {
  documents: AssetDocument[];
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-ui-border shadow-sm">
      <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-7">
        <div>
          <h3 className="text-base font-bold text-ui-strong">Asset Documents</h3>
          <p className="mt-0.5 text-xs text-ui-faint">Offering memoranda, legal, and financial files</p>
        </div>
      </div>
      {loading ? (
        <div className="p-8 text-center text-sm text-ui-faint">Loading documents…</div>
      ) : documents.length === 0 ? (
        <div className="p-8 text-center text-sm text-ui-faint">No documents published for this asset yet.</div>
      ) : (
        <div className="divide-y divide-ui-divider">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentRow({ doc }: { doc: AssetDocument }) {
  const inner = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-faint transition-all group-hover:bg-primary group-hover:text-white">
        <FileText className="h-4 w-4" strokeWidth={iconStroke} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">
          {doc.name}
        </p>
        <p className="text-[10px] font-medium text-ui-faint">
          {doc.type} · {doc.size} · {doc.date}
        </p>
      </div>
      <Download className="h-4 w-4 shrink-0 text-ui-placeholder transition-colors group-hover:text-primary" strokeWidth={iconStroke} />
    </>
  );

  if (doc.url) {
    return (
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-ui-muted-deep/50 md:px-7"
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="group flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-ui-muted-deep/50 md:px-7"
    >
      {inner}
    </button>
  );
}

function AssetDetailFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="h-8 w-24 animate-pulse rounded-lg bg-ui-muted-deep" />
      <div className="h-52 animate-pulse rounded-[32px] bg-ui-muted-deep md:h-72" />
      <div className="h-96 animate-pulse rounded-[28px] bg-ui-muted-deep" />
    </div>
  );
}

export default function AssetDetailPage() {
  return (
    <InvestorLayout pageTitle="Asset Details">
      <Suspense fallback={<AssetDetailFallback />}>
        <AssetDetailContent />
      </Suspense>
    </InvestorLayout>
  );
}
