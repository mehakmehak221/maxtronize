"use client";

import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { OverviewHero } from "@/components/dashboard/OverviewHero";
import type { KpiCard } from "@/components/dashboard/OverviewKpiGrid";
import { OverviewKpiGrid } from "@/components/dashboard/OverviewKpiGrid";
import InvestorLayout from "@/components/InvestorLayout";
import {
  IssuerStatIconBars,
  IssuerStatIconTrend,
  IssuerStatIconUsers,
  IssuerStatIconWallet,
  IconPulseActivity,
} from "@/components/IssuerNavIcons";
import {
  buildAllocationConicGradient,
  buildCapitalChartPaths,
} from "@/lib/issuerDashboard";
import {
  buildInvestorGreeting,
  formatCompactCurrency,
  formatOverviewDate,
  formatPercent,
  formatQuarterChangePercent,
  formatYieldPercent,
  type InvestorDashboardSummary,
} from "@/lib/investorDashboard";
import {
  useGetInvestorDashboardInitQuery,
  useGetInvestorDashboardAllocationQuery,
  useGetInvestorCapitalDeployedQuery,
  useGetInvestorRecentActivityQuery,
} from "@/store/api/investorDashboardApi";

const iconStroke = 1.75;
const MONTH_FALLBACK = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
];

function buildKpiCards(
  summary: InvestorDashboardSummary | undefined,
): KpiCard[] {
  if (!summary) return [];

  const currency = summary.portfolioValue.currency;
  const quarterChange = summary.quarterInvested.changePercent;
  const unrealized = summary.unrealizedGain;
  const dist = summary.distributionsReceived;

  return [
    {
      label: "Portfolio Value",
      val: formatCompactCurrency(summary.portfolioValue.amount, currency, {
        decimals: 0,
      }),
      trend: `${formatPercent(summary.annualReturnPercent)} annual`,
      sub: `${summary.activeHoldings} active holding${summary.activeHoldings === 1 ? "" : "s"}`,
      up: summary.annualReturnPercent >= 0,
      Icon: IssuerStatIconWallet,
      well: "bg-dash-kpi-violet-soft text-dash-kpi-violet-fg ring-1 ring-dash-kpi-violet-ring",
    },
    {
      label: "Total Invested",
      val: formatCompactCurrency(summary.totalInvested.amount, currency),
      trend: formatQuarterChangePercent(quarterChange),
      sub: "versus prior quarter",
      up: quarterChange === null || quarterChange >= 0,
      Icon: IssuerStatIconBars,
      well: "bg-dash-kpi-blue-soft text-dash-kpi-blue-fg ring-1 ring-dash-kpi-blue-ring",
    },
    {
      label: "Unrealized Gain",
      val: formatCompactCurrency(unrealized.amount, currency),
      trend: formatPercent(unrealized.percent),
      sub: "marked to market",
      up: unrealized.amount >= 0,
      Icon: IssuerStatIconTrend,
      well: "bg-dash-kpi-green-soft text-dash-kpi-green-fg ring-1 ring-dash-kpi-green-ring",
    },
    {
      label: "Distributions",
      val: formatCompactCurrency(dist.amount, dist.currency),
      trend: formatCompactCurrency(dist.quarterEstimate, dist.currency),
      sub: "estimated this quarter",
      up: true,
      Icon: IssuerStatIconUsers,
      well: "bg-dash-kpi-orange-soft text-dash-kpi-orange-fg ring-1 ring-dash-kpi-orange-ring",
    },
  ];
}

