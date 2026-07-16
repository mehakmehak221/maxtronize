'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Copy,
  UploadCloud,
  Eye,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Globe,
  HelpCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import InvestorLayout from '@/components/InvestorLayout';

export default function CompliancePage() {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText('KYX-7A91-23D2-8F47');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <InvestorLayout pageTitle="KYC / AML Verification">
      <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Top Header Row */}
        <div className="space-y-1.5 border-b border-card-border pb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
            <span>Platform</span>
            <span>&gt;</span>
            <span>Compliance</span>
            <span>&gt;</span>
            <span className="text-[#7C3AED]">KYC / AML Verification</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-2">Enhanced KYC / AML Verification</h1>
          <p className="text-base text-text-muted">
            Complete verification to unlock investment opportunities on Maxtronize.
          </p>
        </div>

        {/* Verification Summary Card */}
        <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col md:flex-row justify-between items-stretch gap-6">
          {/* Status block */}
          <div className="flex items-center gap-5 md:w-1/3 md:border-r border-card-border md:pr-6">
            <div className="h-16 w-16 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Your Verification Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-foreground">Verified</span>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-[10px] text-text-muted mt-1 leading-snug">You are eligible to invest in open offerings.</p>
            </div>
          </div>

          {/* Compliance Score block */}
          <div className="flex flex-col justify-center items-center text-center md:w-1/3 md:border-r border-card-border px-6 py-4 md:py-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Compliance Score</span>
            <span className="text-3xl font-black text-foreground mt-2">98%</span>
            <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[8px] font-black tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mt-2">
              Excellent
            </span>
          </div>

          {/* Verification Details */}
          <div className="flex flex-col justify-center gap-2.5 md:w-1/3 pl-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">Last Verified On</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mt-1">
                <Calendar className="h-3.5 w-3.5 text-text-muted" />
                <span>May 20, 2024 · 3:15 PM UTC</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">Reference ID</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-foreground font-mono">KYX-7A91-23D2-8F47</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="text-text-muted hover:text-foreground transition-colors relative"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied && (
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[8px] font-bold text-emerald-500 whitespace-nowrap">
                      Copied
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Multi Column Layout */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          
          {/* Column 1 (4 cols): Verification Progress */}
          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Verification Progress</h4>
                <p className="text-[10px] text-text-muted mt-1 leading-snug">Your KYC/AML verification is complete.</p>
              </div>

              {/* Progress Steps list */}
              <div className="relative border-l border-card-border pl-6 space-y-5 ml-3">
                {[
                  { name: 'Identity Verification', sub: 'Government ID' },
                  { name: 'Document Verification', sub: 'Documents authenticated' },
                  { name: 'Address Verification', sub: 'Proof of address' },
                  { name: 'AML Screening', sub: 'Sanctions & watchlist clear' },
                  { name: 'PEP Screening', sub: 'No PEP match found' },
                  { name: 'Wallet Verification', sub: 'Wallet ownership' },
                  { name: 'Whitelist Approval', sub: 'Eligible to invest', tag: 'Approved' },
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[32px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_0_3px_rgba(16,185,129,0.1)]">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <div className="flex justify-between items-baseline gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-foreground leading-tight">{step.name}</h5>
                        <p className="text-[9px] text-text-muted font-bold mt-0.5">{step.sub}</p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">
                        {step.tag || 'Verified'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 (4 cols): Documents Uploaded */}
          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[480px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-card-border pb-3 mb-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Documents Uploaded</h4>
                  <button type="button" className="text-[10px] font-bold text-[#7C3AED] hover:underline uppercase">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Passport', sub: 'United States · Passport', date: 'May 20, 2024' },
                    { name: 'Government ID', sub: "Driver's License", date: 'May 20, 2024' },
                    { name: 'Selfie Verification', sub: 'Biometric check passed', date: 'May 20, 2024' },
                    { name: 'Proof of Address', sub: 'Utility Bill', date: 'May 10, 2024' },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/10 p-3.5 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-extrabold text-foreground">{doc.name}</h5>
                          <span className="text-[8px] font-black text-emerald-500 uppercase">Verified</span>
                        </div>
                        <span className="text-[10px] text-text-muted mt-0.5 block">{doc.sub}</span>
                        <span className="text-[8px] text-text-muted block mt-1">{doc.date}</span>
                      </div>
                      <button type="button" className="text-text-muted hover:text-[#7C3AED] transition-colors shrink-0">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Box */}
              <div className="rounded-2xl border-2 border-dashed border-card-border hover:border-purple-500/50 bg-slate-50/50 dark:bg-slate-900/10 p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
                <UploadCloud className="h-7 w-7 text-text-muted" />
                <span className="text-xs font-extrabold text-foreground block">Upload New Document</span>
                <span className="text-[10px] text-text-muted leading-tight block">Drag & drop or click to upload</span>
              </div>
            </div>
          </div>

          {/* Column 3 (4 cols): Third-Party, Jurisdiction, Help */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Third-Party Verification */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Third-Party Verification</h4>
              
              <div className="space-y-3.5 text-xs font-bold">
                {[
                  { label: 'Identity Verification', status: 'Verified', valColor: 'text-emerald-500' },
                  { label: 'Document Verification', status: 'Verified', valColor: 'text-emerald-500' },
                  { label: 'AML Screening', status: 'Clear', valColor: 'text-emerald-500' },
                  { label: 'Risk Assessment', status: 'Low Risk', valColor: 'text-orange-500' },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center text-text-muted">
                    <span>{row.label}</span>
                    <span className={`font-black ${row.valColor}`}>{row.status}</span>
                  </div>
                ))}
              </div>

              <button type="button" className="text-xs font-black tracking-widest text-[#7C3AED] hover:underline uppercase pt-4 border-t border-card-border w-full flex items-center justify-center gap-1.5">
                <span>View Full Report</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Jurisdiction Eligibility */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Jurisdiction Eligibility</h4>
              
              <div className="space-y-3 text-xs font-bold">
                {[
                  { label: 'United States', status: 'Allowed', color: 'text-emerald-500' },
                  { label: 'UAE', status: 'Allowed', color: 'text-emerald-500' },
                  { label: 'Singapore', status: 'Allowed', color: 'text-emerald-500' },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center text-text-muted">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-text-muted" />
                      <span>{row.label}</span>
                    </div>
                    <span className={`font-black ${row.color}`}>{row.status}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-text-muted pt-3 border-t border-card-border">
                <span>Restricted Countries</span>
                <span className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 px-2 py-0.5 text-[10px] font-black text-rose-500">
                  3
                </span>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute right-[-10px] bottom-[-20px] opacity-5 text-[#7C3AED] pointer-events-none">
                <HelpCircle className="h-28 w-28" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Need Help?</h4>
              <p className="text-xs text-text-muted leading-relaxed">Our compliance team is here to assist you with KYC setup.</p>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900/10 border border-card-border px-5 py-3 text-xs font-bold text-[#7C3AED] hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all shadow-sm"
              >
                <span>Contact Support</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Recent Verification Activity Card */}
        <div className="rounded-3xl border border-card-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-card-border flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Recent Verification Activity</h4>
            <button type="button" className="text-[10px] font-bold text-[#7C3AED] hover:underline uppercase">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-card-border bg-slate-50 dark:bg-slate-900/20 text-[9px] font-black uppercase tracking-widest text-text-muted">
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-xs font-bold text-text-muted">
                {[
                  { time: 'May 20, 2024 3:15 PM', act: 'KYC Verification Completed', provider: 'Sumsub', status: 'Verified', statColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                  { time: 'May 20, 2024 3:10 PM', act: 'AML Screening Completed', provider: 'Refinitiv', status: 'Clear', statColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                  { time: 'May 20, 2024 3:05 PM', act: 'Document Verification Completed', provider: 'Sumsub', status: 'Verified', statColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                  { time: 'May 20, 2024 3:00 PM', act: 'Identity Verification Started', provider: 'Sumsub', status: 'Completed', statColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-normal text-[10px]">{row.time}</td>
                    <td className="px-6 py-4 text-foreground font-black">{row.act}</td>
                    <td className="px-6 py-4 text-text-muted font-bold">{row.provider}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-[8px] font-black tracking-wider uppercase ${row.statColor}`}>
                        {row.status}
                      </span>
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
