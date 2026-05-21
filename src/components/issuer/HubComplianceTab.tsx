'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Shield,
  UserCheck,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { ListHubRegulatoryStatusParams } from '@/lib/issuerHub';
import {
  useExportIssuerHubRegulatoryStatusMutation,
  useGetIssuerHubComplianceSummaryQuery,
  useListIssuerHubRegulatoryStatusQuery,
} from '@/store/api/issuerHubApi';

const iconStroke = 1.75;

function statusRowIcon(tone: string) {
  if (tone === 'warn') return Clock;
  if (tone === 'info') return Shield;
  return CheckCircle2;
}

function statusRowRing(tone: string) {
  if (tone === 'warn') {
    return 'border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/40';
  }
  if (tone === 'info') {
    return 'border-sky-200 bg-sky-50 text-sky-600 dark:bg-sky-950/40';
  }
  return 'border-emerald-200 bg-app-status-success-bg text-app-status-success-fg dark:bg-emerald-950/40';
}

function statusPillClass(tone: string) {
  if (tone === 'warn') return 'border-amber-200 bg-amber-50 text-amber-800';
  if (tone === 'info') {
    return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300';
  }
  return 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg';
}

type HubComplianceTabProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function HubComplianceTab({ search, onSearchChange }: HubComplianceTabProps) {
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listParams: ListHubRegulatoryStatusParams = {
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
  };

  const { data: summary, isLoading: summaryLoading } =
    useGetIssuerHubComplianceSummaryQuery();
  const { data: regulatory, isLoading: listLoading } =
    useListIssuerHubRegulatoryStatusQuery(listParams);
  const [exportReport, { isLoading: exporting }] =
    useExportIssuerHubRegulatoryStatusMutation();

  const score = summary?.complianceScore.score ?? 0;
  const maxScore = summary?.complianceScore.maxScore ?? 100;
  const scorePct = maxScore > 0 ? score / maxScore : 0;

  const donutStroke = 14;
  const donutSize = 160;
  const r = (donutSize - donutStroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = scorePct * circumference;

  const summaryCards = summary
    ? [
        {
          title: 'SEC Filings Current',
          value: `${summary.secFilings.current}/${summary.secFilings.total}`,
          sub: summary.secFilings.summary,
          border: summary.secFilings.allCurrent
            ? 'border-emerald-200 dark:border-emerald-800'
            : 'border-amber-200 dark:border-amber-800',
          Icon: CheckCircle2,
          ring: summary.secFilings.allCurrent
            ? 'border-emerald-500/25 bg-app-status-success-bg text-app-status-success-fg dark:bg-emerald-950/30'
            : 'border-amber-500/25 bg-amber-50 text-amber-600 dark:bg-amber-950/30',
        },
        {
          title: 'KYC Completion Rate',
          value: `${summary.kycCompletion.ratePercent.toFixed(1)}%`,
          sub: summary.kycCompletion.summary,
          border: 'border-emerald-200 dark:border-emerald-800',
          Icon: UserCheck,
          ring: 'border-emerald-500/25 bg-app-status-success-bg text-app-status-success-fg dark:bg-emerald-950/30',
        },
        {
          title: `OFAC Hits (${summary.ofacHits.periodDays}D)`,
          value: String(summary.ofacHits.count),
          sub: summary.ofacHits.summary,
          border:
            summary.ofacHits.count > 0
              ? 'border-amber-200 dark:border-amber-800'
              : 'border-emerald-200 dark:border-emerald-800',
          Icon: AlertTriangle,
          ring:
            summary.ofacHits.count > 0
              ? 'border-amber-500/25 bg-amber-50 text-amber-600 dark:bg-amber-950/30'
              : 'border-emerald-500/25 bg-app-status-success-bg text-app-status-success-fg dark:bg-emerald-950/30',
        },
        {
          title: 'Open Compliance Items',
          value: String(summary.openComplianceItems.count),
          sub: summary.openComplianceItems.summary,
          border:
            summary.openComplianceItems.count > 0
              ? 'border-amber-200 dark:border-amber-800'
              : 'border-emerald-200 dark:border-emerald-800',
          Icon: Clock,
          ring:
            summary.openComplianceItems.count > 0
              ? 'border-amber-500/25 bg-amber-50 text-amber-600 dark:bg-amber-950/30'
              : 'border-emerald-500/25 bg-app-status-success-bg text-app-status-success-fg dark:bg-emerald-950/30',
        },
      ]
    : [];

  const rows = regulatory?.items ?? [];

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-sm xl:col-span-5">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
            <div className="relative h-40 w-40 shrink-0">
              <svg
                width={donutSize}
                height={donutSize}
                viewBox={`0 0 ${donutSize} ${donutSize}`}
                className="-rotate-90"
                aria-hidden
              >
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={r}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth={donutStroke}
                />
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={r}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={donutStroke}
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circumference}`}
                />
              </svg>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="text-center">
                  <span className="block text-3xl font-bold leading-none text-foreground">
                    {summaryLoading ? '—' : score}
                  </span>
                  <span className="text-sm font-semibold text-text-muted">
                    / {maxScore}
                  </span>
                </p>
              </div>
            </div>
            <div className="max-w-xs text-center md:text-left">
              <h3 className="text-lg font-bold text-foreground">Compliance Score</h3>
              <p className="mt-2 text-sm font-medium text-ui-success-text">
                {summary?.complianceScore.summary ?? 'Loading…'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-7">
          {summaryLoading
            ? [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl border border-card-border bg-card"
                />
              ))
            : summaryCards.map((card) => {
                const CardIcon = card.Icon;
                return (
                  <div
                    key={card.title}
                    className={`rounded-2xl border-2 bg-card p-6 shadow-sm ${card.border}`}
                  >
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full border ${card.ring}`}
                    >
                      <CardIcon className="h-5 w-5" strokeWidth={iconStroke} />
                    </div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{card.value}</p>
                    <p className="mt-2 text-xs text-text-muted">{card.sub}</p>
                  </div>
                );
              })}
        </div>
      </div>

      <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-sm md:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Regulatory Status</h3>
            <p className="text-xs text-text-muted">Filings, exemptions, and program reviews.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative md:hidden">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
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
                placeholder="Search filings..."
                className="h-9 w-full min-w-[12rem] rounded-full border border-card-border bg-card py-1.5 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              disabled={exporting}
              onClick={() => exportReport(listParams)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-card-border bg-card px-5 py-2.5 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-surface disabled:opacity-60"
            >
              <Download className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
              {exporting ? 'Exporting…' : 'Export Report'}
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {listLoading ? (
            <p className="py-10 text-center text-xs text-text-muted">Loading regulatory status…</p>
          ) : rows.length > 0 ? (
            rows.map((row) => {
              const RowIcon = statusRowIcon(row.statusTone);
              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-4 py-6 first:pt-0 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${statusRowRing(row.statusTone)}`}
                    >
                      <RowIcon className="h-5 w-5" strokeWidth={iconStroke} />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{row.title}</h4>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusPillClass(row.statusTone)}`}
                        >
                          {row.status}
                        </span>
                        <span className="rounded-full border border-primary/25 bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-primary dark:bg-violet-950/40">
                          {row.entity}
                        </span>
                      </div>
                      {row.description ? (
                        <p className="text-xs text-text-muted">{row.description}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <span className="text-xs font-semibold text-text-muted">{row.date}</span>
                    <ExternalLink
                      className="h-4 w-4 text-text-muted"
                      strokeWidth={iconStroke}
                      aria-hidden
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-10 text-center text-xs text-text-muted">
              No regulatory filings found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
