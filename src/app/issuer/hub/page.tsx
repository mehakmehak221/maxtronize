'use client';

import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  LayoutGrid,
  RefreshCw,
  Send,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { HubAssetsTab } from '@/components/issuer/HubAssetsTab';
import { HubCapTableTab } from '@/components/issuer/HubCapTableTab';
import { HubComplianceTab } from '@/components/issuer/HubComplianceTab';
import { HubInvestorsTab } from '@/components/issuer/HubInvestorsTab';
import { HubDistributionsTab } from '@/components/issuer/HubDistributionsTab';
import { HubOverviewTab } from '@/components/issuer/HubOverviewTab';
import { formatHubUpdatedAt } from '@/lib/issuerHub';
import { useGetIssuerHubOverviewSummaryQuery } from '@/store/api/issuerHubApi';

const iconStroke = 1.75;

function TabIcon({ Icon, active }: { Icon: LucideIcon; active: boolean }) {
  return (
    <Icon
      className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-primary' : 'text-text-muted'}`}
      strokeWidth={iconStroke}
      aria-hidden
    />
  );
}

function MetricIconCircle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

const REGISTRY_CHIP_CLASS: Record<number, string> = {
  1: 'bg-inv-chip-1-bg text-inv-chip-1-fg',
  2: 'bg-inv-chip-2-bg text-inv-chip-2-fg',
  3: 'bg-inv-chip-3-bg text-inv-chip-3-fg',
  4: 'bg-inv-chip-4-bg text-inv-chip-4-fg',
  5: 'bg-inv-chip-5-bg text-inv-chip-5-fg',
  6: 'bg-inv-chip-6-bg text-inv-chip-6-fg',
};

const CAP_CHIP_CLASS: Record<string, string> = {
  yt: 'bg-cap-chip-yt-bg text-cap-chip-yt-fg',
  sl: 'bg-cap-chip-sl-bg text-cap-chip-sl-fg',
  ad: 'bg-cap-chip-ad-bg text-cap-chip-ad-fg',
  ro: 'bg-cap-chip-ro-bg text-cap-chip-ro-fg',
  mo: 'bg-cap-chip-mo-bg text-cap-chip-mo-fg',
  cw: 'bg-cap-chip-cw-bg text-cap-chip-cw-fg',
  eh: 'bg-cap-chip-eh-bg text-cap-chip-eh-fg',
};

const ASSET_BAR_CLASS: Record<string, string> = {
  a: 'bg-issuer-asset-bar-1',
  b: 'bg-issuer-asset-bar-2',
  c: 'bg-issuer-asset-bar-3',
  draft: 'bg-issuer-asset-bar-draft',
};

type TabType = 'overview' | 'assets' | 'cap-table' | 'investors' | 'distributions' | 'compliance' | 'analytics' | 'ai-assistant';

const HUB_TABS: { id: TabType; name: string; icon: LucideIcon; showDot?: boolean }[] = [
  { id: 'overview', name: 'Overview', icon: LayoutGrid },
  { id: 'assets', name: 'Assets', icon: Building2 },
  { id: 'cap-table', name: 'Cap Table', icon: FileText },
  { id: 'investors', name: 'Investors', icon: Users },
  { id: 'distributions', name: 'Distributions', icon: DollarSign },
  { id: 'compliance', name: 'Compliance', icon: ShieldCheck },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'ai-assistant', name: 'AI Assistant', icon: Brain, showDot: true },
];

