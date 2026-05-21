'use client';

import React, { useEffect, useState } from 'react';
import type { ListHubInvestorsParams } from '@/lib/issuerHub';
import {
  useExportIssuerHubInvestorsMutation,
  useGetIssuerHubInvestorsSummaryQuery,
  useListIssuerHubInvestorsQuery,
} from '@/store/api/issuerHubApi';

const REGISTRY_CHIP_CLASS: Record<number, string> = {
  1: 'bg-inv-chip-1-bg text-inv-chip-1-fg',
  2: 'bg-inv-chip-2-bg text-inv-chip-2-fg',
  3: 'bg-inv-chip-3-bg text-inv-chip-3-fg',
  4: 'bg-inv-chip-4-bg text-inv-chip-4-fg',
  5: 'bg-inv-chip-5-bg text-inv-chip-5-fg',
  6: 'bg-inv-chip-6-bg text-inv-chip-6-fg',
};

type InvestorBucket = ListHubInvestorsParams['bucket'];

type HubInvestorsTabProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function HubInvestorsTab({ search, onSearchChange }: HubInvestorsTabProps) {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [bucket, setBucket] = useState<InvestorBucket | undefined>();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listParams: ListHubInvestorsParams = {
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
    bucket,
  };

  const { data, isLoading, isFetching } = useListIssuerHubInvestorsQuery(listParams);
  const { data: investorsSummary } = useGetIssuerHubInvestorsSummaryQuery();

  const [exportInvestors, { isLoading: exporting }] =
    useExportIssuerHubInvestorsMutation();

  const investors = data?.items ?? [];
  const loading = isLoading || isFetching;

  const kpiCards = [
    {
      bucket: 'kycApproved' as const,
      count: investorsSummary?.kycApproved ?? 0,
      label: 'KYC Approved',
      border: 'border-ui-success-border/50',
      countClass: 'text-ui-success-text',
      iconBorder: 'border-ui-success-text text-ui-success-text',
      iconPath: 'M5 13l4 4L19 7',
    },
    {
      bucket: 'pendingReview' as const,
      count: investorsSummary?.pendingReview ?? 0,
      label: 'Pending Review',
      border: 'border-alert-warn-border',
      countClass: 'text-alert-warn-title',
      iconBorder: 'border-alert-warn-icon text-alert-warn-icon',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      bucket: 'actionRequired' as const,
      count: investorsSummary?.actionRequired ?? 0,
      label: 'Action Required',
      border: 'border-ui-danger-muted/40',
      countClass: 'text-ui-danger-text',
      iconBorder: 'border-ui-danger-text text-ui-danger-text',
      iconPath:
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
  ];

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {kpiCards.map((card) => {
          const active = bucket === card.bucket;
          return (
            <button
              key={card.bucket}
              type="button"
              onClick={() => setBucket(active ? undefined : card.bucket)}
              className={`flex w-full items-center justify-between rounded-2xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md ${card.border} ${
                active ? 'ring-2 ring-primary/40' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${card.iconBorder}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={card.iconPath}
                    />
                  </svg>
                </div>
                <div>
                  <p className={`text-3xl font-bold tabular-nums ${card.countClass}`}>
                    {card.count}
                  </p>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${card.countClass}`}
                  >
                    {card.label}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Investor Registry</h3>
        <div className="flex items-center gap-3">
          <div className="relative md:hidden">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search investors..."
              className="w-64 rounded-full border border-card-border bg-card py-2 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>
          <button
            type="button"
            disabled={exporting}
            onClick={() => exportInvestors(listParams)}
            className="flex items-center gap-2 rounded-full border border-card-border bg-card px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-surface disabled:opacity-60"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {exporting ? 'Exporting…' : 'Export'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-card-border bg-card shadow-sm">
        <table className="w-full whitespace-nowrap text-left">
          <thead className="border-b border-card-border bg-surface">
            <tr>
              {[
                'Investor',
                'KYC Status',
                'Accreditation',
                'Commitment',
                'Asset',
                'Jurisdiction',
                'Source',
                'Join Date',
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-xs text-text-muted">
                  Loading investors…
                </td>
              </tr>
            ) : investors.length > 0 ? (
              investors.map((inv) => (
                <tr key={inv.id} className="transition-colors hover:bg-surface">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${REGISTRY_CHIP_CLASS[inv.chipIndex] ?? REGISTRY_CHIP_CLASS[1]}`}
                      >
                        {inv.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground">{inv.name}</p>
                        <p className="text-[10px] text-text-muted">{inv.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        inv.kycApproved
                          ? 'border-ui-success-border/60 bg-ui-success-bg-soft text-ui-success-text'
                          : 'border-alert-warn-border bg-alert-warn-bg text-alert-warn-title'
                      }`}
                    >
                      {inv.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        inv.accreditation.toLowerCase().includes('approv')
                          ? 'border-ui-success-border/60 bg-ui-success-bg-soft text-ui-success-text'
                          : 'border-alert-warn-border bg-alert-warn-bg text-alert-warn-title'
                      }`}
                    >
                      {inv.accreditation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">
                    {inv.commitment}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-text-muted">
                    {inv.asset}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-text-muted">
                    {inv.jurisdiction}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-text-muted">
                    {inv.source}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-text-muted">{inv.joinDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-xs text-text-muted">
                  No investors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
