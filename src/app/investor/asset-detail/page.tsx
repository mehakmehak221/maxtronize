"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Brain,
  Building2,
  Check,
  Copy,
  DollarSign,
  Download,
  Eye,
  FileText,
  Loader2,
  Heart,
  MapPin,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import InvestorLayout from "@/components/InvestorLayout";
import { useIsClient } from "@/hooks/useIsClient";
import { MarketplaceAssetCover } from "@/components/investor/MarketplaceAssetCover";
import type {
  AssetDocument,
  AssetOffering,
  AssetTokenization,
} from "@/lib/assets";
import {
  isKycPendingReview,
  isKycRejected,
  isKycVerified,
  isProfileComplete,
} from "@/lib/profile";
import { useAuthenticatedProfileQuery } from "@/store/api/authApi";
import {
  useGetMarketplaceOpportunityQuery,
  useGetMarketplaceOpportunityDocumentsQuery,
  useGetMarketplaceOpportunityFinancialsQuery,
  useGetMarketplaceOpportunityInitQuery,
  useGetMarketplaceOpportunityOverviewQuery,
  useGetMarketplaceOpportunityInvestPreviewQuery,
  useInvestInMarketplaceOpportunityMutation,
  useAddOpportunityToWatchlistMutation,
  useRemoveOpportunityFromWatchlistMutation,
  useGetSecondaryListingQuery,
  useListSecondaryListingsQuery,
  usePlaceSecondaryOrderMutation,
} from "@/store";

const iconStroke = 1.75;

type TabId = "overview" | "financials" | "ai" | "documents";

type TabDef = {
  id: TabId;
  label: string;
  Icon: LucideIcon;
  aiBadge?: boolean;
};

const TABS: TabDef[] = [
  { id: "overview", label: "Overview", Icon: Eye },
  { id: "financials", label: "Financials", Icon: BarChart3 },
  { id: "ai", label: "AI Intelligence", Icon: Brain, aiBadge: true },
  { id: "documents", label: "Documents", Icon: FileText },
];

const FALLBACK_FINANCIALS = [
  { label: "Net Operating Income", val: "—" },
  { label: "Cap Rate", val: "—" },
  { label: "Occupancy Rate", val: "—" },
];

const AI_INSIGHTS = [
  {
    title: "Undervaluation Signal",
    confidence: 92,
    desc: "Token price is 12–15% below comparable assets. Strong buy signal based on DCF analysis.",
    color: "text-ui-success-text",
    tag: "Consider increasing position",
    tagClass:
      "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    title: "Tenant Risk Assessment",
    confidence: 88,
    desc: "Fortune 500 tenant mix with 8.2yr avg lease term presents low default risk scenario.",
    color: "text-primary",
    tag: "Low Risk",
    tagClass: "border-primary/20 bg-primary/5 text-primary",
  },
  {
    title: "Market Timing",
    confidence: 76,
    desc: "NYC office market showing recovery indicators. Q4 2026 expected to see 4–6% price appreciation.",
    color: "text-amber-600 dark:text-amber-400",
    tag: "Monitor quarterly",
    tagClass:
      "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400",
  },
];

