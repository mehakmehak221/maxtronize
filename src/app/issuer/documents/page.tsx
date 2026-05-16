'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Folder,
  Lock,
  Package,
  Plus,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Upload,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DocumentDetailPanel } from '@/components/issuer/DocumentDetailPanel';
import { IssuerDocumentUploadModal } from '@/components/issuer/IssuerDocumentUploadModal';
import { formatRequestError } from '@/lib/formatRequestError';
import {
  categoryQueryFromKey,
  type IssuerDocument,
  type IssuerDocumentCategoryLabel,
  type IssuerDocumentStatusType,
} from '@/lib/issuerDocuments';
import {
  useGetIssuerDocumentCategoriesQuery,
  useGetIssuerDocumentsSummaryQuery,
  useListIssuerDocumentsQuery,
} from '@/store/api/issuerDocumentsApi';

const iconStroke = 1.75;

type DocCategory = IssuerDocumentCategoryLabel;
type DocStatus = IssuerDocumentStatusType;

const STAT_ICONS: Record<
  string,
  { Icon: LucideIcon; iconClass: string; highlight?: boolean }
> = {
  'Total Documents': {
    Icon: Folder,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
  'Fully Signed': {
    Icon: CheckCircle2,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
  'Pending Signature': {
    Icon: Clock,
    iconClass: 'bg-amber-100 text-amber-600',
    highlight: true,
  },
  'Compliance Score': {
    Icon: Shield,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
};

const CATEGORY_STYLES: Record<DocCategory, { pill: string; Icon: LucideIcon }> = {
  LEGAL: { pill: 'border-app-status-purple-border bg-app-status-purple-bg text-app-status-purple-fg', Icon: Scale },
  COMPLIANCE: { pill: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300', Icon: ShieldCheck },
  'ASSET DOCS': { pill: 'border-app-status-warn-border bg-app-status-warn-bg text-app-status-warn-fg', Icon: Package },
  REPORTS: { pill: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg', Icon: BarChart3 },
};

const STATUS_STYLES: Record<DocStatus, { pill: string; Icon: LucideIcon }> = {
  signed: { pill: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg', Icon: CheckCircle2 },
  pending: { pill: 'border-app-status-warn-border bg-app-status-warn-bg text-app-status-warn-fg', Icon: Clock },
  draft: { pill: 'border-ui-border bg-ui-muted-deep text-ui-muted-text', Icon: FileText },
  expired: { pill: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300', Icon: XCircle },
};

function DocStatCard({
  label,
  value,
  sub,
  Icon,
  iconClass,
  highlight,
}: (typeof DOC_STATS)[number]) {
  return (
    <div
      className={
        highlight
          ? 'flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-[#FFFBEB] p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/25 sm:gap-4 sm:rounded-[20px] sm:p-5 xl:rounded-[24px] xl:p-6'
          : 'flex items-center gap-3 rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm sm:gap-4 sm:rounded-[20px] sm:p-5 xl:rounded-[24px] xl:p-6'
      }
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="h-5 w-5" strokeWidth={iconStroke} />
      </div>
      <div className="min-w-0">
        <p
          className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${
            highlight ? 'text-amber-700/80' : 'text-ui-faint'
          }`}
        >
          {label}
        </p>
        <p className={`text-2xl font-bold tracking-tight ${highlight ? 'text-amber-700' : 'text-ui-strong'}`}>
          {value}
        </p>
        <p className={`mt-0.5 text-[11px] font-medium ${highlight ? 'text-amber-600/90' : 'text-ui-faint'}`}>
          {sub}
        </p>
      </div>
    </div>
  );
}

function CategoryBadge({ catLabel }: { catLabel: DocCategory }) {
  const { pill, Icon } = CATEGORY_STYLES[catLabel];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${pill}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={iconStroke} />
      {catLabel}
    </span>
  );
}

function StatusBadge({ status, statusType }: { status: string; statusType: DocStatus }) {
  const { pill, Icon } = STATUS_STYLES[statusType];
  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${pill}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={iconStroke} />
      <span className="line-clamp-2 sm:whitespace-nowrap">{status}</span>
    </span>
  );
}

function DocRowCard({
  doc,
  onSelect,
}: {
  doc: IssuerDocument;
  onSelect: (id: string) => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(doc.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(doc.id);
        }
      }}
      className="cursor-pointer rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm transition-colors hover:bg-ui-muted sm:p-5"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-muted-text">
          <FileText className="h-5 w-5" strokeWidth={iconStroke} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[13px] font-bold leading-snug text-ui-strong">{doc.name}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-ui-faint">
            {doc.id ? `DOC · ${doc.id.slice(0, 8)}` : '—'}
          </p>
        </div>
      </div>
      <div className="space-y-3 border-t border-ui-divider pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge catLabel={doc.categoryLabel} />
          <StatusBadge status={doc.status} statusType={doc.statusType} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-[11px]">
          <div className="min-w-0">
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Asset</p>
            <p className="line-clamp-2 font-medium text-ui-body">{doc.assetName}</p>
          </div>
          <div>
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Date</p>
            <p className="font-medium text-ui-muted-text">{doc.date}</p>
          </div>
          <div>
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Size</p>
            <p className="font-medium text-ui-muted-text">{doc.size}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DocumentsPage() {
  const [activeTabKey, setActiveTabKey] = useState('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useGetIssuerDocumentsSummaryQuery();
  const {
    data: categoryTabs = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetIssuerDocumentCategoriesQuery();

  const listParams = useMemo(
    () => ({
      page: 1,
      limit: 20,
      search: debouncedSearch || undefined,
      category: categoryQueryFromKey(activeTabKey),
    }),
    [activeTabKey, debouncedSearch],
  );

  const { data, isLoading, isFetching, error } =
    useListIssuerDocumentsQuery(listParams);

  const documents = data?.items ?? [];
  const pageError = summaryError ?? categoriesError ?? error;

  const docStats = useMemo(() => {
    const pendingCount = summary?.pendingSignature.count ?? 0;
    return [
      {
        label: 'Total Documents',
        value: String(summary?.totalDocuments.count ?? 0),
        sub: summary?.totalDocuments.summary || 'Across all assets',
        ...STAT_ICONS['Total Documents'],
      },
      {
        label: 'Fully Signed',
        value: String(summary?.fullySigned.count ?? 0),
        sub: `${summary?.fullySigned.completionRate ?? 0}% completion rate`,
        ...STAT_ICONS['Fully Signed'],
      },
      {
        label: 'Pending Signature',
        value: String(pendingCount),
        sub: summary?.pendingSignature.summary || 'Action required',
        highlight: pendingCount > 0,
        ...STAT_ICONS['Pending Signature'],
      },
      {
        label: 'Compliance Score',
        value: `${summary?.complianceScore.percent ?? 0}%`,
        sub: summary?.complianceScore.summary || '—',
        ...STAT_ICONS['Compliance Score'],
      },
    ];
  }, [summary]);

  return (
    <DashboardLayout>
      <div className="animate-page-enter mx-auto w-full max-w-7xl min-w-0 space-y-6 sm:space-y-8 xl:space-y-10">
        {/* Header */}
        <div className="animate-slide-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ui-strong sm:text-3xl xl:text-4xl">Documents</h1>
            <p className="text-sm font-medium text-ui-muted-text">
              Legal agreements, compliance filings, and asset documentation — all in one secure vault.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-[#9810FA] px-6 py-3.5 text-[13px] font-bold text-white shadow-[0_8px_24px_-6px_rgba(152,16,250,0.45)] transition-all hover:bg-[#7C3AED] sm:w-auto sm:self-auto md:px-8 md:py-4"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            Upload Document
          </button>
        </div>

        {pageError ? (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {formatRequestError(pageError)}
          </p>
        ) : null}

        {/* KPI cards */}
        <div className="motion-stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {summaryLoading
            ? Object.keys(STAT_ICONS).map((label) => (
                <div
                  key={label}
                  className="h-[104px] animate-pulse rounded-2xl border border-ui-border bg-ui-muted-deep sm:rounded-[20px] xl:rounded-[24px]"
                />
              ))
            : docStats.map((stat) => <DocStatCard key={stat.label} {...stat} />)}
        </div>

        {(isLoading || isFetching) && (
          <p className="text-sm font-medium text-ui-muted-text">Loading documents…</p>
        )}

        {/* Filters + search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1">
            {categoriesLoading ? (
              <p className="text-sm text-ui-muted-text">Loading categories…</p>
            ) : (
              categoryTabs.map((tab) => {
                const active = activeTabKey === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTabKey(tab.key)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold transition-all md:px-5 md:py-2.5 md:text-[13px] ${
                      active
                        ? 'bg-dash-filter-active-bg text-dash-filter-active-fg shadow-md'
                        : 'bg-ui-muted-deep text-ui-body hover:bg-ui-border hover:text-ui-strong'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })
            )}
          </div>
          <div className="relative w-full shrink-0 lg:w-72">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ui-faint"
              strokeWidth={iconStroke}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-2xl border border-ui-border bg-ui-card py-3 pl-11 pr-4 text-[13px] font-medium text-ui-strong shadow-sm outline-none transition-shadow placeholder:text-ui-faint focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>

        {/* Mobile / tablet: card list */}
        <div className="space-y-3 xl:hidden">
          {!isLoading && documents.length === 0 ? (
            <p className="rounded-2xl border border-ui-border bg-ui-card px-6 py-14 text-center text-[13px] font-medium text-ui-faint">
              No documents match your filters.
            </p>
          ) : (
            documents.map((doc) => (
              <DocRowCard
                key={doc.id}
                doc={doc}
                onSelect={setSelectedDocumentId}
              />
            ))
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden min-w-0 overflow-hidden rounded-2xl border border-ui-border bg-ui-card shadow-sm sm:rounded-3xl xl:block xl:rounded-[24px]">
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-ui-border bg-ui-muted">
                  {['Document', 'Category', 'Asset', 'Status', 'Date', 'Size'].map((col) => (
                    <th
                      key={col}
                      className={`px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-ui-faint xl:px-8 xl:py-5 ${
                        col === 'Document' ? 'sticky left-0 z-10 bg-ui-muted pl-6 xl:pl-8' : ''
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {!isLoading && documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-14 text-center">
                      <p className="text-[13px] font-medium text-ui-faint">No documents match your filters.</p>
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="group cursor-pointer transition-colors hover:bg-ui-muted"
                      onClick={() => setSelectedDocumentId(doc.id)}
                    >
                      <td className="sticky left-0 z-10 bg-ui-card px-4 py-5 group-hover:bg-ui-muted xl:px-8 xl:py-6">
                        <div className="flex min-w-[200px] items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-muted-text transition-colors group-hover:bg-violet-100 group-hover:text-[#7C3AED]">
                            <FileText className="h-5 w-5" strokeWidth={iconStroke} />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-[13px] font-bold text-ui-strong">{doc.name}</p>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                              {doc.id ? `DOC · ${doc.id.slice(0, 8)}` : '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 xl:px-8 xl:py-6">
                        <CategoryBadge catLabel={doc.categoryLabel} />
                      </td>
                      <td className="px-4 py-5 xl:px-8 xl:py-6">
                        <p className="max-w-[180px] line-clamp-2 text-[12px] font-medium text-ui-body">{doc.assetName}</p>
                      </td>
                      <td className="px-4 py-5 xl:px-8 xl:py-6">
                        <StatusBadge status={doc.status} statusType={doc.statusType} />
                      </td>
                      <td className="px-4 py-5 xl:px-8 xl:py-6">
                        <span className="whitespace-nowrap text-[12px] font-medium text-ui-muted-text">{doc.date}</span>
                      </td>
                      <td className="px-4 py-5 last:pr-6 xl:px-8 xl:py-6 xl:pr-8">
                        <span className="text-[12px] font-medium text-ui-muted-text">{doc.size}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <IssuerDocumentUploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          categoryOptions={categoryTabs}
        />

        <DocumentDetailPanel
          documentId={selectedDocumentId}
          onClose={() => setSelectedDocumentId(null)}
          CategoryBadge={CategoryBadge}
          StatusBadge={StatusBadge}
        />
      </div>
    </DashboardLayout>
  );
}
