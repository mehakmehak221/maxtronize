import {
  pickNumber,
  pickString,
  unwrapList,
  unwrapPayload,
} from "@/lib/apiParse";
import { downloadCsv } from "@/lib/csvExport";
import { formatCompactCurrency } from "@/lib/issuerDashboard";

export type YieldSummary = {
  totalDistributed: {
    amount: number;
    summary: string;
    currency: string;
  };
  ytdDistributions: {
    amount: number;
    priorYearAmount: number;
    changePercent: number;
    currency: string;
  };
  portfolioAvgApy: {
    percent: number;
    summary: string;
  };
  nextDistribution: {
    amount: number;
    currency: string;
    label: string;
    date: string | null;
  } | null;
};

export type DistributionScheduleMonth = {
  month: number;
  label: string;
  actual: number;
  projected: number;
  scheduledCount: number;
  isPast: boolean;
  isCurrent: boolean;
};

export type DistributionSchedule = {
  year: number;
  months: DistributionScheduleMonth[];
  eoyProjection: number;
  ytdActual: number;
  achievementRate: number;
  currency: string;
};

export type UpcomingPayout = {
  id: string;
  scheduledDate: Record<string, unknown>;
  scheduledDateStr: string;
  assetTitle: string;
  ticker: string;
  payoutType: string;
  expectedAmount: number;
  perInvestorEstimate: number | null;
  frequency: string | null;
  frequencyLabel: string;
  investorCount: number;
  currency: string;
  status: string;
};

function parseMoneyBlock(
  block: unknown,
  fallbackSummary = "",
): { amount: number; summary: string; currency: string } {
  if (!block || typeof block !== "object") {
    return { amount: 0, summary: fallbackSummary, currency: "USD" };
  }
  const record = block as Record<string, unknown>;
  return {
    amount: pickNumber(record, ["amount", "value", "total"]) ?? 0,
    summary:
      pickString(record, ["summary", "label", "description"]) ??
      fallbackSummary,
    currency: pickString(record, ["currency"]) ?? "USD",
  };
}

export function parseYieldSummary(payload: unknown): YieldSummary {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return {
      totalDistributed: { amount: 0, summary: "", currency: "USD" },
      ytdDistributions: {
        amount: 0,
        priorYearAmount: 0,
        changePercent: 0,
        currency: "USD",
      },
      portfolioAvgApy: { percent: 0, summary: "" },
      nextDistribution: null,
    };
  }

  const root = record as Record<string, unknown>;
  const totalDistributed = parseMoneyBlock(
    root.totalDistributed,
    "All-time platform total",
  );
  const ytdBlock = root.ytdDistributions;
  const ytd =
    ytdBlock && typeof ytdBlock === "object"
      ? (ytdBlock as Record<string, unknown>)
      : {};
  const apyBlock = root.portfolioAvgApy;
  const apy =
    apyBlock && typeof apyBlock === "object"
      ? (apyBlock as Record<string, unknown>)
      : {};

  const nextRaw = root.nextDistribution;
  let nextDistribution: YieldSummary["nextDistribution"] = null;
  if (nextRaw && typeof nextRaw === "object" && !Array.isArray(nextRaw)) {
    const next = nextRaw as Record<string, unknown>;
    const amount = pickNumber(next, ["amount", "value"]) ?? 0;
    const currency = pickString(next, ["currency"]) ?? "USD";
    nextDistribution = {
      amount,
      currency,
      label:
        pickString(next, ["label", "summary", "description", "assetName"]) ??
        "Upcoming distribution",
      date:
        pickString(next, [
          "date",
          "scheduledAt",
          "scheduled_at",
          "payoutDate",
        ]) ?? null,
    };
  }

  return {
    totalDistributed,
    ytdDistributions: {
      amount: pickNumber(ytd, ["amount", "value"]) ?? 0,
      priorYearAmount:
        pickNumber(ytd, ["priorYearAmount", "prior_year_amount"]) ?? 0,
      changePercent:
        pickNumber(ytd, ["changePercent", "change_percent", "growthPercent"]) ??
        0,
      currency: pickString(ytd, ["currency"]) ?? "USD",
    },
    portfolioAvgApy: {
      percent: pickNumber(apy, ["percent", "apy", "apyPercent", "value"]) ?? 0,
      summary: pickString(apy, ["summary", "label"]) ?? "Weighted by NAV",
    },
    nextDistribution,
  };
}

