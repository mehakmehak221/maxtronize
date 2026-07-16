'use client';

import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  ChevronDown,
  Sparkles,
  Share2,
  Copy,
  Send,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Scale,
} from 'lucide-react';

export function HubLegalDocumentsTab() {
  // Document Configuration State
  const [assetName, setAssetName] = useState('Manhattan Skyline Portfolio');
  const [spvName, setSpvName] = useState('Skyline Tokenized Holdings LLC');
  const [targetAmount, setTargetAmount] = useState('$ 25,000,000');
  const [tokenSupply, setTokenSupply] = useState('1,000,000');
  const [governance, setGovernance] = useState('Standard Preferred - Series A Equivalent');
  const [yieldDist, setYieldDist] = useState('Quarterly');
  const [votingThreshold, setVotingThreshold] = useState(53);
  
  // Missing clause recommendation state
  const [clauseApplied, setClauseApplied] = useState(false);

  // Template Library active selection
  const [activeTemplate, setActiveTemplate] = useState('Operating Agreement');

  return (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="mb-1 text-lg font-bold text-foreground">Legal Documents</h3>
          <p className="text-base text-text-muted">
            Generate, customize, review, and manage legal documentation for your tokenized assets.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-card-border bg-card px-5 py-3 shadow-sm">
          <div className="text-right">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">Compliance Score</span>
            <span className="text-base font-extrabold text-emerald-500">96%</span>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'GENERATED DOCUMENTS',
            value: '24',
            sub: '+3 this week',
            subClass: 'text-purple-500 dark:text-purple-400 font-bold',
            icon: FileText,
            iconClass: 'text-[#7C3AED]',
            bgIcon: 'bg-purple-50 dark:bg-purple-950/40',
          },
          {
            label: 'PENDING REVIEW',
            value: '3',
            sub: 'Requires Attention',
            subClass: 'text-rose-500 font-bold',
            icon: Clock,
            iconClass: 'text-rose-500',
            bgIcon: 'bg-rose-50 dark:bg-rose-950/40',
          },
          {
            label: 'APPROVED',
            value: '18',
            sub: 'Ready for issuance',
            subClass: 'text-emerald-500 font-bold',
            icon: CheckCircle2,
            iconClass: 'text-emerald-500',
            bgIcon: 'bg-emerald-50 dark:bg-emerald-950/40',
          },
          {
            label: 'SYSTEM HEALTH',
            value: 'Active',
            sub: 'All systems operational',
            subClass: 'text-purple-200 font-medium',
            isSpecial: true,
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[115px] relative overflow-hidden ${
              kpi.isSpecial
                ? 'bg-gradient-to-br from-[#1E1B4B] to-[#4F46E5] text-white border border-indigo-950/30'
                : 'border border-card-border bg-card'
            }`}
          >
            {kpi.isSpecial && (
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-white pointer-events-none">
                <Scale className="h-28 w-28" />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${kpi.isSpecial ? 'text-purple-200' : 'text-text-muted'}`}>
                  {kpi.label}
                </span>
                <span className={`text-3xl font-extrabold mt-2 block ${kpi.isSpecial ? 'text-white' : 'text-foreground'}`}>
                  {kpi.value}
                </span>
              </div>
              {!kpi.isSpecial && kpi.icon && (
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${kpi.bgIcon}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconClass}`} />
                </div>
              )}
            </div>
            <div className={`text-xs mt-3 ${kpi.subClass}`}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        
        {/* Left Column (8 cols): Document Config + Activity + Compliance list */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Document Configuration Card */}
          <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div>
                <h4 className="text-base font-extrabold text-foreground">Document Configuration</h4>
                <p className="text-xs text-text-muted mt-0.5">Modify parameters for Operating Agreement</p>
              </div>
              <span className="rounded-full bg-purple-50 dark:bg-purple-950/40 px-3 py-1 text-[10px] font-bold tracking-wider text-[#7C3AED] uppercase">
                DE Jurisdiction Compatible
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  SPV Name
                </label>
                <input
                  type="text"
                  value={spvName}
                  onChange={(e) => setSpvName(e.target.value)}
                  className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Fundraising Target
                </label>
                <input
                  type="text"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Token Supply
                </label>
                <input
                  type="text"
                  value={tokenSupply}
                  onChange={(e) => setTokenSupply(e.target.value)}
                  className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Investor Rights & Governance */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                Investor Rights & Governance
              </label>
              <div className="relative">
                <select
                  value={governance}
                  onChange={(e) => setGovernance(e.target.value)}
                  className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3.5 text-sm font-bold text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option>Standard Preferred - Series A Equivalent</option>
                  <option>Common Equity - Delaware Compliant</option>
                  <option>Custom Governance Structure</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Yield Distribution & Voting Threshold */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-3">
                  Yield Distribution
                </label>
                <div className="flex items-center gap-6">
                  {['Quarterly', 'Monthly'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none">
                      <input
                        type="radio"
                        name="yieldDist"
                        checked={yieldDist === type}
                        onChange={() => setYieldDist(type)}
                        className="h-4.5 w-4.5 rounded-full border-card-border text-[#7C3AED] focus:ring-purple-500/20 focus:ring-2"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                    Voting Threshold
                  </label>
                  <span className="text-xs font-bold text-foreground">{votingThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={votingThreshold}
                  onChange={(e) => setVotingThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                />
                <div className="flex justify-between text-[8px] font-black tracking-wider text-text-muted uppercase mt-1">
                  <span>50% (Majority)</span>
                  <span>75% (Supermajority)</span>
                </div>
              </div>
            </div>

            {/* Suggestion Box */}
            <div className={`rounded-2xl p-5 border transition-all duration-300 ${
              clauseApplied 
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30' 
                : 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/30'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${
                  clauseApplied ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-[#7C3AED]'
                }`}>
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-foreground mb-1">
                    {clauseApplied ? 'Recommendation Applied Successfully' : 'Missing clause detected'}
                  </h5>
                  <p className="text-xs text-text-muted leading-relaxed mb-3">
                    {clauseApplied
                      ? 'The "Manager Exculpation" provision has been added to Article IV of the Operating Agreement.'
                      : 'Based on Delaware Title 6, you should include a "Manager Exculpation" provision to protect stakeholders in decentralized governance models.'}
                  </p>
                  {!clauseApplied && (
                    <button
                      type="button"
                      onClick={() => setClauseApplied(true)}
                      className="text-xs font-black tracking-wider uppercase text-[#7C3AED] hover:underline"
                    >
                      Apply recommendation
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Version History & Activity */}
            <div className="pt-6 border-t border-card-border">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-4">
                Version History & Activity
              </span>
              <div className="relative border-l border-card-border pl-6 space-y-6 ml-2.5">
                <div className="relative">
                  <span className="absolute -left-[30px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-[#7C3AED] ring-4 ring-purple-100 dark:ring-purple-950/20" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Operating Agreement Generated</h5>
                    <p className="text-[10px] text-text-muted mt-0.5">Today, 10:24 AM • By Alexander Reed</p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[30px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-text-muted" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Template Updated to v2.4.1</h5>
                    <p className="text-[10px] text-text-muted mt-0.5">Yesterday, 4:15 PM • System Admin</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Compliance Validation Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-base font-extrabold text-foreground">Compliance Validation</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-emerald-500">96%</span>
                <div className="relative h-5 w-5">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-card-border" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeDasharray="96, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'SEC Regulation D Compatible', success: true },
                { label: 'SPV Entity Properly Referenced', success: true },
                { label: 'Missing Manager Signature Block', warning: true },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs font-bold ${
                    item.warning
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400'
                      : 'bg-slate-50 dark:bg-slate-900/30 border-card-border text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.success ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Live Preview + Template Library */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Live Preview Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col min-h-[460px]">
            <div className="flex items-center justify-between border-b border-card-border pb-4 mb-4">
              <h4 className="text-sm font-extrabold text-foreground">Live Preview</h4>
              <div className="flex items-center gap-3 text-text-muted">
                <Search className="h-4 w-4 hover:text-foreground cursor-pointer" />
                <Printer className="h-4 w-4 hover:text-foreground cursor-pointer" />
              </div>
            </div>

            {/* Document Preview Box */}
            <div className="flex-1 rounded-2xl border border-card-border bg-white dark:bg-slate-950 p-6 flex flex-col justify-between text-slate-800 dark:text-slate-200 relative overflow-hidden font-serif min-h-[360px]">
              <div>
                {/* Logo & Header */}
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                  <div className="h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[#4F46E5]">
                    <div className="h-3 w-3 border-2 border-[#4F46E5] rotate-45" />
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black tracking-widest text-[#4F46E5] uppercase font-sans">Maxtronize</span>
                    <span className="text-[7px] text-slate-400 block font-sans">Legal Engineering Lab</span>
                  </div>
                </div>

                {/* Doc Title */}
                <h5 className="text-center font-bold text-xs uppercase tracking-wide leading-relaxed max-w-[200px] mx-auto mb-6 text-slate-900 dark:text-slate-100">
                  Limited Liability Company Operating Agreement
                </h5>

                {/* Doc Snippet */}
                <div className="space-y-3 text-[9px] leading-relaxed text-slate-600 dark:text-slate-400">
                  <p>
                    This OPERATING AGREEMENT (this &quot;Agreement&quot;) of{' '}
                    <span className="font-sans font-bold text-[#4F46E5] underline decoration-[#4F46E5]/40">{spvName}</span>{' '}
                    (the &quot;Company&quot;), is entered into as of the date of execution by and among the Company and each person listed on Exhibit A hereto as a Member of the Company.
                  </p>
                  <p className="font-sans font-black uppercase text-[7px] tracking-wider text-slate-900 dark:text-slate-200 mt-4">
                    ARTICLE I: DEFINITIONS
                  </p>
                  <p>
                    &quot;Asset&quot; means the real property located at{' '}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{assetName}</span>. Smart Contract metadata associated with the tokenized supply of {tokenSupply} NEX tokens represents fractional membership...
                  </p>
                  {clauseApplied && (
                    <p className="p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded text-[8px] font-sans text-emerald-800 dark:text-emerald-400 leading-snug">
                      <span className="font-bold block">SECTION 4.2: MANAGER EXCULPATION</span>
                      No Manager of the Company shall be personally liable to the Company or any Member for monetary damages for breach of fiduciary duty...
                    </p>
                  )}
                </div>
              </div>

              {/* Document Footer */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-[7px] text-slate-400 font-sans mt-6">
                <span>{spvName}</span>
                <span>Page 1 of 12</span>
                <span>SEC Reg D / Rule 506(c)</span>
              </div>
            </div>
          </div>

          {/* Template Library Card */}
          <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-foreground">Template Library</h4>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full rounded-2xl border border-card-border bg-card-bg pl-10 pr-4 py-2.5 text-xs font-bold text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            </div>

            {/* Template Groups */}
            <div className="space-y-4 pt-2">
              {[
                {
                  group: 'ENTITY FORMATION',
                  templates: [
                    { name: 'Operating Agreement', desc: 'Delaware, US', version: 'v2.4.1' },
                    { name: 'Shareholder Agreement', desc: 'Cayman Islands', version: 'v1.8.0' },
                  ]
                },
                {
                  group: 'OFFERING DOCUMENTS',
                  templates: [
                    { name: 'Offering Memorandum', desc: 'Global Standard', version: 'v3.1.2' },
                  ]
                },
                {
                  group: 'COMPLIANCE',
                  templates: [
                    { name: 'KYC/AML Declaration', desc: 'FATF Compliant', version: 'v6.0.0' },
                  ]
                }
              ].map((grp, gidx) => (
                <div key={gidx} className="space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">
                    {grp.group}
                  </span>
                  <div className="space-y-2">
                    {grp.templates.map((tpl, tidx) => {
                      const isActive = activeTemplate === tpl.name;
                      return (
                        <div
                          key={tidx}
                          onClick={() => setActiveTemplate(tpl.name)}
                          className={`rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-all ${
                            isActive
                              ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20'
                              : 'border-card-border bg-slate-50 dark:bg-slate-900/30 hover:border-text-muted'
                          }`}
                        >
                          <div>
                            <h5 className={`text-xs font-extrabold ${isActive ? 'text-[#7C3AED]' : 'text-foreground'}`}>
                              {tpl.name}
                            </h5>
                            <span className="text-[10px] text-text-muted mt-0.5 block">{tpl.desc}</span>
                          </div>
                          <span className="text-[10px] text-text-muted font-mono">{tpl.version}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Floating Bottom Sticky Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-between gap-4 rounded-3xl border border-card-border bg-card/90 backdrop-blur-md px-6 py-4 shadow-xl z-50 w-[90%] max-w-4xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-card-border bg-card px-5 py-3 text-xs font-bold text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all shadow-sm"
          >
            Save Draft
          </button>
          <div className="h-6 w-[1px] bg-card-border" />
          <button
            type="button"
            title="Duplicate Template"
            className="p-3 rounded-2xl border border-card-border bg-card text-text-muted hover:text-foreground transition-all shadow-sm"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Share Document"
            className="p-3 rounded-2xl border border-card-border bg-card text-text-muted hover:text-foreground transition-all shadow-sm"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-card-border bg-card px-5 py-3 text-xs font-bold text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send for Review</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] px-6 py-3 text-xs font-black tracking-wider uppercase text-white shadow-md shadow-purple-500/10 transition-all"
          >
            <FileCheck className="h-4 w-4" />
            <span>Generate Final Document</span>
          </button>
        </div>
      </div>

    </div>
  );
}
