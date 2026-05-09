'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function DocumentsPage() {
  const stats = [
    { label: 'Total Documents', value: '12', sub: 'Across all assets', icon: '📄', color: 'bg-ui-card text-ui-strong border border-ui-border' },
    { label: 'Fully Signed', value: '8', sub: '67% completion rate', icon: '✅', color: 'bg-ui-card text-ui-strong border border-ui-border' },
    { label: 'Pending Signature', value: '2', sub: 'Action required', icon: '⏳', color: 'bg-amber-50 text-amber-900 border border-amber-100' },
    { label: 'Compliance Score', value: '94%', sub: '2 items need attention', icon: '🛡️', color: 'bg-ui-card text-ui-strong border border-ui-border' },
  ];

  const categories = [
    { name: 'All Documents', count: 12 },
    { name: 'Legal', count: 3 },
    { name: 'Compliance', count: 4 },
    { name: 'Asset Docs', count: 3 },
    { name: 'Reports', count: 2 },
  ];

  const documents = [
    { name: 'Limited Partnership Agreement', id: 'DOC-001', cat: 'LEGAL', asset: 'Prime Office Tower NYC', status: 'Signed (3/3)', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Sep 15, 2026', size: '2.4 MB' },
    { name: 'SEC Regulation D Filing (506c)', id: 'DOC-002', cat: 'COMPLIANCE', asset: 'Prime Office Tower NYC', status: 'Signed', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Sep 01, 2026', size: '1.1 MB' },
    { name: 'Property Appraisal Report', id: 'DOC-003', cat: 'ASSET DOCS', asset: 'Prime Office Tower NYC', status: 'Signed', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Aug 20, 2026', size: '8.7 MB' },
    { name: 'Q3 Investor Report 2026', id: 'DOC-004', cat: 'REPORTS', asset: 'All Assets', status: 'Signed', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Oct 05, 2026', size: '3.2 MB' },
    { name: 'Subscription Agreement', id: 'DOC-005', cat: 'LEGAL', asset: 'Solar Farm Alpha TX', status: 'Awaiting Signature (1/2)', statusColor: 'bg-amber-50 text-amber-600 border-amber-100', date: 'Oct 12, 2026', size: '0.9 MB' },
    { name: 'MiCA Compliance Certificate', id: 'DOC-006', cat: 'COMPLIANCE', asset: 'Riviera Residences', status: 'Awaiting Signature', statusColor: 'bg-amber-50 text-amber-600 border-amber-100', date: 'Oct 18, 2026', size: '0.5 MB' },
    { name: 'Token Offering Memorandum', id: 'DOC-007', cat: 'LEGAL', asset: 'Harbor Ports PE Fund', status: 'Signed (4/4)', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Aug 10, 2026', size: '4.8 MB' },
    { name: 'Asset Valuation Certificate', id: 'DOC-008', cat: 'ASSET DOCS', asset: 'Alpine Art Collection', status: 'Draft', statusColor: 'bg-ui-muted-deep text-ui-muted-text border-ui-border-strong', date: 'Oct 20, 2026', size: '1.6 MB' },
    { name: 'AML/KYC Compliance Report', id: 'DOC-009', cat: 'COMPLIANCE', asset: 'All Assets', status: 'Signed', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Oct 01, 2026', size: '0.7 MB' },
    { name: 'Smart Contract Audit Report', id: 'DOC-010', cat: 'COMPLIANCE', asset: 'Harbor Ports PE Fund', status: 'Signed', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Jul 20, 2026', size: '2.1 MB' },
    { name: 'Quarterly Financial Statement', id: 'DOC-011', cat: 'REPORTS', asset: 'Logistics Hub DE', status: 'Signed', statusColor: 'bg-green-50 text-green-600 border-green-100', date: 'Oct 05, 2026', size: '1.4 MB' },
    { name: 'Land Registry Certificate', id: 'DOC-012', cat: 'ASSET DOCS', asset: 'Riviera Residences', status: 'Expired', statusColor: 'bg-rose-50 text-rose-600 border-rose-100', date: 'Mar 01, 2026', size: '0.3 MB' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Documents</h1>
            <p className="text-sm text-ui-faint font-medium">Legal agreements, compliance filings, and asset documentation — all in one secure vault.</p>
          </div>
          <button className="self-start sm:self-auto px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Upload Document
          </button>
        </div>

        {/* Stats Grid — 2×2 on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className={`p-4 md:p-8 rounded-[20px] md:rounded-[32px] shadow-sm flex items-center gap-3 md:gap-6 ${s.color}`}>
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 ${s.label === 'Pending Signature' ? 'bg-amber-100 text-amber-500' : 'bg-ui-muted-deep text-ui-strong'}`}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-0.5 md:mb-1 truncate">{s.label}</p>
                <h4 className="text-xl md:text-2xl font-bold text-ui-strong">{s.value}</h4>
                <p className="text-[9px] md:text-[10px] text-ui-faint font-medium hidden sm:block">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Scrollable filter tabs */}
          <div className="flex items-center gap-2 p-1 bg-ui-muted-deep/50 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[12px] md:text-[13px] font-bold transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap shrink-0 ${
                  i === 0 ? 'bg-dash-filter-active-bg text-dash-filter-active-fg shadow-lg' : 'text-ui-faint hover:text-ui-body'
                }`}
              >
                {cat.name}
                <span className={`w-4 h-4 md:w-5 md:h-5 rounded-md flex items-center justify-center text-[9px] md:text-[10px] ${
                  i === 0 ? 'bg-dash-filter-active-badge-bg' : 'bg-dash-filter-count-bg'
                }`}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative group w-full sm:w-auto sm:min-w-[260px] md:min-w-[320px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-11 pr-6 py-3.5 bg-ui-card border border-ui-border rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Upload Zone */}
        <div className="p-6 md:p-10 border-2 border-dashed border-ui-border rounded-[24px] md:rounded-[40px] bg-ui-card hover:bg-ui-muted-surface transition-colors cursor-pointer group">
          <div className="flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-ui-strong mb-1">
                <span className="text-primary underline cursor-pointer">Click to upload</span> or drag & drop files here
              </p>
              <p className="text-[11px] text-ui-faint font-medium">PDF, DOCX, XLSX up to 50MB · Encrypted at rest</p>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[40px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-ui-muted-surface border-b border-ui-border">
                  <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Document</th>
                  <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Category</th>
                  <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Asset</th>
                  <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Status</th>
                  <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Date</th>
                  <th className="px-4 md:px-10 py-4 md:py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {documents.map((doc, i) => (
                  <tr key={i} className="hover:bg-ui-muted-surface transition-colors group cursor-pointer">
                    <td className="px-4 md:px-10 py-4 md:py-6">
                      <div className="flex items-center gap-3 md:gap-5">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-ui-muted-deep text-ui-faint flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] md:text-[13px] font-bold text-ui-strong mb-0.5 truncate max-w-[160px] md:max-w-none">{doc.name}</p>
                          <p className="text-[10px] font-medium text-ui-faint uppercase tracking-widest">{doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-6">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-bold border border-primary/10 whitespace-nowrap">
                        {doc.cat}
                      </span>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-6">
                      <p className="text-[12px] font-medium text-ui-muted-text whitespace-nowrap">{doc.asset}</p>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit whitespace-nowrap ${doc.statusColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${doc.statusColor.split(' ')[1].replace('text-', 'bg-')}`}></div>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-6">
                      <span className="text-[11px] font-medium text-ui-faint whitespace-nowrap">{doc.date}</span>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-6">
                      <span className="text-[11px] font-medium text-ui-faint">{doc.size}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
