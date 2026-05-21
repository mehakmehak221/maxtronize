'use client';

import React, { useEffect, useState } from 'react';
import { formatCompactCurrency } from '@/lib/issuerDashboard';
import type { ListHubCapTableParams } from '@/lib/issuerHub';
import {
  useExportIssuerHubCapTableMutation,
  useGetIssuerHubCapTableSummaryQuery,
  useListIssuerHubCapTableQuery,
} from '@/store/api/issuerHubApi';

const CAP_CHIP_CLASS: Record<string, string> = {
  yt: 'bg-cap-chip-yt-bg text-cap-chip-yt-fg',
  sl: 'bg-cap-chip-sl-bg text-cap-chip-sl-fg',
  ad: 'bg-cap-chip-ad-bg text-cap-chip-ad-fg',
  ro: 'bg-cap-chip-ro-bg text-cap-chip-ro-fg',
  mo: 'bg-cap-chip-mo-bg text-cap-chip-mo-fg',
  cw: 'bg-cap-chip-cw-bg text-cap-chip-cw-fg',
  eh: 'bg-cap-chip-eh-bg text-cap-chip-eh-fg',
};

type HubCapTableTabProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function HubCapTableTab({ search, onSearchChange }: HubCapTableTabProps) {
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listParams: ListHubCapTableParams = {
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
  };

  const { data: summary } = useGetIssuerHubCapTableSummaryQuery();
  const { data, isLoading, isFetching } = useListIssuerHubCapTableQuery(listParams);
  const [exportCapTable, { isLoading: exporting }] = useExportIssuerHubCapTableMutation();

  const rows = data?.items ?? [];
  const loading = isLoading || isFetching;
  const currency = summary?.currency ?? 'USD';

  const subtitle = summary
    ? `${summary.investorCount} investors · ${formatCompactCurrency(summary.totalInvested, currency)} invested · ${formatCompactCurrency(summary.totalDistributed, currency)} distributed`
    : 'Loading summary…';

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-lg font-bold text-foreground">Cap Table</h3>
          <p className="text-xs text-text-muted">{subtitle}</p>
        </div>
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
              placeholder="Search investor..."
              className="w-64 rounded-full border border-card-border bg-card py-2 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>
          <button
            type="button"
            disabled={exporting}
            onClick={() => exportCapTable(listParams)}
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
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-card-border bg-card shadow-sm">
        <table className="w-full whitespace-nowrap text-left">
          <thead className="border-b border-card-border bg-surface">
            <tr>
              {[
                'Investor',
                'Asset / Token',
                'Tokens',
                'Ownership %',
                'Invested',
                'Distributions',
                'Jurisdiction',
                'Join Date',
                'Status',
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
                <td colSpan={9} className="px-6 py-12 text-center text-xs text-text-muted">
                  Loading cap table…
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-surface">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${CAP_CHIP_CLASS[row.chipKey] ?? CAP_CHIP_CLASS.yt}`}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground">{row.name}</p>
                        <p className="text-[10px] text-text-muted">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="mb-1 text-[12px] font-medium text-foreground">{row.asset}</p>
                    <span className="rounded border border-card-border bg-surface px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      {row.token}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.tokens}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(row.ownershipPercent * 4, 100)}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-bold text-text-muted">
                        {row.ownershipPercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.invested}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-ui-success-text">
                    {row.distributed}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-text-muted">
                    {row.jurisdiction}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-text-muted">{row.joinDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        row.statusTone === 'funded'
                          ? 'border-status-funded-border bg-status-funded-bg text-status-funded-text'
                          : 'border-primary/25 bg-ui-accent-tint text-primary'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-xs text-text-muted">
                  No cap table entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
