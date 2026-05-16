'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Calendar,
  CalendarClock,
  Clock,
  Coins,
  Download,
  TrendingUp,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCompactCurrency } from '@/lib/issuerDashboard';
import {
  chartScaleForAmounts,
  formatShortPayoutDate,
  parseApyPercent,
  type DistributionScheduleMonth,
} from '@/lib/yield';
import { useListPortfolioAssetsQuery } from '@/store/api/portfolioApi';
import {
  useGetDistributionScheduleQuery,
  useGetUpcomingPayoutsQuery,
  useGetYieldSummaryQuery,
} from '@/store/api/yieldApi';

const iconStroke = 1.75;

const APY_BAR_PALETTE = [
  { dot: 'bg-[#7C3AED]', bar: 'bg-[#7C3AED]' },
  { dot: 'bg-[#8B5CF6]', bar: 'bg-[#8B5CF6]' },
  { dot: 'bg-[#A78BFA]', bar: 'bg-[#A78BFA]' },
  { dot: 'bg-[#C4B5FD]', bar: 'bg-[#C4B5FD]' },
  { dot: 'bg-[#DDD6FE]', bar: 'bg-[#DDD6FE]' },
  { dot: 'bg-[#EDE9FE]', bar: 'bg-[#EDE9FE]' },
] as const;

type YieldStatCard = {
  label: string;
  value: string;
  sub: string;
  Icon: LucideIcon;
  variant: 'primary' | 'default';
};

type BreakdownStatus = 'Above Target' | 'On Track' | 'Below Target';

type BreakdownRow = {
  name: string;
  tag: string;
  dot: string;
  apy: string;
  total: string;
  freq: string;
  last: string;
  next: string;
  status: BreakdownStatus;
};

