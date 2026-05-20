import {
  pickNumber,
  pickString,
  pickStringArray,
  unwrapList,
  unwrapPayload,
} from "@/lib/apiParse";
import {
  parseAssetDetail,
  parseAssetDocuments,
  parseAssetOffering,
  parseAssetTokenization,
  type AssetDetail,
  type AssetDocument,
  type AssetOffering,
  type AssetTokenization,
  type MarketplaceAsset,
} from "@/lib/assets";
import type { PaginationMeta } from "@/lib/issuerDocuments";

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type MarketplaceFilterOption = {
  key: string;
  label: string;
};

export type MarketplaceFilters = {
  assetTypes: MarketplaceFilterOption[];
  riskLevels: MarketplaceFilterOption[];
  minInvestmentBuckets: MarketplaceFilterOption[];
};

export type MarketplaceOpportunitiesResult = {
  data: MarketplaceAsset[];
  pagination: PaginationMeta;
};

export type ListMarketplaceOpportunitiesParams = {
  page?: number;
  limit?: number;
  search?: string;
  assetType?: string;
  riskLevel?: string;
  minInvestmentBucket?: string;
  featuredOnly?: boolean;
  watchlistOnly?: boolean;
};

export type OpportunityFinancial = {
  label: string;
  val: string;
};

export type OpportunityInit = {
  offering: AssetOffering | null;
  tokenization: AssetTokenization | null;
};

export type OpportunityOverview = {
  description: string | null;
  highlights: string[];
  progress: {
    pct: number;
    raised: number;
    target: number;
  };
};

export type MarketplaceStats = {
  availableOpportunities: number;
  newListings30d: number;
  totalRaised30d: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePagination(payload: unknown): PaginationMeta {
  if (!payload || typeof payload !== "object") return DEFAULT_PAGINATION;
  const record = payload as Record<string, unknown>;
  const meta =
    record.pagination && typeof record.pagination === "object"
      ? (record.pagination as Record<string, unknown>)
      : record;

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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop";

function formatCurrencyShort(value: number | null, prefix = "$"): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}K`;
  return `${prefix}${value.toLocaleString()}`;
}

function formatPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`;
}

function calcPct(raised: number | null, target: number | null): number {
  if (raised === null || target === null || target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

function parseOpportunity(record: Record<string, unknown>): MarketplaceAsset {
  const id =
    pickString(record, ["id", "_id", "assetId", "asset_id"]) ?? "unknown";
  const name =
    pickString(record, ["name", "title", "assetName"]) ?? "Untitled asset";
  const type =
    pickString(record, ["assetType", "asset_type", "type", "category"]) ??
    "Asset";
  const location =
    pickString(record, ["location", "city", "address", "jurisdiction"]) ?? "—";

  const apyRaw =
    pickNumber(record, ["apy", "annualYield", "annual_yield", "yield"]) ??
    pickNumber(record, ["expectedReturn", "expected_return"]);
  const minRaw = pickNumber(record, [
    "minInvestment",
    "min_investment",
    "minimumInvestment",
  ]);
  const raised =
    pickNumber(record, ["raised", "raisedAmount", "raised_amount"]) ?? 0;
  const target =
    pickNumber(record, ["target", "targetRaise", "target_raise"]) ?? 0;
  const pct =
    pickNumber(record, ["progress", "progressPct"]) ??
    calcPct(raised, target);
  const investors =
    pickNumber(record, ["investors", "investorCount", "investor_count"]) ?? 0;
  const daysLeft =
    pickNumber(record, [
      "daysLeft",
      "days_left",
      "closingInDays",
      "daysRemaining",
    ]) ?? 0;
  const image =
    pickString(record, [
      "image",
      "imageUrl",
      "image_url",
      "coverImage",
      "thumbnail",
    ]) ?? FALLBACK_IMAGE;

  const tagsRaw = record.tags ?? record.labels;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map(String).filter(Boolean)
    : [];

  const featured = Boolean(
    record.featured ?? record.isFeatured ?? record.is_featured,
  );

  return {
    id,
    name,
    type,
    location,
    apy:
      apyRaw !== null
        ? formatPercent(apyRaw)
        : pickString(record, ["apyLabel"]) ?? "—",
    minInv: minRaw !== null ? formatCurrencyShort(minRaw) : "—",
    raised: raised >= 1000 ? raised / 1_000_000 : raised,
    target: target >= 1000 ? target / 1_000_000 : target,
    pct,
    investors,
    daysLeft,
    tags,
    image,
    featured,
    description: pickString(record, ["description", "summary", "about"]),
    watchlist: Boolean(
      record.watchlist ??
        record.isWatchlisted ??
        record.inWatchlist ??
        record.in_watchlist ??
        record.is_watchlisted
    ),
  };
}

// ── Parsers ───────────────────────────────────────────────────────────────────

export function parseMarketplaceFilters(payload: unknown): MarketplaceFilters {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return { assetTypes: [], riskLevels: [], minInvestmentBuckets: [] };
  }
  const record = root as Record<string, unknown>;

  function parseOptions(key: string): MarketplaceFilterOption[] {
    const arr = record[key];
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map((item) => ({
        key: pickString(item, ["key"]) ?? "",
        label: pickString(item, ["label"]) ?? "",
      }))
      .filter((item) => item.key);
  }

  return {
    assetTypes: parseOptions("assetTypes"),
    riskLevels: parseOptions("riskLevels"),
    minInvestmentBuckets: parseOptions("minInvestmentBuckets"),
  };
}

export function parseMarketplaceFeatured(payload: unknown): MarketplaceAsset[] {
  const root = unwrapPayload(payload);
  if (Array.isArray(root)) {
    return root
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map(parseOpportunity);
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const items = Array.isArray(record.data)
      ? record.data
      : Array.isArray(record.items)
        ? record.items
        : [];
    return items
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map(parseOpportunity);
  }
  return [];
}

export function parseMarketplaceOpportunities(
  payload: unknown,
): MarketplaceOpportunitiesResult {
  const root =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  let items: MarketplaceAsset[] = [];

  if (Array.isArray(root.data)) {
    items = root.data
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map(parseOpportunity);
  } else if (Array.isArray(root.items)) {
    items = root.items
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map(parseOpportunity);
  } else if (Array.isArray(payload)) {
    items = (payload as unknown[])
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map(parseOpportunity);
  }

  return {
    data: items,
    pagination: parsePagination(payload),
  };
}

export function parseOpportunityDetail(payload: unknown): AssetDetail | null {
  return parseAssetDetail(payload);
}

export function parseOpportunityDocuments(payload: unknown): AssetDocument[] {
  return parseAssetDocuments(payload);
}

export function parseOpportunityFinancials(
  payload: unknown,
): OpportunityFinancial[] {
  const unwrapped = unwrapList(payload);
  if (unwrapped.length === 0 && payload && typeof payload === "object") {
    // If payload is an object containing financials array
    const root = payload as Record<string, unknown>;
    const rawFin = root.financials ?? root.data;
    if (Array.isArray(rawFin)) {
      return rawFin
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        )
        .map((item) => ({
          label: pickString(item, ["label", "name", "key"]) ?? "—",
          val: pickString(item, ["val", "value", "amount"]) ?? "—",
        }));
    }
  }
  return unwrapped.map((item) => ({
    label: pickString(item, ["label", "name", "key"]) ?? "—",
    val: pickString(item, ["val", "value", "amount"]) ?? "—",
  }));
}

