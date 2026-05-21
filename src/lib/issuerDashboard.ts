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

const ALLOCATION_COLORS = [
  "#5b21b6",
  "#4338ca",
  "#3b82f6",
  "#7c3aed",
  "#c4b5fd",
  "#6366f1",
  "#8b5cf6",
];

const TOKEN_DOT_CLASSES = [
  "bg-emerald-400",
  "bg-sky-400",
  "bg-amber-400",
  "bg-violet-400",
  "bg-rose-400",
];

export type IssuerDashboardSummary = {
  capitalRaised: {
    total: number;
    quarterlyGrowthPercent: number;
    currency: string;
  };
  assets: {
    count: number;
    jurisdictionCount: number;
    tokenizedValue: number;
  };
  activeRaises: number;
  investors: {
    total: number;
    kycVerifiedPercent: number;
  };
  yield: {
    averageApyPercent: number;
    changePercent: number;
  };
};

export type CapitalRaisedPeriod = "3m" | "6m" | "9m" | "12m" | "1y" | string;

export type CapitalRaisedPoint = {
  label: string;
  actual: number;
  target: number;
};

export type IssuerCapitalRaised = {
  series: CapitalRaisedPoint[];
  currentMonth: number;
  targetGap: number;
  completionPercent: number;
};

export type AllocationSegment = {
  label: string;
  value: number;
  percent: number;
  color: string;
};

export type IssuerDashboardAllocation = {
  segments: AllocationSegment[];
  total: number;
  weightBy: string;
};

export type TokenTickerItem = {
  sym: string;
  change: string;
  dotClass: string;
};

export type RecentActivityItem = {
  name: string;
  id: string;
  amount: string;
  time: string;
  region: string;
  tone: "emerald" | "amber";
  done: boolean;
};

export type UpcomingEventItem = {
  id: string;
  label: string;
  dateDisplay: string;
  month: string;
  day: string;
  pillClass: string;
  subtitle: string;
};

export type IssuerAsset = {
  id: string;
  name: string;
  status: string;
  type: string | null;
  valuation: number | null;
  tokenSymbol: string | null;
};

export type ListIssuerAssetsParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export type IssuerAssetsListResult = {
  items: IssuerAsset[];
  pagination: PaginationMeta;
};

export type ListRecentActivityParams = {
  page?: number;
  limit?: number;
};

export type IssuerRecentActivityResult = {
  items: RecentActivityItem[];
  pagination: PaginationMeta;
};

function parsePagination(payload: unknown): PaginationMeta {
  if (!payload || typeof payload !== "object") return DEFAULT_PAGINATION;
  const record = payload as Record<string, unknown>;
  const pagination =
    record.pagination && typeof record.pagination === "object"
      ? (record.pagination as Record<string, unknown>)
      : record;

  return {
    page: pickNumber(pagination, ["page"]) ?? DEFAULT_PAGINATION.page,
    limit: pickNumber(pagination, ["limit"]) ?? DEFAULT_PAGINATION.limit,
    total: pickNumber(pagination, ["total"]) ?? DEFAULT_PAGINATION.total,
    totalPages:
      pickNumber(pagination, ["totalPages", "total_pages"]) ??
      DEFAULT_PAGINATION.totalPages,
    hasNextPage: Boolean(
      pagination.hasNextPage ?? pagination.has_next_page ?? false,
    ),
    hasPreviousPage: Boolean(
      pagination.hasPreviousPage ?? pagination.has_previous_page ?? false,
    ),
  };
}

function unwrapRecord(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  const root = payload as Record<string, unknown>;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return root.data as Record<string, unknown>;
  }
  return root;
}

export function formatCompactCurrency(
  value: number,
  currency = "USD",
  options?: { decimals?: number },
): string {
  const decimals = options?.decimals ?? 2;
  const symbol = currency === "USD" ? "$" : `${currency} `;
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000).toFixed(decimals)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${symbol}${(abs / 1_000).toFixed(decimals === 2 ? 0 : decimals)}K`;
  }
  return `${sign}${symbol}${abs.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  })}`;
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString("en-US");
}

export function formatPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

function formatActivityAmount(value: number | null): string {
  if (value === null) return "—";
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${formatCompactCurrency(value)}`;
}

function formatRelativeTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function parseIssuerDashboardSummary(
  payload: unknown,
): IssuerDashboardSummary {
  const record = unwrapRecord(payload);
  const capital = (record.capitalRaised ?? record.capital_raised) as
    | Record<string, unknown>
    | undefined;
  const assets = record.assets as Record<string, unknown> | undefined;
  const investors = record.investors as Record<string, unknown> | undefined;
  const yieldData = (record.yield ?? record.yields) as
    | Record<string, unknown>
    | undefined;

  return {
    capitalRaised: {
      total:
        (capital && pickNumber(capital, ["total", "amount", "value"])) ?? 0,
      quarterlyGrowthPercent:
        (capital &&
          pickNumber(capital, [
            "quarterlyGrowthPercent",
            "quarterly_growth_percent",
            "growthPercent",
            "growth_percent",
          ])) ??
        0,
      currency:
        (capital && pickString(capital, ["currency", "currencyCode"])) ??
        "USD",
    },
    assets: {
      count:
        (assets && pickNumber(assets, ["count", "total", "assetCount"])) ?? 0,
      jurisdictionCount:
        (assets &&
          pickNumber(assets, [
            "jurisdictionCount",
            "jurisdiction_count",
            "jurisdictions",
          ])) ??
        0,
      tokenizedValue:
        (assets &&
          pickNumber(assets, [
            "tokenizedValue",
            "tokenized_value",
            "value",
            "totalValue",
          ])) ??
        0,
    },
    activeRaises:
      pickNumber(record, ["activeRaises", "active_raises", "activeRaisesCount"]) ??
      0,
    investors: {
      total:
        (investors && pickNumber(investors, ["total", "count", "investorCount"])) ??
        0,
      kycVerifiedPercent:
        (investors &&
          pickNumber(investors, [
            "kycVerifiedPercent",
            "kyc_verified_percent",
            "kycPercent",
          ])) ??
        0,
    },
    yield: {
      averageApyPercent:
        (yieldData &&
          pickNumber(yieldData, [
            "averageApyPercent",
            "average_apy_percent",
            "apy",
            "averageApy",
          ])) ??
        0,
      changePercent:
        (yieldData &&
          pickNumber(yieldData, [
            "changePercent",
            "change_percent",
            "change",
          ])) ??
        0,
    },
  };
}

function parseCapitalPoint(record: Record<string, unknown>): CapitalRaisedPoint {
  const label =
    pickString(record, [
      "label",
      "month",
      "period",
      "name",
      "date",
      "monthLabel",
    ]) ?? "";
  const actual =
    pickNumber(record, [
      "actual",
      "raised",
      "value",
      "amount",
      "capitalRaised",
      "capital_raised",
    ]) ?? 0;
  const target =
    pickNumber(record, ["target", "goal", "targetAmount", "target_amount"]) ??
    0;
  return { label, actual, target };
}

export function parseIssuerCapitalRaised(payload: unknown): IssuerCapitalRaised {
  const record = unwrapRecord(payload);
  const seriesRaw = record.series ?? record.points ?? record.data;
  const series = Array.isArray(seriesRaw)
    ? seriesRaw
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        )
        .map(parseCapitalPoint)
    : unwrapList(seriesRaw).map(parseCapitalPoint);

  return {
    series,
    currentMonth:
      pickNumber(record, ["currentMonth", "current_month", "current"]) ?? 0,
    targetGap: pickNumber(record, ["targetGap", "target_gap", "gap"]) ?? 0,
    completionPercent:
      pickNumber(record, [
        "completionPercent",
        "completion_percent",
        "completion",
      ]) ?? 0,
  };
}

