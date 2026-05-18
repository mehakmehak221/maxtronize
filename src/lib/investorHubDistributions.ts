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

export type MoneyAmount = {
  amount: number;
  currency: string;
};

export type InvestorDistribution = {
  id: string;
  assetName: string;
  assetId: string | null;
  amount: number;
  amountFormatted: string;
  currency: string;
  date: string;
  status: string;
  type: string;
};

export type InvestorDistributionsListResult = {
  items: InvestorDistribution[];
  pagination: PaginationMeta;
};

export type InvestorDistributionsSummary = {
  ytdDistributions: MoneyAmount;
  nextPayment: (MoneyAmount & { date?: string; label?: string }) | null;
  avgMonthly: MoneyAmount;
};

export type ListInvestorDistributionsParams = {
  page?: number;
  limit?: number;
  assetId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
};

function formatCurrency(amount: number, currency = "USD"): string {
  const symbol = currency === "USD" ? "$" : "";
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${symbol}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${symbol}${(abs / 1_000).toFixed(1)}K`;
  return `${symbol}${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatDistributionDate(value: string | null): string {
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

function parseMoney(
  record: Record<string, unknown> | null,
): MoneyAmount {
  if (!record) return { amount: 0, currency: "USD" };
  return {
    amount: pickNumber(record, ["amount", "value"]) ?? 0,
    currency: pickString(record, ["currency"]) ?? "USD",
  };
}

function parseDistribution(record: Record<string, unknown>, index: number): InvestorDistribution {
  const id =
    pickString(record, ["id", "_id", "distributionId", "distribution_id"]) ??
    `distribution-${index}`;

  const assetRecord =
    record.asset && typeof record.asset === "object"
      ? (record.asset as Record<string, unknown>)
      : null;

  const assetName =
    pickString(record, ["assetName", "asset_name", "name", "title"]) ??
    (assetRecord ? pickString(assetRecord, ["name", "title"]) : null) ??
    "—";
  const assetId =
    pickString(record, ["assetId", "asset_id"]) ??
    (assetRecord ? pickString(assetRecord, ["id", "_id"]) : null);

  const amount = pickNumber(record, ["amount", "value", "distributionAmount"]) ?? 0;
  const currency = pickString(record, ["currency"]) ?? "USD";

  return {
    id,
    assetName,
    assetId,
    amount,
    amountFormatted:
      pickString(record, ["amountFormatted", "amount_formatted"]) ??
      formatCurrency(amount, currency),
    currency,
    date: formatDistributionDate(
      pickString(record, [
        "date",
        "paidAt",
        "paid_at",
        "distributionDate",
        "distribution_date",
        "createdAt",
      ]),
    ),
    status: pickString(record, ["status", "state"]) ?? "—",
    type: pickString(record, ["type", "distributionType", "category"]) ?? "Distribution",
  };
}

export function parseInvestorDistributionsList(
  payload: unknown,
): InvestorDistributionsListResult {
  return {
    items: unwrapList(payload).map(parseDistribution),
    pagination: parsePagination(payload),
  };
}

export function parseInvestorDistributionsSummary(
  payload: unknown,
): InvestorDistributionsSummary {
  if (!payload || typeof payload !== "object") {
    return {
      ytdDistributions: { amount: 0, currency: "USD" },
      nextPayment: null,
      avgMonthly: { amount: 0, currency: "USD" },
    };
  }

  const root = payload as Record<string, unknown>;
  const nextRaw = root.nextPayment ?? root.next_payment;

  let nextPayment: InvestorDistributionsSummary["nextPayment"] = null;
  if (nextRaw && typeof nextRaw === "object") {
    const next = nextRaw as Record<string, unknown>;
    const money = parseMoney(next);
    nextPayment = {
      ...money,
      date: pickString(next, ["date", "scheduledAt", "scheduled_at"]) ?? undefined,
      label: pickString(next, ["label", "summary", "assetName", "asset_name"]) ?? undefined,
    };
  }

  return {
    ytdDistributions: parseMoney(
      (root.ytdDistributions as Record<string, unknown>) ??
        (root.ytd_distributions as Record<string, unknown>) ??
        null,
    ),
    nextPayment,
    avgMonthly: parseMoney(
      (root.avgMonthly as Record<string, unknown>) ??
        (root.avg_monthly as Record<string, unknown>) ??
        null,
    ),
  };
}

export function buildDistributionsQueryString(
  params: ListInvestorDistributionsParams,
): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.assetId?.trim()) searchParams.set("assetId", params.assetId.trim());
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.fromDate?.trim()) searchParams.set("fromDate", params.fromDate.trim());
  if (params.toDate?.trim()) searchParams.set("toDate", params.toDate.trim());
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}
