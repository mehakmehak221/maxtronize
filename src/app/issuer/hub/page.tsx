'use client';

import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  LayoutGrid,
  Plus,
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

const raisedM = [0.8, 1.5, 2.2, 2.9, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1, 10.2];
const committedM = [0.55, 1.0, 1.45, 1.95, 2.5, 3.1, 3.75, 4.4, 5.1, 5.85, 6.65, 7.5];

function buildLinePath(values: number[], chartLeft: number, chartW: number, chartTop: number, chartH: number, maxM: number) {
  const n = values.length;
  return values
    .map((m, i) => {
      const x = chartLeft + (i / (n - 1)) * chartW;
      const y = chartTop + chartH - (m / maxM) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildAreaPath(
  values: number[],
  chartLeft: number,
  chartW: number,
  chartTop: number,
  chartH: number,
  maxM: number,
  baselineY: number,
) {
  const n = values.length;
  const pts = values.map((m, i) => {
    const x = chartLeft + (i / (n - 1)) * chartW;
    const y = chartTop + chartH - (m / maxM) * chartH;
    return { x, y };
  });
  let d = `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ` L ${pts[n - 1].x} ${baselineY} Z`;
  return d;
}

export default function IssuerHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [aiDraft, setAiDraft] = useState('');

  const renderOverview = () => (
    <div className="max-w-full min-w-0 space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-[32px] bg-primary p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="relative z-10 space-y-6">
            <MetricIconCircle className="bg-white/20 ring-1 ring-white/25">
              <DollarSign className="h-5 w-5 text-white" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/60">Total Capital Raised</p>
              <h3 className="text-4xl font-bold tracking-tight">$14,820,000</h3>
              <p className="mt-2 text-xs font-medium text-white/60">across 3 active offerings</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <span className="flex items-center gap-2 text-[11px] font-bold text-issuer-hero-trend-fg">
                ↗ +$1.24M this week
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-card-border bg-card p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
              <Building2 className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <span className="rounded-full bg-ui-success-bg-soft px-2 py-1 text-[10px] font-bold text-ui-success-text">
              ↗ +1 this quarter
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Active Assets</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">3</h3>
            <p className="mt-2 text-xs font-medium text-text-muted">2 in funding · 1 fully funded</p>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-card-border bg-card p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
              <Users className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <span className="rounded-full bg-ui-success-bg-soft px-2 py-1 text-[10px] font-bold text-ui-success-text">
              ↗ +12 this month
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Investors</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">148</h3>
            <p className="mt-2 text-xs font-medium text-text-muted">134 funded · 14 committed</p>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] bg-issuer-yield-card p-8 text-issuer-yield-card-fg shadow-sm">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-white/15 ring-1 ring-white/20">
              <TrendingUp className="h-5 w-5 text-issuer-yield-card-fg" strokeWidth={iconStroke} />
            </MetricIconCircle>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-issuer-yield-card-fg/80">Blended Yield</p>
            <h3 className="text-4xl font-bold tracking-tight">11.8%</h3>
            <p className="mt-2 text-xs font-medium text-issuer-yield-card-fg/80">weighted avg across portfolio</p>
          </div>
          <div className="border-t border-white/20 pt-4">
            <span className="flex items-center gap-2 text-[11px] font-bold text-issuer-yield-card-fg">
              ↗ +0.3% vs last quarter
            </span>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-warning/20 bg-issuer-pending-kyc-bg p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
            <span className="rounded-full bg-warning/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-warning">
              Action
            </span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-warning/90">Pending KYC</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">7</h3>
            <p className="mt-2 text-xs font-medium text-warning">
              5 awaiting docs · 2 in review
              <br />
              <span className="text-ui-danger-text">3 overdue {'>'}5 days</span>
            </p>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-card-border bg-card p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
              <Calendar className="h-5 w-5" strokeWidth={iconStroke} />
            </MetricIconCircle>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Next Distribution</p>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">$186,400</h3>
            <p className="mt-2 text-xs font-medium text-text-muted">Scheduled May 01, 2026 · 148 investors</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-[40px] border border-card-border bg-card p-10 shadow-sm lg:col-span-2">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="mb-1 text-lg font-bold text-foreground">Capital Velocity</h3>
              <p className="text-xs text-text-muted">Raised vs. committed capital — last 12 weeks</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-issuer-chart-line-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Raised</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-palette-success" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Committed</span>
              </div>
            </div>
          </div>

          <div className="relative max-w-full min-w-0 overflow-x-auto">
            <svg
              className="block h-auto max-h-[240px] min-h-[180px] w-full max-w-full text-foreground"
              viewBox="0 0 640 220"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Capital raised and committed over 12 weeks"
            >
              <defs>
                <linearGradient id="issuerHubRaisedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--issuer-chart-line-primary)" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="var(--issuer-chart-line-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 3, 6, 9, 12].map((m) => {
                const chartTop = 28;
                const chartH = 132;
                const chartBottom = chartTop + chartH;
                const y = chartBottom - (m / 12) * chartH;
                return (
                  <g key={m}>
                    <line
                      x1="52"
                      y1={y}
                      x2="620"
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                    />
                    <text
                      x="48"
                      y={y + 4}
                      textAnchor="end"
                      fill="var(--text-muted)"
                      className="text-[10px] font-bold"
                    >
                      {m === 0 ? '$0' : `$${m}M`}
                    </text>
                  </g>
                );
              })}

              {(() => {
                const chartLeft = 56;
                const chartW = 564;
                const chartTop = 28;
                const chartH = 132;
                const chartBottom = chartTop + chartH;
                const maxM = 12;
                const raisedPath = buildLinePath(raisedM, chartLeft, chartW, chartTop, chartH, maxM);
                const committedPath = buildLinePath(committedM, chartLeft, chartW, chartTop, chartH, maxM);
                const areaPath = buildAreaPath(raisedM, chartLeft, chartW, chartTop, chartH, maxM, chartBottom);
                return (
                  <>
                    <path d={areaPath} fill="url(#issuerHubRaisedFill)" />
                    <path
                      d={committedPath}
                      fill="none"
                      stroke="var(--palette-success)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.9}
                    />
                    <path
                      d={raisedPath}
                      fill="none"
                      stroke="var(--issuer-chart-line-primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                );
              })()}

              {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map((label, i) => {
                const chartLeft = 56;
                const chartW = 564;
                const x = chartLeft + (i / 11) * chartW;
                return (
                  <text
                    key={label}
                    x={x}
                    y="208"
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
        </div>

        <div className="flex flex-col rounded-[40px] border border-card-border bg-card p-10 shadow-sm">
          <h3 className="mb-1 text-lg font-bold text-foreground">Recent Activity</h3>
          <p className="mb-8 text-xs text-text-muted">Investor actions & compliance events</p>
          <div className="flex-1 space-y-6">
            {(
              [
                {
                  label: 'Eleanor Hayes committed $150,000 to Peachtree Tower',
                  time: '18 min ago',
                  Icon: DollarSign,
                  ring: 'bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300',
                },
                {
                  label: 'Priya Mehta KYC documents submitted for review',
                  time: '2 hr ago',
                  Icon: ShieldCheck,
                  ring: 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
                },
                {
                  label: 'Q1 distribution of $92,000 queued for Summit Credit',
                  time: '5 hr ago',
                  Icon: TrendingUp,
                  ring: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
                },
                {
                  label: 'OFAC screening flagged 1 name — manual review required',
                  time: 'Yesterday',
                  Icon: AlertTriangle,
                  ring: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400',
                },
                {
                  label: 'Chen Wei committed $200,000 to Summit Credit',
                  time: 'Yesterday',
                  Icon: DollarSign,
                  ring: 'bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300',
                },
              ] as const
            ).map((activity, i) => {
              const RowIcon = activity.Icon;
              return (
              <div
                key={i}
                className="group -mx-2 flex cursor-pointer gap-4 rounded-xl p-2 transition-colors hover:bg-surface"
              >
                <MetricIconCircle className={`${activity.ring} shadow-sm`}>
                  <RowIcon className="h-4 w-4" strokeWidth={iconStroke} />
                </MetricIconCircle>
                <div className="min-w-0">
                  <p className="mb-0.5 text-[11px] font-bold text-foreground transition-colors group-hover:text-primary">
                    {activity.label}
                  </p>
                  <p className="text-[10px] text-text-muted">{activity.time}</p>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Asset Portfolio</h3>
          <p className="text-xs text-text-muted">4 assets · 3 active offerings</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-primary px-6 py-2 text-[13px] font-bold text-white transition-colors hover:bg-issuer-primary-hover"
        >
          + New Asset
        </button>
      </div>
      <div className="space-y-4">
        {[
          { name: 'Peachtree Tower — Atlanta, GA', status: 'Live' as const, tag: 'PTAT', val: '$12.5M', yield: '9.2%', investors: '62', reg: 'Reg D 506(c)', progress: 84, raised: '$4.20M', target: '$5.0M', bar: 'a' },
          { name: 'Summit Industrial Credit Facility', status: 'Live' as const, tag: 'SICF', val: '$8.0M', yield: '11.5%', investors: '54', reg: 'Reg D 506(b)', progress: 85, raised: '$6.80M', target: '$8.0M', bar: 'b' },
          { name: 'Apex Data Center — Phoenix, AZ', status: 'Funded' as const, tag: 'ADCP', val: '$22.0M', yield: '13.1%', investors: '32', reg: 'Reg S', progress: 100, raised: '$4.00M', target: '$4.0M', bar: 'c' },
          { name: 'Crescent Gold Reserve Fund I', status: 'Draft' as const, tag: 'CGRF', val: '$19.8M', yield: '—', investors: '0', reg: 'Pending', progress: 0, raised: '$0.00M', target: '$6.0M', bar: 'draft' },
        ].map((asset, i) => (
          <div
            key={i}
            className="group flex cursor-pointer flex-col gap-4 rounded-3xl border border-card-border bg-card p-6 shadow-sm transition-colors hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                <MetricIconCircle className="bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
                  <Building2 className="h-5 w-5" strokeWidth={iconStroke} />
                </MetricIconCircle>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">{asset.name}</h4>
                    {asset.status === 'Live' ? (
                      <span className="rounded-md border border-status-live-border bg-status-live-bg px-2 py-0.5 text-[10px] font-bold text-status-live-text">
                        Live
                      </span>
                    ) : asset.status === 'Funded' ? (
                      <span className="rounded-md border border-status-funded-border bg-status-funded-bg px-2 py-0.5 text-[10px] font-bold text-status-funded-text">
                        Funded
                      </span>
                    ) : (
                      <span className="rounded-md border border-status-draft-border bg-status-draft-bg px-2 py-0.5 text-[10px] font-bold text-status-draft-text">
                        {asset.status}
                      </span>
                    )}
                    <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      {asset.tag}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-text-muted">
                    Valuation: {asset.val} · Yield: <span className="font-bold text-foreground">{asset.yield}</span> · Investors:{' '}
                    {asset.investors} · {asset.reg}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-foreground">{asset.progress}%</span>
                <svg
                  className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-[10px] font-medium text-text-muted">
                {asset.raised} raised of {asset.target}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full ${ASSET_BAR_CLASS[asset.bar] ?? ASSET_BAR_CLASS.draft}`}
                  style={{ width: `${asset.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-ui-success-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-success-text text-ui-success-text">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-ui-success-text">7</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ui-success-text">KYC Approved</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-alert-warn-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-alert-warn-icon text-alert-warn-icon">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-alert-warn-title">2</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-alert-warn-title">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-ui-danger-muted/40 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-danger-text text-ui-danger-text">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-ui-danger-text">1</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ui-danger-text">Action Required</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 mt-8">
        <h3 className="text-lg font-bold text-foreground">Investor Registry</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search investors..." className="pl-9 pr-4 py-2 bg-card border border-card-border rounded-full text-xs outline-none focus:border-primary text-foreground w-64" />
          </div>
          <button className="px-4 py-2 bg-card border border-card-border hover:bg-surface transition-colors rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </button>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface border-b border-card-border">
            <tr>
              {['Investor', 'KYC Status', 'Accreditation', 'Commitment', 'Asset', 'Jurisdiction', 'Source', 'Join Date'].map(h => (
                <th key={h} className="px-6 py-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { init: 'EH', chip: 1, name: 'Eleanor Hayes', email: 'e.hayes@thornfund.com', status: 'KYC Approved', acc: 'KYC Approved', val: '$150,000', asset: 'Peachtree Tower', jur: 'New York, US', source: 'Direct', date: '03/12/2026' },
              { init: 'MO', chip: 2, name: 'Marcus Osei', email: 'm.osei@capitalgroup.com', status: 'KYC Approved', acc: 'KYC Approved', val: '$250,000', asset: 'Peachtree Tower', jur: 'California, US', source: 'Referral', date: '03/05/2026' },
              { init: 'YT', chip: 3, name: 'Yuki Tanaka', email: 'y.tanaka@nomura-private.jp', status: 'KYC Approved', acc: 'KYC Approved', val: '$500,000', asset: 'Summit Credit', jur: 'Japan', source: 'Reg S', date: '02/18/2026' },
              { init: 'PM', chip: 4, name: 'Priya Mehta', email: 'p.mehta@crescentfamily.com', status: 'KYC Pending', acc: 'KYC Pending', val: '$80,000', asset: 'Peachtree Tower', jur: 'Texas, US', source: 'Direct', date: '04/01/2026' },
              { init: 'RO', chip: 5, name: 'Raymond Okafor', email: 'r.okafor@oakridge.io', status: 'KYC Approved', acc: 'KYC Approved', val: '$300,000', asset: 'Summit Credit', jur: 'Georgia, US', source: 'Platform', date: '02/28/2026' },
              { init: 'SL', chip: 6, name: 'Sophia Lindqvist', email: 's.lindqvist@nordicvc.se', status: 'KYC Approved', acc: 'KYC Approved', val: '$400,000', asset: 'Apex Data Ctr', jur: 'Sweden', source: 'Reg S', date: '01/15/2026' },
            ].map((inv, i) => (
              <tr key={i} className="transition-colors hover:bg-surface">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${REGISTRY_CHIP_CLASS[inv.chip]}`}
                    >
                      {inv.init}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{inv.name}</p>
                      <p className="text-[10px] text-text-muted">{inv.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      inv.status.includes('Approved')
                        ? 'border-ui-success-border/60 bg-ui-success-bg-soft text-ui-success-text'
                        : 'border-alert-warn-border bg-alert-warn-bg text-alert-warn-title'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      inv.acc.includes('Approved')
                        ? 'border-ui-success-border/60 bg-ui-success-bg-soft text-ui-success-text'
                        : 'border-alert-warn-border bg-alert-warn-bg text-alert-warn-title'
                    }`}
                  >
                    {inv.acc}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{inv.val}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.asset}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.jur}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.source}</td>
                <td className="px-6 py-4 text-[11px] text-text-muted">{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCapTable = () => (
    <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Cap Table</h3>
          <p className="text-xs text-text-muted">10 investors · $2.41M invested · $119K distributed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search investor..." className="pl-9 pr-4 py-2 bg-card border border-card-border rounded-full text-xs outline-none focus:border-primary text-foreground w-64" />
          </div>
          <button className="px-4 py-2 bg-card border border-card-border hover:bg-surface transition-colors rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface border-b border-card-border">
            <tr>
              {['Investor', 'Asset / Token', 'Tokens', 'Ownership %', 'Invested', 'Distributions', 'Jurisdiction', 'Join Date', 'Status'].map(h => (
                <th key={h} className="px-6 py-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { init: 'YT', cap: 'yt', name: 'Yuki Tanaka', email: 'y.tanaka@nomura-private.jp', asset: 'Summit Credit', token: 'SICF', tokens: '5,000', own: 6.25, inv: '$500,000', dist: '$28,750', jur: 'Japan (Reg S)', date: '02/18/2026', status: 'Funded' as const },
              { init: 'SL', cap: 'sl', name: 'Sophia Lindqvist', email: 's.lindqvist@nordicvc.se', asset: 'Apex Data Ctr', token: 'ADCP', tokens: '4,000', own: 10.0, inv: '$400,000', dist: '$26,200', jur: 'Sweden (Reg S)', date: '01/15/2026', status: 'Funded' as const },
              { init: 'AD', cap: 'ad', name: 'Amara Diallo', email: 'a.diallo@westlakeadv.com', asset: 'Apex Data Ctr', token: 'ADCP', tokens: '3,500', own: 8.75, inv: '$350,000', dist: '$22,925', jur: 'Illinois, US', date: '01/22/2026', status: 'Funded' as const },
              { init: 'RO', cap: 'ro', name: 'Raymond Okafor', email: 'r.okafor@oakridge.io', asset: 'Summit Credit', token: 'SICF', tokens: '3,000', own: 3.75, inv: '$300,000', dist: '$17,250', jur: 'Georgia, US', date: '02/28/2026', status: 'Funded' as const },
              { init: 'MO', cap: 'mo', name: 'Marcus Osei', email: 'm.osei@capitalgroup.com', asset: 'Peachtree Tower', token: 'PTAT', tokens: '2,500', own: 5.0, inv: '$250,000', dist: '$11,500', jur: 'California, US', date: '03/05/2026', status: 'Funded' as const },
              { init: 'CW', cap: 'cw', name: 'Chen Wei', email: 'c.wei@horizonasset.hk', asset: 'Summit Credit', token: 'SICF', tokens: '2,000', own: 2.5, inv: '$200,000', dist: '—', jur: 'Hong Kong (Reg S)', date: '04/10/2026', status: 'Committed' as const },
              { init: 'EH', cap: 'eh', name: 'Eleanor Hayes', email: 'e.hayes@thornfund.com', asset: 'Peachtree Tower', token: 'PTAT', tokens: '1,500', own: 3.0, inv: '$150,000', dist: '$6,900', jur: 'New York, US', date: '03/12/2026', status: 'Funded' as const },
            ].map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-surface">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${CAP_CHIP_CLASS[row.cap]}`}
                    >
                      {row.init}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{row.name}</p>
                      <p className="text-[10px] text-text-muted">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[12px] font-medium text-foreground mb-1">{row.asset}</p>
                  <span className="px-1.5 py-0.5 bg-surface border border-card-border text-text-muted text-[9px] font-bold rounded uppercase tracking-wider">{row.token}</span>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.tokens}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${row.own * 4}%` }}></div>
                    </div>
                    <span className="text-[12px] font-bold text-text-muted">{row.own.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.inv}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-ui-success-text">{row.dist}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{row.jur}</td>
                <td className="px-6 py-4 text-[11px] text-text-muted">{row.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      row.status === 'Funded'
                        ? 'border-status-funded-border bg-status-funded-bg text-status-funded-text'
                        : 'border-primary/25 bg-ui-accent-tint text-primary'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompliance = () => {
    const donutStroke = 14;
    const donutSize = 160;
    const r = (donutSize - donutStroke) / 2;
    const circumference = 2 * Math.PI * r;
    const scorePct = 87 / 100;
    const dash = scorePct * circumference;

    return (
      <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-sm lg:col-span-5">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
              <div className="relative h-40 w-40 shrink-0">
                <svg
                  width={donutSize}
                  height={donutSize}
                  viewBox={`0 0 ${donutSize} ${donutSize}`}
                  className="-rotate-90"
                  aria-hidden
                >
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={r}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth={donutStroke}
                  />
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={r}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth={donutStroke}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                  />
                </svg>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="text-center">
                    <span className="block text-3xl font-bold leading-none text-foreground">87</span>
                    <span className="text-sm font-semibold text-text-muted">/ 100</span>
                  </p>
                </div>
              </div>
              <div className="max-w-xs text-center md:text-left">
                <h3 className="text-lg font-bold text-foreground">Compliance Score</h3>
                <p className="mt-2 text-sm font-medium text-ui-success-text">
                  Good standing — 1 review item pending
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {(
              [
                {
                  title: 'SEC Filings Current',
                  value: '3/3',
                  sub: 'All Form D filings up to date.',
                  border: 'border-emerald-200 dark:border-emerald-800',
                  Icon: CheckCircle2,
                  ring: 'border-emerald-500/25 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30',
                },
                {
                  title: 'KYC Completion Rate',
                  value: '93.2%',
                  sub: '7 of 10 investors fully verified.',
                  border: 'border-emerald-200 dark:border-emerald-800',
                  Icon: UserCheck,
                  ring: 'border-emerald-500/25 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30',
                },
                {
                  title: 'OFAC Hits (90D)',
                  value: '1',
                  sub: '1 name match — manual review.',
                  border: 'border-amber-200 dark:border-amber-800',
                  Icon: AlertTriangle,
                  ring: 'border-amber-500/25 bg-amber-50 text-amber-600 dark:bg-amber-950/30',
                },
                {
                  title: 'Open Compliance Items',
                  value: '1',
                  sub: 'AML/KYC program review pending.',
                  border: 'border-amber-200 dark:border-amber-800',
                  Icon: Clock,
                  ring: 'border-amber-500/25 bg-amber-50 text-amber-600 dark:bg-amber-950/30',
                },
              ] as const
            ).map((card) => {
              const CardIcon = card.Icon;
              return (
              <div
                key={card.title}
                className={`rounded-2xl border-2 bg-card p-6 shadow-sm ${card.border}`}
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full border ${card.ring}`}
                >
                  <CardIcon className="h-5 w-5" strokeWidth={iconStroke} />
                </div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">{card.title}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <p className="mt-2 text-xs text-text-muted">{card.sub}</p>
              </div>
            );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-card-border bg-card p-8 shadow-sm md:p-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Regulatory Status</h3>
              <p className="text-xs text-text-muted">Filings, exemptions, and program reviews.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-card-border bg-card px-5 py-2.5 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-surface"
            >
              <Download className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
              Export Report
            </button>
          </div>
          <div className="divide-y divide-border">
            {(
              [
                {
                  RowIcon: CheckCircle2,
                  lineRing: 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
                  title: 'Reg D 506(c) Filing (Form D)',
                  status: 'Filed',
                  statusClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
                  entity: 'Peachtree Tower',
                  desc: 'Filed with SEC EDGAR — notice period active through offering.',
                  date: '03/01/2026',
                },
                {
                  RowIcon: Shield,
                  lineRing: 'border-sky-200 bg-sky-50 text-sky-600 dark:bg-sky-950/40',
                  title: 'MiCA Whitepaper — Summit Credit',
                  status: 'Active',
                  statusClass: 'border-sky-200 bg-sky-50 text-sky-700',
                  entity: 'Summit Credit',
                  desc: 'Passport-ready disclosure pack on file with EU host distributor.',
                  date: '02/15/2026',
                },
                {
                  RowIcon: Clock,
                  lineRing: 'border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/40',
                  title: 'AML/KYC Program Review',
                  status: 'Review',
                  statusClass: 'border-amber-200 bg-amber-50 text-amber-800',
                  entity: 'All Assets',
                  desc: 'Annual independent AML program review — analyst assigned.',
                  date: '04/20/2026',
                },
                {
                  RowIcon: CheckCircle2,
                  lineRing: 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
                  title: 'Reg S Exemption — Apex Data Ctr',
                  status: 'Filed',
                  statusClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
                  entity: 'Apex Data Ctr',
                  desc: 'Offering memorandum and investor certification workflow complete.',
                  date: '01/10/2026',
                },
              ] as const
            ).map((row, i) => {
              const RIcon = row.RowIcon;
              return (
                <div
                  key={i}
                  className="flex flex-col gap-4 py-6 first:pt-0 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${row.lineRing}`}
                    >
                      <RIcon className="h-5 w-5" strokeWidth={iconStroke} />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{row.title}</h4>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${row.statusClass}`}
                        >
                          {row.status}
                        </span>
                        <span className="rounded-full border border-primary/25 bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-primary dark:bg-violet-950/40">
                          {row.entity}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">{row.desc}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <span className="text-xs font-semibold text-text-muted">{row.date}</span>
                    <ExternalLink className="h-4 w-4 text-text-muted" strokeWidth={iconStroke} aria-hidden />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const distMonths = ['Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26'];
  const distBarsK = [48, 125, 82, 168, 96, 188, 205, 118, 92];

  const renderDistributions = () => {
    const chartH = 140;
    const chartTop = 32;
    const maxK = 220;
    const chartLeft = 48;
    const chartW = 560;
    const n = distBarsK.length;
    const gap = 10;
    const barW = (chartW - gap * (n - 1)) / n;

    return (
      <div className="max-w-full min-w-0 space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              {
                label: 'Total Distributed',
                value: '$622,000',
                Icon: DollarSign,
              },
              {
                label: 'Next Payout',
                value: '$186,400',
                Icon: Calendar,
              },
              {
                label: 'Investors Receiving',
                value: '148',
                Icon: Users,
              },
              {
                label: 'Scheduled Payouts',
                value: '2',
                Icon: Clock,
              },
            ] as const
          ).map((card) => {
            const CardIcon = card.Icon;
            return (
            <div
              key={card.label}
              className="rounded-[24px] border border-card-border bg-card p-6 shadow-sm"
            >
              <MetricIconCircle className="mb-4 bg-violet-100 text-primary dark:bg-violet-950/50 dark:text-violet-300">
                <CardIcon className="h-5 w-5" strokeWidth={iconStroke} />
              </MetricIconCircle>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">{card.label}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
            </div>
            );
          })}
        </div>

        <div className="max-w-full min-w-0 rounded-[32px] border border-card-border bg-card p-8 shadow-sm md:p-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Distribution History</h3>
              <p className="text-xs text-text-muted">Monthly payouts across all assets</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
              + Schedule Payout
            </button>
          </div>

          <div className="max-w-full min-w-0 overflow-x-auto">
            <svg
              className="block h-auto min-h-[180px] w-full max-w-full min-w-0"
              viewBox="0 0 640 200"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Monthly distribution amounts"
            >
              {[0, 55, 110, 165, 220].map((k) => {
                const y = chartTop + chartH - (k / maxK) * chartH;
                return (
                  <g key={k}>
                    <line
                      x1={chartLeft}
                      y1={y}
                      x2={chartLeft + chartW}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 5"
                    />
                    <text x="40" y={y + 4} textAnchor="end" fill="var(--text-muted)" className="text-[10px] font-bold">
                      {k === 0 ? '$0' : `$${k}K`}
                    </text>
                  </g>
                );
              })}
              {distBarsK.map((k, i) => {
                const h = (k / maxK) * chartH;
                const x = chartLeft + i * (barW + gap);
                const y = chartTop + chartH - h;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barW}
                    height={Math.max(h, 2)}
                    rx="4"
                    fill="var(--primary)"
                  />
                );
              })}
              {distMonths.map((label, i) => {
                const x = chartLeft + i * (barW + gap) + barW / 2;
                return (
                  <text
                    key={label}
                    x={x}
                    y={chartTop + chartH + 22}
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
        </div>

        <div className="max-w-full min-w-0 overflow-x-auto rounded-[32px] border border-card-border bg-card shadow-sm">
          <table className="w-full min-w-0 table-fixed text-left">
            <thead className="border-b border-card-border bg-surface">
              <tr>
                {['Period', 'Asset', 'Type', 'Amount', 'Investors', 'Date', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted sm:px-6 sm:py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(
                [
                  {
                    period: 'Q1 2026',
                    asset: 'Summit Credit',
                    type: 'Interest',
                    amount: '$92,000',
                    investors: '54',
                    date: '04/01/2026',
                    status: 'Completed' as const,
                  },
                  {
                    period: 'Q2 2026',
                    asset: 'Peachtree Tower',
                    type: 'Rental Income',
                    amount: '$61,200',
                    investors: '62',
                    date: '07/01/2026',
                    status: 'Scheduled' as const,
                  },
                ] as const
              ).map((row, i) => (
                <tr key={i} className="transition-colors hover:bg-surface">
                  <td className="min-w-0 break-words px-3 py-3 text-sm font-semibold text-foreground sm:px-6 sm:py-4">{row.period}</td>
                  <td className="min-w-0 px-3 py-3 sm:px-6 sm:py-4">
                    <button type="button" className="text-left text-sm font-bold text-primary hover:underline">
                      {row.asset}
                    </button>
                  </td>
                  <td className="min-w-0 break-words px-3 py-3 text-sm text-text-muted sm:px-6 sm:py-4">{row.type}</td>
                  <td className="min-w-0 px-3 py-3 text-sm font-bold text-foreground sm:px-6 sm:py-4">{row.amount}</td>
                  <td className="min-w-0 px-3 py-3 text-sm text-text-muted sm:px-6 sm:py-4">{row.investors}</td>
                  <td className="min-w-0 px-3 py-3 text-sm text-text-muted sm:px-6 sm:py-4">{row.date}</td>
                  <td className="min-w-0 px-3 py-3 sm:px-6 sm:py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        row.status === 'Completed'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-sky-200 bg-sky-50 text-sky-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
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
      <div className="max-w-full min-w-0 space-y-10 animate-in fade-in duration-700">
        <header className="-mx-5 mb-6 flex flex-col gap-3 border-b border-ui-border px-5 py-4 sm:-mx-6 sm:px-6 md:-mx-8 md:mb-8 md:flex md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-0 lg:mb-10">
          <div className="flex min-w-0 flex-col gap-0.5 md:flex-row md:items-baseline md:gap-2.5">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">Issuer Dashboard</h1>
            <span className="truncate text-xs font-semibold text-primary">Crescent Capital Partners LLC</span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end md:gap-4">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Updated Apr 23, 2026 · 5:24 AM ET</span>
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
                placeholder="Search investors, assets..."
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
          {activeTab === 'distributions' && renderDistributions()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'ai-assistant' && renderAiAssistant()}
        </div>
      </div>
    </DashboardLayout>
  );
}
