'use client';

import type { LucideIcon } from 'lucide-react';
import { Activity, BarChart3, Target, TrendingUp } from 'lucide-react';
import React, { useMemo } from 'react';
import { formatRequestError } from '@/lib/formatRequestError';
import {
  buildPerformanceChartPaths,
  formatAnalyticsNumber,
  formatAnalyticsPercent,
} from '@/lib/investorHubAnalytics';
import {
  useGetInvestorHubAnalyticsInitQuery,
  useGetInvestorHubAnalyticsPerformanceQuery,
  useGetInvestorHubAnalyticsSummaryQuery,
} from '@/store/api/investorHubAnalyticsApi';

const ANALYTICS_PERIOD = '9m';

type HubAnalyticsTabProps = {
  variant?: 'issuer' | 'investor';
};

function MetricIconCircle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

export function HubAnalyticsTab({ variant = 'investor' }: HubAnalyticsTabProps) {
  const isIssuer = variant === 'issuer';

  const {
    data: analyticsSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useGetInvestorHubAnalyticsSummaryQuery();
  const {
    data: analyticsInit,
    isLoading: initLoading,
    error: initError,
  } = useGetInvestorHubAnalyticsInitQuery({ period: ANALYTICS_PERIOD });
  const {
    data: analyticsPerformance,
    isLoading: performanceLoading,
    error: performanceError,
  } = useGetInvestorHubAnalyticsPerformanceQuery(
    { period: ANALYTICS_PERIOD },
    { skip: isIssuer },
  );

  const summary = analyticsSummary ?? analyticsInit?.summary;
  const performance =
    analyticsInit?.performance?.series.length
      ? analyticsInit.performance
      : analyticsPerformance;
  const analyticsLoading =
    summaryLoading || initLoading || (!isIssuer && performanceLoading);
  const analyticsError = summaryError ?? initError ?? performanceError;

  const metricCardClass = isIssuer
    ? 'rounded-[24px] border border-card-border bg-card p-6 shadow-sm md:p-7'
    : 'rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-[24px] md:p-7';

  const chartCardClass = isIssuer
    ? 'rounded-[32px] border border-card-border bg-card p-6 shadow-sm md:p-10'
    : 'rounded-[20px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-10';

  const analyticsMetrics = useMemo(
    () =>
      [
        {
          label: 'Total Return',
          val: analyticsLoading
            ? '…'
            : formatAnalyticsPercent(summary?.totalReturn.value ?? 0),
          sub: summary?.totalReturn.summary || 'Since inception',
          Icon: TrendingUp,
          iconClass: isIssuer
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
            : 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400',
        },
        {
          label: 'Sharpe Ratio',
          val: analyticsLoading
            ? '…'
            : formatAnalyticsNumber(summary?.sharpeRatio.value ?? 0),
          sub: summary?.sharpeRatio.summary || 'Risk-adjusted',
          Icon: Target,
          iconClass: isIssuer
            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400'
            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
        },
        {
          label: 'Volatility',
          val: analyticsLoading
            ? '…'
            : formatAnalyticsPercent(summary?.volatility.value ?? 0),
          sub: summary?.volatility.summary || 'Standard deviation',
          Icon: Activity,
          iconClass: isIssuer
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
        },
        {
          label: 'Beta',
          val: analyticsLoading
            ? '…'
            : formatAnalyticsNumber(summary?.beta.value ?? 0),
          sub: summary?.beta.summary || 'vs. market',
          Icon: BarChart3,
          iconClass: isIssuer
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400'
            : 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
        },
      ] as const,
    [analyticsLoading, isIssuer, summary],
  );

  const performanceChart = useMemo(
    () =>
      buildPerformanceChartPaths(
        performance?.series ?? [],
        performance?.currency ?? "USD",
      ),
    [performance?.currency, performance?.series],
  );

  const monthLabels =
    performanceChart?.labels.length ? performanceChart.labels : [];

  const titleClass = isIssuer
    ? 'text-lg font-bold text-foreground'
    : 'text-base font-bold text-ui-strong';
  const subClass = isIssuer
    ? 'text-xs text-text-muted'
    : 'mt-0.5 text-xs text-ui-faint';

  return (
    <div className="max-w-full min-w-0 space-y-6 animate-in fade-in duration-500 md:space-y-8">
      {analyticsError ? (
        <p
          className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          role="alert"
        >
          {formatRequestError(analyticsError)}
        </p>
      ) : null}

      <div
        className={
          isIssuer
            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'
            : 'grid grid-cols-2 gap-4 md:gap-6 2xl:grid-cols-4'
        }
      >
        {analyticsMetrics.map((m) => {
          const Icon = m.Icon as LucideIcon;
          return (
            <div key={m.label} className={metricCardClass}>
              <MetricIconCircle className={`mb-4 ${m.iconClass}`}>
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </MetricIconCircle>
              <p
                className={
                  isIssuer
                    ? 'mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted'
                    : 'mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint'
                }
              >
                {m.label}
              </p>
              <p
                className={
                  isIssuer
                    ? 'text-2xl font-bold tracking-tight text-foreground md:text-3xl'
                    : 'text-2xl font-bold tracking-tight text-ui-strong md:text-3xl'
                }
              >
                {m.val}
              </p>
              <p
                className={
                  isIssuer
                    ? 'mt-2 text-xs text-text-muted'
                    : 'mt-1 text-[10px] font-medium text-ui-faint'
                }
              >
                {m.sub}
              </p>
            </div>
          );
        })}
      </div>

      <div className={chartCardClass}>
        <h3 className={titleClass}>Portfolio Performance</h3>
        <p className={subClass}>
          Your portfolio vs. benchmark ({performance?.benchmarkLabel ?? 'S&P 500'})
        </p>
        {analyticsLoading ? (
          <div className="mt-6 flex h-56 items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 text-sm text-text-muted dark:border-slate-700/80 dark:bg-slate-900/20 md:h-72">
            Loading performance…
          </div>
        ) : !performanceChart ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center dark:border-slate-700/80 dark:bg-slate-900/20 md:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BarChart3 className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h4 className="text-sm font-bold text-foreground md:text-base">Performance data is not available yet</h4>
            <p className="mt-2 text-xs font-medium leading-relaxed text-text-muted md:text-sm">
              This comparison will appear once the platform has enough portfolio and benchmark history for the selected period.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 mt-6 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Portfolio
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 rounded-full border-t-2 border-dashed border-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {performance?.benchmarkLabel ?? 'Benchmark'}
                </span>
              </div>
            </div>

            <div className="relative mt-4 h-52 md:h-72">
              <div
                className={`absolute bottom-0 left-0 top-0 flex w-11 flex-col justify-between pb-0 pt-0 md:w-12 ${
                  isIssuer ? 'text-[10px] font-medium text-text-muted' : 'text-[9px] font-medium text-ui-placeholder'
                }`}
              >
                {performanceChart.yLabels.map((l, i) => (
                  <span key={`${l}-${i}`}>{l}</span>
                ))}
              </div>

              <div className="absolute inset-y-0 left-11 right-0 md:left-12">
                <div className="pointer-events-none absolute inset-0">
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <div
                      key={pct}
                      className="absolute left-0 right-0 border-t border-dashed border-slate-200 dark:border-slate-700/90"
                      style={{ top: `${pct}%` }}
                    />
                  ))}
                </div>

                <svg
                  className="absolute inset-0 h-full w-full overflow-visible"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  {performanceChart.benchmarkPath ? (
                    <path
                      d={performanceChart.benchmarkPath}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      strokeLinecap="round"
                      vectorEffect="nonScalingStroke"
                    />
                  ) : null}
                  <path
                    d={performanceChart.portfolioPath}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="nonScalingStroke"
                  />
                </svg>
              </div>
            </div>

            <div
              className={`mt-4 flex justify-between overflow-x-auto pb-1 ${
                isIssuer ? 'px-1' : 'pl-11 md:pl-12'
              }`}
            >
              {monthLabels.map((mo) => (
                <span
                  key={mo}
                  className={
                    isIssuer
                      ? 'text-[10px] font-bold text-text-muted'
                      : 'text-[9px] font-bold uppercase tracking-widest text-ui-placeholder'
                  }
                >
                  {mo}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
