'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Brain,
  Building2,
  Check,
  DollarSign,
  Download,
  Eye,
  FileText,
  Heart,
  MapPin,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import InvestorLayout from '@/components/InvestorLayout';

const iconStroke = 1.75;

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=85&auto=format&fit=crop';

type TabId = 'overview' | 'financials' | 'ai' | 'documents';

type TabDef = {
  id: TabId;
  label: string;
  Icon: LucideIcon;
  aiBadge?: boolean;
};

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview', Icon: Eye },
  { id: 'financials', label: 'Financials', Icon: BarChart3 },
  { id: 'ai', label: 'AI Intelligence', Icon: Brain, aiBadge: true },
  { id: 'documents', label: 'Documents', Icon: FileText },
];

const HERO_METRICS = [
  { label: 'Current Price', val: '$1,240', Icon: DollarSign, valClass: 'text-white' },
  { label: 'Annual Yield', val: '8.2%', Icon: TrendingUp, valClass: 'text-emerald-400' },
  { label: 'Min. Investment', val: '$25K', Icon: Target, valClass: 'text-white' },
  { label: 'Investors', val: '164', Icon: Users, valClass: 'text-white' },
];

const FINANCIALS = [
  { label: 'Net Operating Income', val: '$4.12M / yr' },
  { label: 'Cap Rate', val: '6.8%' },
  { label: 'Occupancy Rate', val: '95%' },
  { label: 'Weighted Avg. Lease Term', val: '8.2 years' },
  { label: 'Debt Service Coverage', val: '1.85x' },
  { label: 'LTV Ratio', val: '62%' },
];

const HIGHLIGHTS = [
  '95% occupancy rate with Fortune 500 anchor tenants',
  'Located in Midtown Manhattan — Tier-1 commercial district',
  'Long-term NNN leases averaging 8.2 years remaining',
  'SEC Reg D 506(c) compliant offering — accredited investors only',
  'Smart contract distributions paid quarterly on-chain',
];

const DOCUMENTS = [
  { name: 'Offering Memorandum', type: 'Prospectus', size: '8.7 MB', date: 'Mar 18, 2026' },
  { name: 'Property Appraisal Report', type: 'Asset Docs', size: '4.2 MB', date: 'Feb 28, 2026' },
  { name: 'SEC Reg D 506(c) Filing', type: 'Compliance', size: '1.1 MB', date: 'Jan 15, 2026' },
  { name: 'Smart Contract Audit', type: 'Technical', size: '2.4 MB', date: 'Jan 10, 2026' },
  { name: 'Financial Projections (5-yr)', type: 'Financials', size: '0.9 MB', date: 'Mar 1, 2026' },
];

const AI_INSIGHTS = [
  {
    title: 'Undervaluation Signal',
    confidence: 92,
    desc: 'Token price is 12–15% below comparable assets. Strong buy signal based on DCF analysis.',
    color: 'text-ui-success-text',
    tag: 'Consider increasing position',
    tagClass: 'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  {
    title: 'Tenant Risk Assessment',
    confidence: 88,
    desc: 'Fortune 500 tenant mix with 8.2yr avg lease term presents low default risk scenario.',
    color: 'text-primary',
    tag: 'Low Risk',
    tagClass: 'border-primary/20 bg-primary/5 text-primary',
  },
  {
    title: 'Market Timing',
    confidence: 76,
    desc: 'NYC office market showing recovery indicators. Q4 2026 expected to see 4–6% price appreciation.',
    color: 'text-amber-600 dark:text-amber-400',
    tag: 'Monitor quarterly',
    tagClass: 'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400',
  },
];

