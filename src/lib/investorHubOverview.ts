import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";
import type { CapitalRaisedPeriod } from "@/lib/investorDashboard";
import {
  parseIssuerDashboardAllocation,
  type IssuerDashboardAllocation,
} from "@/lib/issuerDashboard";

export type { CapitalRaisedPeriod as InvestorHubOverviewPeriod };

export type MoneyAmount = {
  amount: number;
  currency: string;
};

export type InvestorHubOverviewHeader = {
  totalPortfolioValue: MoneyAmount;
  annualReturnPercent: number;
};

export type InvestorHubOverviewSummary = {
  monthlyIncome: MoneyAmount & {
    changePercent: number | null;
    summary: string;
  };
  annualReturn: {
    percent: number;
    changePercent: number | null;
    summary: string;
  };
  activeInvestments: {
    count: number;
    change: number;
    summary: string;
  };
  pendingApprovals: {
    count: number;
    summary: string;
  };
};

export type MonthlyEarningsPoint = {
  label: string;
  earnings: number;
  passive: number;
};

export type InvestorHubMonthlyEarnings = {
  series: MonthlyEarningsPoint[];
  currency: string;
};

export type InvestorHubOverviewAllocation = IssuerDashboardAllocation & {
  currency: string;
};

export type InvestorHubOverviewInit = {
  header: InvestorHubOverviewHeader;
  summary: InvestorHubOverviewSummary;
  monthlyEarnings: InvestorHubMonthlyEarnings;
  allocation: InvestorHubOverviewAllocation;
};

function parseMoney(record: Record<string, unknown> | null): MoneyAmount {
  if (!record) return { amount: 0, currency: "USD" };
  return {
    amount: pickNumber(record, ["amount", "value"]) ?? 0,
    currency: pickString(record, ["currency"]) ?? "USD",
  };
}

function monthLabel(month: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(month.trim());
  if (!match) return month;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  if (Number.isNaN(date.getTime())) return month;
  return date.toLocaleDateString("en-US", { month: "short" });
}

function parseSummaryBlock(
  record: Record<string, unknown> | null,
): InvestorHubOverviewSummary {
  const emptyMoney = { amount: 0, currency: "USD", summary: "" };
  if (!record) {
    return {
      monthlyIncome: { ...emptyMoney, changePercent: null },
      annualReturn: { percent: 0, changePercent: null, summary: "" },
      activeInvestments: { count: 0, change: 0, summary: "" },
      pendingApprovals: { count: 0, summary: "" },
    };
  }

  const monthlyIncomeRaw =
    (record.monthlyIncome as Record<string, unknown>) ??
    (record.monthly_income as Record<string, unknown>) ??
    null;
  const annualReturnRaw =
    (record.annualReturn as Record<string, unknown>) ??
    (record.annual_return as Record<string, unknown>) ??
    null;
  const activeInvestmentsRaw =
    (record.activeInvestments as Record<string, unknown>) ??
    (record.active_investments as Record<string, unknown>) ??
    null;
  const pendingApprovalsRaw =
    (record.pendingApprovals as Record<string, unknown>) ??
    (record.pending_approvals as Record<string, unknown>) ??
    null;

  const monthlyMoney = parseMoney(monthlyIncomeRaw);

  return {
    monthlyIncome: {
      ...monthlyMoney,
      changePercent:
        pickNumber(monthlyIncomeRaw, ["changePercent", "change_percent"]) ?? null,
      summary: pickString(monthlyIncomeRaw, ["summary"]) ?? "",
    },
    annualReturn: {
      percent:
        pickNumber(annualReturnRaw, ["percent", "value", "amount"]) ?? 0,
      changePercent:
        pickNumber(annualReturnRaw, ["changePercent", "change_percent"]) ?? null,
      summary: pickString(annualReturnRaw, ["summary"]) ?? "",
    },
    activeInvestments: {
      count: pickNumber(activeInvestmentsRaw, ["count", "value"]) ?? 0,
      change:
        pickNumber(activeInvestmentsRaw, ["change", "changeCount", "change_count"]) ?? 0,
      summary: pickString(activeInvestmentsRaw, ["summary"]) ?? "",
    },
    pendingApprovals: {
      count: pickNumber(pendingApprovalsRaw, ["count", "value"]) ?? 0,
      summary: pickString(pendingApprovalsRaw, ["summary"]) ?? "",
    },
  };
}

