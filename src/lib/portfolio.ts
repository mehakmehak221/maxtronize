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
  tokenPriceRaw: number;
  navRaw: number;
  apyPercent: number;
  investorCount: number;
  priceChangePercent: number;
  currency: string;
  blockchainNetwork: string;
  updatedAt: string | null;
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

export type InvestorPortfolioInit = {
  summary: PortfolioSummary;
  navHistory: PortfolioNavPoint[];
  categories: PortfolioCategory[];
  assets: PortfolioAsset[];
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
  const investorCount =
    pickNumber(record, ["investors", "investorCount", "holders"]) ?? 0;
  const currency = pickString(record, ["currency"]) ?? "USD";
  const blockchainNetwork =
    pickString(record, ["blockchainNetwork", "blockchain_network"]) ?? "—";
  const updatedAt = pickString(record, ["updatedAt", "updated_at"]);

  return {
    id: pickString(record, ["id", "_id"]) ?? `asset-${index}`,
    name:
      pickString(record, ["name", "assetName", "title"]) ?? `Asset ${index + 1}`,
    ticker: pickString(record, ["ticker", "symbol", "tokenSymbol"]) ?? "—",
    location:
      pickString(record, [
        "location",
        "locationLabel",
        "location_label",
        "address",
        "jurisdiction",
      ]) ?? "—",
    compliance:
      pickString(record, ["compliance", "regulation", "regulatoryLabel"]) ??
      "—",
    status,
    tokenPrice: formatCurrency(tokenPriceNum),
    priceChange: formatSignedPercent(priceChangeNum),
    up: priceChangeNum >= 0,
    nav: formatCurrency(navNum),
    apy: `${apyNum.toFixed(1)}%`,
    investors: String(investorCount),
    lockup:
      pickString(record, ["lockup", "lockupPeriod", "lockLabel", "lock_label"]) ??
      "—",
    image:
      pickString(record, [
        "image",
        "imageUrl",
        "coverImage",
        "cover_image",
        "coverImageUrl",
        "cover_image_url",
      ]) ??
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    categoryKey,
    categoryLabel,
    tokenPriceRaw: tokenPriceNum,
    navRaw: navNum,
    apyPercent: apyNum,
    investorCount,
    priceChangePercent: priceChangeNum,
    currency,
    blockchainNetwork,
    updatedAt,
  };
}

export function parsePortfolioAssetDetail(payload: unknown): PortfolioAsset | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;

  if (Array.isArray(root.data) && root.data[0] && typeof root.data[0] === "object") {
    return parseAsset(root.data[0] as Record<string, unknown>, 0);
  }
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return parseAsset(root.data as Record<string, unknown>, 0);
  }
  if (pickString(root, ["id", "_id", "title", "name"])) {
    return parseAsset(root, 0);
  }
  return null;
}

export function formatPortfolioTokenPrice(
  value: number,
  currency = "USD",
): string {
  if (value <= 0) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value);
  } catch {
    return formatCurrency(value);
  }
}

export function parsePortfolioFilters(payload: unknown): PortfolioCategory[] {
  const record = unwrapPayload(payload);
  if (Array.isArray(record)) {
    return record.map((item) => {
      const entry = item as Record<string, unknown>;
      const key = pickString(entry, ["key", "id", "value"]) ?? "ALL";
      const label =
        pickString(entry, ["label", "name", "title"]) ??
        CATEGORY_LABELS[key] ??
        key;
      return { key, label };
    });
  }
  if (!record || typeof record !== "object") {
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
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }

  // Do not use unwrapPayload here: { data: Asset[], pagination } would unwrap to
  // the array only and drop pagination, then fail the object guard below.
  const root = payload as Record<string, unknown>;
  const nested =
    root.data &&
    typeof root.data === "object" &&
    !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : null;
  const itemsRaw =
    root.items ??
    root.data ??
    root.assets ??
    root.results ??
    nested?.items ??
    nested?.assets;
  const items = unwrapList(itemsRaw).map(parseAsset);

  return {
    items,
    pagination: parsePagination(root),
  };
}