function formatRaisedMillions(
  raised: number,
  target: number,
): { raisedLabel: string; targetLabel: string } {
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
  const assetId = searchParams.get("id") ?? "";
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const skip = !assetId;
  const {
    data: asset,
    isLoading: assetLoading,
    isError: assetError,
  } = useGetMarketplaceOpportunityQuery(assetId, { skip });
  const { data: initData } = useGetMarketplaceOpportunityInitQuery(assetId, {
    skip,
  });
  const { data: overviewData } = useGetMarketplaceOpportunityOverviewQuery(
    assetId,
    { skip },
  );
  const { data: financialsData } = useGetMarketplaceOpportunityFinancialsQuery(
    assetId,
    { skip },
  );
  const { data: documents = [], isLoading: docsLoading } =
    useGetMarketplaceOpportunityDocumentsQuery(assetId, { skip });

  const [addWatchlist, { isLoading: addLoading }] =
    useAddOpportunityToWatchlistMutation();
  const [removeWatchlist, { isLoading: removeLoading }] =
    useRemoveOpportunityFromWatchlistMutation();

  const offering = initData?.offering;
  const tokenization = initData?.tokenization;

  const favorited = asset?.watchlist ?? false;

  const handleFavoriteToggle = async () => {
    if (addLoading || removeLoading) return;
    if (favorited) {
      await removeWatchlist(assetId);
    } else {
      await addWatchlist(assetId);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
    } catch {
      setShareCopied(false);
    }
  };

  const progress = useMemo(() => {
    if (!asset) return { pct: 0, raised: 0, target: 0 };
    const rawRaised = overviewData?.progress.raised ?? asset.raised;
    const rawTarget = overviewData?.progress.target ?? asset.target;
    const rawPct = overviewData?.progress.pct ?? asset.pct;
    return mergeOffering(rawPct, rawRaised, rawTarget, offering);
  }, [asset, offering, overviewData]);

  const heroMetrics = useMemo(() => {
    if (!asset) return [];
    const price = tokenization?.tokenPrice ?? "—";
    const apy = offering?.apy ?? asset.apy;
    const minInv = offering?.minInvestment ?? asset.minInv;
    const investors = String(offering?.investorCount ?? asset.investors);
    return [
      {
        label: "Current Price",
        val: price,
        Icon: DollarSign,
        valClass: "text-white",
      },
      {
        label: "Annual Yield",
        val: apy,
        Icon: TrendingUp,
        valClass: "text-emerald-400",
      },
      {
        label: "Min. Investment",
        val: minInv,
        Icon: Target,
        valClass: "text-white",
      },
      {
        label: "Investors",
        val: investors,
        Icon: Users,
        valClass: "text-white",
      },
    ];
  }, [asset, offering, tokenization]);

  const highlights = useMemo(() => {
    const fromOverview = overviewData?.highlights ?? [];
    const fromAsset = asset?.highlights ?? [];
    const fromOffering = offering?.highlights ?? [];
    const merged = [...fromOverview, ...fromAsset, ...fromOffering];
    return merged.length > 0 ? [...new Set(merged)] : [];
  }, [asset, offering, overviewData]);

  const financials = useMemo(() => {
    if (financialsData?.length) return financialsData;
    return asset?.financials?.length ? asset.financials : FALLBACK_FINANCIALS;
  }, [financialsData, asset]);

  const description = overviewData?.description ?? asset?.description;
  const { raisedLabel, targetLabel } = formatRaisedMillions(
    progress.raised,
    progress.target,
  );

  if (!assetId) {
    return (
      <div className="rounded-[24px] border border-ui-border bg-ui-card p-10 text-center">
        <p className="text-base font-medium text-ui-muted-text">
          Select an asset from the marketplace to view details.
        </p>
        <Link
          href="/investor/marketplace"
          className="mt-4 inline-flex text-base font-bold text-primary hover:underline"
        >
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
        <p className="text-base font-bold text-rose-700 dark:text-rose-300">
          Asset not found or unavailable.
        </p>
        <Link
          href="/investor/marketplace"
          className="mt-4 inline-flex text-base font-bold text-primary hover:underline"
        >
          Back to marketplace
        </Link>
      </div>
    );
  }

  const tokenTicker = tokenization?.ticker ?? "—";
  const daysLeft = offering?.closingDays ?? asset.daysLeft;

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
        <Link
          href="/investor/marketplace"
          className="inline-flex w-fit items-center gap-2 text-base font-bold text-ui-muted-text transition-colors hover:text-ui-strong"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={iconStroke} />
          Back
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 md:h-16 md:w-16 md:rounded-[18px]">
              <Building2
                className="h-7 w-7 md:h-8 md:w-8"
                strokeWidth={iconStroke}
              />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-ui-strong md:text-2xl">
                  {asset.name}
                </h1>
                {asset.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <BadgeCheck
                      className="h-3.5 w-3.5"
                      strokeWidth={iconStroke}
                    />
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm font-medium text-ui-muted-text">
                <span className="inline-flex items-center gap-1">
                  <MapPin
                    className="h-3.5 w-3.5 shrink-0 text-ui-faint"
                    strokeWidth={iconStroke}
                  />
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
              onClick={handleFavoriteToggle}
              disabled={addLoading || removeLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ui-border text-ui-faint transition-colors hover:border-primary/30 hover:text-primary disabled:opacity-50"
              aria-label={
                favorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`h-4 w-4 ${favorited ? "fill-primary text-primary" : ""}`}
                strokeWidth={iconStroke}
              />
            </button>
            <button
              type="button"
              onClick={() => void handleShare()}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                shareCopied
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-ui-border text-ui-faint hover:border-primary/30 hover:text-primary"
              }`}
              aria-label={shareCopied ? "Link copied" : "Share"}
            >
              <Share2 className="h-4 w-4" strokeWidth={iconStroke} />
            </button>
            <button
              type="button"
              onClick={() => setIsInvestModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-105"
            >
              <DollarSign className="h-4 w-4" strokeWidth={iconStroke} />
              Invest Now
            </button>
          </div>
        </div>

        <div className="relative h-52 overflow-hidden rounded-[24px] shadow-xl md:h-72 md:rounded-[32px]">
          <MarketplaceAssetCover
            image={asset.image}
            alt={asset.name}
            assetType={asset.type}
            className="h-full w-full"
            imageClassName="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {heroMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md md:p-4"
                  >
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <m.Icon
                        className={`h-3.5 w-3.5 ${m.valClass === "text-emerald-400" ? "text-emerald-400" : "text-white/60"}`}
                        strokeWidth={iconStroke}
                      />
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">
                        {m.label}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold tabular-nums md:text-xl ${m.valClass}`}
                    >
                      {m.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MarketplaceAssetCover>
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
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-base font-bold transition-all ${
                      active
                        ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                        : "text-ui-muted-text hover:bg-ui-muted-deep/80 hover:text-ui-body"
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
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-base font-bold text-ui-strong md:text-lg">
                    About This Asset
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-ui-muted-text md:text-base">
                    {description ??
                      "Details for this asset will appear here once provided by the issuer."}
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-bold text-ui-strong md:text-lg">
                      Fundraising Progress
                    </h3>
                    <span className="text-base font-bold text-primary">
                      {progress.pct}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-ui-muted-deep">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${progress.pct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-medium text-ui-faint">
                    <span>{raisedLabel}</span>
                    <span>{targetLabel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    {
                      label: "Token Price",
                      val: tokenization?.tokenPrice ?? "—",
                      sub: tokenTicker,
                    },
                    {
                      label: "Total Tokens",
                      val: tokenization?.totalSupply ?? "—",
                      sub: "Supply",
                    },
                    {
                      label: "Investors",
                      val: String(offering?.investorCount ?? asset.investors),
                      sub: "Count",
                    },
                    {
                      label: "Closing",
                      val: daysLeft > 0 ? `${daysLeft} days` : "—",
                      sub: "Remaining",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-4"
                    >
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                        {s.label}
                      </p>
                      <p className="text-lg font-bold text-ui-strong">
                        {s.val}
                      </p>
                      <p className="text-xs font-medium text-ui-faint">
                        {s.sub}
                      </p>
                    </div>
                  ))}
                </div>

                {highlights.length > 0 ? (
                  <div>
                    <h3 className="mb-4 text-base font-bold text-ui-strong md:text-lg">
                      Key Highlights
                    </h3>
                    <ul className="space-y-3">
                      {highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <p className="text-base font-medium text-ui-body">
                            {h}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <h3 className="mb-4 text-base font-bold text-ui-strong md:text-lg">
                    Asset Location
                  </h3>
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-ui-border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    <div className="text-center">
                      <MapPin
                        className="mx-auto mb-2 h-8 w-8 text-ui-faint"
                        strokeWidth={iconStroke}
                      />
                      <p className="text-base font-bold text-ui-strong">
                        {asset.location}
                      </p>
                      <p className="text-xs font-medium text-ui-faint">
                        {asset.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "financials" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {financials.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-5"
                    >
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                        {f.label}
                      </p>
                      <p className="text-xl font-bold text-ui-strong">
                        {f.val}
                      </p>
                    </div>
                  ))}
                </div>
                {tokenization?.network ? (
                  <div className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-5">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                      Tokenization
                    </p>
                    <p className="text-base font-medium text-ui-body">
                      {tokenization.network}
                      {tokenization.standard
                        ? ` · ${tokenization.standard}`
                        : ""}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-4">
                <div className="rounded-[24px] bg-gradient-to-r from-primary to-violet-600 p-6 text-white md:p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <Sparkles className="h-5 w-5" strokeWidth={iconStroke} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">AI Asset Analysis</h3>
                      <p className="text-xs text-white/70">
                        Powered by Maxtronize Intelligence Engine
                      </p>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-white/85">
                    AI insights for {asset.name} are generated from market data
                    and offering fundamentals.
                  </p>
                </div>
                {AI_INSIGHTS.map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm md:p-6"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h4 className="text-base font-bold text-ui-strong">
                        {insight.title}
                      </h4>
                      <span
                        className={`flex shrink-0 items-center gap-1.5 text-xs font-bold ${insight.color}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="mb-3 text-sm font-medium leading-relaxed text-ui-muted-text">
                      {insight.desc}
                    </p>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${insight.tagClass}`}
                    >
                      {insight.tag}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "documents" && (
              <DocumentsTab documents={documents} loading={docsLoading} />
            )}
          </div>
        </div>
      </div>

      {isInvestModalOpen && asset && (
        <InvestModal
          assetId={assetId}
          assetName={asset.name}
          minimumInvestmentLabel={offering?.minInvestment ?? asset.minInv}
          annualYield={offering?.apy ?? asset.apy}
          tokenization={tokenization}
          onClose={() => setIsInvestModalOpen(false)}
        />
      )}
    </>
  );
}

// ── CopyButton Helper ───────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border transition-all ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          : "border-ui-border text-ui-muted-text hover:bg-ui-muted-deep/50 hover:text-ui-strong"
      }`}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" strokeWidth={2.5} />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" strokeWidth={iconStroke} />
          Copy
        </>
      )}
    </button>
  );
}

// ── InvestModal ─────────────────────────────────────────────────────────────────
function InvestModal({
  assetId,
  assetName,
  minimumInvestmentLabel,
  annualYield,
  tokenization,
  onClose,
}: {
  assetId: string;
  assetName: string;
  minimumInvestmentLabel: string | null | undefined;
  annualYield: string | null | undefined;
  tokenization: import("@/lib/assets").AssetTokenization | null | undefined;
  onClose: () => void;
}) {
  const [marketMode, setMarketMode] = useState<"primary" | "secondary">(
    "primary",
  );
  const [selectedListingId, setSelectedListingId] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [successData, setSuccessData] = useState<{
    investmentId?: string | null;
    transactionId?: string | null;
    amount: number;
    tokenAmount: number;
    pricePerToken: number;
    type: "primary" | "secondary";
  } | null>(null);

  const mounted = useIsClient();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const amountValue = Number.parseFloat(investmentAmount) || 0;
  const quantityValue = Number.parseFloat(quantity) || 0;
  const { data: profile } = useAuthenticatedProfileQuery();

  const { data: listingsResult, isLoading: listingsLoading } =
    useListSecondaryListingsQuery({
      limit: 50,
    });
  const [placeOrder, { isLoading: isPlacing }] =
    usePlaceSecondaryOrderMutation();
  const [investInOpportunity, { isLoading: isInvesting }] =
    useInvestInMarketplaceOpportunityMutation();

  // Filter listings that match this asset's id
  const assetListings = useMemo(() => {
    const all = listingsResult?.items ?? [];
    return all.filter((l) => l.assetId === assetId);
  }, [listingsResult, assetId]);

  // Auto-select first listing using derived state
  const effectiveSelectedListingId =
    selectedListingId || (assetListings.length > 0 ? assetListings[0].id : "");

  const { data: selectedListingDetail } = useGetSecondaryListingQuery(
    effectiveSelectedListingId,
    {
      skip: !effectiveSelectedListingId,
    },
  );

  const selectedListing =
    selectedListingDetail ??
    assetListings.find((l) => l.id === effectiveSelectedListingId) ??
    assetListings[0] ??
    null;

  const minimumInvestmentValue = useMemo(() => {
    const raw = String(minimumInvestmentLabel ?? "").replace(/[^0-9.]/g, "");
    return Number.parseFloat(raw) || 0;
  }, [minimumInvestmentLabel]);

  const primaryTokenPrice = useMemo(() => {
    const rawTokenPrice = String(tokenization?.tokenPrice ?? "").replace(
      /[^0-9.]/g,
      "",
    );
    return Number.parseFloat(rawTokenPrice) || 0;
  }, [tokenization?.tokenPrice]);

  const {
    data: investPreview,
    isFetching: previewLoading,
    error: previewError,
  } = useGetMarketplaceOpportunityInvestPreviewQuery(
    {
      id: assetId,
      amount: amountValue,
      currency: "USD",
    },
    {
      skip:
        marketMode !== "primary" ||
        amountValue <= 0 ||
        !isProfileComplete(profile) ||
        isKycPendingReview(profile) ||
        isKycRejected(profile),
    },
  );

  const formatRequestError = (error: unknown) => {
    if (!error || typeof error !== "object")
      return "Something went wrong. Please try again.";
    const record = error as {
      data?: { message?: string | string[] };
      message?: string;
      error?: string;
    };
    const message = record.data?.message ?? record.message ?? record.error;
    if (Array.isArray(message)) return message.join(", ");
    return message || "Something went wrong. Please try again.";
  };

  const previewErrorText = previewError
    ? formatRequestError(previewError)
    : null;
  const previewErrorLower = previewErrorText?.toLowerCase() ?? "";
  const requiresKycVerification =
    previewErrorLower.includes("kyc verification is required") ||
    previewErrorLower.includes("kyc") ||
    previewErrorLower.includes("verification is required");
  const requiresFunding = investPreview?.requiresFunding ?? false;
  const profileIncomplete = !isProfileComplete(profile);
  const profileKycVerified = isKycVerified(profile);
  const profilePendingReview = isKycPendingReview(profile);
  const profileRejected = isKycRejected(profile);
  const verificationBlocked =
    profileIncomplete ||
    profilePendingReview ||
    profileRejected ||
    requiresKycVerification;

  const secondaryPriceNum = selectedListing
    ? selectedListing.pricePerTokenValue ||
      Number.parseFloat(
        selectedListing.pricePerToken.replace(/[^0-9.]/g, ""),
      ) ||
      0
    : 0;
  const primaryPriceNum = investPreview?.pricePerToken ?? primaryTokenPrice;
  const total =
    marketMode === "secondary"
      ? (quantityValue * secondaryPriceNum).toFixed(2)
      : (investPreview?.totalDebit ?? amountValue).toFixed(2);
  const displayTicker =
    selectedListing?.ticker ?? tokenization?.ticker ?? "TOKEN";
  const estimatedPrimaryTokens =
    investPreview?.tokenAmount ??
    (primaryPriceNum > 0 && amountValue > 0
      ? amountValue / primaryPriceNum
      : null);
  const quickAmounts = useMemo(() => {
    const base = minimumInvestmentValue > 0 ? minimumInvestmentValue : 1000;
    return Array.from(
      new Set(
        [base, base * 2, base * 5, base * 10].map((value) =>
          Math.max(500, Math.round(value / 100) * 100),
        ),
      ),
    ).slice(0, 4);
  }, [minimumInvestmentValue]);

  const handlePrimaryInvest = async () => {
    if (isInvesting || amountValue <= 0) return;

    if (profileIncomplete) {
      setStatusMsg({
        type: "error",
        text: "Complete your investor profile first so it can be submitted for verification.",
      });
      return;
    }

    if (profilePendingReview) {
      setStatusMsg({
        type: "error",
        text: "Your investor verification is under admin review. Investment will unlock after approval.",
      });
      return;
    }

    if (profileRejected || requiresKycVerification) {
      setStatusMsg({
        type: "error",
        text: "Investor verification is required before you can invest in this asset.",
      });
      return;
    }

    if (minimumInvestmentValue > 0 && amountValue < minimumInvestmentValue) {
      setStatusMsg({
        type: "error",
        text: `Minimum investment for this opportunity is $${minimumInvestmentValue.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}.`,
      });
      return;
    }

    if (requiresFunding) {
      setStatusMsg({
        type: "error",
        text:
          investPreview?.note ||
          "Your wallet balance is not sufficient for this investment amount.",
      });
      return;
    }

    try {
      const result = await investInOpportunity({
        id: assetId,
        amount: amountValue,
        currency: investPreview?.currency || "USD",
        tokenAmount: estimatedPrimaryTokens,
      }).unwrap();

      setSuccessData({
        investmentId: result.investmentId,
        transactionId: result.transactionId,
        amount: result.amount || amountValue,
        tokenAmount: result.tokenAmount || estimatedPrimaryTokens || 0,
        pricePerToken: primaryPriceNum || 0,
        type: "primary",
      });

      setStatusMsg({
        type: "success",
        text:
          result.message ||
          `Investment confirmed for $${amountValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} in ${assetName}.`,
      });
      setInvestmentAmount("");
    } catch (error) {
      setStatusMsg({
        type: "error",
        text: formatRequestError(error),
      });
    }
  };

  interface OrderResponse {
    transactionId?: string;
    transaction_id?: string;
    id?: string;
    investmentId?: string;
    orderId?: string;
    order_id?: string;
    amountUsd?: number;
    amount_usd?: number;
    amount?: number;
    tokensOwned?: number;
    tokens_owned?: number;
    tokenAmount?: number;
    token_amount?: number;
  }

  const handleSecondaryInvest = async () => {
    if (!selectedListing || !quantity || isPlacing) return;
    if (profileIncomplete) {
      setStatusMsg({
        type: "error",
        text: "Complete your investor profile first so it can be submitted for verification.",
      });
      return;
    }
    if (profilePendingReview) {
      setStatusMsg({
        type: "error",
        text: "Your investor verification is under admin review. Trading will unlock after approval.",
      });
      return;
    }
    if (profileRejected || (!profileKycVerified && requiresKycVerification)) {
      setStatusMsg({
        type: "error",
        text: "Investor verification is required before you can trade this asset.",
      });
      return;
    }
    if (secondaryPriceNum <= 0) {
      setStatusMsg({
        type: "error",
        text: "This listing does not currently have a valid token price. Please select another listing or refresh and try again.",
      });
      return;
    }
    setStatusMsg(null);
    try {
      const result = await placeOrder({
        id: selectedListing.id,
        side: "BUY",
        orderType: "MARKET",
        tokenAmount: quantityValue,
        pricePerToken: secondaryPriceNum,
      }).unwrap();

      const resObj =
        result && typeof result === "object" ? (result as OrderResponse) : {};
      const txId =
        resObj.transactionId ?? resObj.transaction_id ?? resObj.id ?? null;

      const invId =
        resObj.investmentId ?? resObj.orderId ?? resObj.order_id ?? null;
      const finalAmount =
        resObj.amountUsd ??
        resObj.amount_usd ??
        resObj.amount ??
        quantityValue * secondaryPriceNum;
      const finalTokens =
        resObj.tokensOwned ??
        resObj.tokens_owned ??
        resObj.tokenAmount ??
        resObj.token_amount ??
        quantityValue;

      setSuccessData({
        investmentId: invId,
        transactionId: txId,
        amount: finalAmount,
        tokenAmount: finalTokens,
        pricePerToken: secondaryPriceNum,
        type: "secondary",
      });

      setStatusMsg({
        type: "success",
        text: `Successfully placed a BUY order for ${quantity} ${displayTicker} tokens at $${secondaryPriceNum.toFixed(2)} per token.`,
      });
      setQuantity("");
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: formatRequestError(err),
      });
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Invest in asset"
    >
      {/* Backdrop - Static full-screen dark overlay with blur */}
      <div
        className="absolute inset-0 bg-zinc-950/55 dark:bg-zinc-950/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      {/* Scrollable Container Wrapper */}
      <div className="absolute inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-6">
        {/* Panel */}
        <div className="relative z-10 my-auto w-full max-w-md overflow-hidden rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 bg-gradient-to-r from-primary/10 via-violet-600/5 to-transparent px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <ShoppingBag className="h-4 w-4" strokeWidth={iconStroke} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-100">
                  {successData ? "Investment Confirmed" : "Invest Now"}
                </h2>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {assetName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-850 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={iconStroke} />
            </button>
          </div>

          {successData ? (
            /* Premium Transaction Success Confirmation Screen */
            <div className="p-6 space-y-6 text-center">
              {/* Emerald Checkmark Circle */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-all scale-100 animate-pulse">
                <BadgeCheck className="h-10 w-10" strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                  Investment Successful!
                </h3>
                <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed px-4">
                  Your order has been executed on the blockchain network and
                  credited to your investor portfolio.
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-base font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active / Settled
              </div>

              {/* Transaction Receipt Table */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/30 p-4 text-left space-y-3.5">
                <div className="flex justify-between items-center text-base">
                  <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                    Asset Name
                  </span>
                  <span
                    className="text-zinc-800 dark:text-zinc-100 font-bold text-right truncate max-w-[200px]"
                    title={assetName}
                  >
                    {assetName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                    Market Mode
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-100 font-bold capitalize">
                    {successData.type === "primary"
                      ? "Primary Marketplace"
                      : "Secondary Trading"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                    Invested Amount
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-100 font-extrabold text-base tabular-nums">
                    $
                    {successData.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                    Tokens Received
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-100 font-extrabold tabular-nums">
                    {successData.tokenAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}{" "}
                    {displayTicker}
                  </span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                    Price / Token
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-100 font-bold tabular-nums">
                    ${successData.pricePerToken.toFixed(2)}
                  </span>
                </div>

                {successData.transactionId && (
                  <div className="pt-2.5 border-t border-zinc-150 dark:border-zinc-800/80 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
                      Transaction ID
                    </span>
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2">
                      <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 truncate select-all">
                        {successData.transactionId}
                      </span>
                      <div className="pointer-events-auto">
                        <CopyButton text={successData.transactionId} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Success Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/investor/portfolio"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 py-3.5 text-base font-bold text-white shadow-md shadow-primary/20 transition-all hover:brightness-110"
                >
                  <TrendingUp className="h-4 w-4" strokeWidth={iconStroke} />
                  Go to Portfolio
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3.5 text-base font-bold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            /* Normal Investment Form */
            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-1">
                <button
                  type="button"
                  onClick={() => setMarketMode("primary")}
                  className={`rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    marketMode === "primary"
                      ? "bg-primary text-white shadow-[0_10px_24px_-12px_rgba(124,58,237,0.7)]"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/85 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Primary Market
                </button>
                <button
                  type="button"
                  onClick={() => setMarketMode("secondary")}
                  className={`rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    marketMode === "secondary"
                      ? "bg-primary text-white shadow-[0_10px_24px_-12px_rgba(124,58,237,0.7)]"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/85 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Secondary ({assetListings.length})
                </button>
              </div>

              {/* Status */}
              {statusMsg && (
                <div
                  key={`${selectedListingId}-${quantity}-${investmentAmount}-${marketMode}`}
                  className={`rounded-xl border px-4 py-3.5 text-sm font-semibold leading-relaxed ${
                    statusMsg.type === "success"
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              {profileIncomplete ? (
                <div className="space-y-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
                  <p>
                    Complete your investor profile before using protected
                    investment flows.
                  </p>
                  <Link
                    href="/setup-profile"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-200 transition-colors hover:text-ui-strong"
                  >
                    Complete setup profile
                    <ArrowLeft
                      className="h-3.5 w-3.5 rotate-180"
                      strokeWidth={iconStroke}
                    />
                  </Link>
                </div>
              ) : null}

              {profilePendingReview ? (
                <div className="space-y-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
                  <p>
                    Your investor profile has been submitted and is awaiting
                    admin review.
                  </p>
                  <p className="text-xs font-medium text-amber-600/90 dark:text-amber-200/90">
                    Investment actions will unlock after your KYC verification
                    is approved.
                  </p>
                  <Link
                    href="/investor/account"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-200 transition-colors hover:text-ui-strong"
                  >
                    View verification status
                    <ArrowLeft
                      className="h-3.5 w-3.5 rotate-180"
                      strokeWidth={iconStroke}
                    />
                  </Link>
                </div>
              ) : null}

              {profileRejected ? (
                <div className="space-y-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3.5 text-sm font-semibold text-rose-600 dark:text-rose-300">
                  <p>
                    Your investor verification needs attention before investing
                    is enabled.
                  </p>
                  <Link
                    href="/investor/account"
                    className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-200 transition-colors hover:text-ui-strong"
                  >
                    Review account details
                    <ArrowLeft
                      className="h-3.5 w-3.5 rotate-180"
                      strokeWidth={iconStroke}
                    />
                  </Link>
                </div>
              ) : null}

              {marketMode === "primary" ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Token Price",
                        val:
                          investPreview?.pricePerTokenFormatted ??
                          (primaryPriceNum > 0
                            ? `$${primaryPriceNum.toFixed(2)}`
                            : "—"),
                      },
                      {
                        label: "Minimum",
                        val:
                          investPreview?.minInvestmentFormatted ??
                          minimumInvestmentLabel ??
                          "—",
                      },
                      { label: "Annual Yield", val: annualYield || "—" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3 text-center"
                      >
                        <p className="mb-1 text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                          {s.label}
                        </p>
                        <p className="text-base font-bold text-zinc-850 dark:text-zinc-100">
                          {s.val}
                        </p>
                      </div>
                    ))}
                  </div>

                  {previewErrorText &&
                  !profilePendingReview &&
                  !profileIncomplete ? (
                    <div className="space-y-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3.5 text-sm font-semibold text-rose-600 dark:text-rose-300">
                      <p>{previewErrorText}</p>
                      {requiresKycVerification ? (
                        <Link
                          href={
                            profileIncomplete
                              ? "/setup-profile"
                              : "/investor/account"
                          }
                          className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-200 transition-colors hover:text-ui-strong"
                        >
                          {profileIncomplete
                            ? "Complete setup profile"
                            : "View verification status"}
                          <ArrowLeft
                            className="h-3.5 w-3.5 rotate-180"
                            strokeWidth={iconStroke}
                          />
                        </Link>
                      ) : null}
                    </div>
                  ) : null}

                  {requiresFunding ? (
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
                      {investPreview?.note ||
                        "Wallet funding is required before this investment can be completed."}
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Investment Amount (USD)
                    </label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                      <span className="px-4 text-base font-bold text-zinc-400 dark:text-zinc-500">
                        $
                      </span>
                      <input
                        type="number"
                        min={minimumInvestmentValue || 0}
                        step="0.01"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder="Enter investment amount"
                        className="flex-1 bg-transparent px-1 py-3.5 pr-4 text-base font-bold text-zinc-800 dark:text-zinc-100 outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {quickAmounts.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setInvestmentAmount(String(value))}
                          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 py-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                        >
                          ${Math.round(value).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/30 px-5 py-4">
                    <div>
                      <span className="block text-sm font-bold text-zinc-550 dark:text-zinc-400">
                        Primary Investment Total
                      </span>
                      <span className="mt-1 block text-xs font-medium text-zinc-400 dark:text-zinc-550">
                        {estimatedPrimaryTokens != null
                          ? `${estimatedPrimaryTokens.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${displayTicker}`
                          : "Live token allocation appears after you enter an amount"}
                      </span>
                    </div>
                    <span className="text-2xl font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
                      $
                      {Number.parseFloat(total).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrimaryInvest}
                    disabled={
                      amountValue <= 0 ||
                      isInvesting ||
                      previewLoading ||
                      requiresFunding ||
                      verificationBlocked ||
                      (minimumInvestmentValue > 0 &&
                        amountValue < minimumInvestmentValue)
                    }
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" strokeWidth={iconStroke} />
                    {isInvesting
                      ? "Processing Investment…"
                      : previewLoading
                        ? "Refreshing Quote…"
                        : `Invest in ${displayTicker}`}
                  </button>

                  <p className="text-center text-xs font-medium text-zinc-400 dark:text-zinc-500 px-2 leading-relaxed">
                    Investments are submitted through the primary marketplace
                    flow. Final allocation and wallet checks are validated by
                    the backend before confirmation.
                  </p>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Select Seller Listing
                    </label>
                    {listingsLoading ? (
                      <div className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900/50" />
                    ) : assetListings.length === 0 ? (
                      <div className="space-y-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3.5 text-sm font-semibold text-amber-700 dark:text-amber-400">
                        <p>
                          No active secondary listings found for this asset
                          right now.
                        </p>
                        <Link
                          href="/investor/secondary-market"
                          className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-300 transition-colors hover:text-ui-strong"
                        >
                          Browse all live listings
                          <ArrowLeft
                            className="h-3.5 w-3.5 rotate-180"
                            strokeWidth={iconStroke}
                          />
                        </Link>
                      </div>
                    ) : (
                      <select
                        value={selectedListingId}
                        onChange={(e) => setSelectedListingId(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-base font-bold text-zinc-800 dark:text-zinc-100 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                      >
                        {assetListings.map((l) => (
                          <option
                            key={l.id}
                            value={l.id}
                            className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                          >
                            {l.ticker} — {l.pricePerToken} / token ·{" "}
                            {l.available} available (Seller: {l.seller})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedListing ? (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Price / Token",
                          val: selectedListing.pricePerToken,
                        },
                        {
                          label: "24h Change",
                          val: selectedListing.change,
                          up: selectedListing.up,
                        },
                        { label: "Available", val: selectedListing.available },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3 text-center"
                        >
                          <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            {s.label}
                          </p>
                          <p
                            className={`text-base font-bold ${"up" in s ? (s.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400") : "text-zinc-800 dark:text-zinc-100"}`}
                          >
                            {s.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Quantity (Tokens)
                    </label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter number of tokens"
                        className="flex-1 bg-transparent px-4 py-3.5 text-base font-bold text-zinc-800 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                      />
                      <span className="px-4 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                        {displayTicker}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {["1", "5", "10", "25"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setQuantity(val)}
                          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 py-1.5 text-xs font-bold text-zinc-555 dark:text-zinc-400 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/30 px-5 py-4">
                    <span className="text-sm font-bold text-zinc-550 dark:text-zinc-400">
                      Total Cost
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
                      $
                      {Number.parseFloat(total).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSecondaryInvest}
                    disabled={
                      !selectedListing ||
                      quantityValue <= 0 ||
                      isPlacing ||
                      assetListings.length === 0 ||
                      profileIncomplete ||
                      profilePendingReview ||
                      profileRejected
                    }
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" strokeWidth={iconStroke} />
                    {isPlacing
                      ? "Processing Order…"
                      : `Buy ${displayTicker} Tokens`}
                  </button>

                  <p className="text-center text-xs font-medium text-zinc-400 dark:text-zinc-500 px-2 leading-relaxed">
                    Orders are executed via the secondary market at the listed
                    price. Market conditions may affect final execution price.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
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
          <h3 className="text-base font-bold text-ui-strong">
            Asset Documents
          </h3>
          <p className="mt-0.5 text-base text-ui-faint">
            Offering memoranda, legal, and financial files
          </p>
        </div>
      </div>
      {loading ? (
        <div className="p-8 text-center text-base text-ui-faint">
          Loading documents…
        </div>
      ) : documents.length === 0 ? (
        <div className="p-8 text-center text-base text-ui-faint">
          No documents published for this asset yet.
        </div>
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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    if (!doc.url) return;

    // Prevent default link navigation — we trigger the download ourselves
    e.preventDefault();
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const proxyUrl =
        "/api/download?url=" +
        encodeURIComponent(doc.url) +
        "&filename=" +
        encodeURIComponent(doc.name);

      const response = await fetch(proxyUrl);
      if (!response.ok)
        throw new Error("Proxy responded with " + response.status);

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(blobUrl);
      a.remove();
    } catch (err) {
      console.error("Download via proxy failed, opening in new tab.", err);
      window.open(doc.url, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const inner = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-faint transition-all group-hover:bg-primary group-hover:text-white">
        <FileText className="h-4 w-4" strokeWidth={iconStroke} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-ui-strong transition-colors group-hover:text-primary">
          {doc.name}
        </p>
        <p className="text-xs font-medium text-ui-faint">
          {doc.type} · {doc.size} · {doc.date}
        </p>
      </div>
      {isDownloading ? (
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin text-primary"
          strokeWidth={iconStroke}
        />
      ) : (
        <Download
          className="h-4 w-4 shrink-0 text-ui-placeholder transition-colors group-hover:text-primary"
          strokeWidth={iconStroke}
        />
      )}
    </>
  );

  if (doc.url) {
    return (
      <a
        href={doc.url}
        download={doc.name}
        onClick={handleDownload}
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
