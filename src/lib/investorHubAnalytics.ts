import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";
import type { CapitalRaisedPeriod } from "@/lib/investorDashboard";

export type AnalyticsMetricBlock = {
  value: number;
  summary: string;
};

export type InvestorHubAnalyticsSummary = {
  totalReturn: AnalyticsMetricBlock;
  sharpeRatio: AnalyticsMetricBlock;
  volatility: AnalyticsMetricBlock;
  beta: AnalyticsMetricBlock;
};

export type PerformanceSeriesPoint = {
  month: string;
  label: string;
  portfolio: number;
  benchmark: number;
};

export type InvestorHubPerformance = {
  series: PerformanceSeriesPoint[];
  benchmarkLabel: string;
  currency: string;
};

export type InvestorHubAnalyticsInit = {
  summary: InvestorHubAnalyticsSummary;
  performance: InvestorHubPerformance;
};

function parseMetricBlock(
  record: Record<string, unknown> | null,
  valueKeys: string[],
): AnalyticsMetricBlock {
  if (!record) return { value: 0, summary: "" };
  return {
    value: pickNumber(record, valueKeys) ?? 0,
    summary: pickString(record, ["summary", "label"]) ?? "",
  };
}

function monthLabel(month: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(month.trim());
  if (!match) return month;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  if (Number.isNaN(date.getTime())) return month;
  return date.toLocaleDateString("en-US", { month: "short" });
}

function parseSeriesPoint(record: Record<string, unknown>): PerformanceSeriesPoint {
  const month = pickString(record, ["month", "period", "label"]) ?? "";
  return {
    month,
    label: monthLabel(month),
    portfolio: pickNumber(record, ["portfolio", "value", "actual"]) ?? 0,
    benchmark: pickNumber(record, ["benchmark", "target", "index"]) ?? 0,
  };
}

export function parseInvestorHubPerformance(
  payload: unknown,
): InvestorHubPerformance {
  if (!payload || typeof payload !== "object") {
    return { series: [], benchmarkLabel: "S&P 500", currency: "USD" };
  }
  const root = payload as Record<string, unknown>;
  const seriesRaw = root.series ?? root.points ?? root.data;
  const series = Array.isArray(seriesRaw)
    ? seriesRaw
        .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === "object")
        .map(parseSeriesPoint)
    : unwrapList(payload).map(parseSeriesPoint);

  return {
    series,
    benchmarkLabel:
      pickString(root, ["benchmarkLabel", "benchmark_label"]) ?? "S&P 500",
    currency: pickString(root, ["currency"]) ?? "USD",
  };
}

export function parseInvestorHubAnalyticsSummary(
  payload: unknown,
): InvestorHubAnalyticsSummary {
  if (!payload || typeof payload !== "object") {
    return {
      totalReturn: { value: 0, summary: "" },
      sharpeRatio: { value: 0, summary: "" },
      volatility: { value: 0, summary: "" },
      beta: { value: 0, summary: "" },
    };
  }
  const root = payload as Record<string, unknown>;
  return {
    totalReturn: parseMetricBlock(
      (root.totalReturn as Record<string, unknown>) ?? null,
      ["percent", "value"],
    ),
    sharpeRatio: parseMetricBlock(
      (root.sharpeRatio as Record<string, unknown>) ?? null,
      ["value"],
    ),
    volatility: parseMetricBlock(
      (root.volatility as Record<string, unknown>) ?? null,
      ["percent", "value"],
    ),
    beta: parseMetricBlock(
      (root.beta as Record<string, unknown>) ?? null,
      ["value"],
    ),
  };
}

export function parseInvestorHubAnalyticsInit(
  payload: unknown,
): InvestorHubAnalyticsInit {
  if (!payload || typeof payload !== "object") {
    return {
      summary: parseInvestorHubAnalyticsSummary(null),
      performance: parseInvestorHubPerformance(null),
    };
  }
  const root = payload as Record<string, unknown>;
  return {
    summary: parseInvestorHubAnalyticsSummary(root.summary ?? root),
    performance: parseInvestorHubPerformance(root.performance ?? root),
  };
}

export function formatAnalyticsPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatAnalyticsNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function formatChartCurrency(
  value: number,
  currency = "USD",
): string {
  const symbol = currency === "USD" ? "$" : "";
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}k`;
  return `${symbol}${value.toFixed(0)}`;
}

/** Percent change vs. the first period in the series (0% at t0). */
export function indexPerformanceSeries(
  series: PerformanceSeriesPoint[],
): { portfolio: number[]; benchmark: number[] } {
  const baselineBenchmark = series[0]?.benchmark ?? 0;
  const firstInvestedIndex = series.findIndex(
    (point) => Number.isFinite(point.portfolio) && point.portfolio > 0,
  );
  const baselinePortfolio =
    firstInvestedIndex >= 0 ? series[firstInvestedIndex].portfolio : 0;

  const benchmark = series.map((point) => {
    if (!Number.isFinite(baselineBenchmark) || baselineBenchmark <= 0) return 0;
    if (!Number.isFinite(point.benchmark)) return 0;
    return ((point.benchmark / baselineBenchmark) - 1) * 100;
  });

  const portfolio = series.map((point) => {
    if (!Number.isFinite(point.portfolio) || point.portfolio <= 0) return 0;
    if (!Number.isFinite(baselinePortfolio) || baselinePortfolio <= 0) return 0;
    return ((point.portfolio / baselinePortfolio) - 1) * 100;
  });

  return { portfolio, benchmark };
}

/** Dollar values for charting; benchmark is scaled to portfolio peak when both exist. */
export function performanceChartDollarSeries(
  series: PerformanceSeriesPoint[],
): { portfolio: number[]; benchmark: number[] } {
  const portfolio = series.map((point) => point.portfolio);
  const portfolioPeak = Math.max(...portfolio, 0);
  const benchStart = series[0]?.benchmark ?? 0;

  const benchmark =
    portfolioPeak > 0 && benchStart > 0
      ? series.map((point) => (point.benchmark / benchStart) * portfolioPeak)
      : series.map((point) => point.benchmark);

  return { portfolio, benchmark };
}

export function buildPerformanceChartPaths(
  series: PerformanceSeriesPoint[],
  currency = "USD",
): {
  portfolioPath: string;
  benchmarkPath: string;
  labels: string[];
  yLabels: string[];
} | null {
  if (series.length === 0) return null;

  const { portfolio: portfolioValues, benchmark: benchmarkValues } =
    performanceChartDollarSeries(series);
  const rawMax = Math.max(...portfolioValues, ...benchmarkValues, 0);
  if (rawMax <= 0) return null;

  const min = 0;
  const max = rawMax * 1.08;
  const range = Math.max(max - min, 1);
  const lastIndex = Math.max(series.length - 1, 1);

  const toPoint = (value: number, index: number) => {
    const x = (index / lastIndex) * 1000;
    const normalized = (value - min) / range;
    const y = 12 + (1 - normalized) * 70;
    return { x, y };
  };

  const portfolioPath = portfolioValues
    .map((value, index) => {
      const point = toPoint(value, index);
      return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");

  const benchmarkPath = benchmarkValues
    .map((value, index) => {
      const point = toPoint(value, index);
      return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");

  const yLabels = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    formatChartCurrency(min + (max - min) * ratio, currency),
  );

  return {
    portfolioPath,
    benchmarkPath,
    labels: series.map((point) => point.label),
    yLabels,
  };
}

export type InvestorHubAnalyticsPeriod = CapitalRaisedPeriod;
