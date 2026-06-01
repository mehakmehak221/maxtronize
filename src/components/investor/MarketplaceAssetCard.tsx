"use client";

import { Heart, Building2, Building, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MarketplaceAsset } from "@/lib/assets";
import { MarketplaceAssetCover } from "@/components/investor/MarketplaceAssetCover";
import {
  useAddOpportunityToWatchlistMutation,
  useRemoveOpportunityFromWatchlistMutation,
} from "@/store";

function HeartOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12.659 9.32799C13.6518 8.3552 14.6579 7.18919 14.6579 5.66338C14.6579 4.69147 14.2718 3.75936 13.5845 3.07212C12.8973 2.38487 11.9652 1.99878 10.9933 1.99878C9.82059 1.99878 8.99439 2.33193 7.99495 3.33136C6.99551 2.33193 6.16931 1.99878 4.99664 1.99878C4.02472 1.99878 3.09262 2.38487 2.40537 3.07212C1.71812 3.75936 1.33203 4.69147 1.33203 5.66338C1.33203 7.19585 2.33147 8.36186 3.33091 9.32799L7.99495 13.992L12.659 9.32799Z"
        stroke="#45556C"
        strokeWidth="1.33258"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MarketplaceAssetCardProps = {
  asset: MarketplaceAsset;
  featured?: boolean;
};

function formatRaisedLine(raisedMillions: number, targetMillions: number) {
  const raised = Number.isFinite(raisedMillions) ? raisedMillions : 0;
  const target = Number.isFinite(targetMillions) ? targetMillions : 0;
  return `$${raised.toFixed(1)}M raised of $${target.toFixed(1)}M`;
}

export function MarketplaceAssetCard({
  asset,
  featured = false,
}: MarketplaceAssetCardProps) {
  const detailHref = `/investor/asset-detail?id=${encodeURIComponent(asset.id)}`;
  const showFeatured = featured || asset.featured;
  const [isWatchlisted, setIsWatchlisted] = useState(Boolean(asset.watchlist));
  const [addWatchlist, { isLoading: isAdding }] =
    useAddOpportunityToWatchlistMutation();
  const [removeWatchlist, { isLoading: isRemoving }] =
    useRemoveOpportunityFromWatchlistMutation();

  useEffect(() => {
    setIsWatchlisted(Boolean(asset.watchlist));
  }, [asset.watchlist]);

  async function handleWatchlistToggle() {
    if (isAdding || isRemoving) return;
    if (isWatchlisted) {
      await removeWatchlist(asset.id).unwrap();
      setIsWatchlisted(false);
      return;
    }
    await addWatchlist(asset.id).unwrap();
    setIsWatchlisted(true);
  }

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-[20px] border border-ui-border bg-ui-card shadow-sm md:rounded-[24px]">
      <MarketplaceAssetCover
        image={asset.image}
        alt={asset.name}
        assetType={asset.type}
        className="h-40 shrink-0 sm:h-44 md:h-40 lg:h-44 xl:h-48"
      >
        {asset.image ? (
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent"
            aria-hidden
          />
        ) : null}

        {showFeatured ? (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-[#FE9A00] px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-white fill-white/20" />
            Featured
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => void handleWatchlistToggle()}
          disabled={isAdding || isRemoving}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-md transition-colors hover:text-rose-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-rose-400"
          aria-label={isWatchlisted ? "Remove from watchlist" : "Save listing"}
        >
          {isWatchlisted ? (
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
          ) : (
            <HeartOutlineIcon />
          )}
        </button>

        <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-5.5rem)] items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-ui-strong shadow-sm backdrop-blur-sm dark:bg-zinc-900/95 dark:text-zinc-100">
          <svg className="h-3.5 w-3.5 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{asset.location}</span>
        </div>
      </MarketplaceAssetCover>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
            {asset.type.toLowerCase().includes("infra") ? (
              <Building className="h-4.5 w-4.5 stroke-[1.5]" />
            ) : (
              <Building2 className="h-4.5 w-4.5 stroke-[1.5]" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold leading-snug text-ui-strong md:text-[15px]">{asset.name}</h3>
            <p className="text-base text-ui-faint">{asset.type}</p>
          </div>
        </div>

        {asset.tags.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {asset.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-ui-border bg-ui-card px-2 py-0.5 text-xs font-bold text-ui-muted-text"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mb-4 grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ui-faint">APY</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{asset.apy}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ui-faint">Min. Investment</p>
            <p className="text-lg font-bold text-ui-strong">{asset.minInv}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1.5 flex justify-between gap-2 text-xs">
            <span className="truncate text-ui-faint">
              {asset.fundingLabel ?? formatRaisedLine(asset.raised, asset.target)}
            </span>
            <span className="shrink-0 font-bold text-primary">{asset.pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${asset.pct}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-base text-ui-faint md:gap-4">
            <span>{asset.investors} investors</span>
            {asset.daysLeft > 0 ? <span>{asset.daysLeft} days left</span> : null}
          </div>
          <Link
            href={detailHref}
            className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 sm:w-auto md:py-2"
          >
            Invest
            <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H9M17 7v8" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
