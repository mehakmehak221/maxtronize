'use client';

import { Calendar, DollarSign, Download, TrendingUp } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { formatRequestError } from '@/lib/formatRequestError';
import { formatCompactCurrency } from '@/lib/issuerDashboard';
import {
  useExportInvestorHubDistributionsMutation,
  useGetInvestorHubDistributionsSummaryQuery,
  useListInvestorHubDistributionsQuery,
} from '@/store/api/investorHubDistributionsApi';

const iconStroke = 1.75;

export function InvestorHubDistributionsTab() {
  const currentYear = new Date().getFullYear();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [fromDate, setFromDate] = useState(`${currentYear}-01-01`);
  const [toDate, setToDate] = useState(`${currentYear}-12-31`);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listParams = useMemo(
    () => ({
      page: 1,
      limit: 50,
      search: debouncedSearch || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [debouncedSearch, fromDate, toDate],
  );

  const { data: summary, isLoading: summaryLoading } =
    useGetInvestorHubDistributionsSummaryQuery();
  const { data: listResult, isLoading: listLoading, error: listError } =
    useListInvestorHubDistributionsQuery(listParams);
  const [exportDistributions, { isLoading: exporting }] =
    useExportInvestorHubDistributionsMutation();

  const items = listResult?.items ?? [];

  const ytd = summary
    ? formatCompactCurrency(
        summary.ytdDistributions.amount,
        summary.ytdDistributions.currency,
        { decimals: 0 },
      )
    : summaryLoading
      ? '…'
      : '$0';

  const nextPayment = summary?.nextPayment
    ? formatCompactCurrency(
        summary.nextPayment.amount,
        summary.nextPayment.currency,
        { decimals: 0 },
      )
    : summaryLoading
      ? '…'
      : 'No payment scheduled';

  const nextPaymentSub =
    summary?.nextPayment?.label ||
    summary?.nextPayment?.date ||
    (!summaryLoading ? 'No upcoming distribution is currently scheduled.' : undefined);

  const avgMonthly = summary
    ? formatCompactCurrency(
        summary.avgMonthly.amount,
        summary.avgMonthly.currency,
        { decimals: 0 },
      )
    : summaryLoading
      ? '…'
      : '$0';

  async function handleExport() {
    try {
      await exportDistributions(listParams).unwrap();
    } catch {
      // export handler triggers browser download; errors surface via RTK
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'YTD Distributions', value: ytd, Icon: DollarSign, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', compact: false, sub: undefined },
          { label: 'Next Payment', value: nextPayment, sub: nextPaymentSub, Icon: Calendar, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', compact: !summary?.nextPayment && !summaryLoading },
          { label: 'Avg Monthly', value: avgMonthly, Icon: TrendingUp, iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400', compact: false, sub: undefined },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-[24px] md:p-6"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${card.iconBg}`}>
              <card.Icon className="h-5 w-5" strokeWidth={iconStroke} />
            </div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{card.label}</p>
            <p className={card.compact ? 'text-base font-bold text-ui-strong md:text-lg' : 'text-2xl font-bold text-ui-strong'}>
              {card.value}
            </p>
            {card.sub ? <p className="mt-1 text-[10px] font-medium text-ui-faint">{card.sub}</p> : null}
          </div>
        ))}
      </div>

      <div className="rounded-[20px] border border-ui-border bg-ui-card shadow-sm md:rounded-[28px]">
        <div className="flex flex-col gap-4 border-b border-ui-divider p-5 md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <h3 className="text-base font-bold text-ui-strong">Distribution History</h3>
            <p className="mt-0.5 text-xs text-ui-faint">Yield and income payouts across your holdings</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="rounded-xl border border-ui-border bg-ui-card px-3 py-2 text-[12px] font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl border border-ui-border bg-ui-card px-3 py-2 text-[12px] font-medium"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border border-ui-border bg-ui-card px-3 py-2 text-[12px] font-medium"
            />
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-ui-border px-4 py-2 text-[12px] font-bold text-primary transition-colors hover:bg-primary/5 disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={iconStroke} />
              {exporting ? 'Exporting…' : 'Export'}
            </button>
          </div>
        </div>

        {listError ? (
          <p className="px-6 py-8 text-center text-sm text-rose-600" role="alert">
            {formatRequestError(listError)}
          </p>
        ) : listLoading ? (
          <p className="px-6 py-12 text-center text-[13px] font-medium text-ui-faint animate-pulse">
            Loading distributions…
          </p>
        ) : items.length === 0 ? (
          <p className="px-6 py-12 text-center text-[13px] font-medium text-ui-faint">
            No distributions found for this period.
          </p>
        ) : (
          <div className="divide-y divide-ui-divider">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-5 md:gap-6 md:px-8 md:py-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <DollarSign className="h-5 w-5" strokeWidth={iconStroke} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ui-strong">{item.assetName}</p>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                    {item.type} · {item.status}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold text-emerald-600">{item.amountFormatted}</p>
                  <p className="text-[10px] font-medium text-ui-faint">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