export function parseDistributionSchedule(
  payload: unknown,
): DistributionSchedule {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return {
      year: new Date().getFullYear(),
      months: [],
      eoyProjection: 0,
      ytdActual: 0,
      achievementRate: 0,
      currency: "USD",
    };
  }

  const root = record as Record<string, unknown>;
  const monthsRaw = root.months ?? root.schedule;
  const months = unwrapList(monthsRaw).map((item, index) => {
    const isPastRaw = item.isPast ?? item.is_past;
    const isCurrentRaw = item.isCurrent ?? item.is_current;
    return {
      month: pickNumber(item, ["month"]) ?? index + 1,
      label: pickString(item, ["label", "name"]) ?? `M${index + 1}`,
      actual: pickNumber(item, ["actual", "actualAmount", "paid"]) ?? 0,
      projected:
        pickNumber(item, ["projected", "projectedAmount", "target"]) ?? 0,
      scheduledCount:
        pickNumber(item, ["scheduledCount", "scheduled_count"]) ?? 0,
      isPast: typeof isPastRaw === "boolean" ? isPastRaw : isPastRaw === "true",
      isCurrent:
        typeof isCurrentRaw === "boolean"
          ? isCurrentRaw
          : isCurrentRaw === "true",
    };
  });

  return {
    year: pickNumber(root, ["year"]) ?? new Date().getFullYear(),
    months,
    eoyProjection:
      pickNumber(root, ["eoyProjection", "eoy_projection", "eoy"]) ?? 0,
    ytdActual: pickNumber(root, ["ytdActual", "ytd_actual", "ytd"]) ?? 0,
    achievementRate:
      pickNumber(root, ["achievementRate", "achievement_rate"]) ?? 0,
    currency: pickString(root, ["currency"]) ?? "USD",
  };
}

export function parseUpcomingPayouts(payload: unknown): UpcomingPayout[] {
  const list = unwrapList(payload);
  return list.map((item, index) => {
    const expectedAmount =
      pickNumber(item, ["expectedAmount", "expected_amount", "amount"]) ?? 0;
    const currency = pickString(item, ["currency"]) ?? "USD";
    const statusRaw = pickString(item, ["status", "state"]) ?? "SCHEDULED";

    const scheduledDateRaw = item.scheduledDate ?? {};
    const scheduledDate =
      scheduledDateRaw &&
      typeof scheduledDateRaw === "object" &&
      !Array.isArray(scheduledDateRaw)
        ? (scheduledDateRaw as Record<string, unknown>)
        : {};
    const scheduledDateStr =
      pickString(scheduledDate, [
        "date",
        "timestamp",
        "scheduledAt",
        "scheduled_at",
      ]) ??
      pickString(item, ["scheduledDate", "date", "timestamp"]) ??
      "—";

    return {
      id: pickString(item, ["id", "_id", "payoutId"]) ?? `payout-${index}`,
      scheduledDate,
      scheduledDateStr,
      assetTitle:
        pickString(item, ["assetTitle", "asset_title", "asset", "assetName"]) ??
        "—",
      ticker: pickString(item, ["ticker", "symbol"]) ?? "—",
      payoutType:
        pickString(item, ["payoutType", "payout_type", "type"]) ?? "—",
      expectedAmount,
      perInvestorEstimate:
        pickNumber(item, ["perInvestorEstimate", "per_investor_estimate"]) ??
        null,
      frequency: pickString(item, ["frequency"]) ?? null,
      frequencyLabel:
        pickString(item, ["frequencyLabel", "frequency_label"]) ?? "—",
      investorCount: pickNumber(item, ["investorCount", "investor_count"]) ?? 0,
      currency,
      status: statusRaw.toUpperCase(),
    };
  });
}

