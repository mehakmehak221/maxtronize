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
  resolveMarketplaceCoverImage,
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

export type MarketplaceInvestment = {
  id: string;
  opportunityId: string | null;
  assetName: string;
  status: string;
  amount: number;
  amountFormatted: string;
  tokenAmount: number | null;
  tokenAmountFormatted: string | null;
  pricePerToken: number | null;
  pricePerTokenFormatted: string | null;
  currency: string;
  createdAt: string | null;
};

export type MarketplaceInvestPreview = {
  amount: number;
  amountFormatted: string;
  tokenAmount: number | null;
  tokenAmountFormatted: string | null;
  pricePerToken: number | null;
  pricePerTokenFormatted: string | null;
  walletBalance: number | null;
  walletBalanceFormatted: string | null;
  availableToInvest: number | null;
  availableToInvestFormatted: string | null;
  minInvestment: number | null;
  minInvestmentFormatted: string | null;
  maxInvestment: number | null;
  maxInvestmentFormatted: string | null;
  fees: number | null;
  feesFormatted: string | null;
  totalDebit: number | null;
  totalDebitFormatted: string | null;
  currency: string;
  note: string | null;
  canInvest: boolean;
  requiresFunding: boolean;
  quoteExpiresAt: string | null;
};

export type MarketplaceInvestResponse = {
  success: boolean;
  investmentId: string | null;
  transactionId?: string | null;
  status: string | null;
  message: string | null;
  amount: number | null;
  amountFormatted: string | null;
  tokenAmount: number | null;
  tokenAmountFormatted: string | null;
  currency: string | null;
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

function formatCurrencyValue(
  value: number | null,
  currency = "USD",
  maximumFractionDigits = 2,
): string | null {
  if (value === null || Number.isNaN(value)) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return `${currency === "USD" ? "$" : ""}${value.toLocaleString("en-US", {
      maximumFractionDigits,
    })}`;
  }
}

function formatTokenAmount(value: number | null): string | null {
  if (value === null || Number.isNaN(value)) return null;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value < 1 ? 2 : 0,
    maximumFractionDigits: 4,
  });
}

function formatDateTime(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function pickBoolean(obj: Record<string, unknown>, keys: string[]): boolean | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "yes") return true;
      if (normalized === "false" || normalized === "no") return false;
    }
  }
  return null;
}