export default function InvestorOverviewPage() {
  const { data: init, isLoading: isInitLoading } =
    useGetInvestorDashboardInitQuery({ period: "9m" });
  const { data: directAllocation, isLoading: isAllocLoading } =
    useGetInvestorDashboardAllocationQuery();
  const { data: directCapitalDeployed, isLoading: isCapLoading } =
    useGetInvestorCapitalDeployedQuery({ period: "9m" });
  const { data: directRecentActivity, isLoading: isActLoading } =
    useGetInvestorRecentActivityQuery();

  const overview = init?.overview;
  const summary = init?.summary;
  const capitalDeployed = directCapitalDeployed ?? init?.capitalDeployed;
  const allocation = directAllocation ?? init?.allocation;
  const activities =
    directRecentActivity?.items ?? init?.recentActivity?.items ?? [];
  const upcomingEvents = init?.upcomingEvents ?? [];

  const isLoading =
    isInitLoading || isAllocLoading || isCapLoading || isActLoading;

  const kpiCards = useMemo(() => buildKpiCards(summary), [summary]);

  const currency =
    capitalDeployed?.currency ??
    allocation?.currency ??
    summary?.portfolioValue.currency ??
    "USD";

  const chart = useMemo(
    () => buildCapitalChartPaths(capitalDeployed?.series ?? [], currency),
    [capitalDeployed?.series, currency],
  );

  const allocationGradient = useMemo(
    () => buildAllocationConicGradient(allocation?.segments ?? []),
    [allocation?.segments],
  );

  const chartLabels = chart?.labels ?? MONTH_FALLBACK.slice(0, 9);
  const completionPercent = capitalDeployed?.completionPercent ?? 0;

  const heroValue = overview
    ? formatCompactCurrency(
        overview.hero.portfolioValue.amount,
        overview.hero.portfolioValue.currency,
        {
          decimals: 0,
        },
      )
    : isLoading
      ? "…"
      : "$0";

  const annualReturn = overview?.hero.annualReturnPercent ?? 0;
  const investmentCount = overview?.hero.composition.investmentCount ?? 0;
  const assetClassCount = overview?.hero.composition.assetClassCount ?? 0;

  const heroTokens =
    (init?.tokenTicker.length ?? 0) > 0
      ? init!.tokenTicker.map((t) => ({
          sym: t.sym,
          ch: t.change,
          dotClass: t.dotClass,
        }))
      : (overview?.activeTokens.length ?? 0) > 0
        ? overview!.activeTokens.map((t) => ({
            sym: t.sym,
            ch: t.change,
            dotClass: t.dotClass,
          }))
        : [];

  return (
    <InvestorLayout pageTitle="Investor Overview">
      <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8 md:space-y-10">
        <OverviewHero
          greeting={buildInvestorGreeting(overview)}
          date={
            overview
              ? formatOverviewDate(overview.greeting.asOf)
              : isLoading
                ? "…"
                : formatOverviewDate(new Date().toISOString())
          }
          value={heroValue}
          subtitle="Total portfolio value across all investments"
          badges={[
            {
              type: annualReturn >= 0 ? "positive" : "neutral",
              text: `${formatPercent(annualReturn)} Annual Return`,
            },
            {
              type: "neutral",
              text: `${investmentCount} investment${investmentCount === 1 ? "" : "s"} · ${assetClassCount} asset class${assetClassCount === 1 ? "" : "es"}`,
            },
          ]}
          pillars={[
            {
              label: "Monthly Income",
              value: overview
                ? formatCompactCurrency(
                    overview.quickStats.monthlyIncome.amount,
                    overview.quickStats.monthlyIncome.currency,
                  )
                : isLoading
                  ? "…"
                  : "$0",
              Icon: Wallet,
            },
            {
              label: "Active Positions",
              value: String(overview?.quickStats.activePositions ?? 0),
              Icon: IconPulseActivity,
            },
            {
              label: "Average Yield",
              value: formatYieldPercent(
                overview?.quickStats.averageYieldPercent,
              ),
              Icon: TrendingUp,
            },
          ]}
          tokens={heroTokens}
        />

        {kpiCards.length > 0 ? (
          <OverviewKpiGrid cards={kpiCards} />
        ) : isLoading ? (
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
          <div className="xl:col-span-2 overflow-hidden rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-center">
              <div>
                <h3 className="mb-1 text-lg font-bold text-ui-strong md:text-xl">
                  Capital Deployed
                </h3>
                <p className="text-base font-medium text-ui-muted-text">
                  Cumulative vs. target · {currency}
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-ui-muted-text">
                    Actual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0 w-4 border-t-2 border-dashed border-ui-border-strong" />
                  <span className="text-xs font-bold uppercase tracking-widest text-ui-muted-text">
                    Target
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-2 h-52 motion-chart md:h-64">
              {isLoading ? (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-ui-border bg-ui-muted-deep/40 animate-pulse" />
              ) : chart ? (
                <>
                  {/* Y-Axis Labels */}
                  <div className="absolute bottom-0 left-0 top-0 w-12">
                    {[
                      { label: chart.yLabels[0], top: "12%" },
                      { label: chart.yLabels[1], top: "29.5%" },
                      { label: chart.yLabels[2], top: "47%" },
                      { label: chart.yLabels[3], top: "64.5%" },
                      { label: chart.yLabels[4], top: "82%" },
                    ].map((item, idx) => (
                      <span
                        key={idx}
                        className="absolute left-0 -translate-y-1/2 text-xs font-bold text-ui-placeholder"
                        style={{ top: item.top }}
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="absolute inset-y-0 left-12 right-0">
                    {/* Horizontal Gridlines */}
                    <div className="pointer-events-none absolute inset-0">
                      {[12, 29.5, 47, 64.5, 82].map((top) => (
                        <div
                          key={top}
                          className="absolute left-0 right-0 border-t border-dashed border-ui-divider"
                          style={{ top: `${top}%` }}
                        />
                      ))}
                    </div>

                    <svg
                      className="absolute inset-0 h-full w-full text-primary"
                      viewBox="0 0 1000 100"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <defs>
                        <linearGradient
                          id="inv-capital-area"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity="0.35"
                          />
                          <stop
                            offset="55%"
                            stopColor="#8b5cf6"
                            stopOpacity="0.08"
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path d={chart.areaPath} fill="url(#inv-capital-area)" />
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
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-ui-border bg-ui-muted-deep/40">
                  <p className="text-base font-medium text-ui-muted-text">
                    No capital deployed data for this period
                  </p>
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-between overflow-x-auto pl-12 pr-0.5 pb-1">
              {chartLabels.map((m) => (
                <span
                  key={m}
                  className="text-xs font-bold uppercase tracking-widest text-ui-placeholder"
                >
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-ui-divider pt-8 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  label: "Current Month",
                  val: formatCompactCurrency(
                    capitalDeployed?.currentMonth ?? 0,
                    currency,
                  ),
                },
                {
                  label: "Target Gap",
                  val: formatCompactCurrency(
                    capitalDeployed?.targetGap ?? 0,
                    currency,
                  ),
                },
                {
                  label: "Completion",
                  val: `${completionPercent.toFixed(1)}%`,
                  color: "text-ui-success-text",
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ui-faint">
                    {item.label}
                  </p>
                  <p
                    className={`text-xl font-bold tabular-nums ${item.color ?? "text-ui-strong"}`}
                  >
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 md:mb-8">
              <h3 className="mb-1 text-lg font-bold text-ui-strong md:text-xl">
                Allocation
              </h3>
              <p className="text-base font-medium text-ui-muted-text">
                By asset class
                {allocation?.weightBy ? ` · ${allocation.weightBy}` : ""}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-8 md:gap-10">
              <div
                className="relative h-44 w-44 shrink-0 rounded-full p-[14px] shadow-inner shadow-black/5 md:h-48 md:w-48 md:p-4"
                style={{
                  background:
                    allocationGradient ??
                    "conic-gradient(from -90deg, rgb(148 163 184 / 0.25) 0deg 360deg)",
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-ui-card">
                  <p className="text-2xl font-bold tabular-nums text-ui-strong md:text-3xl">
                    {(allocation?.segments.length ?? 0) > 0 ? "100%" : "0%"}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-ui-faint">
                    Total
                  </p>
                </div>
              </div>

              <div className="w-full space-y-3.5">
                {(allocation?.segments.length ?? 0) > 0 ? (
                  allocation!.segments.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 text-sm"
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
                          : formatCompactCurrency(item.value, currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-base font-medium text-ui-muted-text">
                    No allocation data yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="xl:col-span-2 rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between md:mb-8">
              <div>
                <h3 className="text-lg font-bold text-ui-strong md:text-xl">
                  Recent Activity
                </h3>
                <p className="mt-0.5 text-base font-medium text-ui-muted-text">
                  Capital flows & distributions
                </p>
              </div>
              <Link
                href="/investor/hub?tab=transactions"
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
              >
                View all
                <ChevronRight className="h-4 w-4" strokeWidth={iconStroke} />
              </Link>
            </div>

            <div className="space-y-1">
              {activities.length > 0 ? (
                activities.map((item) => (
                  <div
                    key={`${item.id}-${item.name}`}
                    className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-transparent p-4 transition-colors hover:border-ui-border hover:bg-ui-muted-deep/80 sm:flex-row sm:items-center md:gap-5 md:p-5"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-11 md:w-11 ${
                        item.done
                          ? "bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                          : "bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                      }`}
                    >
                      {item.done ? (
                        <CheckCircle2
                          className="h-5 w-5"
                          strokeWidth={iconStroke}
                        />
                      ) : (
                        <Clock className="h-5 w-5" strokeWidth={iconStroke} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 truncate text-base font-bold text-ui-strong">
                        {item.name}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ui-faint">
                        {item.id}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 sm:block sm:text-right">
                      <p className="text-base font-bold text-ui-success-text sm:mb-0.5">
                        {item.amount}
                      </p>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className="rounded bg-ui-muted-deep px-1.5 py-0.5 text-[8px] font-bold uppercase text-ui-muted-text">
                          {item.region}
                        </span>
                        <p className="text-xs font-medium text-ui-placeholder">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-base font-medium text-ui-muted-text">
                  No recent activity
                </p>
              )}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[28px] md:p-9 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between md:mb-8">
              <div>
                <h3 className="text-lg font-bold text-ui-strong md:text-xl">
                  Upcoming
                </h3>
                <p className="mt-0.5 text-base font-medium text-ui-muted-text">
                  Deadlines & events
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" strokeWidth={iconStroke} />
              </div>
            </div>

            <div className="flex flex-1 flex-col space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-ui-border p-3.5 transition-all hover:border-primary/35 hover:bg-ui-muted-deep/50 md:gap-4 md:p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-primary md:h-12 md:w-12 md:rounded-2xl">
                      <Calendar
                        className="h-5 w-5 md:h-6 md:w-6"
                        strokeWidth={iconStroke}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-ui-strong">
                        {event.title}
                      </p>
                      <p className="text-xs font-medium text-ui-muted-text">
                        {event.assetTitle}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-base font-medium text-ui-muted-text">
                  No upcoming events
                </p>
              )}
            </div>

            <Link
              href="/investor/hub?tab=overview"
              className="mt-6 flex w-full items-center justify-center gap-1 rounded-2xl border border-ui-border bg-ui-muted-deep/50 py-3.5 text-xs font-bold uppercase tracking-widest text-ui-muted-text transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary md:mt-8"
            >
              Full Calendar
              <ChevronRight className="h-4 w-4" strokeWidth={iconStroke} />
            </Link>
          </div>
        </section>
      </div>
    </InvestorLayout>
  );
}
