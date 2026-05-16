import { pickNumber, pickString, unwrapList, unwrapPayload } from "@/lib/apiParse";
import type { PaginationMeta } from "@/lib/issuerDocuments";

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export type PortfolioCategory = {
  key: string;
  label: string;
};

export type PortfolioAssetStatus = "Active" | "Raising" | "Locked" | string;

export type PortfolioAsset = {
  id: string;
  name: string;
  ticker: string;
  location: string;
  compliance: string;
  status: PortfolioAssetStatus;
  tokenPrice: string;
  priceChange: string;
  up: boolean;
  nav: string;
  apy: string;
  investors: string;
  lockup: string;
  image: string;
  categoryKey: string;
  categoryLabel: string;
};

export type PortfolioNavPoint = {
  label: string;
  value: number;
};

export type PortfolioSummary = {
  totalNav: number;
  totalNavFormatted: string;
  ytdPercent: number;
  assetCount: number;
  totalInvestors: number | null;
  avgApyPercent: number | null;
  navHistory: PortfolioNavPoint[];
};

export type PortfolioListResult = {
  items: PortfolioAsset[];
  pagination: PaginationMeta;
};

const CATEGORY_LABELS: Record<string, string> = {
  ALL: "All Assets",
  COMMERCIAL_RE: "Commercial RE",
  INFRASTRUCTURE: "Infrastructure",
  RESIDENTIAL: "Residential",
  PRIVATE_EQUITY: "Private Equity",
  ART_COLLECTIBLES: "Art & Col.",
};

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatSignedPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function parsePagination(payload: Record<string, unknown>): PaginationMeta {
  const meta =
    payload.pagination && typeof payload.pagination === "object"
      ? (payload.pagination as Record<string, unknown>)
      : payload.meta && typeof payload.meta === "object"
        ? (payload.meta as Record<string, unknown>)
        : payload;

  const page = pickNumber(meta, ["page", "currentPage"]) ?? 1;
  const limit = pickNumber(meta, ["limit", "pageSize"]) ?? 20;
  const total = pickNumber(meta, ["total", "totalCount", "count"]) ?? 0;
  const totalPages =
    pickNumber(meta, ["totalPages", "total_pages"]) ??
    (limit > 0 ? Math.ceil(total / limit) : 0);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

function parseAsset(record: Record<string, unknown>, index: number): PortfolioAsset {
  const categoryKey =
    pickString(record, ["category", "categoryKey", "assetCategory"]) ?? "ALL";
  const categoryLabel =
    pickString(record, ["categoryLabel", "category_label"]) ??
    CATEGORY_LABELS[categoryKey] ??
    categoryKey;

  const priceChangeNum =
    pickNumber(record, ["priceChangePercent", "price_change_percent", "change"]) ??
    0;
  const statusRaw =
    pickString(record, ["status", "displayStatus", "offeringStatus"]) ?? "Active";
  const status =
    statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).toLowerCase();

  const tokenPriceNum =
    pickNumber(record, ["tokenPrice", "token_price", "price"]) ?? 0;
  const navNum = pickNumber(record, ["nav", "navUsd", "totalNav"]) ?? 0;
  const apyNum =
    pickNumber(record, ["apy", "apyPercent", "yieldPercent", "targetApy"]) ?? 0;

  return {
    id: pickString(record, ["id", "_id"]) ?? `asset-${index}`,
    name:
      pickString(record, ["name", "assetName", "title"]) ?? `Asset ${index + 1}`,
    ticker: pickString(record, ["ticker", "symbol", "tokenSymbol"]) ?? "—",
    location:
      pickString(record, ["location", "address", "jurisdiction"]) ?? "—",
    compliance:
      pickString(record, ["compliance", "regulation", "regulatoryLabel"]) ??
      "—",
    status,
    tokenPrice: formatCurrency(tokenPriceNum),
    priceChange: formatSignedPercent(priceChangeNum),
    up: priceChangeNum >= 0,
    nav: formatCurrency(navNum),
    apy: `${apyNum.toFixed(1)}%`,
    investors: String(
      pickNumber(record, ["investors", "investorCount", "holders"]) ?? 0,
    ),
    lockup: pickString(record, ["lockup", "lockupPeriod"]) ?? "—",
    image:
      pickString(record, ["image", "imageUrl", "coverImage", "cover_image"]) ??
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    categoryKey,
    categoryLabel,
  };
}

