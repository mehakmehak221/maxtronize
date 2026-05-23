import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";
import type { PaginationMeta } from "@/lib/issuerDocuments";

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export type InvestorHoldingStatus = string;

export type InvestorHolding = {
  id: string;
  assetId: string | null;
  name: string;
  ticker: string;
  sector: string;
  currentValue: number;
  currentValueFormatted: string;
  investedAmount: number;
  investedFormatted: string;
  gainAmount: number;
  gainFormatted: string;
  gainPercent: number;
  gainPercentFormatted: string;
  status: InvestorHoldingStatus;
  up: boolean;
};

export type InvestorHoldingsListResult = {
  items: InvestorHolding[];
  pagination: PaginationMeta;
};

export type ListInvestorHoldingsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

function formatCurrency(value: number, currency = "USD"): string {
  const symbol = currency === "USD" ? "$" : "";
  const abs = Math.abs(value);
  const prefix = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${prefix}${symbol}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${prefix}${symbol}${(abs / 1_000).toFixed(1)}K`;
  return `${prefix}${symbol}${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatSignedCurrency(value: number, currency = "USD"): string {
  const formatted = formatCurrency(Math.abs(value), currency);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function parsePagination(payload: unknown): PaginationMeta {
  if (!payload || typeof payload !== "object") return DEFAULT_PAGINATION;
  const record = payload as Record<string, unknown>;
  const meta =
    record.pagination && typeof record.pagination === "object"
      ? (record.pagination as Record<string, unknown>)
      : record.meta && typeof record.meta === "object"
        ? (record.meta as Record<string, unknown>)
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

function pickMoney(
  record: Record<string, unknown>,
  amountKeys: string[],
  formattedKeys: string[],
  currencyKeys: string[] = ["currency"],
): { amount: number; formatted: string } {
  const nested =
    record.currentValue && typeof record.currentValue === "object"
      ? (record.currentValue as Record<string, unknown>)
      : record.invested && typeof record.invested === "object"
        ? (record.invested as Record<string, unknown>)
        : record.marketValue && typeof record.marketValue === "object"
          ? (record.marketValue as Record<string, unknown>)
          : null;

  const source = nested ?? record;
  const amount =
    pickNumber(source, amountKeys) ??
    pickNumber(record, amountKeys) ??
    0;
  const currency = pickString(source, currencyKeys) ?? "USD";
  const formatted =
    pickString(source, formattedKeys) ??
    pickString(record, formattedKeys) ??
    formatCurrency(amount, currency);

  return { amount, formatted };
}

function parseHolding(record: Record<string, unknown>, index: number): InvestorHolding {
  const id =
    pickString(record, ["id", "_id", "holdingId", "holding_id"]) ??
    `holding-${index}`;
  const assetId = pickString(record, ["assetId", "asset_id", "asset"]);

  // Try nested asset object first (e.g. { asset: { title: "..." } })
  const assetRecord =
    record.asset && typeof record.asset === "object" && !Array.isArray(record.asset)
      ? (record.asset as Record<string, unknown>)
      : record.opportunity && typeof record.opportunity === "object" && !Array.isArray(record.opportunity)
        ? (record.opportunity as Record<string, unknown>)
        : null;

  const name =
    pickString(record, ["assetTitle", "asset_title", "name", "assetName", "asset_name", "title"]) ??
    (assetRecord ? pickString(assetRecord, ["title", "name", "assetTitle", "assetName"]) : null) ??
    "Untitled holding";
  const ticker =
    pickString(record, ["ticker", "symbol", "tokenSymbol", "token_symbol"]) ?? "—";
  const sector =
    pickString(record, ["sector", "assetClass", "asset_class", "category"]) ?? "—";

  const current = pickMoney(
    record,
    ["currentValue", "current_value", "marketValue", "market_value", "value"],
    ["currentValueFormatted", "current_value_formatted", "marketValueFormatted"],
  );
  const invested = pickMoney(
    record,
    ["invested", "investedAmount", "invested_amount", "costBasis", "cost_basis"],
    ["investedFormatted", "invested_formatted"],
  );

  const gainAmount =
    pickNumber(record, [
      "gain",
      "gainAmount",
      "gain_amount",
      "unrealizedGain",
      "unrealized_gain",
    ]) ?? current.amount - invested.amount;
  const gainPercent =
    pickNumber(record, [
      "gainPercent",
      "gain_percent",
      "returnPercent",
      "return_percent",
    ]) ??
    (invested.amount > 0 ? (gainAmount / invested.amount) * 100 : 0);

  const currency = pickString(record, ["currency"]) ?? "USD";
  const status =
    pickString(record, ["status", "holdingStatus", "state"]) ?? "Active";

  return {
    id,
    assetId,
    name,
    ticker,
    sector,
    currentValue: current.amount,
    currentValueFormatted: current.formatted,
    investedAmount: invested.amount,
    investedFormatted: invested.formatted,
    gainAmount,
    gainFormatted:
      pickString(record, ["gainFormatted", "gain_formatted"]) ??
      formatSignedCurrency(gainAmount, currency),
    gainPercent,
    gainPercentFormatted:
      pickString(record, ["gainPercentFormatted", "gain_percent_formatted"]) ??
      formatSignedPercent(gainPercent),
    status,
    up: gainAmount >= 0,
  };
}

export function parseInvestorHoldingsList(
  payload: unknown,
): InvestorHoldingsListResult {
  return {
    items: unwrapList(payload).map(parseHolding),
    pagination: parsePagination(payload),
  };
}

export function parseInvestorHolding(payload: unknown): InvestorHolding | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return parseHolding(root.data as Record<string, unknown>, 0);
  }
  if (root.holding && typeof root.holding === "object") {
    return parseHolding(root.holding as Record<string, unknown>, 0);
  }
  return parseHolding(root, 0);
}

const SECTOR_ICON_BG: Record<string, string> = {
  "real estate":
    "bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-300",
  "renewable energy":
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-300",
  "private equity":
    "bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-300",
  commodities:
    "bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-300",
};

export function sectorIconClass(sector: string): string {
  const key = sector.trim().toLowerCase();
  return (
    SECTOR_ICON_BG[key] ??
    "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300"
  );
}