function calcPct(raised: number | null, target: number | null): number {
  if (raised === null || target === null || target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

function parseOpportunity(record: Record<string, unknown>): MarketplaceAsset {
  const hero =
    record.hero && typeof record.hero === "object"
      ? (record.hero as Record<string, unknown>)
      : null;
  const metadata =
    record.metadata && typeof record.metadata === "object"
      ? (record.metadata as Record<string, unknown>)
      : null;
  const metaAsset =
    metadata && metadata.asset && typeof metadata.asset === "object"
      ? (metadata.asset as Record<string, unknown>)
      : null;
  const metaOffering =
    metadata && metadata.offering && typeof metadata.offering === "object"
      ? (metadata.offering as Record<string, unknown>)
      : null;
  const metaAccreditation =
    metadata && metadata.accreditation && typeof metadata.accreditation === "object"
      ? (metadata.accreditation as Record<string, unknown>)
      : null;

  const id =
    pickString(record, ["id", "_id", "assetId", "asset_id"]) ?? "unknown";
  const name =
    pickString(record, ["assetTitle", "asset_title", "name", "title", "assetName"]) ?? "Untitled asset";
  const type =
    pickString(record, [
      "assetTypeLabel",
      "asset_type_label",
      "assetType",
      "asset_type",
      "type",
      "category",
    ]) ??
    "Asset";
  const location =
    pickString(record, ["location", "city", "address", "jurisdiction"]) ?? "—";

  // APY / Yield extraction with fallback to metadata.asset.capRate or metadata.offering.targetIrr
  const apyRaw =
    pickNumber(record, [
      "apy",
      "apyPercent",
      "annualYield",
      "annual_yield",
      "yield",
    ]) ??
    pickNumber(record, ["expectedReturn", "expected_return"]) ??
    (metaAsset ? pickNumber(metaAsset, ["capRate"]) : null) ??
    (metaOffering ? pickNumber(metaOffering, ["targetIrr", "preferredReturn"]) : null) ??
    (hero ? pickNumber(hero, ["annualYieldPercent", "apyPercent", "apy"]) : null);

  const minRaw = pickNumber(record, [
    "minInvestment",
    "min_investment",
    "minimumInvestment",
  ]) ?? (hero ? pickNumber(hero, ["minimumInvestment", "minInvestment"]) : null);

  // Note: Backend might not expose raised at root. Check offering metadata first, fallback to root.
  const raised =
    pickNumber(record, [
      "raised",
      "raisedAmount",
      "raised_amount",
      "amountRaised",
    ]) ?? 
    (metaOffering ? pickNumber(metaOffering, ["raised", "raisedAmount"]) : null) ??
    0;

  const target =
    pickNumber(record, [
      "target",
      "targetRaise",
      "target_raise",
      "targetRaiseAmount",
    ]) ?? 0;

  const pct =
    pickNumber(record, [
      "progress",
      "progressPct",
      "fundedPercent",
      "fundingProgressPercent",
    ]) ??
    (metaOffering ? pickNumber(metaOffering, ["progress", "progressPct"]) : null) ??
    (hero ? pickNumber(hero, ["fundraisingProgressPercent", "fundingProgressPercent"]) : null) ??
    calcPct(raised, target);

  const investors =
    pickNumber(record, ["investors", "investorCount", "investor_count"]) ??
    (metaOffering ? pickNumber(metaOffering, ["investors", "investorCount"]) : null) ??
    (hero ? pickNumber(hero, ["investorCount", "investors"]) : null) ??
    0;

  const daysLeft =
    pickNumber(record, [
      "daysLeft",
      "days_left",
      "closingInDays",
      "daysRemaining",
    ]) ??
    (metaOffering ? pickNumber(metaOffering, ["daysLeft", "closingDays"]) : null) ??
    0;

  const image = resolveMarketplaceCoverImage(record, metaAsset);

  // Support tags from accreditation exemptions as tag fallback
  const tagsRaw = record.tags ?? record.labels ?? metaAccreditation?.exemptions;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map(String).filter(Boolean)
    : [];

  const featured = Boolean(
    record.featured ?? record.isFeatured ?? record.is_featured,
  );

  const fundingLabel = pickString(record, ["fundingLabel", "funding_label"]);
  const riskLabel =
    pickString(record, ["riskLabel", "risk_label"]) ??
    pickString(record, ["riskLevel", "risk_level"]);
  const verified =
    pickBoolean(record, ["isVerified", "is_verified", "verified"]) ?? false;

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
    raised: (raised ?? 0) / 1_000_000,
    target: (target ?? 0) / 1_000_000,
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
        record.is_watchlisted,
    ),
    fundingLabel,
    riskLabel,
    verified,
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
      .map((item, index) => {
        if (typeof item === "string") {
          const normalizedKey = item.trim().toUpperCase().replace(/[\s&/-]+/g, "_");
          return { key: normalizedKey, label: item.trim() };
        }
        if (!item || typeof item !== "object") return null;
        const entry = item as Record<string, unknown>;
        return {
          key:
            pickString(entry, ["key", "value", "id", "code"]) ??
            `option_${index}`,
          label:
            pickString(entry, ["label", "name", "title", "displayName"]) ??
            pickString(entry, ["key", "value"]) ??
            "Option",
        };
      })
      .filter((item): item is MarketplaceFilterOption => Boolean(item))
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
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const root = unwrapPayload(payload);
    if (root && typeof root === "object" && !Array.isArray(root)) {
      const outerRecord = root as Record<string, unknown>;
      const nestedFinancials =
        outerRecord.financials &&
        typeof outerRecord.financials === "object" &&
        !Array.isArray(outerRecord.financials)
          ? (outerRecord.financials as Record<string, unknown>)
          : null;
      const record = nestedFinancials ?? outerRecord;
      const offering =
        record.offering && typeof record.offering === "object"
          ? (record.offering as Record<string, unknown>)
          : null;
      const financialRows = [
        {
          label: "Appraisal Value",
          val:
            formatCurrencyValue(
              pickNumber(record, ["appraisalValue"]),
              pickString(record, ["currency"]) ?? "USD",
              0,
            ) ?? null,
        },
        {
          label: "Annual Income",
          val:
            formatCurrencyValue(
              pickNumber(record, ["annualIncome"]),
              pickString(record, ["currency"]) ?? "USD",
              0,
            ) ?? null,
        },
        {
          label: "Token Price",
          val:
            formatCurrencyValue(
              pickNumber(record, ["tokenPrice"]),
              pickString(record, ["currency"]) ?? "USD",
              0,
            ) ?? null,
        },
        {
          label: "Total Supply",
          val: formatTokenAmount(pickNumber(record, ["totalSupply"])) ?? null,
        },
        offering
          ? {
              label: "Lockup Period",
              val: pickString(offering, ["lockupPeriod", "lockup_period"]) ?? null,
            }
          : null,
      ].filter(
        (item): item is { label: string; val: string } =>
          Boolean(item && item.val),
      );
      if (financialRows.length > 0) {
        return financialRows;
      }
    }
  }
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
  return unwrapped
    .map((item) => ({
      label: pickString(item, ["label", "name", "key"]) ?? "—",
      val: pickString(item, ["val", "value", "amount"]) ?? "—",
    }))
    .filter((item) => item.label !== "—" || item.val !== "—");
}

