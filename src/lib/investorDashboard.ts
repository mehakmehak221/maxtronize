import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";
import type { PaginationMeta } from "@/lib/issuerDocuments";
import {
  formatCompactCurrency,
  formatPercent,
  greetingForHour,
  parseIssuerCapitalRaised,
  parseIssuerDashboardAllocation,
  parseIssuerRecentActivity,
  parseIssuerTokenTicker,
  type CapitalRaisedPeriod,
  type IssuerCapitalRaised,
  type IssuerDashboardAllocation,
  type IssuerRecentActivityResult,
  type RecentActivityItem,
  type TokenTickerItem,
  type UpcomingEventItem,
} from "@/lib/issuerDashboard";

export type { CapitalRaisedPeriod };

export type MoneyAmount = {
  amount: number;
  currency: string;
};

export type InvestorGreeting = {
  name: string;
  displayName: string;
  asOf: string;
};

export type InvestorDashboardOverview = {
  greeting: InvestorGreeting;
  hero: {
    portfolioValue: MoneyAmount;
    annualReturnPercent: number;
    composition: {
      investmentCount: number;
      assetClassCount: number;
    };
  };
  quickStats: {
    monthlyIncome: MoneyAmount;
    activePositions: number;
    averageYieldPercent: number | null;
  };
  activeTokens: TokenTickerItem[];
};

export type InvestorDashboardSummary = {
  portfolioValue: MoneyAmount;
  totalInvested: MoneyAmount;
  unrealizedGain: { amount: number; percent: number };
  distributionsReceived: {
    amount: number;
    quarterEstimate: number;
    currency: string;
  };
  activeHoldings: number;
  weightedYieldPercent: number | null;
  annualReturnPercent: number;
  monthlyIncome: number;
  assetClassCount: number;
  quarterInvested: { amount: number; changePercent: number | null };
  kycStatus: string;
  pendingActions: string[];
};

export type InvestorCapitalDeployed = IssuerCapitalRaised & {
  currency: string;
};

export type InvestorDashboardInit = {
  overview: InvestorDashboardOverview;
  summary: InvestorDashboardSummary;
  capitalDeployed: InvestorCapitalDeployed;
  allocation: IssuerDashboardAllocation & { currency?: string };
  tokenTicker: TokenTickerItem[];
  recentActivity: IssuerRecentActivityResult;
  upcomingEvents: UpcomingEventItem[];
};

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

function unwrapRecord(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  const root = payload as Record<string, unknown>;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return root.data as Record<string, unknown>;
  }
  return root;
}

function parseMoney(value: unknown, fallbackCurrency = "USD"): MoneyAmount {
  if (!value || typeof value !== "object") {
    return { amount: 0, currency: fallbackCurrency };
  }
  const record = value as Record<string, unknown>;
  return {
    amount: pickNumber(record, ["amount", "value", "total"]) ?? 0,
    currency: (
      pickString(record, ["currency", "currencyCode"]) ?? fallbackCurrency
    ).toUpperCase(),
  };
}

function parseGreeting(record: Record<string, unknown>): InvestorGreeting {
  const greeting =
    record.greeting && typeof record.greeting === "object"
      ? (record.greeting as Record<string, unknown>)
      : record;
  return {
    name: pickString(greeting, ["name", "firstName"]) ?? "there",
    displayName:
      pickString(greeting, ["displayName", "display_name", "fullName"]) ??
      pickString(greeting, ["name"]) ??
      "Investor",
    asOf:
      pickString(greeting, ["asOf", "as_of", "date"]) ??
      new Date().toISOString(),
  };
}