export function formatShortPayoutDate(
  dateStr: string | null | undefined,
): string {
  if (!dateStr || dateStr === "—") return "—";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type YieldAssetBreakdownRow = {
  assetId: string;
  name: string;
  ticker: string;
  apyPercent: number;
  apyDisplay: string;
  totalDistributed: number;
  totalDistributedFormatted: string;
  frequency: string;
  lastPayoutDate: string | null;
  nextPayoutDate: string | null;
  status: "Above Target" | "On Track" | "Below Target";
};

export type SchedulePayoutRequest = {
  assetId: string;
  title: string;
  payoutType: string;
  scheduledDate: string;
  totalAmount: number;
};

export type ProjectionRequest = {
  year: number;
  month: number;
  projectedAmount: number;
};

export type ProjectionResponse = {
  id: string;
  year: number;
  month: number;
  monthLabel: string;
  projectedAmount: number;
  updatedAt: Record<string, unknown>;
};

export type DistributionHistoryItem = {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  payoutType: string;
  amount: number;
  currency: string;
  investorCount: number;
  paidDate: string;
};

export type PayoutDetails = {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  payoutType: string;
  scheduledDate: string;
  totalAmount: number;
  currency: string;
  investorCount: number;
  status: "SCHEDULED" | "PROCESSING" | "PAID" | "CANCELLED";
};

/** API may send APY as percent (7.2) or scaled (720 → 7.2%, 2400 → 24%). */
export function normalizeYieldApyPercent(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  if (raw > 100) return raw / 100;
  return raw;
}

function formatFrequencyLabel(raw: string | null): string {
  if (!raw?.trim()) return "—";
  if (!raw.includes("_")) return raw;
  return raw
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");
}

function mapPerformanceStatus(
  label: string | null,
  status: string | null,
): YieldAssetBreakdownRow["status"] {
  const normalized = (label ?? status ?? "")
    .trim()
    .toUpperCase()
    .replace(/[_-]+/g, " ");
  if (normalized.includes("ABOVE")) return "Above Target";
  if (normalized.includes("BELOW")) return "Below Target";
  return "On Track";
}

export function parseYieldAssetBreakdown(
  payload: unknown,
): YieldAssetBreakdownRow[] {
  return unwrapList(payload).map((item, index) => {
    const apyRaw =
      pickNumber(item, ["apyPercent", "apy_percent", "apy", "yieldPercent"]) ??
      0;
    const apyPercent = normalizeYieldApyPercent(apyRaw);
    const totalDistributed =
      pickNumber(item, [
        "totalDistributed",
        "total_distributed",
        "distributed",
      ]) ?? 0;
    const currency = pickString(item, ["currency"]) ?? "USD";
    const frequency =
      pickString(item, ["frequencyLabel", "frequency_label"]) ??
      formatFrequencyLabel(pickString(item, ["frequency"]));

    return {
      assetId:
        pickString(item, ["assetId", "asset_id", "id", "_id"]) ??
        `asset-${index}`,
      name:
        pickString(item, ["title", "assetName", "asset_name", "name"]) ??
        `Asset ${index + 1}`,
      ticker: pickString(item, ["ticker", "symbol", "tokenSymbol"]) ?? "—",
      apyPercent,
      apyDisplay: `${apyPercent.toFixed(apyPercent % 1 === 0 ? 0 : 1)}%`,
      totalDistributed,
      totalDistributedFormatted: formatCompactCurrency(
        totalDistributed,
        currency,
        {
          decimals: totalDistributed >= 1_000_000 ? 2 : 0,
        },
      ),
      frequency,
      lastPayoutDate:
        pickString(item, [
          "lastPayoutDate",
          "last_payout_date",
          "lastPayout",
        ]) ?? null,
      nextPayoutDate:
        pickString(item, [
          "nextPayoutDate",
          "next_payout_date",
          "nextPayout",
        ]) ?? null,
      status: mapPerformanceStatus(
        pickString(item, ["performanceLabel", "performance_label"]),
        pickString(item, ["performanceStatus", "performance_status", "status"]),
      ),
    };
  });
}

export function parseProjectionResponse(payload: unknown): ProjectionResponse {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return {
      id: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      monthLabel: "",
      projectedAmount: 0,
      updatedAt: {},
    };
  }

  const root = record as Record<string, unknown>;
  const projectionRaw = root.projection ?? root;
  const projection =
    projectionRaw &&
    typeof projectionRaw === "object" &&
    !Array.isArray(projectionRaw)
      ? (projectionRaw as Record<string, unknown>)
      : root;

  return {
    id: pickString(projection, ["id", "_id"]) ?? "",
    year: pickNumber(projection, ["year"]) ?? new Date().getFullYear(),
    month: pickNumber(projection, ["month"]) ?? new Date().getMonth() + 1,
    monthLabel:
      pickString(projection, ["monthLabel", "month_label", "label"]) ?? "",
    projectedAmount:
      pickNumber(projection, ["projectedAmount", "projected_amount"]) ?? 0,
    updatedAt: (projection.updatedAt ?? {}) as Record<string, unknown>,
  };
}

