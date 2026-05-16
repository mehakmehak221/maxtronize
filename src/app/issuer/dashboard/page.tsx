'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { OverviewHero } from '@/components/dashboard/OverviewHero';
import { OverviewKpiGrid } from '@/components/dashboard/OverviewKpiGrid';
import type { KpiCard } from '@/components/dashboard/OverviewKpiGrid';
import DashboardLayout from '@/components/DashboardLayout';
import {
  IconChartBar,
  IconClock,
  IconNavSparkles,
  IconNavTrendingUp,
  IconNavUsers,
  IconPulseActivity,
  IssuerStatIconBars,
  IssuerStatIconTrend,
  IssuerStatIconUsers,
  IssuerStatIconWallet,
} from '@/components/IssuerNavIcons';
import {
  buildAllocationConicGradient,
  buildCapitalChartPaths,
  firstNameFromProfile,
  formatCompactCurrency,
  formatCompactNumber,
  formatPercent,
  greetingForHour,
} from '@/lib/issuerDashboard';
import { useAuthenticatedProfileQuery } from '@/store/api/authApi';
import {
  useGetIssuerCapitalRaisedQuery,
  useGetIssuerDashboardAllocationQuery,
  useGetIssuerDashboardSummaryQuery,
  useGetIssuerRecentActivityQuery,
  useGetIssuerTokenTickerQuery,
  useGetIssuerUpcomingEventsQuery,
} from '@/store/api/issuerDashboardApi';

const MONTH_FALLBACK = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

function buildKpiCards(
  summary: ReturnType<typeof useGetIssuerDashboardSummaryQuery>['data'],
): KpiCard[] {
  if (!summary) return [];

  const { capitalRaised, assets, investors, yield: yieldData } = summary;
  const growth = capitalRaised.quarterlyGrowthPercent;
  const yieldChange = yieldData.changePercent;

  return [
    {
      label: 'Total Raised',
      val: formatCompactCurrency(capitalRaised.total, capitalRaised.currency),
      trend: `${growth >= 0 ? '↗' : '↘'} ${formatPercent(growth)}`,
      sub: 'vs prior quarter',
      up: growth >= 0,
      Icon: IssuerStatIconWallet,
      well: 'bg-dash-kpi-violet-soft text-dash-kpi-violet-fg ring-1 ring-dash-kpi-violet-ring',
    },
    {
      label: 'Assets Tokenized',
      val: formatCompactCurrency(assets.tokenizedValue, capitalRaised.currency),
      trend: `${assets.count} assets`,
      sub: `${assets.jurisdictionCount} jurisdiction${assets.jurisdictionCount === 1 ? '' : 's'}`,
      up: true,
      Icon: IssuerStatIconBars,
      well: 'bg-dash-kpi-blue-soft text-dash-kpi-blue-fg ring-1 ring-dash-kpi-blue-ring',
    },
    {
      label: 'Active Investors',
      val: formatCompactNumber(investors.total),
      trend: `${investors.kycVerifiedPercent.toFixed(0)}% KYC`,
      sub: 'verified investors',
      up: investors.kycVerifiedPercent >= 50,
      Icon: IssuerStatIconUsers,
      well: 'bg-dash-kpi-green-soft text-dash-kpi-green-fg ring-1 ring-dash-kpi-green-ring',
    },
    {
      label: 'Platform Yield',
      val: `${yieldData.averageApyPercent.toFixed(1)}%`,
      trend: `${yieldChange >= 0 ? '↗' : '↘'} ${formatPercent(yieldChange)}`,
      sub: 'Weighted avg. APY',
      up: yieldChange >= 0,
      Icon: IssuerStatIconTrend,
      well: 'bg-dash-kpi-orange-soft text-dash-kpi-orange-fg ring-1 ring-dash-kpi-orange-ring',
    },
  ];
}

