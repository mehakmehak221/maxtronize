import { pickNumber, pickString } from "@/lib/apiParse";
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

export type TransactionDisplayType = {
  key: string;
  label: string;
};

export type TransactionAssetFilter = {
  id: string;
  name: string;
};

export type InvestorHubTransactionFilters = {
  displayTypes: TransactionDisplayType[];
  assets: TransactionAssetFilter[];
};

export type InvestorHubTransaction = {
  id: string;
  assetId: string | null;
  assetName: string;
  type: string;
  typeLabel: string;
  amount: number;
  amountFormatted: string;
  currency: string;
  date: string;
  status: string;
};

export type InvestorHubTransactionsResult = {
  data: InvestorHubTransaction[];
  pagination: PaginationMeta;
};

export type ListInvestorHubTransactionsParams = {
  page?: number;
  limit?: number;
  assetId?: string;
  displayType?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number, currency = "USD"): string {
  const symbol = currency === "USD" ? "$" : "";
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "+";
  if (abs >= 1_000_000) return `${sign}${symbol}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${symbol}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${symbol}${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseTransaction(
  record: Record<string, unknown>,
  index: number,
): InvestorHubTransaction {
  const id =
    pickString(record, ["id", "_id", "transactionId", "transaction_id"]) ??
    `tx-${index}`;

  const assetRecord =
    record.asset && typeof record.asset === "object"
      ? (record.asset as Record<string, unknown>)
      : null;

  const assetName =
    pickString(record, ["assetName", "asset_name", "name"]) ??
    (assetRecord ? pickString(assetRecord, ["name", "title"]) : null) ??
    "—";

  const assetId =
    pickString(record, ["assetId", "asset_id"]) ??
    (assetRecord ? pickString(assetRecord, ["id", "_id"]) : null);

  const type =
    pickString(record, ["type", "displayType", "transactionType"]) ?? "—";
  const typeLabel =
    pickString(record, ["typeLabel", "type_label", "label"]) ?? type;

  const amount =
    pickNumber(record, ["amount", "value", "transactionAmount"]) ?? 0;
  const currency = pickString(record, ["currency"]) ?? "USD";

  return {
    id,
    assetId,
    assetName,
    type,
    typeLabel,
    amount,
    amountFormatted:
      pickString(record, ["amountFormatted", "amount_formatted"]) ??
      formatCurrency(amount, currency),
    currency,
    date: formatDate(
      pickString(record, [
        "date",
        "transactionDate",
        "createdAt",
        "created_at",
        "timestamp",
      ]),
    ),
    status: pickString(record, ["status", "state"]) ?? "—",
  };
}

export function parseInvestorHubTransactions(
  payload: unknown,
): InvestorHubTransactionsResult {
  // The API returns { data: [], pagination: {...} }
  const root =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const dataArray = Array.isArray(root.data) ? root.data : [];

  const items = dataArray
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    )
    .map(parseTransaction);

  return {
    data: items,
    pagination: parsePagination(payload),
  };
}

export function parseInvestorHubTransactionFilters(
  payload: unknown,
): InvestorHubTransactionFilters {
  if (!payload || typeof payload !== "object") {
    return { displayTypes: [], assets: [] };
  }
  const root = payload as Record<string, unknown>;

  const displayTypes: TransactionDisplayType[] = Array.isArray(root.displayTypes)
    ? root.displayTypes
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        )
        .map((item) => ({
          key: pickString(item, ["key"]) ?? "",
          label: pickString(item, ["label"]) ?? "",
        }))
        .filter((item) => item.key)
    : [];

  const assets: TransactionAssetFilter[] = Array.isArray(root.assets)
    ? root.assets
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        )
        .map((item) => ({
          id: pickString(item, ["id", "_id"]) ?? "",
          name: pickString(item, ["name", "title"]) ?? "",
        }))
        .filter((item) => item.id)
    : [];

  return { displayTypes, assets };
}

// ── Query string ──────────────────────────────────────────────────────────────

export function buildTransactionsQueryString(
  params: ListInvestorHubTransactionsParams,
): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.assetId?.trim()) searchParams.set("assetId", params.assetId.trim());
  if (params.displayType?.trim())
    searchParams.set("type", params.displayType.trim());
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.fromDate?.trim())
    searchParams.set("fromDate", params.fromDate.trim());
  if (params.toDate?.trim()) searchParams.set("toDate", params.toDate.trim());
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}