export function parseInvestorDashboardOverview(
  payload: unknown,
): InvestorDashboardOverview {
  const record = unwrapRecord(payload);
  const hero =
    record.hero && typeof record.hero === "object"
      ? (record.hero as Record<string, unknown>)
      : {};
  const composition =
    hero.composition && typeof hero.composition === "object"
      ? (hero.composition as Record<string, unknown>)
      : {};
  const quickStats =
    record.quickStats && typeof record.quickStats === "object"
      ? (record.quickStats as Record<string, unknown>)
      : record.quick_stats && typeof record.quick_stats === "object"
        ? (record.quick_stats as Record<string, unknown>)
        : {};

  const tokensRaw =
    record.activeTokens ?? record.active_tokens ?? record.tokens;
  const activeTokens = parseIssuerTokenTicker(tokensRaw ?? []);

  return {
    greeting: parseGreeting(record),
    hero: {
      portfolioValue: parseMoney(hero.portfolioValue ?? hero.portfolio_value),
      annualReturnPercent:
        pickNumber(hero, [
          "annualReturnPercent",
          "annual_return_percent",
          "annualReturn",
        ]) ?? 0,
      composition: {
        investmentCount:
          pickNumber(composition, [
            "investmentCount",
            "investment_count",
            "investments",
          ]) ?? 0,
        assetClassCount:
          pickNumber(composition, [
            "assetClassCount",
            "asset_class_count",
            "assetClasses",
          ]) ?? 0,
      },
    },
    quickStats: {
      monthlyIncome: parseMoney(
        quickStats.monthlyIncome ?? quickStats.monthly_income,
      ),
      activePositions:
        pickNumber(quickStats, ["activePositions", "active_positions"]) ?? 0,
      averageYieldPercent:
        pickNumber(quickStats, [
          "averageYieldPercent",
          "average_yield_percent",
          "avgYield",
        ]) ?? null,
    },
    activeTokens,
  };
}

export function parseInvestorDashboardSummary(
  payload: unknown,
): InvestorDashboardSummary {
  const record = unwrapRecord(payload);
  const unrealized =
    record.unrealizedGain && typeof record.unrealizedGain === "object"
      ? (record.unrealizedGain as Record<string, unknown>)
      : record.unrealized_gain && typeof record.unrealized_gain === "object"
        ? (record.unrealized_gain as Record<string, unknown>)
        : {};
  const distributions =
    record.distributionsReceived &&
    typeof record.distributionsReceived === "object"
      ? (record.distributionsReceived as Record<string, unknown>)
      : record.distributions_received &&
          typeof record.distributions_received === "object"
        ? (record.distributions_received as Record<string, unknown>)
        : {};
  const quarterInvested =
    record.quarterInvested && typeof record.quarterInvested === "object"
      ? (record.quarterInvested as Record<string, unknown>)
      : record.quarter_invested && typeof record.quarter_invested === "object"
        ? (record.quarter_invested as Record<string, unknown>)
        : {};

  const pendingRaw = record.pendingActions ?? record.pending_actions;
  const pendingActions = Array.isArray(pendingRaw)
    ? pendingRaw.filter((x): x is string => typeof x === "string")
    : [];

  const distCurrency =
    pickString(distributions, ["currency"]) ??
    parseMoney(record.portfolioValue).currency;

  return {
    portfolioValue: parseMoney(record.portfolioValue ?? record.portfolio_value),
    totalInvested: parseMoney(record.totalInvested ?? record.total_invested),
    unrealizedGain: {
      amount: pickNumber(unrealized, ["amount", "value"]) ?? 0,
      percent: pickNumber(unrealized, ["percent", "percentage"]) ?? 0,
    },
    distributionsReceived: {
      amount: pickNumber(distributions, ["amount", "value"]) ?? 0,
      quarterEstimate:
        pickNumber(distributions, [
          "quarterEstimate",
          "quarter_estimate",
          "quarterlyEstimate",
        ]) ?? 0,
      currency: (distCurrency ?? "USD").toUpperCase(),
    },
    activeHoldings:
      pickNumber(record, ["activeHoldings", "active_holdings"]) ?? 0,
    weightedYieldPercent:
      pickNumber(record, ["weightedYieldPercent", "weighted_yield_percent"]) ??
      null,
    annualReturnPercent:
      pickNumber(record, ["annualReturnPercent", "annual_return_percent"]) ?? 0,
    monthlyIncome: pickNumber(record, ["monthlyIncome", "monthly_income"]) ?? 0,
    assetClassCount:
      pickNumber(record, ["assetClassCount", "asset_class_count"]) ?? 0,
    quarterInvested: {
      amount: pickNumber(quarterInvested, ["amount", "value"]) ?? 0,
      changePercent:
        pickNumber(quarterInvested, [
          "changePercent",
          "change_percent",
          "change",
        ]) ?? null,
    },
    kycStatus: pickString(record, ["kycStatus", "kyc_status"]) ?? "UNKNOWN",
    pendingActions,
  };
}