export function parseInvestorHubOverviewHeader(
  payload: unknown,
): InvestorHubOverviewHeader {
  if (!payload || typeof payload !== "object") {
    return {
      totalPortfolioValue: { amount: 0, currency: "USD" },
      annualReturnPercent: 0,
    };
  }
  const root = payload as Record<string, unknown>;
  const totalPortfolioValue = parseMoney(
    (root.totalPortfolioValue as Record<string, unknown>) ??
      (root.total_portfolio_value as Record<string, unknown>) ??
      null,
  );

  return {
    totalPortfolioValue,
    annualReturnPercent:
      pickNumber(root, ["annualReturnPercent", "annual_return_percent"]) ?? 0,
  };
}

export function parseInvestorHubOverviewSummary(
  payload: unknown,
): InvestorHubOverviewSummary {
  if (!payload || typeof payload !== "object") {
    return parseSummaryBlock(null);
  }
  return parseSummaryBlock(payload as Record<string, unknown>);
}

function parseMonthlyEarningsPoint(
  record: Record<string, unknown>,
): MonthlyEarningsPoint {
  const month = pickString(record, ["month", "period", "label"]) ?? "";
  return {
    label: monthLabel(month) || month,
    earnings:
      pickNumber(record, ["earnings", "actual", "income", "value"]) ?? 0,
    passive:
      pickNumber(record, ["passive", "passiveIncome", "passive_income", "target"]) ??
      0,
  };
}

export function parseInvestorHubMonthlyEarnings(
  payload: unknown,
): InvestorHubMonthlyEarnings {
  if (!payload || typeof payload !== "object") {
    return { series: [], currency: "USD" };
  }
  const root = payload as Record<string, unknown>;
  const seriesRaw = root.series ?? root.points ?? root.data;
  const series = Array.isArray(seriesRaw)
    ? seriesRaw
        .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === "object")
        .map(parseMonthlyEarningsPoint)
    : unwrapList(payload).map(parseMonthlyEarningsPoint);

  return {
    series,
    currency: pickString(root, ["currency"]) ?? "USD",
  };
}

export function parseInvestorHubOverviewAllocation(
  payload: unknown,
): InvestorHubOverviewAllocation {
  if (!payload || typeof payload !== "object") {
    return {
      segments: [],
      total: 0,
      weightBy: "appraisal",
      currency: "USD",
    };
  }
  const root = payload as Record<string, unknown>;
  return {
    ...parseIssuerDashboardAllocation(root),
    currency: pickString(root, ["currency"]) ?? "USD",
  };
}

export function parseInvestorHubOverviewInit(
  payload: unknown,
): InvestorHubOverviewInit {
  if (!payload || typeof payload !== "object") {
    return {
      header: parseInvestorHubOverviewHeader(null),
      summary: parseInvestorHubOverviewSummary(null),
      monthlyEarnings: parseInvestorHubMonthlyEarnings(null),
      allocation: parseInvestorHubOverviewAllocation(null),
    };
  }
  const root = payload as Record<string, unknown>;
  return {
    header: parseInvestorHubOverviewHeader(root.header ?? root),
    summary: parseInvestorHubOverviewSummary(root.summary ?? root),
    monthlyEarnings: parseInvestorHubMonthlyEarnings(
      root.monthlyEarnings ?? root.monthly_earnings ?? root,
    ),
    allocation: parseInvestorHubOverviewAllocation(root.allocation ?? root),
  };
}

export function formatOverviewTrendPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatOverviewTrendChange(value: number): string {
  if (!value) return "";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}`;
}

export function formatChartCurrency(
  value: number,
  currency = "USD",
): string {
  const symbol = currency === "USD" ? "$" : "";
  if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}k`;
  return `${symbol}${value.toFixed(0)}`;
}

export function buildMonthlyEarningsChartPaths(
  series: MonthlyEarningsPoint[],
): {
  earningsPath: string;
  passivePath: string;
  areaPath: string;
  labels: string[];
} | null {
  if (series.length === 0) return null;

  const earningsValues = series.map((p) => p.earnings);
  const passiveValues = series.map((p) => p.passive);
  const max = Math.max(...earningsValues, ...passiveValues, 1);
  const lastIndex = Math.max(series.length - 1, 1);

  const toPoint = (value: number, index: number) => {
    const x = (index / lastIndex) * 1000;
    const y = 12 + (1 - value / max) * 70;
    return { x, y };
  };

  const linePath = (values: number[]) =>
    values
      .map((v, i) => {
        const p = toPoint(v, i);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ");

  const earningsPoints = earningsValues.map((v, i) => toPoint(v, i));
  const earningsPath = linePath(earningsValues);
  const passivePath = linePath(passiveValues);
  const last = earningsPoints[earningsPoints.length - 1];
  const first = earningsPoints[0];
  const areaPath = `${earningsPath} L${last.x.toFixed(1)},100 L${first.x.toFixed(1)},100 Z`;

  return {
    earningsPath,
    passivePath,
    areaPath,
    labels: series.map((p) => p.label),
  };
}