function parseAllocationSegment(
  record: Record<string, unknown>,
  index: number,
): AllocationSegment {
  const value =
    pickNumber(record, ["value", "amount", "weight", "appraisal"]) ?? 0;
  const percent =
    pickNumber(record, [
      "percent",
      "percentage",
      "share",
      "sharePercent",
      "weightPercent",
    ]) ?? 0;
  const label =
    pickString(record, [
      "label",
      "name",
      "category",
      "assetClass",
      "asset_class",
      "type",
    ]) ?? `Segment ${index + 1}`;
  const color =
    pickString(record, ["color", "hex", "fill"]) ??
    ALLOCATION_COLORS[index % ALLOCATION_COLORS.length];

  return { label, value, percent, color };
}

export function parseIssuerDashboardAllocation(
  payload: unknown,
): IssuerDashboardAllocation {
  const record = unwrapRecord(payload);
  const segmentsRaw = record.segments ?? record.items ?? record.data;
  let segments = Array.isArray(segmentsRaw)
    ? segmentsRaw
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        )
        .map((item, i) => parseAllocationSegment(item, i))
    : unwrapList(segmentsRaw).map((item, i) =>
        parseAllocationSegment(item, i),
      );

  const total =
    pickNumber(record, ["total", "totalValue", "total_value"]) ??
    segments.reduce((sum, s) => sum + (s.value || s.percent), 0);

  if (segments.length > 0 && segments.every((s) => s.percent === 0) && total > 0) {
    segments = segments.map((s) => ({
      ...s,
      percent: total > 0 ? (s.value / total) * 100 : 0,
    }));
  }

  return {
    segments,
    total,
    weightBy:
      pickString(record, ["weightBy", "weight_by", "weightedBy"]) ?? "appraisal",
  };
}

function parseTokenTickerItem(
  record: Record<string, unknown>,
  index: number,
): TokenTickerItem {
  const sym =
    pickString(record, [
      "sym",
      "symbol",
      "ticker",
      "tokenSymbol",
      "token_symbol",
      "code",
    ]) ?? "—";
  const changeRaw =
    pickNumber(record, [
      "change",
      "changePercent",
      "change_percent",
      "percentChange",
      "ch",
    ]) ?? 0;
  const changeStr =
    pickString(record, ["changeLabel", "change_label", "displayChange"]) ??
    `${changeRaw >= 0 ? "+" : ""}${changeRaw.toFixed(1)}%`;

  return {
    sym,
    change: changeStr.startsWith("+") || changeStr.startsWith("-")
      ? changeStr
      : `${changeRaw >= 0 ? "+" : ""}${changeStr}`,
    dotClass: TOKEN_DOT_CLASSES[index % TOKEN_DOT_CLASSES.length],
  };
}

export function parseIssuerTokenTicker(payload: unknown): TokenTickerItem[] {
  const list = Array.isArray(payload)
    ? payload
    : unwrapList(unwrapPayloadTicker(payload));
  return list
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    )
    .map(parseTokenTickerItem);
}

function unwrapPayloadTicker(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const root = payload as Record<string, unknown>;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.tokens)) return root.tokens;
  if (Array.isArray(root.items)) return root.items;
  return payload;
}

