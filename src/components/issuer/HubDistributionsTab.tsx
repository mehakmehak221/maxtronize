'use client';

import { Calendar, Clock, DollarSign, Plus, Target, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { chartScaleForAmounts } from '@/lib/yield';
import { formatCompactCurrency } from '@/lib/issuerDashboard';
import {
  useGetDistributionScheduleQuery,
  useGetUpcomingPayoutsQuery,
  useGetYieldSummaryQuery,
} from '@/store/api/yieldApi';

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

export function HubDistributionsTab() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data: summary, isLoading: summaryLoading } = useGetYieldSummaryQuery();
  const { data: schedule, isLoading: scheduleLoading } =
    useGetDistributionScheduleQuery({ year });
  const { data: upcoming = [], isLoading: payoutsLoading } =
    useGetUpcomingPayoutsQuery();

  const chartData = useMemo(() => {
    const months = schedule?.months ?? [];
    const actualValues = months.map((m) => m.actual);
    const scale = chartScaleForAmounts([
      ...actualValues,
      ...(schedule ? [schedule.eoyProjection, schedule.ytdActual] : []),
    ]);
    return { months, actualValues, scale };
  }, [schedule]);

  const chartH = 140;
  const chartTop = 32;
  const chartLeft = 48;
  const chartW = 560;
  const maxChart = Math.max(chartData.scale.max * 1.15, 1);
  const n = chartData.months.length || 12;
  const gap = 6;
  const barW = n > 0 ? (chartW - gap * (n - 1)) / n : 0;

  const totalDistributed = summary
    ? formatCompactCurrency(
        summary.totalDistributed.amount,
        summary.totalDistributed.currency,
        { decimals: 0 },
      )
    : summaryLoading
      ? '—'
      : '$0';

  const nextPayout = summary?.nextDistribution
    ? formatCompactCurrency(
        summary.nextDistribution.amount,
        summary.nextDistribution.currency,
        { decimals: 0 },
      )
    : summaryLoading
      ? '—'
      : '—';

  const avgApy = summary
    ? `${summary.portfolioAvgApy.percent.toFixed(1)}%`
    : summaryLoading
      ? '—'
      : '0%';

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            {
              label: 'Total Distributed',
              value: totalDistributed,
              Icon: DollarSign,
            },
            {
              label: 'Next Payout',
              value: nextPayout,
              sub: summary?.nextDistribution?.label,
              Icon: Calendar,
            },
            {
              label: 'Portfolio Avg APY',
              value: avgApy,
              sub: summary?.portfolioAvgApy.summary,
              Icon: TrendingUp,
            },
            {
              label: 'Scheduled Payouts',
              value: payoutsLoading ? '—' : String(upcoming.length),
              Icon: Clock,
            },
          ] as const
        ).map((card) => {
          const CardIcon = card.Icon;
          return (
            <div
              key={card.label}
              className="rounded-[24px] border border-card-border bg-card p-6 shadow-sm"
            >
              <MetricIconCircle className="mb-4 bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
                <CardIcon className="h-5 w-5" strokeWidth={iconStroke} />
              </MetricIconCircle>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                {card.label}
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
              {'sub' in card && card.sub ? (
                <p className="mt-1 text-xs font-medium text-text-muted">{card.sub}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="max-w-full min-w-0 rounded-[32px] border border-card-border bg-card p-8 shadow-sm md:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Distribution Schedule {schedule?.year ?? year}
            </h3>
            <p className="text-xs text-text-muted">
              {scheduleLoading
                ? 'Loading monthly actual vs projected…'
                : `YTD ${formatCompactCurrency(schedule?.ytdActual ?? 0, schedule?.currency ?? 'USD', { decimals: 0 })} · EOY projection ${formatCompactCurrency(schedule?.eoyProjection ?? 0, schedule?.currency ?? 'USD', { decimals: 0 })} · ${(schedule?.achievementRate ?? 0).toFixed(0)}% of target`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-full border border-card-border bg-surface px-4 py-2 text-xs font-bold text-foreground"
              aria-label="Distribution schedule year"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
              Schedule Payout
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Actual
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Projected
            </span>
          </div>
        </div>

        <div className="max-w-full min-w-0 overflow-x-auto">
          <svg
            className="block h-auto min-h-[180px] w-full max-w-full min-w-0"
            viewBox="0 0 640 200"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Monthly distribution schedule"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const k = maxChart * pct;
              const y = chartTop + chartH - (k / maxChart) * chartH;
              const suffix = chartData.scale.suffix;
              return (
                <g key={pct}>
                  <line
                    x1={chartLeft}
                    y1={y}
                    x2={chartLeft + chartW}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4 5"
                  />
                  <text
                    x="40"
                    y={y + 4}
                    textAnchor="end"
                    fill="var(--text-muted)"
                    className="text-[10px] font-bold"
                  >
                    {pct === 0
                      ? '$0'
                      : `$${k.toFixed(suffix === 'M' ? 1 : 0)}${suffix}`}
                  </text>
                </g>
              );
            })}
            {chartData.months.map((month, i) => {
              const actualH =
                (month.actual / chartData.scale.divisor / maxChart) * chartH;
              const projectedH =
                (month.projected / chartData.scale.divisor / maxChart) * chartH;
              const x = chartLeft + i * (barW + gap);
              const groupW = Math.max(barW, 4);
              const innerGap = 2;
              const singleW = (groupW - innerGap) / 2;
              return (
                <g key={month.label}>
                  <rect
                    x={x}
                    y={chartTop + chartH - Math.max(projectedH, 2)}
                    width={singleW}
                    height={Math.max(projectedH, 2)}
                    rx="3"
                    fill="var(--border)"
                  />
                  <rect
                    x={x + singleW + innerGap}
                    y={chartTop + chartH - Math.max(actualH, 2)}
                    width={singleW}
                    height={Math.max(actualH, 2)}
                    rx="3"
                    fill="var(--primary)"
                  />
                  <text
                    x={x + groupW / 2}
                    y={chartTop + chartH + 22}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    className="text-[10px] font-bold"
                  >
                    {month.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {summary && !summaryLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-card-border bg-surface px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                YTD Distributions
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatCompactCurrency(
                  summary.ytdDistributions.amount,
                  summary.ytdDistributions.currency,
                  { decimals: 0 },
                )}
              </p>
              <p className="text-xs text-text-muted">
                {summary.ytdDistributions.changePercent >= 0 ? '+' : ''}
                {summary.ytdDistributions.changePercent.toFixed(1)}% vs prior year
              </p>
            </div>
            <div className="rounded-2xl border border-card-border bg-surface px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1">
                <Target className="h-3 w-3" strokeWidth={iconStroke} />
                Achievement
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {(schedule?.achievementRate ?? 0).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-2xl border border-card-border bg-surface px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                {summary.totalDistributed.summary || 'All-time total'}
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">{totalDistributed}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="max-w-full min-w-0 overflow-x-auto rounded-[32px] border border-card-border bg-card shadow-sm">
        <div className="border-b border-card-border px-6 py-4">
          <h3 className="text-lg font-bold text-foreground">Upcoming Payouts</h3>
          <p className="text-xs text-text-muted">Scheduled distributions across assets</p>
        </div>
        <table className="w-full min-w-0 table-fixed text-left">
          <thead className="border-b border-card-border bg-surface">
            <tr>
              {['Period', 'Asset', 'Type', 'Amount', 'Investors', 'Date', 'Status'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted sm:px-6 sm:py-4"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payoutsLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-text-muted">
                  Loading upcoming payouts…
                </td>
              </tr>
            ) : upcoming.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-text-muted">
                  No upcoming payouts scheduled.
                </td>
              </tr>
            ) : (
              upcoming.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-surface">
                  <td className="min-w-0 break-words px-3 py-3 text-sm font-semibold text-foreground sm:px-6 sm:py-4">
                    {row.period}
                  </td>
                  <td className="min-w-0 px-3 py-3 sm:px-6 sm:py-4">
                    <span className="text-sm font-bold text-primary">{row.asset}</span>
                  </td>
                  <td className="min-w-0 break-words px-3 py-3 text-sm text-text-muted sm:px-6 sm:py-4">
                    {row.type}
                  </td>
                  <td className="min-w-0 px-3 py-3 text-sm font-bold text-foreground sm:px-6 sm:py-4">
                    {row.amountFormatted}
                  </td>
                  <td className="min-w-0 px-3 py-3 text-sm text-text-muted sm:px-6 sm:py-4">
                    {row.investors}
                  </td>
                  <td className="min-w-0 px-3 py-3 text-sm text-text-muted sm:px-6 sm:py-4">
                    {row.date}
                  </td>
                  <td className="min-w-0 px-3 py-3 sm:px-6 sm:py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        row.status.toLowerCase() === 'completed'
                          ? 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg'
                          : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