export default function AssetDetailPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [favorited, setFavorited] = useState(false);

  return (
    <InvestorLayout pageTitle="Asset Details">
      <div className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8">
        <Link
          href="/investor/marketplace"
          className="inline-flex w-fit items-center gap-2 text-[13px] font-bold text-ui-muted-text transition-colors hover:text-ui-strong"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={iconStroke} />
          Back
        </Link>

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 md:h-16 md:w-16 md:rounded-[18px]">
              <Building2 className="h-7 w-7 md:h-8 md:w-8" strokeWidth={iconStroke} />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-ui-strong md:text-2xl">
                  Prime Office Tower NYC
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <BadgeCheck className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                  Verified
                </span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-ui-muted-text">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-ui-faint" strokeWidth={iconStroke} />
                  Manhattan, New York, NY
                </span>
                <span className="text-ui-placeholder" aria-hidden>
                  ·
                </span>
                <span>Commercial Property</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 md:gap-3">
            <button
              type="button"
              onClick={() => setFavorited((f) => !f)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ui-border text-ui-faint transition-colors hover:border-primary/30 hover:text-primary"
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`h-4 w-4 ${favorited ? 'fill-primary text-primary' : ''}`}
                strokeWidth={iconStroke}
              />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ui-border text-ui-faint transition-colors hover:border-primary/30 hover:text-primary"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" strokeWidth={iconStroke} />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-105"
            >
              <DollarSign className="h-4 w-4" strokeWidth={iconStroke} />
              Invest Now
            </button>
          </div>
        </div>

        {/* Hero + glass metrics */}
        <div className="relative h-52 overflow-hidden rounded-[24px] shadow-xl md:h-72 md:rounded-[32px]">
          <Image
            src={HERO_IMAGE}
            alt="Prime Office Tower NYC"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {HERO_METRICS.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md md:p-4"
                >
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <m.Icon
                      className={`h-3.5 w-3.5 ${m.valClass === 'text-emerald-400' ? 'text-emerald-400' : 'text-white/60'}`}
                      strokeWidth={iconStroke}
                    />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">{m.label}</p>
                  </div>
                  <p className={`text-lg font-bold tabular-nums md:text-xl ${m.valClass}`}>{m.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content card — overlaps hero */}
        <div className="-mt-4 rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:-mt-6 md:rounded-[28px] dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
          {/* Pill tabs */}
          <div className="border-b border-ui-border p-4 md:p-6">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all ${
                      active
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/15'
                        : 'text-ui-muted-text hover:bg-ui-muted-deep/80 hover:text-ui-body'
                    }`}
                  >
                    <tab.Icon className="h-4 w-4" strokeWidth={iconStroke} />
                    {tab.label}
                    {tab.aiBadge && (
                      <span className="rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 md:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-base font-bold text-ui-strong md:text-lg">About This Asset</h3>
                  <p className="text-[13px] font-medium leading-relaxed text-ui-muted-text md:text-sm">
                    Class A office tower in prime Manhattan location with 95% occupancy, featuring Fortune 500
                    tenants and long-term lease agreements averaging 8+ years remaining.
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-bold text-ui-strong md:text-lg">Fundraising Progress</h3>
                    <span className="text-base font-bold text-primary">82%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-ui-muted-deep">
                    <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: '82%' }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] font-medium text-ui-faint">
                    <span>$4.1M raised</span>
                    <span>Target: $5.0M</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { label: 'Token Price', val: '$1,240', sub: 'PONYC' },
                    { label: 'Total Tokens', val: '100,000', sub: 'Supply' },
                    { label: 'Investors', val: '164', sub: 'Accredited' },
                    { label: 'Closing', val: '12 days', sub: 'Remaining' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-4">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{s.label}</p>
                      <p className="text-lg font-bold text-ui-strong">{s.val}</p>
                      <p className="text-[10px] font-medium text-ui-faint">{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-4 text-base font-bold text-ui-strong md:text-lg">Key Highlights</h3>
                  <ul className="space-y-3">
                    {HIGHLIGHTS.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <p className="text-[13px] font-medium text-ui-body">{h}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-base font-bold text-ui-strong md:text-lg">Asset Location</h3>
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-ui-border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-ui-faint" strokeWidth={iconStroke} />
                      <p className="text-[13px] font-bold text-ui-strong">Manhattan, New York, NY</p>
                      <p className="text-[11px] font-medium text-ui-faint">Midtown Commercial District</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {FINANCIALS.map((f) => (
                    <div key={f.label} className="rounded-2xl border border-ui-border bg-ui-muted-deep/50 p-5">
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{f.label}</p>
                      <p className="text-xl font-bold text-ui-strong">{f.val}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[24px] border border-ui-border bg-ui-card p-6 shadow-sm">
                  <h3 className="mb-6 text-base font-bold text-ui-strong">Projected Returns</h3>
                  <div className="space-y-4">
                    {[
                      { period: '1 Year', roi: '+8.2%', bar: 'bg-primary/25 text-primary', width: '30%' },
                      { period: '3 Years', roi: '+27.4%', bar: 'bg-primary/50 text-primary', width: '55%' },
                      { period: '5 Years', roi: '+49.8%', bar: 'bg-primary text-white', width: '80%' },
                    ].map((r) => (
                      <div key={r.period} className="flex items-center gap-4">
                        <span className="w-16 shrink-0 text-[11px] font-bold text-ui-muted-text">{r.period}</span>
                        <div className="h-8 flex-1 overflow-hidden rounded-full bg-ui-muted-deep">
                          <div
                            className={`flex h-full items-center justify-end rounded-full px-3 text-[10px] font-bold ${r.bar}`}
                            style={{ width: r.width }}
                          >
                            {r.roi}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="rounded-[24px] bg-gradient-to-r from-primary to-violet-600 p-6 text-white md:p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <Sparkles className="h-5 w-5" strokeWidth={iconStroke} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">AI Asset Analysis</h3>
                      <p className="text-[11px] text-white/70">Powered by Maxtronize Intelligence Engine</p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/85">
                    Based on comparable Manhattan office transactions and current market conditions, this asset shows
                    strong fundamentals with 92% confidence in stable long-term returns.
                  </p>
                </div>
                {AI_INSIGHTS.map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm md:p-6"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h4 className="text-[13px] font-bold text-ui-strong">{insight.title}</h4>
                      <span className={`flex shrink-0 items-center gap-1.5 text-[11px] font-bold ${insight.color}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="mb-3 text-[12px] font-medium leading-relaxed text-ui-muted-text">{insight.desc}</p>
                    <span className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold ${insight.tagClass}`}>
                      {insight.tag}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="overflow-hidden rounded-[24px] border border-ui-border shadow-sm">
                <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-7">
                  <div>
                    <h3 className="text-base font-bold text-ui-strong">Asset Documents</h3>
                    <p className="mt-0.5 text-xs text-ui-faint">Offering memoranda, legal, and financial files</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-[12px] font-bold text-primary transition-colors hover:text-primary/80"
                  >
                    <Download className="h-4 w-4" strokeWidth={iconStroke} />
                    Download All
                  </button>
                </div>
                <div className="divide-y divide-ui-divider">
                  {DOCUMENTS.map((doc) => (
                    <button
                      key={doc.name}
                      type="button"
                      className="group flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-ui-muted-deep/50 md:px-7"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-faint transition-all group-hover:bg-primary group-hover:text-white">
                        <FileText className="h-4 w-4" strokeWidth={iconStroke} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">
                          {doc.name}
                        </p>
                        <p className="text-[10px] font-medium text-ui-faint">
                          {doc.type} · {doc.size} · {doc.date}
                        </p>
                      </div>
                      <Download className="h-4 w-4 shrink-0 text-ui-placeholder transition-colors group-hover:text-primary" strokeWidth={iconStroke} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}