function parseRecentActivityItem(
  record: Record<string, unknown>,
): RecentActivityItem {
  const name =
    pickString(record, [
      "name",
      "title",
      "assetName",
      "asset_name",
      "description",
      "label",
    ]) ?? "Activity";
  const id =
    pickString(record, [
      "id",
      "referenceId",
      "reference_id",
      "transactionId",
      "transaction_id",
      "txId",
    ]) ?? "";
  const amountValue = pickNumber(record, [
    "amount",
    "value",
    "capitalRaised",
    "raised",
  ]);
  const time =
    pickString(record, ["time", "timeAgo", "time_ago", "relativeTime"]) ??
    formatRelativeTime(
      pickString(record, [
        "createdAt",
        "created_at",
        "occurredAt",
        "occurred_at",
        "date",
        "timestamp",
      ]),
    );
  const region =
    pickString(record, [
      "region",
      "jurisdiction",
      "country",
      "countryCode",
      "country_code",
    ]) ?? "—";
  const status = (pickString(record, ["status", "state", "type"]) ?? "").toLowerCase();
  const done =
    record.completed === true ||
    record.isCompleted === true ||
    status.includes("complete") ||
    status.includes("settled") ||
    status.includes("success");

  const tone: "emerald" | "amber" =
    done || status.includes("raise") || status.includes("invest")
      ? "emerald"
      : "amber";

  return {
    name,
    id: id ? (id.startsWith("TX-") ? id : `TX-${id.slice(0, 8)}`) : "—",
    amount: formatActivityAmount(amountValue),
    time,
    region: region.length <= 4 ? region.toUpperCase() : region.slice(0, 3).toUpperCase(),
    tone,
    done,
  };
}

export function parseIssuerRecentActivity(
  payload: unknown,
): IssuerRecentActivityResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }
  const record = payload as Record<string, unknown>;
  const items = unwrapList(record.data ?? record.items ?? record.activities).map(
    parseRecentActivityItem,
  );
  return {
    items,
    pagination: parsePagination(payload),
  };
}

const DEFAULT_EVENT_PILL =
  "bg-ui-muted-deep text-ui-muted-text dark:bg-white/10 dark:text-white/70";

function pillClassForUpcomingEvent(label: string, type: string | null): string {
  const hay = `${label} ${type ?? ""}`.toLowerCase();
  if (hay.includes("yield") || hay.includes("distribution")) {
    return "bg-violet-500/15 text-violet-700 dark:text-violet-300";
  }
  if (hay.includes("kyc") || hay.includes("review") || hay.includes("compliance")) {
    return "bg-amber-500/15 text-amber-800 dark:text-amber-300";
  }
  if (hay.includes("lock") || hay.includes("expir") || hay.includes("maturity")) {
    return "bg-sky-500/15 text-sky-800 dark:text-sky-300";
  }
  if (hay.includes("onboard") || hay.includes("investor") || hay.includes("signup")) {
    return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300";
  }
  return DEFAULT_EVENT_PILL;
}

function formatUpcomingEventDate(value: string | null): {
  dateDisplay: string;
  month: string;
  day: string;
} {
  if (!value?.trim()) {
    return { dateDisplay: "—", month: "—", day: "—" };
  }

  const trimmed = value.trim();
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const month = parsed.toLocaleDateString("en-US", { month: "short" });
    const day = String(parsed.getDate());
    return { dateDisplay: `${month} ${day}`, month, day };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return {
      dateDisplay: `${parts[0]} ${parts[1]}`,
      month: parts[0],
      day: parts[1],
    };
  }

  return { dateDisplay: trimmed, month: trimmed, day: "—" };
}

function parseUpcomingEventItem(
  record: Record<string, unknown>,
  index: number,
): UpcomingEventItem {
  const label =
    pickString(record, [
      "label",
      "title",
      "name",
      "eventName",
      "event_name",
      "description",
    ]) ?? "Upcoming event";
  const type = pickString(record, [
    "type",
    "eventType",
    "event_type",
    "category",
    "kind",
  ]);
  const dateRaw =
    pickString(record, [
      "date",
      "dateLabel",
      "date_label",
      "displayDate",
      "scheduledAt",
      "scheduled_at",
      "eventDate",
      "event_date",
      "startsAt",
      "starts_at",
      "dueAt",
      "due_at",
    ]) ?? null;
  const { dateDisplay, month, day } = formatUpcomingEventDate(dateRaw);
  const subtitle =
    pickString(record, [
      "subtitle",
      "sub",
      "description",
      "assetName",
      "asset_name",
      "status",
      "statusLabel",
    ]) ?? "Coming soon";
  const id =
    pickString(record, ["id", "_id", "eventId", "event_id"]) ??
    `event-${index}`;

  const pillFromApi = pickString(record, ["pillClass", "pill_class", "colorClass"]);
  const pillClass = pillFromApi ?? pillClassForUpcomingEvent(label, type);

  return {
    id,
    label,
    dateDisplay,
    month,
    day,
    pillClass,
    subtitle,
  };
}