export function parsePortfolioSummary(
  payload: unknown,
  months?: number,
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

  // Check nested or top-level totalNav
  const totalNavObj = root.totalNav && typeof root.totalNav === "object"
    ? (root.totalNav as Record<string, unknown>)
    : null;
  const totalNav = totalNavObj
    ? (pickNumber(totalNavObj, ["amount"]) ?? 0)
    : (pickNumber(root, ["totalNav", "total_nav", "nav", "totalValue"]) ?? 0);

  const ytdPercent = totalNavObj
    ? (pickNumber(totalNavObj, ["ytdGrowthPercent", "ytdPercent"]) ?? 0)
    : (pickNumber(root, ["ytdPercent", "ytd_percent", "ytdChange", "growthPercent"]) ?? 0);

  const assetCount = totalNavObj
    ? (pickNumber(totalNavObj, ["assetCount"]) ?? 0)
    : (pickNumber(root, ["assetCount", "asset_count", "assets", "count"]) ?? 0);

  const totalInvestorsObj = root.totalInvestors && typeof root.totalInvestors === "object"
    ? (root.totalInvestors as Record<string, unknown>)
    : null;
  const totalInvestors = totalInvestorsObj
    ? pickNumber(totalInvestorsObj, ["count", "total"])
    : pickNumber(root, ["totalInvestors", "total_investors", "investorCount", "investors"]);

  const avgApyObj = root.avgTokenYield && typeof root.avgTokenYield === "object"
    ? (root.avgTokenYield as Record<string, unknown>)
    : null;
  const avgApyPercent = avgApyObj
    ? pickNumber(avgApyObj, ["percent", "percentValue"])
    : pickNumber(root, ["avgApyPercent", "avg_apy_percent", "averageApy", "avgApy", "blendedYield"]);

  return {
    totalNav,
    totalNavFormatted: formatCurrency(totalNav),
    ytdPercent,
    assetCount,
    totalInvestors,
    avgApyPercent,
    navHistory: [],
  };
}

export function parsePortfolioNavHistory(payload: unknown): PortfolioNavPoint[] {
  const record = unwrapPayload(payload);
  if (Array.isArray(record)) {
    return record
      .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === "object")
      .map((point, index) => {
        const recordedAt = pickString(point, ["recordedAt", "date", "label", "month"]) ?? `M${index + 1}`;
        let label = recordedAt;
        if (recordedAt.includes("-")) {
          try {
            const date = new Date(recordedAt);
            if (!isNaN(date.getTime())) {
              label = date.toLocaleDateString("en-US", { month: "short" });
            }
          } catch {
            // ignore
          }
        }
        const nav = pickNumber(point, ["nav", "value", "amount"]) ?? 0;
        return { label, value: nav };
      });
  }
  if (!record || typeof record !== "object") return [];
  const root = record as Record<string, unknown>;
  const series = root.series ?? root.history ?? root.navHistory ?? [];
  if (!Array.isArray(series)) return [];

  return series
    .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === "object")
    .map((point, index) => {
      const recordedAt = pickString(point, ["recordedAt", "date", "label", "month"]) ?? `M${index + 1}`;
      let label = recordedAt;
      if (recordedAt.includes("-")) {
        try {
          const date = new Date(recordedAt);
          if (!isNaN(date.getTime())) {
            label = date.toLocaleDateString("en-US", { month: "short" });
          }
        } catch {
          // ignore
        }
      }
      const nav = pickNumber(point, ["nav", "value", "amount"]) ?? 0;
      return {
        label,
        value: nav,
      };
    });
}

export function parseInvestorPortfolioInit(
  payload: unknown,
): InvestorPortfolioInit {
  const root =
    payload && typeof payload === "object"
      ? ((payload as Record<string, unknown>).data &&
        typeof (payload as Record<string, unknown>).data === "object" &&
        !Array.isArray((payload as Record<string, unknown>).data)
          ? ((payload as Record<string, unknown>).data as Record<string, unknown>)
          : (payload as Record<string, unknown>))
      : {};

  const summaryPayload =
    root.summary && typeof root.summary === "object" ? root.summary : root;
  const navPayload =
    root.navHistory ??
    root.history ??
    root.series ??
    (summaryPayload as Record<string, unknown>).navHistory ??
    summaryPayload;
  const filtersPayload =
    root.filters ?? root.categories ?? root.tabs ?? summaryPayload;
  const assetsPayload =
    root.assets ?? root.items ?? root.portfolioAssets ?? root.results ?? root;

  return {
    summary: parsePortfolioSummary(summaryPayload),
    navHistory: parsePortfolioNavHistory({ data: navPayload }),
    categories: parsePortfolioFilters({ data: filtersPayload }),
    assets: parsePortfolioAssets({ data: assetsPayload }).items,
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
