'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useMemo, useState, type ComponentType, type SVGProps } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import { formatRequestError } from '@/lib/formatRequestError';
import { formatPercent } from '@/lib/investorDashboard';
import {
  buildMonthlyEarningsChartPaths,
  formatChartCurrency as formatOverviewChartCurrency,
  formatOverviewTrendChange,
  formatOverviewTrendPercent,
} from '@/lib/investorHubOverview';
import { sectorIconClass } from '@/lib/investorHoldings';
import { filterTransactionsByDisplayType } from '@/lib/investorHubTransactions';
import {
  buildAllocationConicGradient,
  formatCompactCurrency,
} from '@/lib/issuerDashboard';
import { HubAnalyticsTab } from '@/components/hub/HubAnalyticsTab';
import { ComingSoonModal } from '@/components/issuer/ComingSoonModal';
import { InvestorHubDistributionsTab } from '@/components/investor/InvestorHubDistributionsTab';
import { InvestorHubInvestmentDocumentsTab } from '@/components/investor/InvestorHubInvestmentDocumentsTab';
import {
  useGetInvestorHubOverviewInitQuery,
  useGetInvestorHubOverviewMonthlyEarningsQuery
} from '@/store/api/investorHubOverviewApi';
import { useListInvestorHoldingsQuery } from '@/store/api/investorHoldingsApi';
import { useGetInvestorHubTabsQuery } from '@/store/api/investorHubTabsApi';
import {
  useListInvestorHubTransactionsQuery,
  useGetInvestorHubTransactionFiltersQuery,
  useExportInvestorHubTransactionsMutation,
} from '@/store/api/investorHubTransactionsApi';
import {
  AnalyticIcon,
  AssetIntelligenceIcon,
  BuyIcon,
  Document,
  DistributionsIcon,
  Help,
  IncomeIcon,
  InvestmentIcon,
  LexaAiIcon,
  Overview,
  OverviewHeroPulse,
  PendingIcon,
  ReturnIcon,
  SecondaryMarket,
  SellIcon,
  SuccessIcon,
  YieldIcon,
} from '@/app/VectorImages';

type TabType = 'overview' | 'investments' | 'transactions' | 'distributions' | 'documents' | 'analytics' | 'lexa' | 'asset-intelligence';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

const OVERVIEW_PERIOD = '9m';

const TAB_KEY_MAP: Record<string, TabType> = {
  OVERVIEW: 'overview',
  MY_INVESTMENTS: 'investments',
  TRANSACTIONS: 'transactions',
  DISTRIBUTIONS: 'distributions',
  DOCUMENTS: 'documents',
  ANALYTICS: 'analytics',
  LEXA_AI: 'lexa',
  ASSET_INTELLIGENCE: 'asset-intelligence',
};