const STATUS_STYLES: Record<BreakdownStatus, { pill: string; dot: string }> = {
  'Above Target': {
    pill: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg',
    dot: 'bg-emerald-500',
  },
  'On Track': {
    pill: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  'Below Target': {
    pill: 'border-app-status-warn-border bg-app-status-warn-bg text-app-status-warn-fg',
    dot: 'bg-amber-500',
  },
};

function breakdownStatus(apyPercent: number, portfolioAvg: number): BreakdownStatus {
  if (apyPercent > portfolioAvg + 1) return 'Above Target';
  if (apyPercent < portfolioAvg - 1) return 'Below Target';
  return 'On Track';
}

function YieldStatCardUI({ stat }: { stat: YieldStatCard }) {
  const isPrimary = stat.variant === 'primary';
  const Icon = stat.Icon;

  return (
    <div
      className={
        isPrimary
          ? 'flex min-h-[148px] flex-col justify-between rounded-2xl bg-linear-to-br from-[#9810FA] to-[#4F39F6] p-5 shadow-[0_16px_40px_-12px_rgba(152,16,250,0.45)] sm:min-h-[160px] sm:rounded-3xl sm:p-6 xl:min-h-[168px] xl:rounded-[24px] xl:p-8'
          : 'flex min-h-[148px] flex-col justify-between rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm sm:min-h-[160px] sm:rounded-3xl sm:p-6 xl:min-h-[168px] xl:rounded-[24px] xl:p-8'
      }
    >
      <div
        className={
          isPrimary
            ? 'flex h-11 w-11 items-center justify-center rounded-xl bg-ui-card/20 text-white'
            : 'flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED]'
        }
      >
        <Icon className="h-5 w-5" strokeWidth={iconStroke} />
      </div>
      <div>
        <p
          className={`mb-2 text-[10px] font-bold uppercase tracking-[0.12em] ${
            isPrimary ? 'text-white/70' : 'text-ui-faint'
          }`}
        >
          {stat.label}
        </p>
        <p
          className={`text-2xl font-bold leading-none tracking-tight tabular-nums sm:text-3xl xl:text-[32px] ${isPrimary ? 'text-white' : 'text-ui-strong'}`}
        >
          {stat.value}
        </p>
        <p className={`mt-2 text-[13px] font-medium ${isPrimary ? 'text-white/65' : 'text-ui-faint'}`}>
          {stat.sub}
        </p>
      </div>
    </div>
  );
}

function buildAreaPath(
  values: number[],
  chartLeft: number,
  chartW: number,
  chartTop: number,
  chartH: number,
  maxVal: number,
  baselineY: number,
) {
  if (values.length === 0) return '';
  const n = values.length;
  const pts = values.map((v, i) => {
    const x = chartLeft + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
    const y = chartTop + chartH - (v / maxVal) * chartH;
    return { x, y };
  });
  let d = `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ` L ${pts[n - 1].x} ${baselineY} Z`;
  return d;
}

function buildLinePath(
  values: number[],
  chartLeft: number,
  chartW: number,
  chartTop: number,
  chartH: number,
  maxVal: number,
) {
  if (values.length === 0) return '';
  const n = values.length;
  return values
    .map((v, i) => {
      const x = chartLeft + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
      const y = chartTop + chartH - (v / maxVal) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function DistributionScheduleChart({
  mode,
  months,
  chartValues,
  maxChart,
  scaleSuffix,
  loading,
}: {
  mode: 'bar' | 'area';
  months: DistributionScheduleMonth[];
  chartValues: number[];
  maxChart: number;
  scaleSuffix: string;
  loading: boolean;
}) {
  const chartLeft = 48;
  const chartW = 572;
  const chartTop = 20;
  const chartH = 140;
  const chartBottom = chartTop + chartH;
  const barW = 28;
  const n = chartValues.length;
  const gap = n > 0 ? chartW / n : chartW;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => maxChart * pct);

  const areaPath = buildAreaPath(
    chartValues,
    chartLeft,
    chartW,
    chartTop,
    chartH,
    maxChart,
    chartBottom,
  );

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm font-medium text-ui-faint">
        Loading distribution schedule…
      </div>
    );
  }

  if (n === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm font-medium text-ui-faint">
        No distribution data for this period.
      </div>
    );
  }

  return (
    <div className="motion-chart relative min-w-0 overflow-x-auto">
      <svg
        className="block h-auto min-h-[200px] w-full max-w-full"
        viewBox="0 0 640 200"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Monthly distribution schedule"
      >
        <defs>
          <linearGradient id="yieldDistAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9810FA" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9810FA" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((k, idx) => {
          const y = chartBottom - (k / maxChart) * chartH;
          return (
            <g key={idx}>
              <line
                x1={chartLeft}
                y1={y}
                x2={chartLeft + chartW}
                y2={y}
                stroke="var(--ui-border)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <text x={chartLeft - 6} y={y + 4} textAnchor="end" fill="#9CA3AF" className="text-[10px] font-bold">
                {k === 0
                  ? '$0'
                  : `$${k.toFixed(scaleSuffix === 'M' ? 1 : 0)}${scaleSuffix}`}
              </text>
            </g>
          );
        })}

        {mode === 'area' ? (
          <>
            <path d={areaPath} fill="url(#yieldDistAreaFill)" />
            <path
              d={buildLinePath(chartValues, chartLeft, chartW, chartTop, chartH, maxChart)}
              fill="none"
              stroke="#9810FA"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {chartValues.map((v, i) => {
              const x = chartLeft + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
              const y = chartTop + chartH - (v / maxChart) * chartH;
              return <circle key={i} cx={x} cy={y} r="4" fill="#9810FA" />;
            })}
          </>
        ) : (
          chartValues.map((v, i) => {
            const barH = (v / maxChart) * chartH;
            const x = chartLeft + i * gap + (gap - barW) / 2;
            const y = chartBottom - barH;
            return (
              <rect
                key={months[i]?.label ?? i}
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx="4"
                ry="4"
                fill="#9810FA"
                className="motion-bar-grow"
                style={{ animationDelay: `${i * 40}ms` }}
              />
            );
          })
        )}

        {months.map((m, i) => {
          const x = chartLeft + i * gap + gap / 2;
          return (
            <text
              key={m.label}
              x={x}
              y={chartBottom + 22}
              textAnchor="middle"
              fill="#9CA3AF"
              className="text-[10px] font-bold uppercase"
            >
              {m.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function YieldPage() {
  const [chartMode, setChartMode] = useState<'bar' | 'area'>('bar');
  const currentYear = new Date().getFullYear();

  const { data: summary, isLoading: summaryLoading } = useGetYieldSummaryQuery();
  const { data: schedule, isLoading: scheduleLoading } = useGetDistributionScheduleQuery({
    year: currentYear,
  });
  const { data: upcoming = [], isLoading: payoutsLoading } = useGetUpcomingPayoutsQuery();
  const { data: portfolioAssets, isLoading: assetsLoading } = useListPortfolioAssetsQuery({
    page: 1,
    limit: 100,
  });

  const yieldStats = useMemo((): YieldStatCard[] => {
    const loading = summaryLoading;
    const total = summary
      ? formatCompactCurrency(
          summary.totalDistributed.amount,
          summary.totalDistributed.currency,
          { decimals: 2 },
        )
      : loading
        ? '—'
        : '$0';
    const ytd = summary
      ? formatCompactCurrency(
          summary.ytdDistributions.amount,
          summary.ytdDistributions.currency,
          { decimals: 0 },
        )
      : loading
        ? '—'
        : '$0';
    const ytdSub = summary
      ? `${summary.ytdDistributions.changePercent >= 0 ? '+' : ''}${summary.ytdDistributions.changePercent.toFixed(1)}% vs prior year`
      : loading
        ? ''
        : 'Year to date';
    const avgApy = summary
      ? `${summary.portfolioAvgApy.percent.toFixed(1)}%`
      : loading
        ? '—'
        : '0%';
    const next = summary?.nextDistribution;
    const nextValue = next?.date
      ? formatShortPayoutDate(next.date)
      : loading
        ? '—'
        : '—';
    const nextSub = next
      ? `${next.label} · ${formatCompactCurrency(next.amount, next.currency, { decimals: 1 })}`
      : loading
        ? ''
        : 'No upcoming distribution';

    return [
      {
        label: 'Total Distributed',
        value: total,
        sub: summary?.totalDistributed.summary || 'All-time platform total',
        Icon: Coins,
        variant: 'primary',
      },
      {
        label: 'YTD Distributions',
        value: ytd,
        sub: ytdSub,
        Icon: TrendingUp,
        variant: 'default',
      },
      {
        label: 'Portfolio Avg APY',
        value: avgApy,
        sub: summary?.portfolioAvgApy.summary || 'Weighted by NAV',
        Icon: BarChart3,
        variant: 'default',
      },
      {
        label: 'Next Distribution',
        value: nextValue,
        sub: nextSub,
        Icon: Calendar,
        variant: 'default',
      },
    ];
  }, [summary, summaryLoading]);

  const chartBundle = useMemo(() => {
    const months = schedule?.months ?? [];
    const scale = chartScaleForAmounts([
      ...months.map((m) => m.actual),
      ...(schedule ? [schedule.eoyProjection, schedule.ytdActual] : []),
    ]);
    const chartValues = months.map((m) => m.actual / scale.divisor);
    const maxChart = Math.max(scale.max * 1.15, 1);
    return { months, chartValues, maxChart, scaleSuffix: scale.suffix };
  }, [schedule]);

  const apyAssets = useMemo(() => {
    const items = portfolioAssets?.items ?? [];
    return [...items]
      .map((asset, index) => ({
        name: asset.ticker !== '—' ? asset.ticker : asset.name,
        pct: parseApyPercent(asset.apy),
        palette: APY_BAR_PALETTE[index % APY_BAR_PALETTE.length],
      }))
      .filter((a) => a.pct > 0)
      .sort((a, b) => b.pct - a.pct);
  }, [portfolioAssets]);

  const maxApy = useMemo(
    () => Math.max(...apyAssets.map((a) => a.pct), 1),
    [apyAssets],
  );

  const breakdownRows = useMemo((): BreakdownRow[] => {
    const portfolio = portfolioAssets?.items ?? [];
    const portfolioAvg = summary?.portfolioAvgApy.percent ?? 0;
    const byAsset = new Map<string, BreakdownRow>();

    for (const asset of portfolio) {
      const apyPct = parseApyPercent(asset.apy);
      const palette = APY_BAR_PALETTE[byAsset.size % APY_BAR_PALETTE.length];
      byAsset.set(asset.name, {
        name: asset.name,
        tag: asset.ticker,
        dot: palette.dot,
        apy: asset.apy,
        total: '—',
        freq: '—',
        last: '—',
        next: '—',
        status: breakdownStatus(apyPct, portfolioAvg),
      });
    }

    for (const payout of upcoming) {
      const existing = byAsset.get(payout.asset);
      const palette = APY_BAR_PALETTE[byAsset.size % APY_BAR_PALETTE.length];
      const portfolioMatch = portfolio.find(
        (a) => a.name === payout.asset || a.ticker === payout.asset,
      );
      const apyPct = portfolioMatch ? parseApyPercent(portfolioMatch.apy) : portfolioAvg;

      if (existing) {
        existing.freq = payout.type;
        existing.next = formatShortPayoutDate(payout.date);
        existing.total = payout.amountFormatted;
      } else {
        byAsset.set(payout.asset, {
          name: payout.asset,
          tag: portfolioMatch?.ticker ?? '—',
          dot: palette.dot,
          apy: portfolioMatch?.apy ?? '—',
          total: payout.amountFormatted,
          freq: payout.type,
          last: '—',
          next: formatShortPayoutDate(payout.date),
          status: breakdownStatus(apyPct, portfolioAvg),
        });
      }
    }

    return Array.from(byAsset.values()).sort(
      (a, b) => parseApyPercent(b.apy) - parseApyPercent(a.apy),
    );
  }, [portfolioAssets, upcoming, summary]);

  const highlightPayoutId = upcoming[0]?.id;

  const scheduleFooter = useMemo(() => {
    const currency = schedule?.currency ?? 'USD';
    return {
      ytd: formatCompactCurrency(schedule?.ytdActual ?? 0, currency, { decimals: 0 }),
      eoy: formatCompactCurrency(schedule?.eoyProjection ?? 0, currency, { decimals: 2 }),
      achievement: `${(schedule?.achievementRate ?? 0).toFixed(1)}%`,
    };
  }, [schedule]);

  return (
    <DashboardLayout>
      <div className="animate-page-enter mx-auto w-full max-w-7xl min-w-0 space-y-6 sm:space-y-8 xl:space-y-10">
        <div className="animate-slide-up space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong sm:text-3xl xl:text-4xl">Yield</h1>
          <p className="text-sm font-medium text-ui-muted-text">
            Track distributions, APY performance, and upcoming payout schedules.
          </p>
        </div>

        <div className="motion-stagger-children grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
          {yieldStats.map((stat) => (
            <YieldStatCardUI key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="animate-slide-up delay-100 min-w-0 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8 xl:col-span-1 xl:rounded-[24px]">
            <div className="mb-6 sm:mb-8">
              <h3 className="mb-1 text-[15px] font-bold text-ui-strong">APY by Asset</h3>
              <p className="text-xs font-medium text-ui-faint">Annualized yield performance</p>
            </div>
            {assetsLoading ? (
              <p className="text-sm font-medium text-ui-faint">Loading assets…</p>
            ) : apyAssets.length === 0 ? (
              <p className="text-sm font-medium text-ui-faint">No assets with APY data.</p>
            ) : (
              <div className="space-y-5">
                {apyAssets.map((asset) => (
                  <div key={asset.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${asset.palette.dot}`} />
                        <span className="text-[12px] font-bold text-ui-body">{asset.name}</span>
                      </div>
                      <span className="text-[12px] font-bold text-[#7C3AED]">{asset.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-ui-muted-deep">
                      <div
                        className={`h-full rounded-full ${asset.palette.bar}`}
                        style={{ width: `${(asset.pct / maxApy) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="animate-slide-up delay-200 flex min-w-0 flex-col rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8 xl:col-span-2 xl:rounded-[24px]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="mb-1 text-[15px] font-bold text-ui-strong">Distribution Schedule</h3>
                <p className="text-xs font-medium text-ui-faint">
                  Monthly distributions vs. projected ({schedule?.year ?? currentYear})
                </p>
              </div>
              <div className="flex shrink-0 gap-1 rounded-lg bg-ui-muted-deep p-1">
                <button
                  type="button"
                  onClick={() => setChartMode('bar')}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition-all ${
                    chartMode === 'bar'
                      ? 'bg-ui-card text-ui-strong shadow-sm'
                      : 'text-ui-faint hover:text-ui-muted-text'
                  }`}
                >
                  Bar
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('area')}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition-all ${
                    chartMode === 'area'
                      ? 'bg-ui-card text-ui-strong shadow-sm'
                      : 'text-ui-faint hover:text-ui-muted-text'
                  }`}
                >
                  Area
                </button>
              </div>
            </div>

            <DistributionScheduleChart
              mode={chartMode}
              months={chartBundle.months}
              chartValues={chartBundle.chartValues}
              maxChart={chartBundle.maxChart}
              scaleSuffix={chartBundle.scaleSuffix}
              loading={scheduleLoading}
            />

            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-ui-border pt-6 sm:grid-cols-3 sm:gap-8 sm:pt-8">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  Distributed YTD
                </p>
                <p className="text-xl font-bold text-ui-strong">
                  {scheduleLoading ? '—' : scheduleFooter.ytd}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  EOY Projection
                </p>
                <p className="text-xl font-bold text-ui-strong">
                  {scheduleLoading ? '—' : scheduleFooter.eoy}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                  Achievement Rate
                </p>
                <p className="text-xl font-bold text-ui-success-text">
                  {scheduleLoading ? '—' : scheduleFooter.achievement}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-slide-up delay-300 min-w-0 rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8 xl:rounded-[24px]">
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED]">
              <CalendarClock className="h-5 w-5" strokeWidth={iconStroke} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-ui-strong">Upcoming Payouts</h3>
              <p className="text-xs font-medium text-ui-faint">Scheduled distributions</p>
            </div>
          </div>
          {payoutsLoading ? (
            <p className="text-sm font-medium text-ui-faint">Loading upcoming payouts…</p>
          ) : upcoming.length === 0 ? (
            <p className="text-sm font-medium text-ui-faint">No upcoming payouts scheduled.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              {upcoming.map((p) => {
                const highlight = p.id === highlightPayoutId;
                const dateLabel = formatShortPayoutDate(p.date);
                return highlight ? (
                  <div
                    key={p.id}
                    className="relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-amber-200/80 bg-[#FFFBEB] p-5 dark:border-amber-900/40 dark:bg-amber-950/25 sm:rounded-[20px] sm:p-6"
                  >
                    <Clock
                      className="absolute right-5 top-5 h-4 w-4 text-amber-500"
                      strokeWidth={iconStroke}
                      aria-hidden
                    />
                    <div className="space-y-1 pr-8">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-amber-600">
                        {dateLabel}
                      </span>
                      <h4 className="truncate text-sm font-bold text-ui-strong">{p.asset}</h4>
                      <p className="text-[11px] font-medium text-ui-muted-text">{p.type}</p>
                    </div>
                    <p className="mt-4 text-xl font-bold tabular-nums text-ui-success-text sm:mt-6 sm:text-2xl">
                      {p.amountFormatted}
                    </p>
                  </div>
                ) : (
                  <div
                    key={p.id}
                    className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-ui-border bg-ui-card p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] sm:rounded-[20px] sm:p-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-[#7C3AED]">
                        {dateLabel}
                      </span>
                      <h4 className="truncate text-sm font-bold text-ui-strong">{p.asset}</h4>
                      <p className="text-[11px] font-medium text-ui-muted-text">{p.type}</p>
                    </div>
                    <p className="mt-4 text-xl font-bold tabular-nums text-ui-success-text sm:mt-6 sm:text-2xl">
                      {p.amountFormatted}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="animate-slide-up delay-400 min-w-0 overflow-hidden rounded-2xl border border-ui-border bg-ui-card shadow-sm sm:rounded-3xl xl:rounded-[24px]">
          <div className="flex flex-col gap-4 border-b border-ui-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 md:px-8 md:py-7">
            <div>
              <h3 className="mb-1 text-[15px] font-bold text-ui-strong">Asset Yield Breakdown</h3>
              <p className="text-xs font-medium text-ui-faint">
                Individual APY performance and distribution schedules
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ui-border bg-ui-card px-5 py-2.5 text-[11px] font-bold text-ui-body shadow-sm transition-colors hover:bg-ui-muted"
            >
              <Download className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
              Export CSV
            </button>
          </div>

          {assetsLoading && payoutsLoading ? (
            <p className="px-6 py-8 text-sm font-medium text-ui-faint">Loading breakdown…</p>
          ) : breakdownRows.length === 0 ? (
            <p className="px-6 py-8 text-sm font-medium text-ui-faint">
              No asset yield data available yet.
            </p>
          ) : (
            <>
              <div className="space-y-3 p-4 sm:p-5 xl:hidden">
                {breakdownRows.map((row) => {
                  const statusStyle = STATUS_STYLES[row.status];
                  return (
                    <article
                      key={`${row.tag}-${row.name}`}
                      className="rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm sm:p-5"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${row.dot}`} />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-ui-strong">{row.name}</p>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                              {row.tag}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${statusStyle.pill}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} aria-hidden />
                          {row.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 border-t border-ui-divider pt-3 text-[11px]">
                        <div>
                          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">APY</p>
                          <p className="font-bold text-ui-success-text">{row.apy}</p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Total</p>
                          <p className="font-bold tabular-nums text-ui-strong">{row.total}</p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                            Frequency
                          </p>
                          <p className="font-bold text-ui-body">{row.freq}</p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                            Next payout
                          </p>
                          <p className="font-bold text-ui-strong">{row.next}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="hidden min-w-0 overflow-x-auto xl:block">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-ui-border bg-ui-muted">
                      {['Asset', 'APY', 'Total Distributed', 'Frequency', 'Last Payout', 'Next Payout', 'Status'].map(
                        (col) => (
                          <th
                            key={col}
                            className={`px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-ui-faint xl:px-8 xl:py-5 ${
                              col === 'Asset' ? 'sticky left-0 z-10 bg-ui-muted pl-6 xl:pl-8' : ''
                            } ${col === 'Last Payout' ? 'hidden 2xl:table-cell' : ''} ${col === 'Frequency' ? 'hidden lg:table-cell' : ''}`}
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ui-divider">
                    {breakdownRows.map((row) => {
                      const statusStyle = STATUS_STYLES[row.status];
                      return (
                        <tr key={`${row.tag}-${row.name}`} className="transition-colors hover:bg-ui-muted">
                          <td className="sticky left-0 z-10 bg-ui-card px-4 py-5 group-hover:bg-ui-muted xl:px-8 xl:py-6">
                            <div className="flex min-w-[180px] items-center gap-3">
                              <span className={`h-2 w-2 shrink-0 rounded-full ${row.dot}`} />
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-bold text-ui-strong">{row.name}</p>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                                  {row.tag}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-5 xl:px-8 xl:py-6">
                            <span className="text-[13px] font-bold text-ui-success-text">{row.apy}</span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-5 xl:px-8 xl:py-6">
                            <span className="text-[13px] font-bold tabular-nums text-ui-strong">{row.total}</span>
                          </td>
                          <td className="hidden px-4 py-5 lg:table-cell xl:px-8 xl:py-6">
                            <span className="inline-flex rounded-lg border border-ui-border bg-ui-muted-deep px-3 py-1 text-[10px] font-bold text-ui-body">
                              {row.freq}
                            </span>
                          </td>
                          <td className="hidden px-4 py-5 2xl:table-cell xl:px-8 xl:py-6">
                            <span className="text-[12px] font-medium text-ui-muted-text">{row.last}</span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-5 xl:px-8 xl:py-6">
                            <span className="text-[12px] font-bold text-ui-strong">{row.next}</span>
                          </td>
                          <td className="px-4 py-5 pr-6 xl:px-8 xl:py-6">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold ${statusStyle.pill}`}
                            >
                              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyle.dot}`} />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