export default function DashboardPage() {
  const { data: profile } = useAuthenticatedProfileQuery();
  const { data: summary, isLoading: summaryLoading } = useGetIssuerDashboardSummaryQuery();
  const { data: capitalRaised } = useGetIssuerCapitalRaisedQuery({ period: '9m' });
  const { data: allocation } = useGetIssuerDashboardAllocationQuery();
  const { data: ticker = [] } = useGetIssuerTokenTickerQuery();
  const { data: recentActivity } = useGetIssuerRecentActivityQuery({ page: 1, limit: 5 });
  const { data: upcomingEvents = [] } = useGetIssuerUpcomingEventsQuery();

  const kpiCards = useMemo(() => buildKpiCards(summary), [summary]);

  const chart = useMemo(
    () => buildCapitalChartPaths(capitalRaised?.series ?? []),
    [capitalRaised?.series],
  );

  const allocationGradient = useMemo(
    () => buildAllocationConicGradient(allocation?.segments ?? []),
    [allocation?.segments],
  );

  const displayDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const greeting = `${greetingForHour()}, ${firstNameFromProfile(profile?.fullName)}`;

  const heroValue = summary
    ? formatCompactCurrency(
        summary.capitalRaised.total,
        summary.capitalRaised.currency,
        { decimals: 0 },
      )
    : summaryLoading
      ? '—'
      : '$0';

  const growthPercent = summary?.capitalRaised.quarterlyGrowthPercent ?? 0;
  const tokenizedValue = summary?.assets.tokenizedValue ?? 0;
  const assetCount = summary?.assets.count ?? 0;

  const heroTokens =
    ticker.length > 0
      ? ticker.map((t) => ({ sym: t.sym, ch: t.change, dotClass: t.dotClass }))
      : [{ sym: '—', ch: 'No tokens', dotClass: 'bg-white/30' }];

  const activities = recentActivity?.items ?? [];

  const chartLabels = chart?.labels ?? MONTH_FALLBACK.slice(0, 9);
  const completionPercent = capitalRaised?.completionPercent ?? 0;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8 md:space-y-10">
        <OverviewHero
          variant="issuer"
          greeting={greeting}
          date={displayDate}
          value={heroValue}
          subtitle="Total capital raised across all active offerings."
          badges={[
            {
              type: growthPercent >= 0 ? 'positive' : 'neutral',
              text: `${formatPercent(growthPercent)} vs last quarter`,
            },
            {
              type: 'neutral',
              text: `${formatCompactCurrency(tokenizedValue)} tokenized · ${assetCount} asset${assetCount === 1 ? '' : 's'}`,
            },
          ]}
          pillars={[
            {
              label: 'Active Raises',
              value: String(summary?.activeRaises ?? 0),
              Icon: IconPulseActivity,
            },
            {
              label: 'Investors',
              value: formatCompactNumber(summary?.investors.total ?? 0),
              Icon: IconNavUsers,
            },
            {
              label: 'Avg Yield',
              value: `${(summary?.yield.averageApyPercent ?? 0).toFixed(1)}%`,
              Icon: IconNavTrendingUp,
            },
          ]}
          tokens={heroTokens}
        />

        {kpiCards.length > 0 ? (
          <OverviewKpiGrid cards={kpiCards} />
        ) : summaryLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-[22px] border border-ui-border bg-ui-muted-deep/60 md:rounded-3xl"
              />
            ))}
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="min-w-0 overflow-hidden rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-[28px] md:p-9 xl:col-span-2 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-center">
              <div>
                <h3 className="mb-1 text-lg font-bold text-ui-strong md:text-xl">Capital Raised</h3>
                <p className="text-xs font-medium text-ui-muted-text">
                  Cumulative vs. target · USD millions
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ui-muted-text">
                    Actual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0 w-4 border-t-2 border-dashed border-ui-border-strong" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ui-muted-text">
                    Target
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-2 h-52 motion-chart md:h-64">
              {chart ? (
                <svg
                  className="absolute inset-0 h-full w-full text-primary"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="dash-capital-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                      <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={chart.areaPath} fill="url(#dash-capital-area)" />
                  <path
                    d={chart.targetPath}
                    fill="none"
                    stroke="rgb(148 163 184)"
                    strokeOpacity="0.9"
                    strokeWidth="2.5"
                    strokeDasharray="14 10"
                    strokeLinecap="round"
                    className="dark:stroke-slate-500"
                  />
                  <path
                    d={chart.actualPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-ui-border bg-ui-muted-deep/40">
                  <p className="text-xs font-medium text-ui-muted-text">
                    No capital raised data for this period
                  </p>
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-between overflow-x-auto px-0.5 pb-1">
              {chartLabels.map((m) => (
                <span
                  key={m}
                  className="text-[10px] font-bold uppercase tracking-widest text-ui-placeholder"
                >
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-ui-divider pt-8 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  label: 'Current Month',
                  val: formatCompactCurrency(capitalRaised?.currentMonth ?? 0),
                },
                {
                  label: 'Target Gap',
                  val: formatCompactCurrency(capitalRaised?.targetGap ?? 0),
                },
                {
                  label: 'Completion',
                  val: `${completionPercent.toFixed(1)}%`,
                  color: 'text-ui-success-text',
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                    {item.label}
                  </p>
                  <p className={`text-xl font-bold tabular-nums ${item.color ?? 'text-ui-strong'}`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 md:mb-8">
              <h3 className="mb-1 text-lg font-bold text-ui-strong md:text-xl">Allocation</h3>
              <p className="text-xs font-medium text-ui-muted-text">
                By asset class
                {allocation?.weightBy ? ` · ${allocation.weightBy}` : ''}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-8 md:gap-10">
              <div
                className="relative h-44 w-44 shrink-0 rounded-full p-[14px] shadow-inner shadow-black/5 md:h-48 md:w-48 md:p-4"
                style={{
                  background:
                    allocationGradient ??
                    'conic-gradient(from -90deg, rgb(148 163 184 / 0.25) 0deg 360deg)',
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-ui-card dark:bg-ui-card">
                  <p className="text-2xl font-bold tabular-nums text-ui-strong md:text-3xl">
                    {(allocation?.segments.length ?? 0) > 0 ? '100%' : '—'}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                    Total
                  </p>
                </div>
              </div>

              <div className="w-full space-y-3.5">
                {(allocation?.segments.length ?? 0) > 0 ? (
                  allocation!.segments.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 text-[12px]"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate font-medium text-ui-muted-text">
                          {item.label}
                        </span>
                      </div>
                      <span className="shrink-0 font-bold tabular-nums text-ui-strong">
                        {item.percent > 0
                          ? `${item.percent.toFixed(0)}%`
                          : formatCompactCurrency(item.value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs font-medium text-ui-muted-text">
                    No allocation data yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="min-w-0 rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] sm:p-6 md:rounded-[28px] md:p-9 xl:col-span-2 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-bold text-ui-strong md:text-xl">Recent Activity</h3>
              <button
                type="button"
                className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-dark"
              >
                View all <span aria-hidden>→</span>
              </button>
            </div>

            <div className="space-y-1">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={`${activity.id}-${activity.name}`}
                    className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-ui-border hover:bg-ui-muted-deep/80 sm:flex-row sm:items-center sm:gap-3 md:gap-5 md:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          activity.tone === 'amber'
                            ? 'bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                            : 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                        }`}
                      >
                        {activity.done ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <IconClock className="!h-5 !w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-0.5 line-clamp-2 text-[13px] font-bold leading-snug text-ui-strong sm:truncate sm:line-clamp-none">
                          {activity.name}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-faint">
                          {activity.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 sm:block sm:text-right">
                      <p className="text-[13px] font-bold text-ui-success-text sm:mb-0.5">
                        {activity.amount}
                      </p>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className="rounded bg-ui-muted-deep px-1.5 py-0.5 text-[8px] font-bold uppercase text-ui-muted-text">
                          {activity.region}
                        </span>
                        <p className="text-[10px] font-medium text-ui-placeholder">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs font-medium text-ui-muted-text">
                  No recent activity
                </p>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col rounded-[22px] border border-ui-border bg-ui-card p-5 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] sm:p-6 md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-bold text-ui-strong md:text-xl">Upcoming</h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-ui-border p-3.5 transition-all hover:border-primary/35 hover:bg-ui-muted-deep/50 md:gap-4 md:p-4"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-center md:h-12 md:w-12 md:rounded-2xl ${event.pillClass}`}
                    >
                      <p className="text-[8px] font-bold uppercase leading-none opacity-90">
                        {event.month}
                      </p>
                      <p className="text-sm font-bold leading-tight">{event.day}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-snug text-ui-strong xl:line-clamp-2">
                        {event.label}
                      </p>
                      <p className="text-[10px] font-medium text-ui-muted-text">
                        {event.subtitle}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="flex flex-1 flex-col items-center justify-center py-10 text-center text-xs font-medium text-ui-muted-text">
                  No upcoming events
                </p>
              )}
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-2xl border border-ui-border bg-ui-muted-deep/50 py-3.5 text-[11px] font-bold uppercase tracking-widest text-ui-muted-text transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary md:mt-8"
            >
              Full Calendar <span aria-hidden>→</span>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:pb-12">
          {[
            {
              href: '/issuer/tokenize-asset',
              label: 'Tokenize New Asset',
              sub: 'Start a new offering',
              Icon: IconNavSparkles,
              well: 'bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/35',
            },
            {
              href: '/issuer/hub',
              label: 'Issuer Hub',
              sub: 'Manage assets & raises',
              Icon: IconChartBar,
              well: 'bg-gradient-to-br from-qa-hub-from to-qa-hub-to shadow-lg shadow-indigo-500/25',
            },
            {
              href: '/issuer/yield',
              label: 'Yield Center',
              sub: 'Distributions & payouts',
              Icon: IconNavTrendingUp,
              well: 'bg-gradient-to-br from-qa-yield-from to-qa-yield-to shadow-lg shadow-amber-500/20',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col gap-5 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.14)] md:gap-6 md:rounded-[26px] md:p-7 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-200 group-hover:scale-[1.05] md:h-14 md:w-14 md:rounded-[18px] ${action.well}`}
              >
                <action.Icon className="!h-6 !w-6 text-white md:!h-7 md:!w-7" />
              </div>
              <div>
                <h4 className="mb-1 text-[13px] font-bold text-ui-strong md:text-sm">{action.label}</h4>
                <p className="text-[10px] font-medium leading-relaxed text-ui-muted-text md:text-[11px]">
                  {action.sub}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}