export function parsePortfolioFilters(payload: unknown): PortfolioCategory[] {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }));
  }

  const root = record as Record<string, unknown>;
  const categoriesRaw = root.categories ?? root.items ?? root.filters;
  const list = unwrapList(categoriesRaw);
  if (list.length === 0) {
    return Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }));
  }

  return list.map((item) => {
    const key = pickString(item, ["key", "id", "value"]) ?? "ALL";
    const label =
      pickString(item, ["label", "name", "title"]) ??
      CATEGORY_LABELS[key] ??
      key;
    return { key, label };
  });
}

export function parsePortfolioAssets(payload: unknown): PortfolioListResult {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }

  const root = record as Record<string, unknown>;
  const itemsRaw = root.items ?? root.data ?? root.assets ?? root.results;
  const items = unwrapList(itemsRaw).map(parseAsset);

  return {
    items,
    pagination: parsePagination(root),
  };
}

export function parsePortfolioSummary(
  payload: unknown,
  months: number,
): PortfolioSummary {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return {
      totalNav: 0,
      totalNavFormatted: "$0",
      ytdPercent: 0,
      assetCount: 0,
      totalInvestors: null,
      avgApyPercent: null,
      navHistory: [],
    };
  }

  const root = record as Record<string, unknown>;
  const totalNav =
    pickNumber(root, ["totalNav", "total_nav", "nav", "totalValue"]) ?? 0;
  const ytdPercent =
    pickNumber(root, ["ytdPercent", "ytd_percent", "ytdChange", "growthPercent"]) ??
    0;
  const assetCount =
    pickNumber(root, ["assetCount", "asset_count", "assets", "count"]) ?? 0;

  const historyRaw =
    root.navHistory ?? root.history ?? root.series ?? root.dataPoints;
  const navHistory = Array.isArray(historyRaw)
    ? historyRaw
        .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === "object")
        .map((point, index) => ({
          label:
            pickString(point, ["label", "month", "period"]) ??
            `M${index + 1}`,
          value:
            pickNumber(point, ["value", "nav", "amount", "total"]) ?? 0,
        }))
    : [];

  const totalInvestors =
    pickNumber(root, [
      "totalInvestors",
      "total_investors",
      "investorCount",
      "investors",
    ]) ?? null;
  const avgApyPercent =
    pickNumber(root, [
      "avgApyPercent",
      "avg_apy_percent",
      "averageApy",
      "avgApy",
      "blendedYield",
    ]) ?? null;

  return {
    totalNav,
    totalNavFormatted: formatCurrency(totalNav),
    ytdPercent,
    assetCount,
    totalInvestors,
    avgApyPercent,
    navHistory,
  };
}

export function categoryKeyToFilterLabel(
  categories: PortfolioCategory[],
  key: string,
): string {
  const match = categories.find((c) => c.key === key);
  return match?.label ?? CATEGORY_LABELS[key] ?? key;
}

export function parseInvestorCount(value: string): number {
  const n = parseInt(value.replace(/,/g, "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

export function parseApyPercentFromLabel(apy: string): number {
  const n = parseFloat(apy.replace(/%/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function aggregatePortfolioAssetStats(assets: PortfolioAsset[]): {
  totalInvestors: number;
  avgApyPercent: number | null;
} {
  if (assets.length === 0) {
    return { totalInvestors: 0, avgApyPercent: null };
  }
  const totalInvestors = assets.reduce(
    (sum, asset) => sum + parseInvestorCount(asset.investors),
    0,
  );
  const apyValues = assets
    .map((asset) => parseApyPercentFromLabel(asset.apy))
    .filter((value) => value > 0);
  const avgApyPercent =
    apyValues.length > 0
      ? apyValues.reduce((sum, value) => sum + value, 0) / apyValues.length
      : null;
  return { totalInvestors, avgApyPercent };
}

export function filterLabelToCategoryKey(
  categories: PortfolioCategory[],
  label: string,
): string | undefined {
  if (label === "All Assets") return "ALL";
  const match = categories.find((c) => c.label === label);
  return match?.key;
}