export function parseDistributionHistory(
  payload: unknown,
): DistributionHistoryItem[] {
  return unwrapList(payload).map((item, index) => ({
    id: pickString(item, ["id", "_id", "payoutId"]) ?? `dist-${index}`,
    assetId: pickString(item, ["assetId", "asset_id"]) ?? "",
    assetName: pickString(item, ["assetName", "asset_name", "asset"]) ?? "—",
    title: pickString(item, ["title", "name"]) ?? "—",
    payoutType: pickString(item, ["payoutType", "payout_type", "type"]) ?? "—",
    amount: pickNumber(item, ["amount", "totalAmount", "total_amount"]) ?? 0,
    currency: pickString(item, ["currency"]) ?? "USD",
    investorCount:
      pickNumber(item, ["investorCount", "investor_count", "investors"]) ?? 0,
    paidDate: pickString(item, ["paidDate", "paid_date", "date"]) ?? "",
  }));
}

export function parsePayoutDetails(payload: unknown): PayoutDetails {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return {
      id: "",
      assetId: "",
      assetName: "",
      title: "",
      payoutType: "",
      scheduledDate: "",
      totalAmount: 0,
      currency: "USD",
      investorCount: 0,
      status: "SCHEDULED",
    };
  }

  const root = record as Record<string, unknown>;
  const statusRaw = pickString(root, ["status"]) ?? "SCHEDULED";
  const status: PayoutDetails["status"] =
    statusRaw.toUpperCase() as PayoutDetails["status"];

  return {
    id: pickString(root, ["id", "_id"]) ?? "",
    assetId: pickString(root, ["assetId", "asset_id"]) ?? "",
    assetName: pickString(root, ["assetName", "asset_name", "asset"]) ?? "—",
    title: pickString(root, ["title", "name"]) ?? "—",
    payoutType: pickString(root, ["payoutType", "payout_type", "type"]) ?? "—",
    scheduledDate:
      pickString(root, ["scheduledDate", "scheduled_date", "date"]) ?? "",
    totalAmount:
      pickNumber(root, ["totalAmount", "total_amount", "amount"]) ?? 0,
    currency: pickString(root, ["currency"]) ?? "USD",
    investorCount:
      pickNumber(root, ["investorCount", "investor_count", "investors"]) ?? 0,
    status,
  };
}

const YIELD_BREAKDOWN_CSV_HEADERS = [
  "Asset",
  "Ticker",
  "APY",
  "Total Distributed",
  "Frequency",
  "Last Payout",
  "Next Payout",
  "Status",
] as const;

export function exportYieldAssetBreakdownCsv(
  rows: YieldAssetBreakdownRow[],
): void {
  const dateStamp = new Date().toISOString().slice(0, 10);
  const csvRows = rows.map((row) => [
    row.name,
    row.ticker,
    row.apyDisplay,
    row.totalDistributedFormatted,
    row.frequency,
    row.lastPayoutDate ? formatShortPayoutDate(row.lastPayoutDate) : "",
    row.nextPayoutDate ? formatShortPayoutDate(row.nextPayoutDate) : "",
    row.status,
  ]);

  downloadCsv(
    `asset-yield-breakdown-${dateStamp}.csv`,
    [...YIELD_BREAKDOWN_CSV_HEADERS],
    csvRows,
  );
}

export function parseApyPercent(apy: string): number {
  const n = parseFloat(apy.replace(/%/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function chartScaleForAmounts(values: number[]): {
  divisor: number;
  suffix: string;
  max: number;
} {
  const max = Math.max(...values, 0);
  if (max >= 1_000_000) {
    return { divisor: 1_000_000, suffix: "M", max: max / 1_000_000 };
  }
  if (max >= 1_000) {
    return { divisor: 1_000, suffix: "K", max: max / 1_000 };
  }
  return { divisor: 1, suffix: "", max };
}

export function distributionScheduleHasChartData(
  months: DistributionScheduleMonth[],
): boolean {
  return months.some((m) => m.actual > 0 || m.projected > 0);
}

export function buildDistributionChartYTicks(
  maxChart: number,
  count = 5,
): number[] {
  if (!Number.isFinite(maxChart) || maxChart <= 0) return [0];
  const steps = Math.max(count - 1, 1);
  return Array.from(
    { length: count },
    (_, index) => (maxChart * index) / steps,
  );
}

export function formatDistributionChartYTick(
  value: number,
  scaleSuffix: string,
): string {
  if (value === 0) return "$0";
  if (scaleSuffix === "M") return `$${value.toFixed(1)}M`;
  if (scaleSuffix === "K") {
    return value >= 10 ? `$${Math.round(value)}K` : `$${value.toFixed(1)}K`;
  }
  if (value < 1) return `$${value.toFixed(2)}`;
  return `$${Math.round(value)}`;
}