export function parseOpportunityInit(payload: unknown): OpportunityInit {
  if (!payload || typeof payload !== "object") {
    return { offering: null, tokenization: null };
  }
  const root = payload as Record<string, unknown>;
  
  // Try finding offering / tokenization either nested or flattened in the root
  const offeringRaw = root.offering ?? root;
  const tokenizationRaw = root.tokenization ?? root;

  return {
    offering: parseAssetOffering(offeringRaw),
    tokenization: parseAssetTokenization(tokenizationRaw),
  };
}

export function parseOpportunityOverview(payload: unknown): OpportunityOverview {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return {
      description: null,
      highlights: [],
      progress: { pct: 0, raised: 0, target: 0 },
    };
  }
  const o = root as Record<string, unknown>;
  const raised =
    pickNumber(o, ["raised", "raisedAmount", "raised_amount", "amountRaised"]) ?? 0;
  const target =
    pickNumber(o, ["target", "targetRaise", "target_raise", "fundraisingTarget"]) ??
    0;
  const pct =
    pickNumber(o, ["progress", "progressPct", "fundedPercent"]) ??
    calcPct(raised, target);

  return {
    description: pickString(o, ["description", "summary", "about"]),
    highlights: pickStringArray(o, ["highlights", "keyHighlights"]),
    progress: { pct, raised, target },
  };
}

export function parseMarketplaceStats(payload: unknown): MarketplaceStats {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return { availableOpportunities: 0, newListings30d: 0, totalRaised30d: 0 };
  }
  const record = root as Record<string, unknown>;
  return {
    availableOpportunities:
      pickNumber(record, ["availableOpportunities", "available_opportunities"]) ?? 0,
    newListings30d: pickNumber(record, ["newListings30d", "new_listings_30d"]) ?? 0,
    totalRaised30d: pickNumber(record, ["totalRaised30d", "total_raised_30d"]) ?? 0,
  };
}

// ── Query string ──────────────────────────────────────────────────────────────

export function buildOpportunitiesQueryString(
  params: ListMarketplaceOpportunitiesParams,
): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.assetType?.trim())
    searchParams.set("assetType", params.assetType.trim());
  if (params.riskLevel?.trim())
    searchParams.set("riskLevel", params.riskLevel.trim());
  if (params.minInvestmentBucket?.trim())
    searchParams.set("minInvestmentBucket", params.minInvestmentBucket.trim());
  if (params.featuredOnly != null)
    searchParams.set("featuredOnly", String(params.featuredOnly));
  if (params.watchlistOnly != null)
    searchParams.set("watchlistOnly", String(params.watchlistOnly));
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}
