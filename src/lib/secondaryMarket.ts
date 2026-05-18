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

export type LiquidityLevel = "High Liquidity" | "Medium Liquidity" | "Low Liquidity";

export type SecondaryListing = {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  seller: string;
  liquidity: LiquidityLevel;
  pricePerToken: string;
  change: string;
  up: boolean;
  vol24h: string;
  lastSale: string;
  available: string;
  totalVal: string;
  iconType: "building" | "energy" | "pe" | "commodities" | string;
};

export type SecondaryMarketFilters = {
  liquidityLevels: { key: string; label: string }[];
};

export type SecondaryMarketListingsResult = {
  items: SecondaryListing[];
  pagination: PaginationMeta;
};

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
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
  const limit = meta.limit ? (pickNumber(meta, ["limit"]) ?? 20) : 20;
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

function mapLiquidityKey(key: string | null): LiquidityLevel {
  if (!key) return "High Liquidity";
  const upper = key.toUpperCase();
  if (upper === "HIGH" || upper.includes("HIGH")) return "High Liquidity";
  if (upper === "MEDIUM" || upper.includes("MEDIUM") || upper.includes("MED")) return "Medium Liquidity";
  return "Low Liquidity";
}

function parseListingRecord(record: Record<string, unknown>, index: number): SecondaryListing {
  const priceNum = pickNumber(record, ["pricePerToken", "price_per_token", "price", "tokenPrice"]) ?? 0;
  const changeNum = pickNumber(record, ["change", "priceChangePercent", "changePercent"]) ?? 0;
  const volNum = pickNumber(record, ["vol24h", "vol_24h", "volume24h", "volume"]) ?? 0;
  const lastSaleNum = pickNumber(record, ["lastSale", "last_sale", "lastPrice"]) ?? priceNum;
  const totalValNum = pickNumber(record, ["totalVal", "total_val", "value"]) ?? 0;

  const sector = pickString(record, ["sector", "category", "assetType"]) ?? "Real Estate";
  let iconType = "building";
  const sLower = sector.toLowerCase();
  if (sLower.includes("energy") || sLower.includes("solar") || sLower.includes("infra")) {
    iconType = "energy";
  } else if (sLower.includes("private") || sLower.includes("pe") || sLower.includes("equity")) {
    iconType = "pe";
  } else if (sLower.includes("commodity") || sLower.includes("mine") || sLower.includes("copper") || sLower.includes("royalty")) {
    iconType = "commodities";
  }

  const availableNum = pickNumber(record, ["available", "availableTokens", "quantity"]) ?? 0;
  const availableStr = pickString(record, ["availableLabel", "available_label"]) ?? `${availableNum} tokens`;

  return {
    id: pickString(record, ["id", "_id"]) ?? `listing-${index}`,
    name: pickString(record, ["name", "title"]) ?? `Listing ${index + 1}`,
    ticker: pickString(record, ["ticker", "symbol"]) ?? "—",
    sector,
    seller: pickString(record, ["seller", "owner", "sellerName"]) ?? `Investor #${1000 + index}`,
    liquidity: mapLiquidityKey(pickString(record, ["liquidity", "liquidityLevel", "liquidity_level"])),
    pricePerToken: formatCurrency(priceNum),
    change: formatSignedPercent(changeNum),
    up: changeNum >= 0,
    vol24h: formatCurrency(volNum),
    lastSale: formatCurrency(lastSaleNum),
    available: availableStr,
    totalVal: formatCurrency(totalValNum || (availableNum * priceNum)),
    iconType,
  };
}

export function parseSecondaryFilters(payload: unknown): SecondaryMarketFilters {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return {
      liquidityLevels: [
        { key: "HIGH", label: "High Liquidity" },
        { key: "MEDIUM", label: "Medium Liquidity" },
        { key: "LOW", label: "Low Liquidity" },
      ],
    };
  }

  const rObj = root as Record<string, unknown>;
  const levelsRaw = rObj.liquidityLevels ?? rObj.levels ?? [];
  const list = unwrapList(levelsRaw);

  return {
    liquidityLevels: list.map((item) => ({
      key: pickString(item, ["key"]) ?? "",
      label: pickString(item, ["label"]) ?? "",
    })).filter((x) => x.key),
  };
}

export function parseSecondaryListings(payload: unknown): SecondaryMarketListingsResult {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }

  const rObj = root as Record<string, unknown>;
  const rawListings = rObj.items ?? rObj.listings ?? rObj.data ?? [];
  const items = unwrapList(rawListings).map(parseListingRecord);

  return {
    items,
    pagination: parsePagination(rObj),
  };
}

export function parseSecondaryListingDetail(payload: unknown): SecondaryListing | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) return null;
  return parseListingRecord(record as Record<string, unknown>, 0);
}

export type SecondaryChartPoint = {
  recordedAt: string;
  price: number;
};

export type SecondaryChartResult = {
  series: SecondaryChartPoint[];
};

export function parseSecondaryChart(payload: unknown): SecondaryChartResult {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object") return { series: [] };
  const root = record as Record<string, unknown>;
  const rawSeries = root.series ?? root.chart ?? [];
  if (!Array.isArray(rawSeries)) return { series: [] };

  return {
    series: rawSeries
      .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === "object")
      .map((p) => ({
        recordedAt: pickString(p, ["recordedAt", "date", "timestamp"]) ?? "",
        price: pickNumber(p, ["price", "value"]) ?? 0,
      })),
  };
}

export type SecondaryMarketStats = {
  marketOpen: boolean;
  volume24h: { amount: number; changePercent: number };
  totalListings: { count: number; change: number };
  avgPriceChange: { percent: number; changePercent: number };
  activeTraders: { count: number; change: number };
};

export function parseSecondaryStats(payload: unknown): SecondaryMarketStats {
  const root = (unwrapPayload(payload) ?? {}) as Record<string, unknown>;
  const marketOpen = typeof root.marketOpen === "boolean" ? root.marketOpen : true;

  const volObj = (root.volume24h && typeof root.volume24h === "object" ? root.volume24h : {}) as Record<string, unknown>;
  const listObj = (root.totalListings && typeof root.totalListings === "object" ? root.totalListings : {}) as Record<string, unknown>;
  const priceObj = (root.avgPriceChange && typeof root.avgPriceChange === "object" ? root.avgPriceChange : {}) as Record<string, unknown>;
  const activeObj = (root.activeTraders && typeof root.activeTraders === "object" ? root.activeTraders : {}) as Record<string, unknown>;

  return {
    marketOpen,
    volume24h: {
      amount: pickNumber(volObj, ["amount", "value"]) ?? 2800000,
      changePercent: pickNumber(volObj, ["changePercent", "change_percent", "change"]) ?? 12.4,
    },
    totalListings: {
      count: pickNumber(listObj, ["count", "total"]) ?? 847,
      change: pickNumber(listObj, ["change", "diff"]) ?? 42,
    },
    avgPriceChange: {
      percent: pickNumber(priceObj, ["percent", "avgPercent", "value"]) ?? 3.2,
      changePercent: pickNumber(priceObj, ["changePercent", "change_percent", "change"]) ?? 0.8,
    },
    activeTraders: {
      count: pickNumber(activeObj, ["count", "total"]) ?? 1284,
      change: pickNumber(activeObj, ["change", "diff"]) ?? 156,
    },
  };
}

