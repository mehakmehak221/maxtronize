'use client';

import React, { useState, type ComponentType, type SVGProps } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import {
  Document,
  PendingIcon,
  SuccessIcon,
  WalletCustodyBarsIcon,
  WalletPolygonIcon,
  WalletTransferIcon,
  WalletWithdrawIcon,
} from '@/app/VectorImages';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

function ShieldOutlineMini(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

type Category = 'All Documents' | 'Legal' | 'Compliance' | 'Asset Docs' | 'Reports';
type DocStatus = 'signed' | 'pending' | 'draft' | 'expired';

interface Doc {
  name: string;
  id: string;
  cat: 'Legal' | 'Compliance' | 'Asset Docs' | 'Reports';
  catLabel: string;
  asset: string;
  status: string;
  statusType: DocStatus;
  date: string;
  size: string;
}

export default function InvestorDocumentsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All Documents');
  const [search, setSearch] = useState('');

  const stats: {
    label: string;
    val: string;
    sub: string;
    Icon: NavSvg;
    iconRing: string;
    iconShape?: 'square' | 'circle';
    highlight?: boolean;
  }[] = [
    {
      label: 'Total Documents',
      val: '12',
      sub: 'Across all assets',
      Icon: Document,
      iconRing: 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
    },
    {
      label: 'Fully Signed',
      val: '8',
      sub: '67% completion rate',
      Icon: SuccessIcon,
      iconRing: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
      iconShape: 'circle',
    },
    {
      label: 'Pending Signature',
      val: '2',
      sub: 'Action required',
      Icon: PendingIcon,
      iconRing: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300',
      highlight: true,
    },
    {
      label: 'Compliance Score',
      val: '94%',
      sub: '2 items need attention',
      Icon: ShieldOutlineMini,
      iconRing: 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
    },
  ];

  const categories: { name: Category; count: number }[] = [
    { name: 'All Documents', count: 12 },
    { name: 'Legal', count: 3 },
    { name: 'Compliance', count: 4 },
    { name: 'Asset Docs', count: 3 },
    { name: 'Reports', count: 2 },
  ];

  const allDocs: Doc[] = [
    { name: 'Limited Partnership Agreement', id: 'DOC-001', cat: 'Legal', catLabel: 'LEGAL', asset: 'Prime Office Tower NYC', status: 'Signed (3/3)', statusType: 'signed', date: 'Sep 15, 2026', size: '2.4 MB' },
    { name: 'SEC Regulation D Filing (506c)', id: 'DOC-002', cat: 'Compliance', catLabel: 'COMPLIANCE', asset: 'Prime Office Tower NYC', status: 'Signed', statusType: 'signed', date: 'Sep 01, 2026', size: '1.1 MB' },
    { name: 'Property Appraisal Report', id: 'DOC-003', cat: 'Asset Docs', catLabel: 'ASSET DOCS', asset: 'Prime Office Tower NYC', status: 'Signed', statusType: 'signed', date: 'Aug 20, 2026', size: '8.7 MB' },
    { name: 'Q3 Investor Report 2026', id: 'DOC-004', cat: 'Reports', catLabel: 'REPORTS', asset: 'All Assets', status: 'Signed', statusType: 'signed', date: 'Oct 05, 2026', size: '3.2 MB' },
    { name: 'Subscription Agreement', id: 'DOC-005', cat: 'Legal', catLabel: 'LEGAL', asset: 'Solar Farm Alpha TX', status: 'Awaiting Signature (1/2)', statusType: 'pending', date: 'Oct 12, 2026', size: '0.9 MB' },
    { name: 'MiCA Compliance Certificate', id: 'DOC-006', cat: 'Compliance', catLabel: 'COMPLIANCE', asset: 'Riviera Residences', status: 'Awaiting Signature', statusType: 'pending', date: 'Oct 18, 2026', size: '0.5 MB' },
    { name: 'Token Offering Memorandum', id: 'DOC-007', cat: 'Legal', catLabel: 'LEGAL', asset: 'Harbor Ports PE Fund', status: 'Signed (4/4)', statusType: 'signed', date: 'Aug 01, 2026', size: '4.8 MB' },
    { name: 'Asset Valuation Certificate', id: 'DOC-008', cat: 'Asset Docs', catLabel: 'ASSET DOCS', asset: 'Alpine Art Collection', status: 'Draft', statusType: 'draft', date: 'Oct 20, 2026', size: '1.6 MB' },
    { name: 'AML/KYC Compliance Report', id: 'DOC-009', cat: 'Compliance', catLabel: 'COMPLIANCE', asset: 'All Assets', status: 'Signed', statusType: 'signed', date: 'Oct 01, 2026', size: '0.7 MB' },
    { name: 'Smart Contract Audit Report', id: 'DOC-010', cat: 'Compliance', catLabel: 'COMPLIANCE', asset: 'Harbor Ports PE Fund', status: 'Signed', statusType: 'signed', date: 'Jul 20, 2026', size: '2.1 MB' },
    { name: 'Quarterly Financial Statement', id: 'DOC-011', cat: 'Reports', catLabel: 'REPORTS', asset: 'Logistics Hub DE', status: 'Signed', statusType: 'signed', date: 'Oct 05, 2026', size: '1.4 MB' },
    { name: 'Land Registry Certificate', id: 'DOC-012', cat: 'Asset Docs', catLabel: 'ASSET DOCS', asset: 'Riviera Residences', status: 'Expired', statusType: 'expired', date: 'Mar 01, 2026', size: '0.3 MB' },
  ];

  const filteredDocs = allDocs.filter(d => {
    const matchCat = activeCategory === 'All Documents' || d.cat === activeCategory;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.asset.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const statusStyle: Record<DocStatus, string> = {
    signed: 'bg-green-50 text-green-600 border-green-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    draft: 'bg-ui-muted-deep text-ui-muted-text border-ui-border-strong',
    expired: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const catStyle: Record<string, string> = {
    LEGAL: 'bg-primary/5 text-primary border-primary/10',
    COMPLIANCE: 'bg-blue-50 text-blue-600 border-blue-100',
    'ASSET DOCS': 'bg-amber-50 text-amber-600 border-amber-100',
    REPORTS: 'bg-green-50 text-green-600 border-green-100',
  };

  function CategoryGlyph({ catLabel }: { catLabel: string }) {
    const cls = 'h-3.5 w-3.5 shrink-0';
    switch (catLabel) {
      case 'LEGAL':
        return <Document className={cls} />;
      case 'COMPLIANCE':
        return <WalletTransferIcon className={cls} />;
      case 'ASSET DOCS':
        return <WalletPolygonIcon className={`${cls} w-3`} />;
      case 'REPORTS':
        return <WalletCustodyBarsIcon className="h-3.5 w-2.5 shrink-0" />;
      default:
        return <Document className={cls} />;
    }
  }

  function StatusGlyph({ statusType }: { statusType: DocStatus }) {
    const cls = 'h-3.5 w-3.5 shrink-0';
    switch (statusType) {
      case 'signed':
        return <SuccessIcon className={cls} />;
      case 'pending':
        return <PendingIcon className={cls} />;
      case 'draft':
        return <Document className={cls} />;
      case 'expired':
        return <WalletWithdrawIcon className={cls} />;
      default:
        return <Document className={cls} />;
    }
  }

  return (
    <InvestorLayout pageTitle="Documents">
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Documents</h1>
            <p className="text-sm text-ui-faint mt-1 font-medium">Legal agreements, compliance filings, and asset documentation — all in one secure vault.</p>
          </div>
          <button className="self-start sm:self-auto px-5 md:px-7 py-3 bg-primary text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Upload Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`rounded-[20px] border p-4 shadow-sm md:rounded-[28px] md:p-6 ${
                s.highlight
                  ? 'border-amber-100/80 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/25'
                  : 'border-ui-border bg-ui-card dark:border-zinc-800 dark:bg-zinc-900/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                    s.iconShape === 'circle' ? 'rounded-full' : 'rounded-xl'
                  } ${s.iconRing}`}
                >
                  <s.Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="mb-0.5 truncate text-[9px] font-bold uppercase tracking-widest text-ui-faint">{s.label}</p>
                  <p className={`text-xl font-bold md:text-2xl ${s.highlight ? 'text-amber-600' : 'text-ui-strong'}`}>
                    {s.val}
                  </p>
                  <p
                    className={`hidden text-[10px] font-medium sm:block ${s.highlight ? 'text-amber-600/90' : 'text-ui-faint'}`}
                  >
                    {s.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 md:px-5 py-2 rounded-full text-[12px] font-bold transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat.name
                    ? 'bg-slate-900 text-white shadow-md dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {cat.name}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                    activeCategory === cat.name
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56 md:w-72 shrink-0">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ui-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2.5 bg-ui-card border border-ui-border rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary/5 shadow-sm"
            />
          </div>
        </div>

        {/* Upload Zone */}
        <div className="group cursor-pointer rounded-[20px] border-2 border-dashed border-ui-border bg-ui-card/95 p-4 shadow-sm transition-colors hover:border-violet-300 hover:bg-ui-card md:rounded-[28px] md:p-6 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-violet-500/50">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition-transform group-hover:scale-105 dark:bg-violet-950/60 dark:text-violet-300">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 11l-3-3m0 0l-3 3m3-3V4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ui-strong">
                <span className="text-primary underline">Click to upload</span> or drag &amp; drop files here
              </p>
              <p className="text-[11px] text-ui-faint font-medium">PDF, DOCX, XLSX up to 50MB · Encrypted at rest</p>
            </div>
            <button type="button" className="shrink-0 text-ui-placeholder transition-colors hover:text-ui-faint" aria-label="Encrypted upload">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-hidden rounded-[20px] border border-ui-border bg-ui-card/95 shadow-sm md:rounded-[32px] dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[680px]">
              <thead>
                <tr className="border-b border-ui-divider">
                  {['Document', 'Category', 'Asset', 'Status', 'Date', 'Size'].map(h => (
                    <th key={h} className="px-4 md:px-8 py-4 text-[9px] font-bold text-ui-faint uppercase tracking-widest bg-transparent">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center">
                      <p className="text-[13px] font-medium text-ui-faint">No documents found matching your search.</p>
                    </td>
                  </tr>
                ) : filteredDocs.map((doc, i) => (
                  <tr key={i} className="hover:bg-ui-muted-deep/40 transition-colors group cursor-pointer">
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-ui-muted-deep text-ui-faint group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] md:text-[13px] font-bold text-ui-strong truncate max-w-[140px] md:max-w-[220px] group-hover:text-primary transition-colors">{doc.name}</p>
                          <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">{doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold whitespace-nowrap ${catStyle[doc.catLabel]}`}
                      >
                        <CategoryGlyph catLabel={doc.catLabel} />
                        {doc.catLabel}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {doc.asset === 'All Assets' ? (
                          <WalletCustodyBarsIcon className="h-3.5 w-2.5 shrink-0 text-ui-placeholder" aria-hidden />
                        ) : (
                          <WalletPolygonIcon className="h-3.5 w-3 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
                        )}
                        <p className="text-[12px] font-medium text-ui-muted-text">{doc.asset}</p>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold whitespace-nowrap ${statusStyle[doc.statusType]}`}
                      >
                        <StatusGlyph statusType={doc.statusType} />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <span className="text-[11px] font-medium text-ui-faint whitespace-nowrap">{doc.date}</span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <span className="text-[11px] font-medium text-ui-faint">{doc.size}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </InvestorLayout>
  );
}