function InvestorHubContent() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonTab, setComingSoonTab] = useState<TabType | null>(null);

  useEffect(() => {
    if (!requestedTab) return;
    const validTab = requestedTab as TabType;
    if (
      validTab === 'overview' ||
      validTab === 'investments' ||
      validTab === 'transactions' ||
      validTab === 'distributions' ||
      validTab === 'documents' ||
      validTab === 'analytics' ||
      validTab === 'lexa' ||
      validTab === 'asset-intelligence'
    ) {
      setActiveTab(validTab);
      if (validTab === 'lexa' || validTab === 'asset-intelligence') {
        setComingSoonTab(validTab);
        setShowComingSoon(true);
      }
    }
  }, [requestedTab]);

  const comingSoonDetails = useMemo(() => {
    if (comingSoonTab === 'lexa') {
      return {
        title: 'Lexa AI Legal Assistant',
        description: 'Lexa is launching soon. Your AI-powered legal and compliance advisor will be available here to answer questions about tax implications, regulatory requirements, and investment structures.',
        dismissNote: 'You can still explore the preview below — full access will unlock at launch.',
      };
    }
    if (comingSoonTab === 'asset-intelligence') {
      return {
        title: 'AI Asset Intelligence',
        description: 'AI Asset Intelligence is launching soon. Predictive analytics, market insights, and AI-powered recommendations will be available here to optimize your investment portfolio.',
        dismissNote: 'You can still explore the preview below — full access will unlock at launch.',
      };
    }
    return {
      title: 'Coming Soon',
      description: 'This feature is launching soon.',
      dismissNote: 'You can still explore the preview below.',
    };
  }, [comingSoonTab]);


  const { data: hubTabsData } = useGetInvestorHubTabsQuery();


  const [txSearch, setTxSearch] = useState('');
  const [txType, setTxType] = useState('');
  const [txPage, setTxPage] = useState(1);
  const { data: txResult, isLoading: txLoading } = useListInvestorHubTransactionsQuery({
    page: txPage,
    limit: 20,
    search: txSearch || undefined,
    displayType: txType || undefined,
  });
  const { data: txFilters } = useGetInvestorHubTransactionFiltersQuery();
  const [exportTx, { isLoading: exportLoading }] = useExportInvestorHubTransactionsMutation();

  const filteredTransactions = useMemo(
    () => filterTransactionsByDisplayType(txResult?.data ?? [], txType),
    [txResult?.data, txType],
  );
  const serverAppliedTypeFilter =
    !txType ||
    filteredTransactions.length === (txResult?.data?.length ?? 0);
  const transactionCount = serverAppliedTypeFilter
    ? (txResult?.pagination.total ?? filteredTransactions.length)
    : filteredTransactions.length;

  const {
    data: overviewInit,
    isLoading: overviewLoading,
    error: overviewError,
  } = useGetInvestorHubOverviewInitQuery({ period: OVERVIEW_PERIOD });

  const { data: directMonthlyEarnings, isLoading: earningsLoading } = useGetInvestorHubOverviewMonthlyEarningsQuery({ period: OVERVIEW_PERIOD });

  const { data: holdingsResult, isLoading: holdingsLoading, error: holdingsError } =
    useListInvestorHoldingsQuery({ page: 1, limit: 50 });
  const holdings = holdingsResult?.items ?? [];
  const holdingsTotal = holdingsResult?.pagination.total ?? holdings.length;

  const investments = useMemo(
    () =>
      holdings.map((h) => ({
        id: h.id,
        assetId: h.assetId,
        name: h.name,
        ticker: h.ticker,
        sector: h.sector,
        Icon: SuccessIcon,
        iconBg: sectorIconClass(h.sector),
        currentVal: h.currentValueFormatted,
        gain: h.gainFormatted,
        gainPct: h.gainPercentFormatted,
        invested: h.investedFormatted,
        status: h.status,
        up: h.up,
      })),
    [holdings],
  );

  const TAB_ICONS: Record<TabType, NavSvg> = {
    overview: Overview,
    investments: InvestmentIcon,
    transactions: SecondaryMarket,
    distributions: DistributionsIcon,
    documents: Document,
    analytics: AnalyticIcon,
    lexa: LexaAiIcon,
    'asset-intelligence': AssetIntelligenceIcon,
  };


  const tabs: { id: TabType; label: string; Icon: NavSvg; count?: number; badge?: string }[] =
    hubTabsData?.tabs.length
      ? hubTabsData.tabs
        .map((t) => ({
          id: TAB_KEY_MAP[t.key] as TabType,
          label: t.label,
          Icon: TAB_ICONS[TAB_KEY_MAP[t.key] as TabType] ?? Overview,
          count: t.count ?? undefined,
          badge: t.badge ?? undefined,
        }))
        .filter((t) => t.id)
      : [
        { id: 'overview' as TabType, label: 'Overview', Icon: Overview },
        { id: 'investments' as TabType, label: 'My Investments', Icon: InvestmentIcon, count: holdingsTotal || undefined },
        { id: 'transactions' as TabType, label: 'Transactions', Icon: SecondaryMarket },
        { id: 'distributions' as TabType, label: 'Distributions', Icon: DistributionsIcon },
        { id: 'documents' as TabType, label: 'Documents', Icon: Document },
        { id: 'analytics' as TabType, label: 'Analytics', Icon: AnalyticIcon },
        { id: 'lexa' as TabType, label: 'Lexa AI', Icon: LexaAiIcon, badge: 'AI' },
        { id: 'asset-intelligence' as TabType, label: 'Asset Intelligence', Icon: AssetIntelligenceIcon },
      ];


  function txIconProps(type: string): { Icon: NavSvg; iconBg: string } {
    const t = type.toUpperCase();
    if (t === 'BUY') return { Icon: BuyIcon, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' };
    if (t === 'SELL') return { Icon: SellIcon, iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400' };
    return { Icon: YieldIcon, iconBg: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400' };
  }

  const overviewHeader = overviewInit?.header;
  const overviewSummary = overviewInit?.summary;
  const monthlyEarnings = directMonthlyEarnings ?? overviewInit?.monthlyEarnings;
  const overviewAllocation = overviewInit?.allocation;

  const statsOverview = useMemo(() => {
    const s = overviewSummary;
    return [
      {
        label: 'Monthly Income',
        val: overviewLoading
          ? '…'
          : formatCompactCurrency(
            s?.monthlyIncome.amount ?? 0,
            s?.monthlyIncome.currency ?? 'USD',
            { decimals: 0 },
          ),
        sub: s?.monthlyIncome.summary || 'Passive earnings',
        trend: formatOverviewTrendPercent(s?.monthlyIncome.changePercent ?? null),
        Icon: IncomeIcon,
        up: (s?.monthlyIncome.changePercent ?? 0) >= 0,
        iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
      },
      {
        label: 'Annual Return',
        val: overviewLoading ? '…' : formatPercent(s?.annualReturn.percent ?? 0),
        sub: s?.annualReturn.summary || 'YTD performance',
        trend: formatOverviewTrendPercent(s?.annualReturn.changePercent ?? null),
        Icon: AnalyticIcon,
        up: (s?.annualReturn.changePercent ?? 0) >= 0,
        iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
      },
      {
        label: 'Active Investments',
        val: overviewLoading ? '…' : String(s?.activeInvestments.count ?? 0),
        sub: s?.activeInvestments.summary || 'Across your portfolio',
        trend: formatOverviewTrendChange(s?.activeInvestments.change ?? 0),
        Icon: OverviewHeroPulse,
        up: (s?.activeInvestments.change ?? 0) >= 0,
        iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
      },
      {
        label: 'Pending Approvals',
        val: overviewLoading ? '…' : String(s?.pendingApprovals.count ?? 0),
        sub:
          (s?.pendingApprovals.count ?? 0) > 0
            ? 'Awaiting compliance decision'
            : 'No items pending',
        statusTag:
          (s?.pendingApprovals.count ?? 0) > 0
            ? s?.pendingApprovals.summary || 'In review'
            : '',
        trend: '',
        Icon: PendingIcon,
        up: false,
        iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
      },
    ];
  }, [overviewLoading, overviewSummary]);

  const earningsChart = useMemo(
    () => buildMonthlyEarningsChartPaths(monthlyEarnings?.series ?? []),
    [monthlyEarnings?.series],
  );

  const earningsYLabels = useMemo(() => {
    const series = monthlyEarnings?.series ?? [];
    const max = Math.max(...series.flatMap((p) => [p.earnings, p.passive]), 1);
    const currency = monthlyEarnings?.currency ?? 'USD';
    return [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
      formatOverviewChartCurrency(max * ratio, currency),
    );
  }, [monthlyEarnings]);

  const allocationGradient = useMemo(
    () => buildAllocationConicGradient(overviewAllocation?.segments ?? []),
    [overviewAllocation?.segments],
  );

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const earningsMonthLabels =
    earningsChart?.labels.length ? earningsChart.labels : months;


  const renderOverview = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {overviewError ? (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-base text-rose-700" role="alert">
          {formatRequestError(overviewError)}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 md:gap-6 2xl:grid-cols-4">
        {statsOverview.map((stat, i) => (
          <div
            key={i}
            className="flex h-full min-h-[148px] flex-col rounded-[20px] border border-ui-border bg-ui-card p-4 shadow-sm transition-shadow hover:shadow-md md:rounded-[24px] md:p-6"
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11 ${stat.iconBg}`}
              >
                <stat.Icon className="h-5 w-5" />
              </div>
              {'statusTag' in stat && stat.statusTag ? (
                <span className="inline-flex max-w-[52%] items-center justify-center rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950/35 dark:text-amber-300 md:text-[10px]">
                  {stat.statusTag}
                </span>
              ) : stat.trend ? (
                <span
                  className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold md:text-[10px] ${stat.up ? 'bg-green-50 text-green-600 dark:bg-green-950/35 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/35 dark:text-amber-400'
                    }`}
                >
                  <ReturnIcon className="h-3 w-3 shrink-0" />
                  {stat.trend}
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-1 flex-col justify-start">
              <p className="text-xl font-bold tracking-tight text-ui-strong md:text-2xl lg:text-3xl">{stat.val}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{stat.label}</p>
              <p className="mt-0.5 text-xs font-medium text-ui-faint">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 md:gap-8">
        {/* Earnings Chart */}
        <div className="xl:col-span-2 bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-base font-bold text-ui-strong">Monthly Earnings</h3>
              <p className="text-base text-ui-faint mt-0.5">
                Earnings vs. passive income · {monthlyEarnings?.currency ?? 'USD'}
              </p>
            </div>
            <div className="flex gap-5">
              {[
                ['Earnings', 'bg-primary'],
                ['Passive', 'bg-blue-400'],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-2">
                  <div className={`h-1 w-6 rounded-full ${c}`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Y-axis + chart */}
          <div className="relative h-48 md:h-56">
            <div className="absolute bottom-0 left-0 top-0 flex flex-col justify-between text-[9px] font-medium text-ui-placeholder">
              {earningsYLabels.map((l, i) => (
                <span key={`${l}-${i}`}>{l}</span>
              ))}
            </div>
            <div className="absolute inset-y-0 left-8 right-0 motion-chart">
              {earningsLoading ? (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-ui-border bg-ui-muted-deep/40 animate-pulse" />
              ) : earningsChart ? (
                <>
                  <svg className="absolute inset-0 h-full w-full text-primary" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
                    <defs>
                      <linearGradient id="hub-earnings-area-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={earningsChart.areaPath} fill="url(#hub-earnings-area-fill)" />
                    <path
                      d={earningsChart.earningsPath}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full text-blue-500"
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d={earningsChart.passivePath}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                  </svg>
                </>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-ui-border bg-ui-muted-deep/40">
                  <p className="text-base font-medium text-ui-muted-text">No earnings data for this period</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4 pl-8 overflow-x-auto pb-1">
            {earningsMonthLabels.map((m) => (
              <span key={m} className="text-[9px] font-bold text-ui-placeholder uppercase tracking-widest">{m}</span>
            ))}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="flex flex-col rounded-[24px] border border-ui-border bg-ui-card p-6 shadow-sm md:rounded-[32px] md:p-10">
          <h3 className="text-base font-bold text-ui-strong mb-1">Asset Allocation</h3>
          <p className="text-base text-ui-faint mb-6">By investment type</p>
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              className="relative h-36 w-36 motion-chart rounded-full md:h-40 md:w-40"
              style={{
                background:
                  allocationGradient ??
                  'conic-gradient(from -90deg, rgb(148 163 184 / 0.25) 0deg 360deg)',
              }}
            >
              <div className="absolute inset-[18%] flex items-center justify-center rounded-full bg-ui-card">
                <span className="text-lg font-bold text-ui-strong md:text-xl">
                  {(overviewAllocation?.segments.length ?? 0) > 0 ? '100%' : '—'}
                </span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {(overviewAllocation?.segments.length ?? 0) > 0 ? (
                overviewAllocation!.segments.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-medium text-ui-muted-text">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-ui-strong">
                      {item.percent > 0 ? `${Math.round(item.percent)}%` : '—'}
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
      </div>
    </div>
  );

  const renderInvestments = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="mb-2">
        <h3 className="text-base font-bold text-ui-strong">All Investments</h3>
        <p className="text-base text-ui-faint mt-0.5">
          {holdingsLoading ? 'Loading…' : `${holdingsTotal} active position${holdingsTotal === 1 ? '' : 's'}`}
        </p>
      </div>
      {holdingsError ? (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-base text-rose-700" role="alert">
          {formatRequestError(holdingsError)}
        </p>
      ) : null}
      {holdingsLoading ? (
        <p className="rounded-2xl border border-ui-border bg-ui-card px-6 py-12 text-center text-base font-medium text-ui-faint animate-pulse">
          Loading investments…
        </p>
      ) : investments.length === 0 ? (
        <p className="rounded-2xl border border-ui-border bg-ui-card px-6 py-12 text-center text-base font-medium text-ui-faint">
          No holdings yet.
        </p>
      ) : null}
      {investments.map((inv) => {
        const card = (
          <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] p-5 md:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            {/* Top row */}
            <div className="flex items-center justify-between gap-4 mb-5 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 ${inv.iconBg}`}>
                  <inv.Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h4 className="text-base md:text-base font-bold text-ui-strong group-hover:text-primary transition-colors">{inv.name}</h4>
                  <p className="text-xs text-ui-faint font-medium uppercase tracking-widest">{inv.ticker} · {inv.sector}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg md:text-2xl font-bold text-ui-strong">{inv.currentVal}</p>
                <p className={`text-xs md:text-base font-bold flex items-center justify-end gap-1 ${inv.up ? 'text-green-500' : 'text-red-500'}`}>
                  <span>{inv.up ? '↗' : '↙'}</span> {inv.gainPct}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 md:gap-8 border-t border-ui-divider pt-5 md:pt-6">
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Invested</p>
                <p className="text-base md:text-base font-bold text-ui-strong">{inv.invested}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Gain / Loss</p>
                <p className={`text-base md:text-base font-bold ${inv.up ? 'text-green-500' : 'text-red-500'}`}>{inv.gain}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Status</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:border-emerald-800/60 dark:bg-emerald-950/45 dark:text-emerald-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {inv.status}
                </span>
              </div>
            </div>
          </div>
        );
        if (inv.assetId) {
          return (
            <Link key={inv.id} href={`/investor/asset-detail?id=${encodeURIComponent(inv.assetId)}`} className="block">
              {card}
            </Link>
          );
        }
        return <div key={inv.id}>{card}</div>;
      })}
    </div>
  );

  const renderTransactions = () => {
    const rows = filteredTransactions;
    const pagination = txResult?.pagination;
    return (
      <div className="animate-in fade-in duration-500 space-y-4">
        <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] shadow-sm overflow-hidden">
          <div className="p-5 md:p-8 border-b border-ui-divider flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-ui-strong">Transaction History</h3>
              <p className="text-base text-ui-faint mt-0.5">
                {txLoading ? 'Loading…' : `${transactionCount} transaction${transactionCount === 1 ? '' : 's'}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <input
                value={txSearch}
                onChange={e => { setTxSearch(e.target.value); setTxPage(1); }}
                placeholder="Search…"
                className="px-3 py-2 border border-ui-border rounded-xl text-sm font-medium bg-ui-muted-deep outline-none focus:ring-2 focus:ring-primary/10 w-36"
              />
              {/* Type filter */}
              {(txFilters?.displayTypes.length ?? 0) > 0 && (
                <select
                  value={txType}
                  onChange={e => { setTxType(e.target.value); setTxPage(1); }}
                  className="px-3 py-2 border border-ui-border rounded-xl text-sm font-medium bg-ui-muted-deep outline-none focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">All Types</option>
                  {txFilters!.displayTypes.map(dt => (
                    <option key={dt.key} value={dt.key}>{dt.label}</option>
                  ))}
                </select>
              )}
              {/* Export */}
              <button
                onClick={() => exportTx({ search: txSearch || undefined, displayType: txType || undefined })}
                disabled={exportLoading}
                className="flex items-center gap-2 px-4 py-2 border border-ui-border rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {exportLoading ? 'Exporting…' : 'Export'}
              </button>
            </div>
          </div>

          {txLoading ? (
            <div className="divide-y divide-ui-divider">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 md:px-8 py-4 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-ui-muted-deep shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 rounded bg-ui-muted-deep" />
                    <div className="h-2 w-24 rounded bg-ui-muted-deep" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-3 w-16 rounded bg-ui-muted-deep" />
                    <div className="h-2 w-20 rounded bg-ui-muted-deep" />
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-base font-medium text-ui-faint">
              No transactions found.
            </p>
          ) : (
            <div className="divide-y divide-ui-divider">
              {rows.map((tx) => {
                const { Icon, iconBg } = txIconProps(tx.type);
                return (
                  <div key={tx.id} className="flex items-center gap-3 md:gap-6 px-5 md:px-8 py-4 md:py-5 hover:bg-ui-muted-surface transition-colors group cursor-pointer">
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-ui-strong group-hover:text-primary transition-colors truncate">{tx.assetName}</p>
                      <p className="text-xs text-ui-faint font-medium uppercase tracking-widest">{tx.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-base md:text-base font-bold ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {tx.amountFormatted}
                      </p>
                      <p className="text-xs text-ui-faint font-medium">{tx.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {(pagination?.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-between">
            <button
              disabled={!pagination?.hasPreviousPage}
              onClick={() => setTxPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-ui-border text-sm font-bold text-ui-muted-text disabled:opacity-40 hover:bg-ui-muted-deep transition-colors"
            >
              ← Previous
            </button>
            <span className="text-sm font-medium text-ui-faint">
              Page {pagination?.page} of {pagination?.totalPages}
            </span>
            <button
              disabled={!pagination?.hasNextPage}
              onClick={() => setTxPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-ui-border text-sm font-bold text-ui-muted-text disabled:opacity-40 hover:bg-ui-muted-deep transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    );
  }


  const renderAnalytics = () => <HubAnalyticsTab variant="investor" />;

  const [lexaInput, setLexaInput] = React.useState('');
  const chatMessages = [
    { role: 'user', text: 'What are the tax implications of receiving yield distributions?' },
    { role: 'ai', text: 'Yield distributions from tokenized real estate assets are typically treated as ordinary income and reported on Form 1099-DIV. The specific tax treatment depends on:\n\n1. **Asset Type**: Real estate yields may qualify for REIT-like treatment  2. **Holding Period**: Long-term vs short-term capital gains  3. **Jurisdiction**: Your tax residency and where the asset is located\n\nI recommend consulting with a tax professional for personalized advice. Would you like me to generate a tax estimation report for your current holdings?' },
    { role: 'user', text: 'Yes, please generate that report.' },
    { role: 'ai', text: "I'll prepare a comprehensive tax estimation report based on your current portfolio. This will include estimated tax liabilities for each asset class and suggested withholding strategies. The report will be ready in your Documents tab within 2–3 minutes." },
  ];

  const renderLexa = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-purple-500 rounded-[20px] md:rounded-[28px] p-6 md:p-8 text-white flex items-center gap-5">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-ui-card/10 border border-background/20 flex items-center justify-center shrink-0 text-white">
          <LexaAiIcon className="h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">Lexa Legal Assistant</h3>
          <p className="text-white/70 text-base md:text-base mt-1 leading-relaxed">Your AI-powered legal and compliance advisor. Ask questions about tax implications, regulatory requirements, investment structures, and legal documentation.</p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-ui-divider">
          <h4 className="text-base font-bold text-ui-strong">Conversation</h4>
        </div>
        <div className="p-4 md:p-6 space-y-5 max-h-[420px] overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 ${msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-ui-muted-deep text-ui-muted-text'
                }`}>
                {msg.role === 'ai' ? <LexaAiIcon className="h-4 w-4" /> : <span className="text-xs font-bold">You</span>}
              </div>
              <div className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl text-base font-medium leading-relaxed ${msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-none'
                : 'bg-ui-muted-deep text-ui-body rounded-tl-none'
                }`}>
                {msg.text.split('\n').map((line, j) => <p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p>)}
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="p-4 md:p-5 border-t border-ui-divider flex gap-3">
          <input
            type="text"
            value={lexaInput}
            onChange={e => setLexaInput(e.target.value)}
            placeholder="Ask Lexa about legal or compliance matters…"
            className="flex-1 px-4 py-3 bg-ui-muted-deep border border-ui-border rounded-2xl text-base font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
          />
          <button className="px-5 py-3 bg-primary text-white rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderAssetIntelligence = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-purple-500 rounded-[20px] md:rounded-[28px] p-6 md:p-8 text-white flex items-center gap-5">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-ui-card/10 border border-background/20 flex items-center justify-center shrink-0 text-white">
          <AssetIntelligenceIcon className="h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">AI Asset Intelligence</h3>
          <p className="text-white/70 text-base md:text-base mt-1 leading-relaxed">Predictive analytics, market insights, and AI-powered recommendations for your investment portfolio.</p>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="space-y-4">
        {[
          {
            title: 'Prime Office Tower Undervalued',
            desc: 'Market analysis suggests 12–15% upside based on comparable NYC properties and recent transactions.',
            confidence: 92,
            confidenceColor: 'text-green-500',
            action: 'Consider increasing position',
            actionColor:
              'bg-green-50 text-green-600 border-green-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
            Icon: AssetIntelligenceIcon,
            iconBg: 'bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-300',
          },
          {
            title: 'Solar Farm Revenue Forecast',
            desc: 'Energy price trends and grid demand indicate 8–10% yield increase over next 12 months.',
            confidence: 87,
            confidenceColor: 'text-primary',
            action: 'Monitor quarterly',
            actionColor: 'bg-primary/5 text-primary border-primary/10 dark:bg-primary/15 dark:text-primary dark:border-primary/25',
            Icon: AnalyticIcon,
            iconBg: 'bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-300',
          },
          {
            title: 'Copper Price Volatility Risk',
            desc: 'Mining royalty asset exposed to commodity price swings. Consider hedging or rebalancing.',
            confidence: 78,
            confidenceColor: 'text-amber-500',
            action: 'Review allocation',
            actionColor:
              'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
            Icon: Help,
            iconBg: 'bg-orange-50 text-orange-400 dark:bg-orange-950/40 dark:text-orange-300',
          },
        ].map((insight, i) => (
          <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${insight.iconBg}`}>
                <insight.Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h4 className="text-base md:text-base font-bold text-ui-strong">{insight.title}</h4>
                  <span className={`text-xs font-bold shrink-0 flex items-center gap-1.5 ${insight.confidenceColor}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {insight.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm md:text-[13px] text-ui-muted-text font-medium leading-relaxed">{insight.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-14">
              <button
                type="button"
                onClick={() => {
                  setComingSoonTab('asset-intelligence');
                  setShowComingSoon(true);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border hover:opacity-80 active:scale-95 transition-all ${insight.actionColor}`}
              >
                {insight.action}
              </button>
              <button
                type="button"
                onClick={() => {
                  setComingSoonTab('asset-intelligence');
                  setShowComingSoon(true);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-ui-faint hover:text-primary transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabContent: Record<TabType, React.ReactNode> = {
    overview: renderOverview(),
    investments: renderInvestments(),
    transactions: renderTransactions(),
    distributions: <InvestorHubDistributionsTab />,
    documents: <InvestorHubInvestmentDocumentsTab />,
    analytics: renderAnalytics(),
    lexa: renderLexa(),
    'asset-intelligence': renderAssetIntelligence(),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <ComingSoonModal
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title={comingSoonDetails.title}
        description={comingSoonDetails.description}
        dismissNote={comingSoonDetails.dismissNote}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Investor Hub</h1>
          <p className="text-base text-ui-faint mt-1 font-medium">Manage your portfolio, track performance, and access AI-powered insights</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-bold text-ui-faint uppercase tracking-widest mb-1">Total Portfolio Value</p>
          <p className="text-2xl md:text-4xl font-bold text-ui-strong">
            {overviewLoading
              ? '…'
              : formatCompactCurrency(
                overviewHeader?.totalPortfolioValue.amount ?? 0,
                overviewHeader?.totalPortfolioValue.currency ?? 'USD',
                { decimals: 0 },
              )}
          </p>
          <p
            className={`text-base font-bold flex items-center justify-end gap-1 mt-1 ${(overviewHeader?.annualReturnPercent ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
          >
            <ReturnIcon className="h-4 w-4 shrink-0" />
            {overviewLoading
              ? '…'
              : `${formatPercent(overviewHeader?.annualReturnPercent ?? 0)} Annual`}
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-ui-border overflow-x-auto scrollbar-hide -mx-4 md:-mx-0">
        <div className="flex items-center px-4 md:px-0 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'lexa' || tab.id === 'asset-intelligence') {
                  setComingSoonTab(tab.id);
                  setShowComingSoon(true);
                }
              }}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 text-base font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-ui-faint hover:text-ui-body hover:border-ui-border-strong'
                }`}
            >
              <tab.Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-ui-muted-deep text-ui-faint'}`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>{tabContent[activeTab]}</div>
    </div>
  );
}

function InvestorHubFallback() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-ui-muted-deep" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded-xl bg-ui-muted-deep" />
      </div>
      <div className="h-16 animate-pulse rounded-2xl bg-ui-muted-deep" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-40 animate-pulse rounded-[24px] bg-ui-muted-deep" />
        ))}
      </div>
    </div>
  );
}

export default function InvestorHubPage() {
  return (
    <InvestorLayout pageTitle="Investor Hub">
      <Suspense fallback={<InvestorHubFallback />}>
        <InvestorHubContent />
      </Suspense>
    </InvestorLayout>
  );
}
