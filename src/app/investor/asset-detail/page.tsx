'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';
import { BuildingIcon, Overview, AnalyticIcon, AssetIntelligenceIcon, Document } from '@/app/VectorImages';

function MapPinOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ShieldOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

type TabType = 'overview' | 'financials' | 'ai' | 'documents';

export default function AssetDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Overview className="h-4 w-4" /> },
    { id: 'financials', label: 'Financials', icon: <AnalyticIcon className="h-4 w-4" /> },
    { id: 'ai', label: 'AI Intelligence', icon: <AssetIntelligenceIcon className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', icon: <Document className="h-4 w-4" /> },
  ];  

  const financials = [
    { label: 'Net Operating Income', val: '$4.12M / yr' },
    { label: 'Cap Rate', val: '6.8%' },
    { label: 'Occupancy Rate', val: '95%' },
    { label: 'Weighted Avg. Lease Term', val: '8.2 years' },
    { label: 'Debt Service Coverage', val: '1.85x' },
    { label: 'LTV Ratio', val: '62%' },
  ];

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-base font-bold text-ui-strong mb-3">About This Asset</h3>
        <p className="text-[13px] text-ui-muted-text font-medium leading-relaxed">
          Class A office tower in prime Manhattan location with 95% occupancy, featuring Fortune 500 tenants
          and long-term lease agreements averaging 8+ years remaining.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-ui-strong">Fundraising Progress</h3>
          <span className="text-base font-bold text-primary">82%</span>
        </div>
        <div className="w-full h-2.5 bg-ui-muted-deep rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '82%' }} />
        </div>
        <div className="flex justify-between mt-2 text-[11px] font-medium text-ui-faint">
          <span>$4.1M raised</span>
          <span>Target: $5.0M</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Token Price', val: '$1,240', sub: 'PONYC' },
          { label: 'Total Tokens', val: '100,000', sub: 'Supply' },
          { label: 'Investors', val: '164', sub: 'Accredited' },
          { label: 'Closing', val: '12 days', sub: 'Remaining' },
        ].map((s, i) => (
          <div key={i} className="bg-ui-muted-deep rounded-2xl p-4 border border-ui-border">
            <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-lg font-bold text-ui-strong">{s.val}</p>
            <p className="text-[10px] text-ui-faint font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-base font-bold text-ui-strong mb-4">Key Highlights</h3>
        <div className="space-y-3">
          {[
            '95% occupancy rate with Fortune 500 anchor tenants',
            'Located in Midtown Manhattan — Tier-1 commercial district',
            'Long-term NNN leases averaging 8.2 years remaining',
            'SEC Reg D 506(c) compliant offering — accredited investors only',
            'Smart contract distributions paid quarterly on-chain',
          ].map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-[13px] text-ui-body font-medium">{h}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-ui-strong mb-4">Asset Location</h3>
        <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center border border-ui-border">
          <div className="text-center">
            <p className="text-2xl mb-2">📍</p>
            <p className="text-[13px] font-bold text-ui-body">Manhattan, New York, NY</p>
            <p className="text-[11px] text-ui-faint font-medium">Midtown Commercial District</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {financials.map((f, i) => (
          <div key={i} className="bg-ui-muted-deep border border-ui-border rounded-2xl p-5">
            <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-2">{f.label}</p>
            <p className="text-xl font-bold text-ui-strong">{f.val}</p>
          </div>
        ))}
      </div>
      <div className="bg-ui-card border border-ui-border rounded-[24px] p-6 shadow-sm">
        <h3 className="text-base font-bold text-ui-strong mb-6">Projected Returns</h3>
        <div className="space-y-4">
          {[
            { period: '1 Year', roi: '+8.2%', color: 'bg-primary/20 text-primary', width: '30%' },
            { period: '3 Years', roi: '+27.4%', color: 'bg-primary/40 text-primary', width: '55%' },
            { period: '5 Years', roi: '+49.8%', color: 'bg-primary text-white', width: '80%' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-ui-muted-text w-16 shrink-0">{r.period}</span>
              <div className="flex-1 h-8 bg-ui-muted-deep rounded-full overflow-hidden">
                <div className={`h-full ${r.color} rounded-full flex items-center justify-end px-3 text-[10px] font-bold transition-all duration-1000`} style={{ width: r.width }}>{r.roi}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-primary to-purple-500 rounded-[24px] p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-ui-card/10 flex items-center justify-center text-xl">🤖</div>
          <div><h3 className="text-base font-bold">AI Asset Analysis</h3><p className="text-white/60 text-[11px]">Powered by Maxtronize Intelligence Engine</p></div>
        </div>
        <p className="text-white/80 text-[13px] leading-relaxed">Based on comparable Manhattan office transactions and current market conditions, this asset shows strong fundamentals with 92% confidence in stable long-term returns.</p>
      </div>
      {[
        { title: 'Undervaluation Signal', confidence: 92, desc: 'Token price is 12–15% below comparable assets. Strong buy signal based on DCF analysis.', color: 'text-green-500', tag: 'Consider increasing position', tagColor: 'bg-green-50 text-green-600 border-green-100' },
        { title: 'Tenant Risk Assessment', confidence: 88, desc: 'Fortune 500 tenant mix with 8.2yr avg lease term presents low default risk scenario.', color: 'text-primary', tag: 'Low Risk', tagColor: 'bg-primary/5 text-primary border-primary/10' },
        { title: 'Market Timing', confidence: 76, desc: 'NYC office market showing recovery indicators. Q4 2026 expected to see 4–6% price appreciation.', color: 'text-amber-500', tag: 'Monitor quarterly', tagColor: 'bg-amber-50 text-amber-600 border-amber-100' },
      ].map((insight, i) => (
        <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] p-5 md:p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h4 className="text-[13px] font-bold text-ui-strong">{insight.title}</h4>
            <span className={`text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${insight.color}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current" />{insight.confidence}% confidence
            </span>
          </div>
          <p className="text-[12px] text-ui-muted-text font-medium leading-relaxed mb-3">{insight.desc}</p>
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${insight.tagColor}`}>{insight.tag}</span>
        </div>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <div className="animate-in fade-in duration-500">
      <div className="bg-ui-card border border-ui-border rounded-[24px] shadow-sm overflow-hidden">
        <div className="p-5 md:p-7 border-b border-ui-divider flex items-center justify-between">
          <div><h3 className="text-base font-bold text-ui-strong">Asset Documents</h3><p className="text-xs text-ui-faint mt-0.5">Offering memoranda, legal, and financial files</p></div>
          <button className="flex items-center gap-2 text-[12px] font-bold text-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download All
          </button>
        </div>
        <div className="divide-y divide-ui-divider">
          {[
            { name: 'Offering Memorandum', type: 'Prospectus', size: '8.7 MB', date: 'Mar 18, 2026' },
            { name: 'Property Appraisal Report', type: 'Asset Docs', size: '4.2 MB', date: 'Feb 28, 2026' },
            { name: 'SEC Reg D 506(c) Filing', type: 'Compliance', size: '1.1 MB', date: 'Jan 15, 2026' },
            { name: 'Smart Contract Audit', type: 'Technical', size: '2.4 MB', date: 'Jan 10, 2026' },
            { name: 'Financial Projections (5-yr)', type: 'Financials', size: '0.9 MB', date: 'Mar 1, 2026' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-4 px-5 md:px-7 py-5 hover:bg-ui-muted-surface transition-colors group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-ui-muted-deep text-ui-faint group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors truncate">{doc.name}</p>
                <p className="text-[10px] text-ui-faint font-medium">{doc.type} · {doc.size} · {doc.date}</p>
              </div>
              <svg className="w-4 h-4 text-ui-placeholder group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabContent: Record<TabType, React.ReactNode> = {
    overview: renderOverview(),
    financials: renderFinancials(),
    ai: renderAI(),
    documents: renderDocuments(),
  };

  return (
    <InvestorLayout pageTitle="Maxtronize">
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* Back */}
        <Link href="/investor/marketplace" className="flex items-center gap-2 text-[13px] font-bold text-ui-muted-text hover:text-ui-body transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </Link>

        {/* Asset header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400 md:h-16 md:w-16">
              <BuildingIcon className="h-8 w-8 md:h-9 md:w-9" />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-ui-strong md:text-2xl">Prime Office Tower NYC</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <ShieldOutlineIcon className="h-3.5 w-3.5 shrink-0" />
                  Verified
                </span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPinOutlineIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                  Manhattan, New York, NY
                </span>
                <span className="text-slate-300 dark:text-slate-600" aria-hidden>
                  ·
                </span>
                <span>Commercial Property</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-faint hover:text-primary transition-colors text-lg">♡</button>
            <button className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-faint hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
            <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2">
              $ Invest Now
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full h-48 md:h-72 rounded-[24px] md:rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 shadow-xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/20">
              <p className="text-8xl">🏙️</p>
            </div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {/* Overlay stats */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Current Price', val: '$1,240', icon: '$' },
                { label: 'Annual Yield', val: '8.2%', icon: '↗', valColor: 'text-green-400' },
                { label: 'Min. Investment', val: '$25K', icon: '🪙' },
                { label: 'Investors', val: '164', icon: '👥' },
              ].map((s, i) => (
                <div key={i} className="bg-black/40 backdrop-blur-sm border border-background/10 rounded-2xl p-3 md:p-4">
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-base md:text-xl font-bold ${s.valColor || 'text-white'}`}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="border-b border-ui-border overflow-x-auto scrollbar-hide -mx-4 md:-mx-0">
          <div className="flex items-center px-4 md:px-0 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 text-[13px] font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-ui-faint hover:text-ui-body hover:border-ui-border-strong'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'ai' && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        <div>{tabContent[activeTab]}</div>
      </div>
    </InvestorLayout>
  );
}