export function parseIssuerUpcomingEvents(payload: unknown): UpcomingEventItem[] {
  if (Array.isArray(payload)) {
    return payload
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map(parseUpcomingEventItem);
  }
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  return unwrapList(
    record.data ?? record.events ?? record.items ?? record.upcomingEvents,
  ).map(parseUpcomingEventItem);
}

function parseIssuerAsset(record: Record<string, unknown>): IssuerAsset {
  return {
    id: pickString(record, ["id", "_id", "assetId", "asset_id"]) ?? "",
    name:
      pickString(record, ["name", "title", "assetName", "asset_name"]) ??
      "Untitled asset",
    status: pickString(record, ["status", "state", "lifecycleStatus"]) ?? "—",
    type: pickString(record, ["type", "assetType", "asset_class", "category"]),
    valuation: pickNumber(record, [
      "valuation",
      "value",
      "appraisalValue",
      "appraisal_value",
      "tokenizedValue",
    ]),
    tokenSymbol: pickString(record, [
      "tokenSymbol",
      "token_symbol",
      "symbol",
      "ticker",
    ]),
  };
}

export function parseIssuerAssetsList(payload: unknown): IssuerAssetsListResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }
  const record = payload as Record<string, unknown>;
  const items = unwrapList(record.data ?? record.items ?? record.assets).map(
    parseIssuerAsset,
  );
  return {
    items,
    pagination: parsePagination(payload),
  };
}

export function buildAllocationConicGradient(
  segments: AllocationSegment[],
): string | null {
  if (segments.length === 0) return null;
  const totalWeight = segments.reduce(
    (sum, s) => sum + (s.percent > 0 ? s.percent : s.value),
    0,
  );
  if (totalWeight <= 0) return null;

  let angle = -90;
  const stops: string[] = [];
  for (const segment of segments) {
    const weight =
      segment.percent > 0 ? segment.percent : (segment.value / totalWeight) * 100;
    const sweep = (weight / 100) * 360;
    const end = angle + sweep;
    stops.push(`${segment.color} ${angle}deg ${end}deg`);
    angle = end;
  }
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

export function buildCapitalChartPaths(series: CapitalRaisedPoint[]): {
  actualPath: string;
  targetPath: string;
  areaPath: string;
  labels: string[];
} | null {
  if (series.length === 0) return null;

  const actualValues = series.map((p) => p.actual);
  const targetValues = series.map((p) => p.target);
  const max = Math.max(...actualValues, ...targetValues, 1);
  const lastIndex = Math.max(series.length - 1, 1);

  const toPoint = (value: number, index: number) => {
    const x = (index / lastIndex) * 1000;
    const y = 12 + (1 - value / max) * 70;
    return { x, y };
  };

  const actualPoints = actualValues.map((v, i) => toPoint(v, i));
  const targetPoints = targetValues.map((v, i) => toPoint(v, i));

  const linePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    if (points.length === 1) {
      const p = points[0];
      return `M${p.x},${p.y}`;
    }
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ");
  };

  const actualPath = linePath(actualPoints);
  const targetPath = linePath(targetPoints);
  const last = actualPoints[actualPoints.length - 1];
  const first = actualPoints[0];
  const areaPath = `${actualPath} L${last.x.toFixed(1)},100 L${first.x.toFixed(1)},100 Z`;

  const monthFallback = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const labels = series.map(
    (p, i) => p.label || monthFallback[i % monthFallback.length],
  );

  return { actualPath, targetPath, areaPath, labels };
}

export function greetingForHour(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function firstNameFromProfile(fullName: string | null | undefined): string {
  if (!fullName?.trim()) return "there";
  return fullName.trim().split(/\s+/)[0] ?? "there";
}