export default function IssuerHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [aiDraft, setAiDraft] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [investorSearch, setInvestorSearch] = useState('');
  const [capTableSearch, setCapTableSearch] = useState('');
  const [complianceSearch, setComplianceSearch] = useState('');

  const { data: overviewSummary } = useGetIssuerHubOverviewSummaryQuery();

  const hubSearchValue =
    activeTab === 'assets'
      ? assetSearch
      : activeTab === 'investors'
        ? investorSearch
        : activeTab === 'cap-table'
          ? capTableSearch
          : activeTab === 'compliance'
            ? complianceSearch
            : '';

  const hubSearchPlaceholder =
    activeTab === 'assets'
      ? 'Search assets...'
      : activeTab === 'investors'
        ? 'Search investors...'
        : activeTab === 'cap-table'
          ? 'Search cap table...'
          : activeTab === 'compliance'
            ? 'Search filings...'
            : 'Search investors, assets...';

  const onHubSearchChange = (value: string) => {
    if (activeTab === 'assets') setAssetSearch(value);
    else if (activeTab === 'investors') setInvestorSearch(value);
    else if (activeTab === 'cap-table') setCapTableSearch(value);
    else if (activeTab === 'compliance') setComplianceSearch(value);
  };

  const renderOverview = () => <HubOverviewTab />;

  const renderAssets = () => (
    <HubAssetsTab search={assetSearch} onSearchChange={setAssetSearch} />
  );

  const renderInvestors = () => (
    <HubInvestorsTab search={investorSearch} onSearchChange={setInvestorSearch} />
  );

  const renderCapTable = () => (
    <HubCapTableTab search={capTableSearch} onSearchChange={setCapTableSearch} />
  );

  const renderCompliance = () => (
    <HubComplianceTab search={complianceSearch} onSearchChange={setComplianceSearch} />
  );


  const growthY = [24, 38, 52, 68, 88, 110, 132, 148];
  const growthLabels = ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'];

  const yieldBars = [
    { name: 'Peachtree', actual: 72, target: 55 },
    { name: 'Summit Credit', actual: 88, target: 70 },
    { name: 'Apex Data Ctr', actual: 65, target: 58 },
  ];

  const geo = [
    { label: 'United States', pct: 68, bar: 'bg-[#5b21b6]' },
    { label: 'Europe (Reg S)', pct: 18, bar: 'bg-[#7c3aed]' },
    { label: 'Asia Pacific (Reg S)', pct: 10, bar: 'bg-[#a78bfa]' },
    { label: 'Other', pct: 4, bar: 'bg-[#ddd6fe]' },
  ];

  const renderAnalytics = () => {
    const gLeft = 56;
    const gW = 480;
    const gTop = 28;
    const gH = 140;
    const gMax = 160;
    const growthPath = growthY
      .map((v, i) => {
        const x = gLeft + (i / (growthY.length - 1)) * gW;
        const y = gTop + gH - (v / gMax) * gH;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(
            [
              {
                label: 'Portfolio IRR',
                value: '14.2%',
                sub: 'Blended across 3 assets',
                Icon: TrendingUp,
              },
              {
                label: 'Cash-on-Cash Return',
                value: '9.8%',
                sub: 'Annualized YTD',
                Icon: RefreshCw,
              },
              {
                label: 'Avg. Investment Size',
                value: '$100,135',
                sub: 'Per investor',
                Icon: Target,
              },
              {
                label: 'Investor Retention',
                value: '97.3%',
                sub: 'No redemptions YTD',
                Icon: UserCheck,
              },
            ] as const
          ).map((card) => {
            const CardIcon = card.Icon;
            return (
            <div key={card.label} className="rounded-[24px] border border-card-border bg-card p-6 shadow-sm">
              <MetricIconCircle className="mb-4 bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
                <CardIcon className="h-5 w-5" strokeWidth={iconStroke} />
              </MetricIconCircle>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">{card.label}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
              <p className="mt-2 text-xs text-text-muted">{card.sub}</p>
            </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-sm md:p-10">
            <h3 className="text-lg font-bold text-foreground">Investor Growth</h3>
            <p className="mb-8 text-xs text-text-muted">Cumulative accredited investors onboarded.</p>
            <svg className="h-52 w-full" viewBox="0 0 560 200" preserveAspectRatio="xMidYMid meet">
              {[0, 40, 80, 120, 160].map((v) => {
                const y = gTop + gH - (v / gMax) * gH;
                return (
                  <g key={v}>
                    <line
                      x1={gLeft}
                      y1={y}
                      x2={gLeft + gW}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                    />
                    <text x="44" y={y + 4} textAnchor="end" fill="var(--text-muted)" className="text-[10px] font-bold">
                      {v}
                    </text>
                  </g>
                );
              })}
              <path
                d={growthPath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {growthY.map((v, i) => {
                const x = gLeft + (i / (growthY.length - 1)) * gW;
                const y = gTop + gH - (v / gMax) * gH;
                return <circle key={i} cx={x} cy={y} r="5" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />;
              })}
              {growthLabels.map((label, i) => {
                const x = gLeft + (i / (growthLabels.length - 1)) * gW;
                return (
                  <text
                    key={label}
                    x={x}
                    y={gTop + gH + 24}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    className="text-[10px] font-bold"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-sm md:p-10">
            <h3 className="text-lg font-bold text-foreground">Yield vs. Target</h3>
            <p className="mb-6 text-xs text-text-muted">Actual annualized yield vs. offering target.</p>
            <div className="mb-6 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Target</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Actual</span>
              </div>
            </div>
            <div className="flex h-48 items-end justify-around gap-4 px-2">
              {yieldBars.map((b) => (
                <div key={b.name} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full max-w-[72px] items-end justify-center gap-1.5">
                    <div
                      className="w-4 rounded-t-md bg-border"
                      style={{ height: `${b.target}%` }}
                      title="Target"
                    />
                    <div
                      className="w-4 rounded-t-md bg-primary"
                      style={{ height: `${b.actual}%` }}
                      title="Actual"
                    />
                  </div>
                  <span className="text-center text-[10px] font-bold text-text-muted">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-sm md:p-10">
          <h3 className="text-lg font-bold text-foreground">Investor Geography</h3>
          <p className="mb-8 text-xs text-text-muted">Breakdown by jurisdiction (% of total committed capital).</p>
          <div className="flex flex-col items-center gap-10 xl:flex-row xl:items-center xl:gap-16">
            <div
              className="relative h-44 w-44 shrink-0 rounded-full"
              style={{
                background:
                  'conic-gradient(#5b21b6 0% 68%, #7c3aed 68% 86%, #a78bfa 86% 96%, #e9d5ff 96% 100%)',
              }}
              aria-hidden
            >
              <div className="absolute inset-[18%] rounded-full bg-card shadow-inner" />
            </div>
            <div className="w-full max-w-md flex-1 space-y-4">
              {geo.map((g) => (
                <div key={g.label}>
                  <div className="mb-1 flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{g.label}</span>
                    <span className="text-text-muted">{g.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className={`h-full rounded-full ${g.bar}`} style={{ width: `${g.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAiAssistant = () => (
    <div className="min-w-0 max-w-full px-3 animate-in fade-in duration-500 sm:px-4 md:px-5">
      <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-card-border bg-card shadow-sm">
        <div className="flex flex-col gap-5 border-b border-card-border p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8 md:px-10 md:py-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md sm:h-14 sm:w-14">
              <Brain className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={iconStroke} aria-hidden />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Maxtronize AI Assistant</h3>
              <p className="mt-0.5 text-xs font-semibold text-primary sm:text-[13px]">
                Strategy · Compliance · Pricing · Investor Insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 sm:self-auto dark:border-emerald-700/60 dark:bg-emerald-950/50">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Live</span>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8 md:px-10 md:py-9">
          <div className="flex min-w-0 gap-4 sm:gap-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-10 sm:w-10">
              <Brain className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={iconStroke} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-violet-100 bg-violet-50/90 px-5 py-4 sm:px-6 sm:py-5 dark:border-violet-800/60 dark:bg-violet-950/55">
              <p className="text-sm leading-relaxed text-foreground sm:text-[15px] sm:leading-relaxed">
                Hello, Marcus. I&apos;m your Maxtronize AI compliance and strategy assistant. I have access to your
                portfolio data, compliance status, and market benchmarks. I can help you:{' '}
                <span className="text-foreground/90">
                  Recommend optimal offering structures (Reg D, Reg A+, etc.) · Generate investor pitch summaries ·
                  Analyze asset pricing and risk scoring · Suggest compliance action items.
                </span>{' '}
                What would you like to explore?
              </p>
              <p className="mt-4 text-[10px] font-medium text-text-muted sm:text-[11px]">Apr 23, 2026 · 5:24 AM</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1 sm:gap-3.5">
            {[
              'What offering structure is best for my real estate SPV?',
              'Generate an investor pitch summary for Peachtree Tower',
              'Analyze my cap table and suggest diversification',
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="max-w-full rounded-full border border-card-border bg-surface px-5 py-2.5 text-left text-[11px] font-semibold text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-violet-50/80 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/40"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-card-border p-5 sm:p-8 md:px-10 md:pb-10 md:pt-2">
          <div className="relative flex items-center gap-3 rounded-2xl border border-card-border bg-surface pl-5 pr-3 py-3 sm:rounded-3xl sm:pl-6 sm:pr-3 sm:py-3.5 dark:border-zinc-700 dark:bg-zinc-900/60">
            <input
              type="text"
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              placeholder="Ask about offering structure, pricing, compliance, investor insights..."
              className="min-w-0 flex-1 bg-transparent py-0.5 text-sm text-foreground outline-none placeholder:text-text-muted sm:text-[15px]"
            />
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-90 sm:h-12 sm:w-12"
              aria-label="Send message"
            >
              <Send className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={iconStroke} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-full min-w-0 space-y-6 animate-in fade-in duration-700 sm:space-y-8 xl:space-y-10">
        <header className="-mx-5 mb-6 flex flex-col gap-3 px-5 py-4 sm:-mx-6 sm:px-6 md:-mx-8 md:mb-8 md:flex md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-0 lg:mb-10">
          <div className="flex min-w-0 flex-col gap-0.5 md:flex-row md:items-baseline md:gap-2.5">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">Issuer Dashboard</h1>
            <span className="truncate text-xs font-semibold text-primary">
              {overviewSummary?.organizationName?.trim() || 'Issuer Hub'}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end md:gap-4">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {overviewSummary?.updatedAt
                  ? `Updated ${formatHubUpdatedAt(overviewSummary.updatedAt)}`
                  : 'Updated —'}
              </span>
            </div>
            <div className="relative w-full min-w-0 md:w-auto md:max-w-[16rem]">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={hubSearchValue}
                onChange={(e) => onHubSearchChange(e.target.value)}
                placeholder={hubSearchPlaceholder}
                className="h-9 w-full rounded-full border border-card-border bg-card py-1.5 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary md:w-64"
              />
            </div>
          </div>
        </header>

        <div className="-mx-1 flex max-w-full min-w-0 overflow-x-auto border-b border-border">
          {HUB_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 transition-colors sm:px-6 ${
                active
                  ? 'border-primary font-semibold text-primary'
                  : 'border-transparent font-medium text-text-muted hover:text-foreground'
              }`}
            >
              <TabIcon Icon={tab.icon} active={active} />
              <span className="whitespace-nowrap text-[13px]">{tab.name}</span>
              {tab.showDot && (
                <span
                  className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary ring-2 ring-card"
                  aria-hidden
                />
              )}
            </button>
            );
          })}
        </div>

        <div className="min-h-[60vh] min-w-0 max-w-full">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'assets' && renderAssets()}
          {activeTab === 'investors' && renderInvestors()}
          {activeTab === 'cap-table' && renderCapTable()}
          {activeTab === 'compliance' && renderCompliance()}
          {activeTab === 'distributions' && <HubDistributionsTab />}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'ai-assistant' && renderAiAssistant()}
        </div>
      </div>
    </DashboardLayout>
  );
}