export function parseOpportunityInit(payload: unknown): OpportunityInit {
  if (!payload || typeof payload !== "object") {
    return { offering: null, tokenization: null };
  }
  const root = payload as Record<string, unknown>;
  const financials =
    root.financials && typeof root.financials === "object"
      ? (root.financials as Record<string, unknown>)
      : null;
  
  // Try finding offering / tokenization either nested or flattened in the root
  const offeringRaw = root.offering ?? financials?.offering ?? root.hero ?? root;
  const tokenizationRaw = root.tokenization ?? financials?.tokenization ?? financials ?? root;

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
  const overview =
    o.overview && typeof o.overview === "object"
      ? (o.overview as Record<string, unknown>)
      : o;
  const raised =
    pickNumber(overview, [
      "raised",
      "raisedAmount",
      "raised_amount",
      "amountRaised",
    ]) ?? 0;
  const target =
    pickNumber(overview, [
      "target",
      "targetRaise",
      "target_raise",
      "targetRaiseAmount",
      "fundraisingTarget",
    ]) ??
    0;
  const pct =
    pickNumber(overview, [
      "progress",
      "progressPct",
      "fundedPercent",
      "fundingProgressPercent",
      "fundraisingProgressPercent",
    ]) ??
    calcPct(raised, target);

  return {
    description: pickString(overview, ["description", "summary", "about"]),
    highlights: pickStringArray(overview, ["highlights", "keyHighlights"]),
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

function getRecord(payload: unknown): Record<string, unknown> | null {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) return null;
  return root as Record<string, unknown>;
}

export function parseMarketplaceInvestment(
  payload: unknown,
): MarketplaceInvestment | null {
  const record = getRecord(payload);
  if (!record) return null;

  const opportunityRecord =
    record.opportunity && typeof record.opportunity === "object"
      ? (record.opportunity as Record<string, unknown>)
      : null;
  const assetRecord =
    record.asset && typeof record.asset === "object"
      ? (record.asset as Record<string, unknown>)
      : opportunityRecord;

  const amount =
    pickNumber(record, ["amount", "investmentAmount", "committedAmount"]) ?? 0;
  const tokenAmount =
    pickNumber(record, ["tokenAmount", "tokens", "quantity", "units"]);
  const pricePerToken = pickNumber(record, [
    "pricePerToken",
    "tokenPrice",
    "price",
  ]);
  const currency = pickString(record, ["currency"]) ?? "USD";

  return {
    id:
      pickString(record, ["id", "_id", "investmentId", "investment_id"]) ??
      "investment",
    opportunityId:
      pickString(record, ["opportunityId", "opportunity_id", "assetId", "asset_id"]) ??
      (assetRecord ? pickString(assetRecord, ["id", "_id"]) : null),
    assetName:
      pickString(record, ["assetName", "asset_name", "name"]) ??
      (assetRecord ? pickString(assetRecord, ["name", "title"]) : null) ??
      "Marketplace investment",
    status: pickString(record, ["status", "state"]) ?? "Pending",
    amount,
    amountFormatted:
      pickString(record, ["amountFormatted", "amount_formatted"]) ??
      formatCurrencyValue(amount, currency) ??
      "—",
    tokenAmount,
    tokenAmountFormatted:
      pickString(record, ["tokenAmountFormatted", "token_amount_formatted"]) ??
      formatTokenAmount(tokenAmount),
    pricePerToken,
    pricePerTokenFormatted:
      pickString(record, ["pricePerTokenFormatted", "price_per_token_formatted"]) ??
      formatCurrencyValue(pricePerToken, currency),
    currency,
    createdAt: formatDateTime(
      pickString(record, [
        "createdAt",
        "created_at",
        "date",
        "executedAt",
        "executed_at",
      ]),
    ),
  };
}

export function parseMarketplaceInvestPreview(
  payload: unknown,
): MarketplaceInvestPreview {
  const record = getRecord(payload) ?? {};
  const quote =
    record.quote && typeof record.quote === "object"
      ? (record.quote as Record<string, unknown>)
      : record;
  const wallet =
    record.wallet && typeof record.wallet === "object"
      ? (record.wallet as Record<string, unknown>)
      : record.walletCheck && typeof record.walletCheck === "object"
        ? (record.walletCheck as Record<string, unknown>)
        : record;

  const currency =
    pickString(quote, ["currency"]) ??
    pickString(wallet, ["currency"]) ??
    "USD";
  const amount =
    pickNumber(quote, ["amount", "investmentAmount", "subtotal"]) ??
    pickNumber(record, ["amount", "investmentAmount"]) ??
    0;
  const tokenAmount =
    pickNumber(quote, ["tokenAmount", "tokens", "quantity", "units"]) ??
    pickNumber(record, ["tokenAmount", "tokens", "quantity"]);
  const pricePerToken =
    pickNumber(quote, ["pricePerToken", "tokenPrice", "price"]) ??
    pickNumber(record, ["pricePerToken", "tokenPrice"]);
  const fees =
    pickNumber(quote, ["fees", "feeAmount", "estimatedFees"]) ??
    pickNumber(record, ["fees", "feeAmount", "estimatedFees"]);
  const totalDebit =
    pickNumber(quote, ["totalDebit", "total", "totalAmount"]) ??
    (amount || fees ? amount + (fees ?? 0) : null);
  const walletBalance =
    pickNumber(wallet, ["walletBalance", "availableBalance", "balance"]) ??
    pickNumber(record, ["walletBalance", "availableBalance", "balance"]);
  const availableToInvest =
    pickNumber(wallet, ["availableToInvest", "available"]) ??
    pickNumber(record, ["availableToInvest", "available"]);
  const minInvestment =
    pickNumber(quote, ["minInvestment", "minimumInvestment"]) ??
    pickNumber(record, ["minInvestment", "minimumInvestment"]);
  const maxInvestment =
    pickNumber(quote, ["maxInvestment", "maximumInvestment"]) ??
    pickNumber(record, ["maxInvestment", "maximumInvestment"]);

  const requiresFunding =
    pickBoolean(record, [
      "requiresFunding",
      "insufficientBalance",
      "requiresWalletFunding",
    ]) ??
    (walletBalance !== null && totalDebit !== null ? walletBalance < totalDebit : false);

  const canInvest =
    pickBoolean(record, ["canInvest", "isEligible", "eligible"]) ??
    !requiresFunding;

  return {
    amount,
    amountFormatted:
      pickString(quote, ["amountFormatted", "amount_formatted"]) ??
      formatCurrencyValue(amount, currency) ??
      "—",
    tokenAmount,
    tokenAmountFormatted:
      pickString(quote, ["tokenAmountFormatted", "token_amount_formatted"]) ??
      formatTokenAmount(tokenAmount),
    pricePerToken,
    pricePerTokenFormatted:
      pickString(quote, ["pricePerTokenFormatted", "price_per_token_formatted"]) ??
      formatCurrencyValue(pricePerToken, currency),
    walletBalance,
    walletBalanceFormatted:
      pickString(wallet, ["walletBalanceFormatted", "wallet_balance_formatted"]) ??
      formatCurrencyValue(walletBalance, currency),
    availableToInvest,
    availableToInvestFormatted:
      pickString(wallet, ["availableToInvestFormatted", "available_to_invest_formatted"]) ??
      formatCurrencyValue(availableToInvest, currency),
    minInvestment,
    minInvestmentFormatted:
      pickString(quote, ["minInvestmentFormatted", "min_investment_formatted"]) ??
      formatCurrencyValue(minInvestment, currency),
    maxInvestment,
    maxInvestmentFormatted:
      pickString(quote, ["maxInvestmentFormatted", "max_investment_formatted"]) ??
      formatCurrencyValue(maxInvestment, currency),
    fees,
    feesFormatted:
      pickString(quote, ["feesFormatted", "fees_formatted", "feeFormatted"]) ??
      formatCurrencyValue(fees, currency),
    totalDebit,
    totalDebitFormatted:
      pickString(quote, ["totalDebitFormatted", "total_debit_formatted", "totalFormatted"]) ??
      formatCurrencyValue(totalDebit, currency),
    currency,
    note:
      pickString(record, ["note", "message", "summary"]) ??
      pickString(wallet, ["note", "message"]) ??
      null,
    canInvest,
    requiresFunding,
    quoteExpiresAt: formatDateTime(
      pickString(record, ["quoteExpiresAt", "quote_expires_at", "expiresAt"]),
    ),
  };
}

export function parseMarketplaceInvestResponse(
  payload: unknown,
): MarketplaceInvestResponse {
  const record = getRecord(payload) ?? {};
  const createdInvestment =
    record.investment && typeof record.investment === "object"
      ? (record.investment as Record<string, unknown>)
      : record;
  const currency = pickString(createdInvestment, ["currency"]) ?? null;
  const amount = pickNumber(createdInvestment, [
    "amount",
    "investmentAmount",
    "committedAmount",
    "amountUsd",
    "amount_usd",
  ]);
  const tokenAmount = pickNumber(createdInvestment, [
    "tokenAmount",
    "tokens",
    "quantity",
    "units",
    "tokensOwned",
    "tokens_owned",
  ]);
  const transactionId = pickString(record, ["transactionId", "transaction_id"]);

  return {
    success:
      pickBoolean(record, ["success", "ok"]) ??
      Boolean(
        pickString(createdInvestment, ["id", "_id", "investmentId", "investment_id"]),
      ),
    investmentId:
      pickString(createdInvestment, [
        "id",
        "_id",
        "investmentId",
        "investment_id",
      ]) ?? null,
    transactionId,
    status: pickString(createdInvestment, ["status", "state"]),
    message: pickString(record, ["message", "detail", "summary"]),
    amount,
    amountFormatted:
      pickString(createdInvestment, ["amountFormatted", "amount_formatted"]) ??
      formatCurrencyValue(amount, currency ?? "USD"),
    tokenAmount,
    tokenAmountFormatted:
      pickString(createdInvestment, [
        "tokenAmountFormatted",
        "token_amount_formatted",
      ]) ?? formatTokenAmount(tokenAmount),
    currency,
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
