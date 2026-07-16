'use client';

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Activity,
  ChevronDown,
  Sparkles,
  Search,
  ZoomIn,
  Printer,
  Copy,
  Eye,
  Share2,
  Send,
  Check,
  AlertCircle,
  FileSignature,
  Sliders,
  Scale,
  BookOpen,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function LegalDocumentsPage() {
  // Config state
  const [assetName, setAssetName] = useState('Manhattan Skyline Portfolio');
  const [spvName, setSpvName] = useState('Skyline Tokenized Holdings LLC');
  const [fundingTarget, setFundingTarget] = useState('25,000,000');
  const [tokenSupply, setTokenSupply] = useState('1,000,000');
  const [governanceType, setGovernanceType] = useState('Standard Preferred - Series A Equivalent');
  const [yieldPeriod, setYieldPeriod] = useState<'quarterly' | 'monthly'>('quarterly');
  const [votingThreshold, setVotingThreshold] = useState(51);

  // Template Search state
  const [templateSearch, setTemplateSearch] = useState('');

  return (
    <DashboardLayout>
      <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500 pb-24">

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">Legal Documents</h3>
            <p className="text-base text-text-muted">
              Generate, customize, review, and manage legal documentation for your tokenized assets.
            </p>
          </div>
          <div className="rounded-3xl border border-card-border bg-card px-5 py-3 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Compliance Score</span>
            <div className="flex items-center gap-1">
              <span className="text-base font-extrabold text-foreground">96%</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Generated Documents',
              value: '24',
              sub: '+3 this week',
              well: 'border-card-border bg-card',
              icon: FileText,
              iconColor: 'text-violet-600',
              bgCircle: 'bg-violet-50 dark:bg-violet-950/20',
            },
            {
              label: 'Pending Review',
              value: '3',
              sub: 'Requires Attention',
              well: 'border-rose-200 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10',
              icon: Clock,
              iconColor: 'text-rose-500',
              bgCircle: 'bg-rose-50 dark:bg-rose-950/20',
            },
            {
              label: 'Approved',
              value: '18',
              sub: 'Ready for Issuance',
              well: 'border-card-border bg-card',
              icon: CheckCircle2,
              iconColor: 'text-emerald-500',
              bgCircle: 'bg-emerald-50 dark:bg-emerald-950/20',
            },
            {
              label: 'System Health',
              value: 'Active',
              sub: '99.98% uptime',
              well: 'bg-primary text-white border-primary shadow-md shadow-primary/10',
              icon: Activity,
              iconColor: 'text-white',
              bgCircle: 'bg-white/10 border border-white/20',
              isDark: true,
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className={`rounded-3xl border p-6 shadow-sm flex flex-col justify-between min-h-[120px] ${kpi.well}`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${kpi.isDark ? 'text-white/80' : 'text-text-muted'}`}>
                  {kpi.label}
                </p>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${kpi.bgCircle}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.iconColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-2xl font-extrabold leading-none ${kpi.isDark ? 'text-white' : 'text-foreground'}`}>
                  {kpi.value}
                </p>
                <p className={`text-[10px] font-bold mt-1.5 ${kpi.isDark ? 'text-white/70' : 'text-text-muted'}`}>
                  {kpi.sub}
                </p>
              </div>
            </div>
          ))}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (Spans 7) */}
          <div className="lg:col-span-7 space-y-8">

            {/* Document Configuration */}
            <div className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="flex items-center gap-2.5 font-extrabold text-foreground text-base">
                  <Sliders className="h-5 w-5 text-primary" />
                  Document Configuration
                </h4>
                <span className="rounded-md bg-violet-50 text-violet-600 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase">
                  DE Jurisdiction Compatible
                </span>
              </div>

              <div className="space-y-4">
                {/* Inputs Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-2xl px-4 py-3 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                      SPV Name
                    </label>
                    <input
                      type="text"
                      value={spvName}
                      onChange={(e) => setSpvName(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-2xl px-4 py-3 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Inputs Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Fundraising Target
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">$</span>
                      <input
                        type="text"
                        value={fundingTarget}
                        onChange={(e) => setFundingTarget(e.target.value)}
                        className="w-full bg-surface border border-card-border rounded-2xl pl-8 pr-4 py-3 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Token Supply
                    </label>
                    <input
                      type="text"
                      value={tokenSupply}
                      onChange={(e) => setTokenSupply(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-2xl px-4 py-3 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Governance Options */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                    Investor Rights & Governance
                  </label>
                  <div className="relative">
                    <select
                      value={governanceType}
                      onChange={(e) => setGovernanceType(e.target.value)}
                      className="w-full bg-surface border border-card-border rounded-2xl px-4 py-3 text-xs font-bold text-foreground appearance-none focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="Standard Preferred - Series A Equivalent">Standard Preferred - Series A Equivalent</option>
                      <option value="Common Stock - Vote Enabled">Common Stock - Vote Enabled</option>
                      <option value="Limited Partner - Silent Share">Limited Partner - Silent Share</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Yield & Voting Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-3">
                      Yield Distribution
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer">
                        <input
                          type="radio"
                          name="yieldPeriod"
                          checked={yieldPeriod === 'quarterly'}
                          onChange={() => setYieldPeriod('quarterly')}
                          className="h-4 w-4 text-primary focus:ring-primary border-card-border bg-surface"
                        />
                        <span>Quarterly</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer">
                        <input
                          type="radio"
                          name="yieldPeriod"
                          checked={yieldPeriod === 'monthly'}
                          onChange={() => setYieldPeriod('monthly')}
                          className="h-4 w-4 text-primary focus:ring-primary border-card-border bg-surface"
                        />
                        <span>Monthly</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Voting Threshold
                    </label>
                    <div className="space-y-2 pt-1.5">
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={votingThreshold}
                        onChange={(e) => setVotingThreshold(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex items-center justify-between text-[9px] font-extrabold text-text-muted uppercase tracking-wider">
                        <span>51% (Majority)</span>
                        <span className="text-primary font-black">{votingThreshold}%</span>
                        <span>75% (Supermajority)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Missing Clause recommendation alert */}
                <div className="rounded-2xl border border-violet-100 dark:border-violet-950/50 bg-violet-50/40 dark:bg-violet-950/25 p-5 flex gap-3.5 items-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs leading-relaxed font-bold text-foreground/90">
                      Missing clause detected: Based on Delaware Title 6, you should include a &quot;Manager Exculpation&quot; provision to protect stakeholders in decentralized governance models.
                    </p>
                    <button
                      type="button"
                      className="text-xs font-black text-primary hover:text-primary-hover mt-3 block transition-colors uppercase tracking-wider"
                    >
                      Apply recommendation
                    </button>
                  </div>
                </div>

                {/* Version history list */}
                <div className="pt-4 border-t border-card-border space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Version History & Activity</h5>
                  <div className="relative border-l border-border dark:border-card-border pl-4 space-y-4">
                    {[
                      {
                        title: 'Operating Agreement Generated',
                        detail: 'Today, 10:24 AM • By Alexander Reed',
                        color: 'bg-primary',
                      },
                      {
                        title: 'Template Updated to v2.4.1',
                        detail: 'Yesterday, 4:15 PM • System Admin',
                        color: 'bg-gray-400 dark:bg-gray-600',
                      },
                    ].map((history, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[21px] top-1 flex h-2 w-2 rounded-full ${history.color} ring-4 ring-card`} />
                        <p className="text-xs font-extrabold text-foreground leading-none">{history.title}</p>
                        <p className="text-[9px] font-semibold text-text-muted mt-1">{history.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Compliance Validation */}
            <div className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-foreground text-base">Compliance Validation</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-primary">96%</span>
                  <div className="h-6 w-6 rounded-full border-4 border-primary border-r-transparent animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'SEC Regulation D Compatible', success: true },
                  { label: 'SPV Entity Property Referenced', success: true },
                  { label: 'Missing Manager Signature Block', warning: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-colors ${item.success
                      ? 'border-emerald-100 bg-emerald-50/20 dark:border-emerald-950/20 dark:bg-emerald-950/5'
                      : 'border-rose-100 bg-rose-50/20 dark:border-rose-950/20 dark:bg-rose-950/5'
                      }`}
                  >
                    {item.success ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-rose-500" />
                    )}
                    <span className={`text-xs font-extrabold ${item.success ? 'text-foreground/90' : 'text-rose-600 dark:text-rose-400'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Spans 5) */}
          <div className="lg:col-span-5 space-y-8">

            {/* Live Preview */}
            <div className="rounded-3xl border border-card-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-card-border bg-card flex items-center justify-between">
                <h4 className="font-extrabold text-foreground text-base">Live Preview</h4>
                <div className="flex items-center gap-3.5 text-text-muted">
                  <button className="hover:text-primary transition-colors"><ZoomIn className="h-4.5 w-4.5" /></button>
                  <button className="hover:text-primary transition-colors"><Printer className="h-4.5 w-4.5" /></button>
                </div>
              </div>

              {/* Document Mock Preview container */}
              <div className="p-6 bg-surface/50 border-b border-card-border flex justify-center">
                <div className="w-full max-w-[340px] bg-card border border-card-border shadow-md rounded-2xl p-6 space-y-6 aspect-[1/1.4] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                        <Scale className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[9px] text-foreground tracking-widest">MAXTRONIZE</p>
                        <p className="text-[7px] text-text-muted font-bold tracking-wider">Legal Engineering Lab</p>
                      </div>
                    </div>

                    <div className="text-center py-2">
                      <h5 className="font-black text-sm text-foreground uppercase tracking-wider leading-snug">
                        Limited Liability Company<br />Operating Agreement
                      </h5>
                      <div className="h-0.5 w-16 bg-foreground mx-auto mt-2.5" />
                    </div>

                    <div className="space-y-2 text-[8px] text-text-muted leading-relaxed font-semibold">
                      <p>
                        This OPERATING AGREEMENT (this &quot;Agreement&quot;) of <span className="text-foreground font-black underline">{spvName}</span>, is entered into as of the date of execution by and among the Company and each person listed on Exhibit A hereto as a Member of the Company.
                      </p>
                      <p className="font-extrabold text-foreground uppercase tracking-wider mt-3">Article 1: Definitions</p>
                      <p>
                        &quot;Asset&quot; means the real property located at <span className="text-foreground font-black">{assetName}</span> as described in the Smart Contract Metadata associated with the Tokenized Issuance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[7px] text-text-muted border-t border-border pt-3">
                    <span>Securities Act 1933</span>
                    <span>Page 1 of 12</span>
                    <span>SEC Reg D / Rule 506(c)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Library */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Template Library</h4>
                <BookOpen className="h-4.5 w-4.5 text-text-muted" />
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Template Items */}
              <div className="space-y-4">
                {[
                  {
                    category: 'Entity Formation',
                    templates: [
                      { title: 'Operating Agreement', desc: 'Delaware, US', version: 'v2.4.1', active: true },
                      { title: 'Shareholder Agreement', desc: 'Cayman Islands', version: 'v1.8.0' },
                    ]
                  },
                  {
                    category: 'Offering Documents',
                    templates: [
                      { title: 'Offering Memorandum', desc: 'Global Standard', version: 'v3.1.2' },
                    ]
                  },
                  {
                    category: 'Compliance',
                    templates: [
                      { title: 'KYC/AML Declaration', desc: 'FATF Compliant', version: 'v4.0.0' },
                    ]
                  }
                ].map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{sec.category}</p>
                    <div className="space-y-2">
                      {sec.templates.map((tpl, tIdx) => (
                        <div
                          key={tIdx}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${tpl.active
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-card-border bg-surface/50 hover:bg-surface'
                            }`}
                        >
                          <div>
                            <p className="font-extrabold text-xs text-foreground">{tpl.title}</p>
                            <p className="text-[9px] font-bold text-text-muted mt-0.5">{tpl.desc}</p>
                          </div>
                          <span className="text-[9px] font-black text-text-muted">{tpl.version}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Action Footer Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-500">
          <div className="rounded-3xl border border-card-border bg-card p-4 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-2xl border border-card-border bg-surface hover:bg-border px-4 py-3 text-xs font-black uppercase tracking-wider text-foreground transition-all"
              >
                Save Draft
              </button>
              <div className="flex items-center gap-1.5 text-text-muted border-l border-border pl-2.5">
                <button className="p-2 hover:text-primary transition-colors"><Copy className="h-4.5 w-4.5" /></button>
                <button className="p-2 hover:text-primary transition-colors"><Eye className="h-4.5 w-4.5" /></button>
                <button className="p-2 hover:text-primary transition-colors"><Share2 className="h-4.5 w-4.5" /></button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-2xl border border-card-border bg-surface hover:bg-border px-4 py-3 text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send for Review</span>
              </button>
              <button
                type="button"
                className="rounded-2xl bg-primary hover:bg-primary-hover px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-primary/15 flex items-center gap-1.5 transition-all"
              >
                <FileSignature className="h-4 w-4" />
                <span>Generate Final Document</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