export function parseInvestorCapitalDeployed(
  payload: unknown,
): InvestorCapitalDeployed {
  const parsed = parseIssuerCapitalRaised(payload);
  const record = unwrapRecord(payload);
  const currency = pickString(record, ["currency", "currencyCode"]) ?? "USD";
  return { ...parsed, currency: currency.toUpperCase() };
}

function parseInvestorUpcomingEvent(
  record: Record<string, unknown>,
  index: number,
): UpcomingEventItem {
  const title =
    pickString(record, ["title", "label", "name", "eventName"]) ??
    "Upcoming event";
  const assetTitle =
    pickString(record, ["assetTitle", "asset_title", "asset"]) ?? "—";
  const category = pickString(record, ["category", "type", "eventType"]) ?? "—";

  const dateRaw = record.date ?? record.date_at ?? {};
  const date =
    dateRaw && typeof dateRaw === "object" && !Array.isArray(dateRaw)
      ? (dateRaw as Record<string, unknown>)
      : {};

  const id = pickString(record, ["id", "_id", "eventId"]) ?? `event-${index}`;

  return {
    id,
    title,
    assetTitle,
    category,
    date,
  };
}

export function parseInvestorUpcomingEvents(
  payload: unknown,
): UpcomingEventItem[] {
  if (Array.isArray(payload)) {
    return payload
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
      .map(parseInvestorUpcomingEvent);
  }
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  return unwrapList(
    record.data ?? record.events ?? record.items ?? record.upcomingEvents,
  ).map(parseInvestorUpcomingEvent);
}

export function parseInvestorDashboardInit(
  payload: unknown,
): InvestorDashboardInit {
  const record = unwrapRecord(payload);
  const overviewRaw = record.overview ?? record;
  const recentRaw = record.recentActivity ??
    record.recent_activity ?? {
      data: [],
      pagination: DEFAULT_PAGINATION,
    };

  return {
    overview: parseInvestorDashboardOverview(overviewRaw),
    summary: parseInvestorDashboardSummary(
      record.summary && typeof record.summary === "object"
        ? record.summary
        : {},
    ),
    capitalDeployed: parseInvestorCapitalDeployed(
      record.capitalDeployed ?? record.capital_deployed ?? {},
    ),
    allocation: {
      ...parseIssuerDashboardAllocation(
        record.allocation ?? { segments: [], total: 0 },
      ),
      currency:
        pickString(
          record.allocation && typeof record.allocation === "object"
            ? (record.allocation as Record<string, unknown>)
            : {},
          ["currency"],
        ) ?? "USD",
    },
    tokenTicker: parseIssuerTokenTicker(
      record.tokenTicker ?? record.token_ticker ?? [],
    ),
    recentActivity: parseIssuerRecentActivity(recentRaw),
    upcomingEvents: parseInvestorUpcomingEvents(
      record.upcomingEvents ?? record.upcoming_events ?? [],
    ),
  };
}

export function formatOverviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function buildInvestorGreeting(
  overview: InvestorDashboardOverview | undefined,
): string {
  if (!overview) return `${greetingForHour()}, there`;
  const first =
    overview.greeting.name?.trim() ||
    overview.greeting.displayName.split(/\s+/)[0] ||
    "there";
  return `${greetingForHour()}, ${first}`;
}

export function formatYieldPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0.0%";
  return `${value.toFixed(1)}%`;
}

/** Human-readable trend when API has no prior-period comparison yet. */
export function formatQuarterChangePercent(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) return "No prior quarter";
  const sign = value >= 0 ? "↗" : "↘";
  return `${sign} ${formatPercent(value)}`;
}

export type { RecentActivityItem, TokenTickerItem, UpcomingEventItem };

export { formatCompactCurrency, formatPercent };
