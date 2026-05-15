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
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const iconStroke = 1.75;

type Category = 'All Documents' | 'Legal' | 'Compliance' | 'Asset Docs' | 'Reports';
type DocStatus = 'signed' | 'pending' | 'draft' | 'expired';
type DocCategory = 'LEGAL' | 'COMPLIANCE' | 'ASSET DOCS' | 'REPORTS';

type DocRow = {
  name: string;
  id: string;
  cat: Category;
  catLabel: DocCategory;
  asset: string;
  status: string;
  statusType: DocStatus;
  date: string;
  size: string;
};

const DOC_STATS: {
  label: string;
  value: string;
  sub: string;
  Icon: LucideIcon;
  iconClass: string;
  highlight?: boolean;
}[] = [
  {
    label: 'Total Documents',
    value: '12',
    sub: 'Across all assets',
    Icon: Folder,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
  {
    label: 'Fully Signed',
    value: '8',
    sub: '67% completion rate',
    Icon: CheckCircle2,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
  {
    label: 'Pending Signature',
    value: '2',
    sub: 'Action required',
    Icon: Clock,
    iconClass: 'bg-amber-100 text-amber-600',
    highlight: true,
  },
  {
    label: 'Compliance Score',
    value: '94%',
    sub: '2 items need attention',
    Icon: Shield,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
];

const FILTER_TABS: { name: Category; count: number }[] = [
  { name: 'All Documents', count: 12 },
  { name: 'Legal', count: 3 },
  { name: 'Compliance', count: 4 },
  { name: 'Asset Docs', count: 3 },
  { name: 'Reports', count: 2 },
];

const ALL_DOCS: DocRow[] = [
  {
    name: 'Limited Partnership Agreement',
    id: 'DOC · #01',
    cat: 'Legal',
    catLabel: 'LEGAL',
    asset: 'Prime Office Tower NYC',
    status: 'Signed (3/3)',
    statusType: 'signed',
    date: 'Sep 15, 2026',
    size: '2.4 MB',
  },
  {
    name: 'SEC Regulation D Filing (506c)',
    id: 'DOC · #02',
    cat: 'Compliance',
    catLabel: 'COMPLIANCE',
    asset: 'Prime Office Tower NYC',
    status: 'Signed',
    statusType: 'signed',
    date: 'Sep 01, 2026',
    size: '1.1 MB',
  },
  {
    name: 'Property Appraisal Report',
    id: 'DOC · #03',
    cat: 'Asset Docs',
    catLabel: 'ASSET DOCS',
    asset: 'Prime Office Tower NYC',
    status: 'Signed',
    statusType: 'signed',
    date: 'Aug 20, 2026',
    size: '8.7 MB',
  },
  {
    name: 'Q3 Investor Report 2026',
    id: 'DOC · #04',
    cat: 'Reports',
    catLabel: 'REPORTS',
    asset: 'All Assets',
    status: 'Signed',
    statusType: 'signed',
    date: 'Oct 05, 2026',
    size: '3.2 MB',
  },
  {
    name: 'Subscription Agreement',
    id: 'DOC · #05',
    cat: 'Legal',
    catLabel: 'LEGAL',
    asset: 'Solar Farm Alpha TX',
    status: 'Awaiting Signature (1/2)',
    statusType: 'pending',
    date: 'Oct 12, 2026',
    size: '0.9 MB',
  },
  {
    name: 'MiCA Compliance Certificate',
    id: 'DOC · #06',
    cat: 'Compliance',
    catLabel: 'COMPLIANCE',
    asset: 'Riviera Residences',
    status: 'Awaiting Signature',
    statusType: 'pending',
    date: 'Oct 18, 2026',
    size: '0.5 MB',
  },
  {
    name: 'Token Offering Memorandum',
    id: 'DOC · #07',
    cat: 'Legal',
    catLabel: 'LEGAL',
    asset: 'Harbor Ports PE Fund',
    status: 'Signed (4/4)',
    statusType: 'signed',
    date: 'Aug 10, 2026',
    size: '4.8 MB',
  },
  {
    name: 'Asset Valuation Certificate',
    id: 'DOC · #08',
    cat: 'Asset Docs',
    catLabel: 'ASSET DOCS',
    asset: 'Alpine Art Collection',
    status: 'Draft',
    statusType: 'draft',
    date: 'Oct 20, 2026',
    size: '1.6 MB',
  },
  {
    name: 'AML/KYC Compliance Report',
    id: 'DOC · #09',
    cat: 'Compliance',
    catLabel: 'COMPLIANCE',
    asset: 'All Assets',
    status: 'Signed',
    statusType: 'signed',
    date: 'Oct 01, 2026',
    size: '0.7 MB',
  },
  {
    name: 'Smart Contract Audit Report',
    id: 'DOC · #10',
    cat: 'Compliance',
    catLabel: 'COMPLIANCE',
    asset: 'Harbor Ports PE Fund',
    status: 'Signed',
    statusType: 'signed',
    date: 'Jul 20, 2026',
    size: '2.1 MB',
  },
  {
    name: 'Quarterly Financial Statement',
    id: 'DOC · #11',
    cat: 'Reports',
    catLabel: 'REPORTS',
    asset: 'Logistics Hub DE',
    status: 'Signed',
    statusType: 'signed',
    date: 'Oct 05, 2026',
    size: '1.4 MB',
  },
  {
    name: 'Land Registry Certificate',
    id: 'DOC · #12',
    cat: 'Asset Docs',
    catLabel: 'ASSET DOCS',
    asset: 'Riviera Residences',
    status: 'Expired',
    statusType: 'expired',
    date: 'Mar 01, 2026',
    size: '0.3 MB',
  },
];

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
          ? 'flex items-center gap-4 rounded-[20px] border border-amber-200/80 bg-[#FFFBEB] dark:border-amber-900/40 dark:bg-amber-950/25 p-5 shadow-sm md:rounded-[24px] md:p-6'
          : 'flex items-center gap-4 rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm md:rounded-[24px] md:p-6'
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
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold ${pill}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={iconStroke} />
      {status}
    </span>
  );
}

export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All Documents');
  const [search, setSearch] = useState('');

  const filteredDocs = ALL_DOCS.filter((doc) => {
    const matchCat = activeCategory === 'All Documents' || doc.cat === activeCategory;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.asset.toLowerCase().includes(q) ||
      doc.id.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="animate-page-enter space-y-8 md:space-y-10">
        {/* Header */}
        <div className="animate-slide-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Documents</h1>
            <p className="text-sm font-medium text-ui-muted-text">
              Legal agreements, compliance filings, and asset documentation — all in one secure vault.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-2.5 self-start rounded-2xl bg-[#9810FA] px-6 py-3.5 text-[13px] font-bold text-white shadow-[0_8px_24px_-6px_rgba(152,16,250,0.45)] transition-all hover:bg-[#7C3AED] sm:self-auto md:px-8 md:py-4"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            Upload Document
          </button>
        </div>

        {/* KPI cards */}
        <div className="motion-stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {DOC_STATS.map((stat) => (
            <DocStatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Filters + search */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => {
              const active = activeCategory === tab.name;
              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => setActiveCategory(tab.name)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold transition-all md:px-5 md:py-2.5 md:text-[13px] ${
                    active
                      ? 'bg-dash-filter-active-bg text-dash-filter-active-fg shadow-md'
                      : 'bg-ui-muted-deep text-ui-body hover:bg-ui-border hover:text-ui-strong'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              );
            })}
          </div>
          <div className="relative w-full shrink-0 sm:w-72">
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

        {/* Upload dropzone */}
        <div className="group cursor-pointer rounded-[20px] border-2 border-dashed border-ui-border bg-ui-card p-5 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50/30 md:rounded-[24px] md:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED] transition-transform group-hover:scale-105">
              <Upload className="h-5 w-5" strokeWidth={iconStroke} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-ui-strong">
                <span className="text-[#7C3AED] underline decoration-violet-300 underline-offset-2">
                  Click to upload
                </span>{' '}
                or drag & drop files here
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-ui-faint">
                PDF, DOCX, XLSX up to 50MB · Encrypted at rest
              </p>
            </div>
            <Lock
              className="h-5 w-5 shrink-0 text-ui-faint"
              strokeWidth={iconStroke}
              aria-hidden
            />
          </div>
        </div>

        {/* Documents table */}
        <div className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-ui-border bg-ui-muted">
                  {['Document', 'Category', 'Asset', 'Status', 'Date', 'Size'].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ui-faint first:pl-8 last:pr-8 md:px-8 md:py-5"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-14 text-center">
                      <p className="text-[13px] font-medium text-ui-faint">No documents match your filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="group cursor-pointer transition-colors hover:bg-ui-muted"
                    >
                      <td className="px-6 py-5 first:pl-8 md:px-8 md:py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-muted-text transition-colors group-hover:bg-violet-100 group-hover:text-[#7C3AED]">
                            <FileText className="h-5 w-5" strokeWidth={iconStroke} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-ui-strong max-w-[200px] md:max-w-[280px]">
                              {doc.name}
                            </p>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                              {doc.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <CategoryBadge catLabel={doc.catLabel} />
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <p className="whitespace-nowrap text-[12px] font-medium text-ui-body">{doc.asset}</p>
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <StatusBadge status={doc.status} statusType={doc.statusType} />
                      </td>
                      <td className="px-6 py-5 md:px-8 md:py-6">
                        <span className="whitespace-nowrap text-[12px] font-medium text-ui-muted-text">{doc.date}</span>
                      </td>
                      <td className="px-6 py-5 last:pr-8 md:px-8 md:py-6">
                        <span className="text-[12px] font-medium text-ui-muted-text">{doc.size}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
