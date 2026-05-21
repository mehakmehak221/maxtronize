'use client';

import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { formatCompactCurrency } from '@/lib/issuerDashboard';
import {
  capitalVelocityChartValues,
  formatHubUpdatedAt,
  formatSignedChange,
  type HubOverviewActivityItem,
} from '@/lib/issuerHub';
import {
  useGetIssuerHubCapitalVelocityQuery,
  useGetIssuerHubOverviewActivityQuery,
  useGetIssuerHubOverviewSummaryQuery,
} from '@/store/api/issuerHubApi';

const iconStroke = 1.75;

function MetricIconCircle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

function buildLinePath(
  values: number[],
  chartLeft: number,
  chartW: number,
  chartTop: number,
  chartH: number,
  maxM: number,
) {
  const n = values.length;
  if (n === 0) return '';
  return values
    .map((m, i) => {
      const x = chartLeft + (i / Math.max(n - 1, 1)) * chartW;
      const y = chartTop + chartH - (m / maxM) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildAreaPath(
  values: number[],
  chartLeft: number,
  chartW: number,
  chartTop: number,
  chartH: number,
  maxM: number,
  baselineY: number,
) {
  const n = values.length;
  if (n === 0) return '';
  const pts = values.map((m, i) => {
    const x = chartLeft + (i / Math.max(n - 1, 1)) * chartW;
    const y = chartTop + chartH - (m / maxM) * chartH;
    return { x, y };
  });
  let d = `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ` L ${pts[n - 1].x} ${baselineY} Z`;
  return d;
}

const ACTIVITY_RING: Record<HubOverviewActivityItem['tone'], string> = {
  primary: 'bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300',
  info: 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  warn: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  danger: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400',
};

const ACTIVITY_ICON: Record<HubOverviewActivityItem['tone'], LucideIcon> = {
  primary: DollarSign,
  info: ShieldCheck,
  success: TrendingUp,
  warn: ShieldCheck,
  danger: AlertTriangle,
};

export function HubOverviewTab() {
  const { data: summary, isLoading: summaryLoading } =
    useGetIssuerHubOverviewSummaryQuery();
  const { data: velocity } = useGetIssuerHubCapitalVelocityQuery({ weeks: 12 });
  const { data: activityData, isLoading: activityLoading } =
    useGetIssuerHubOverviewActivityQuery({ page: 1, limit: 8 });

  const currency = summary?.totalCapitalRaised.currency ?? 'USD';
  const chart = useMemo(
    () => capitalVelocityChartValues(velocity?.series ?? []),
    [velocity?.series],
  );

  const yTicks = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => (chart.maxM / steps) * i);
  }, [chart.maxM]);

  const activities = activityData?.items ?? [];

  return (
    <div className="max-w-full min-w-0 space-y-6 animate-in fade-in duration-500 sm:space-y-8 xl:space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-2xl sm:rounded-3xl sm:p-6 md:p-7 xl:rounded-[32px] xl:p-8">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6">
            <MetricIconCircle className="bg-white/20 ring-1 ring-white/25">
              <DollarSign className="h-5 w-5 text-white" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                Total Capital Raised
              </p>
              <h3 className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                {summaryLoading
                  ? '—'
                  : formatCompactCurrency(
                      summary?.totalCapitalRaised.amount ?? 0,
                      currency,
                      { decimals: 0 },
                    )}
              </h3>
              <p className="mt-2 text-xs font-medium text-white/60">
                across {summary?.totalCapitalRaised.activeOfferingsCount ?? 0} active
                offering
                {(summary?.totalCapitalRaised.activeOfferingsCount ?? 0) === 1
                  ? ''
                  : 's'}
              </p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <span className="flex items-center gap-2 text-[11px] font-bold text-issuer-hero-trend-fg">
                {summaryLoading
                  ? '—'
                  : formatSignedChange(
                      summary?.totalCapitalRaised.weeklyChange ?? 0,
                      { suffix: ' this week' },
                    )}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:space-y-5 sm:rounded-3xl sm:p-6 md:space-y-6 md:p-7 xl:rounded-[32px] xl:p-8">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
              <Building2 className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <span className="rounded-full bg-ui-success-bg-soft px-2 py-1 text-[10px] font-bold text-ui-success-text">
              {summaryLoading
                ? '—'
                : formatSignedChange(summary?.activeAssets.quarterlyChange ?? 0, {
                    suffix: ' this quarter',
                  })}
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Active Assets
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
              {summary?.activeAssets.total ?? (summaryLoading ? '—' : 0)}
            </h3>
            <p className="mt-2 text-xs font-medium text-text-muted">
              {summary?.activeAssets.inFunding ?? 0} in funding ·{' '}
              {summary?.activeAssets.fullyFunded ?? 0} fully funded
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:space-y-5 sm:rounded-3xl sm:p-6 md:space-y-6 md:p-7 xl:rounded-[32px] xl:p-8">
          <div className="flex items-start justify-between gap-2">
            <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
              <Users className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <span className="rounded-full bg-ui-success-bg-soft px-2 py-1 text-[10px] font-bold text-ui-success-text">
              {summaryLoading
                ? '—'
                : formatSignedChange(summary?.totalInvestors.monthlyChange ?? 0, {
                    suffix: ' this month',
                  })}
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Total Investors
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
              {summary?.totalInvestors.total ?? (summaryLoading ? '—' : 0)}
            </h3>
            <p className="mt-2 text-xs font-medium text-text-muted">
              {summary?.totalInvestors.funded ?? 0} funded ·{' '}
              {summary?.totalInvestors.committed ?? 0} committed
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-issuer-yield-card p-5 text-issuer-yield-card-fg shadow-sm sm:space-y-5 sm:rounded-3xl sm:p-6 md:space-y-6 md:p-7 xl:rounded-[32px] xl:p-8">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-white/15 ring-1 ring-white/20">
              <TrendingUp className="h-5 w-5 text-issuer-yield-card-fg" strokeWidth={iconStroke} />
            </MetricIconCircle>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-issuer-yield-card-fg/80">
              Blended Yield
            </p>
            <h3 className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
              {summaryLoading
                ? '—'
                : `${(summary?.blendedYield.percent ?? 0).toFixed(1)}%`}
            </h3>
            <p className="mt-2 text-xs font-medium text-issuer-yield-card-fg/80">
              weighted avg across portfolio
            </p>
          </div>
          <div className="border-t border-white/20 pt-4">
            <span className="flex items-center gap-2 text-[11px] font-bold text-issuer-yield-card-fg">
              {summaryLoading
                ? '—'
                : formatSignedChange(
                    summary?.blendedYield.quarterlyChangePercent ?? 0,
                    { suffix: ' vs last quarter', isPercent: true },
                  )}
            </span>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-warning/20 bg-issuer-pending-kyc-bg p-5 shadow-sm sm:space-y-5 sm:rounded-3xl sm:p-6 md:space-y-6 md:p-7 xl:rounded-[32px] xl:p-8">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <span className="rounded-full bg-warning/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-warning">
              Action
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-warning/90">
              Pending KYC
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
              {summary?.pendingKyc.total ?? (summaryLoading ? '—' : 0)}
            </h3>
            <p className="mt-2 text-xs font-medium text-warning">
              {summary?.pendingKyc.awaitingDocuments ?? 0} awaiting docs ·{' '}
              {summary?.pendingKyc.inReview ?? 0} in review
              {(summary?.pendingKyc.overdueCount ?? 0) > 0 ? (
                <>
                  <br />
                  <span className="text-ui-danger-text">
                    {summary?.pendingKyc.overdueCount} overdue &gt;5 days
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:space-y-5 sm:rounded-3xl sm:p-6 md:space-y-6 md:p-7 xl:rounded-[32px] xl:p-8">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
              <Calendar className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Next Distribution
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
              {summary?.nextDistribution
                ? formatCompactCurrency(
                    summary.nextDistribution.amount,
                    summary.nextDistribution.currency,
                    { decimals: 0 },
                  )
                : summaryLoading
                  ? '—'
                  : '—'}
            </h3>
            <p className="mt-2 text-xs font-medium text-text-muted">
              {summary?.nextDistribution?.label ?? 'No distribution scheduled'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="min-w-0 rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8 xl:col-span-2 xl:rounded-[40px] xl:p-10">
          <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between md:mb-8">
            <div>
              <h3 className="mb-1 text-lg font-bold text-foreground">Capital Velocity</h3>
              <p className="text-xs text-text-muted">
                Raised vs. committed capital — last {velocity?.weeks ?? 12} weeks
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-issuer-chart-line-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Raised
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-palette-success" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Committed
                </span>
              </div>
            </div>
          </div>

          <div className="relative max-w-full min-w-0 overflow-x-auto">
            <svg
              className="block h-auto max-h-[240px] min-h-[180px] w-full max-w-full text-foreground"
              viewBox="0 0 640 220"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Capital raised and committed over time"
            >
              <defs>
                <linearGradient id="issuerHubRaisedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--issuer-chart-line-primary)" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="var(--issuer-chart-line-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {yTicks.map((m) => {
                const chartTop = 28;
                const chartH = 132;
                const chartBottom = chartTop + chartH;
                const y = chartBottom - (m / chart.maxM) * chartH;
                return (
                  <g key={m}>
                    <line
                      x1="52"
                      y1={y}
                      x2="620"
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                    />
                    <text
                      x="48"
                      y={y + 4}
                      textAnchor="end"
                      fill="var(--text-muted)"
                      className="text-[10px] font-bold"
                    >
                      {m === 0 ? '$0' : `$${m}M`}
                    </text>
                  </g>
                );
              })}

              {chart.raisedM.length > 0 ? (
                (() => {
                  const chartLeft = 56;
                  const chartW = 564;
                  const chartTop = 28;
                  const chartH = 132;
                  const chartBottom = chartTop + chartH;
                  const raisedPath = buildLinePath(
                    chart.raisedM,
                    chartLeft,
                    chartW,
                    chartTop,
                    chartH,
                    chart.maxM,
                  );
                  const committedPath = buildLinePath(
                    chart.committedM,
                    chartLeft,
                    chartW,
                    chartTop,
                    chartH,
                    chart.maxM,
                  );
                  const areaPath = buildAreaPath(
                    chart.raisedM,
                    chartLeft,
                    chartW,
                    chartTop,
                    chartH,
                    chart.maxM,
                    chartBottom,
                  );
                  return (
                    <>
                      <path d={areaPath} fill="url(#issuerHubRaisedFill)" />
                      <path
                        d={committedPath}
                        fill="none"
                        stroke="var(--palette-success)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.9}
                      />
                      <path
                        d={raisedPath}
                        fill="none"
                        stroke="var(--issuer-chart-line-primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  );
                })()
              ) : null}

              {(chart.weekLabels.length > 0
                ? chart.weekLabels
                : ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']
              ).map((label, i, arr) => {
                const chartLeft = 56;
                const chartW = 564;
                const x = chartLeft + (i / Math.max(arr.length - 1, 1)) * chartW;
                return (
                  <text
                    key={`${label}-${i}`}
                    x={x}
                    y="208"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    className="text-[10px] font-bold"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="flex min-w-0 flex-col rounded-2xl border border-card-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8 xl:rounded-[40px] xl:p-10">
          <h3 className="mb-1 text-lg font-bold text-foreground">Recent Activity</h3>
          <p className="mb-5 text-xs text-text-muted sm:mb-6 md:mb-8">
            Investor actions & compliance events
          </p>
          <div className="flex-1 space-y-4 sm:space-y-5 md:space-y-6">
            {activityLoading ? (
              <p className="text-xs text-text-muted">Loading activity…</p>
            ) : activities.length > 0 ? (
              activities.map((activity) => {
                const RowIcon = ACTIVITY_ICON[activity.tone];
                return (
                  <div
                    key={activity.id}
                    className="group -mx-2 flex cursor-pointer gap-4 rounded-xl p-2 transition-colors hover:bg-surface"
                  >
                    <MetricIconCircle className={`${ACTIVITY_RING[activity.tone]} shadow-sm`}>
                      <RowIcon className="h-4 w-4" strokeWidth={iconStroke} />
                    </MetricIconCircle>
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 line-clamp-3 text-[11px] font-bold leading-snug text-foreground transition-colors group-hover:text-primary xl:line-clamp-2">
                        {activity.label}
                      </p>
                      <p className="text-[10px] text-text-muted">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-text-muted">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
