'use client';

import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  LayoutGrid,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const iconStroke = 1.75;
const SCORE = 87;

const HUB_TABS: { id: string; name: string; icon: LucideIcon; href: string; showDot?: boolean }[] = [
  { id: 'overview', name: 'Overview', icon: LayoutGrid, href: '/issuer/dashboard' },
  { id: 'assets', name: 'Assets', icon: Building2, href: '/issuer/hub' },
  { id: 'cap-table', name: 'Cap Table', icon: FileText, href: '/issuer/hub' },
  { id: 'investors', name: 'Investors', icon: Users, href: '/issuer/investors' },
  { id: 'distributions', name: 'Distributions', icon: DollarSign, href: '/issuer/yield' },
  { id: 'compliance', name: 'Compliance', icon: ShieldCheck, href: '/issuer/compliance' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, href: '/issuer/hub' },
  { id: 'ai-assistant', name: 'AI Assistant', icon: Brain, href: '/issuer/ai-intelligence', showDot: true },
];

const SEGMENT_COLORS = [
  '#C4B5FD',
  '#A78BFA',
  '#8B5CF6',
  '#7C3AED',
  '#6D28D9',
  '#5B21B6',
  '#818CF8',
  '#6366F1',
  '#4F46E5',
  '#4338CA',
];

function TabIcon({ Icon, active }: { Icon: LucideIcon; active: boolean }) {
  return (
    <Icon
      className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-[#9810FA]' : 'text-ui-muted-text'}`}
      strokeWidth={iconStroke}
      aria-hidden
    />
  );
}

function ComplianceScoreGauge({ score }: { score: number }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 86;
  const strokeW = 11;
  const totalSegments = 24;
  const filled = Math.round((score / 100) * totalSegments);
  const gapDeg = 3.5;
  const segDeg = (360 - gapDeg * totalSegments) / totalSegments;

  const polar = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const arc = (startDeg: number, endDeg: number) => {
    const start = polar(startDeg);
    const end = polar(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  let angle = 0;
  const segments = Array.from({ length: totalSegments }, (_, i) => {
    const start = angle + gapDeg / 2;
    const end = angle + segDeg + gapDeg / 2;
    angle += segDeg + gapDeg;
    return { i, start, end, filled: i < filled };
  });

  return (
    <div className="relative mx-auto h-[220px] w-[220px] shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {segments.map((seg) => (
          <path
            key={seg.i}
            d={arc(seg.start, seg.end)}
            fill="none"
            stroke={seg.filled ? SEGMENT_COLORS[seg.i % SEGMENT_COLORS.length] : 'var(--ui-border)'}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[44px] font-bold leading-none tracking-tight text-ui-strong">{score}</p>
        <p className="mt-1 text-sm font-medium text-ui-faint">/ 100</p>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  return (
    <DashboardLayout>
      <div className="animate-page-enter max-w-full min-w-0 space-y-8 md:space-y-10">
        <nav className="-mx-1 flex max-w-full min-w-0 overflow-x-auto border-b border-ui-border">
          {HUB_TABS.map((tab) => {
            const active = tab.id === 'compliance';
            const inner = (
              <>
                <TabIcon Icon={tab.icon} active={active} />
                <span className="whitespace-nowrap text-[13px]">{tab.name}</span>
                {tab.showDot && (
                  <span
                    className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary ring-2 ring-ui-sidebar"
                    aria-hidden
                  />
                )}
              </>
            );
            const className = `flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 transition-colors sm:px-6 ${
              active
                ? 'border-[#9810FA] font-semibold text-[#9810FA]'
                : 'border-transparent font-medium text-ui-muted-text hover:text-ui-strong'
            }`;

            if (active) {
              return (
                <button key={tab.id} type="button" className={className}>
                  {inner}
                </button>
              );
            }

            return (
              <Link key={tab.id} href={tab.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </nav>

        <div className="max-w-full min-w-0 space-y-8">
          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="animate-slide-up flex flex-col rounded-[20px] border border-ui-border bg-ui-card p-8 shadow-sm lg:col-span-5 lg:p-10">
              <div className="flex flex-1 flex-col items-center justify-center gap-8 py-2">
                <ComplianceScoreGauge score={SCORE} />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-ui-strong">Compliance Score</h3>
                  <p className="mt-3 text-sm font-medium text-ui-success-text">
                    Good standing — 1 review item pending
                  </p>
                </div>
              </div>
            </div>

            {/* Metric cards 2×2 */}
            <div className="motion-stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
              {(
                [
                  {
                    title: 'SEC Filings Current',
                    value: '3/3',
                    sub: 'All Form D filings up to date',
                    border: 'border-ui-success-border',
                    valueColor: 'text-ui-success-text',
                    Icon: CheckCircle2,
                    iconRing: 'bg-ui-success-bg-soft text-ui-success-icon',
                  },
                  {
                    title: 'KYC Completion Rate',
                    value: '93.2%',
                    sub: '7 of 10 investors fully verified',
                    border: 'border-ui-success-border',
                    valueColor: 'text-ui-success-text',
                    Icon: CheckCircle2,
                    iconRing: 'bg-ui-success-bg-soft text-ui-success-icon',
                  },
                  {
                    title: 'OFAC Hits (90D)',
                    value: '1',
                    sub: '1 name match — manual review',
                    border: 'border-app-status-warn-border',
                    valueColor: 'text-app-status-warn-fg',
                    Icon: AlertTriangle,
                    iconRing: 'bg-app-status-warn-bg text-app-status-warn-dot',
                  },
                  {
                    title: 'Open Compliance Items',
                    value: '1',
                    sub: 'AML/KYC program review pending',
                    border: 'border-app-status-warn-border',
                    valueColor: 'text-app-status-warn-fg',
                    Icon: AlertCircle,
                    iconRing: 'bg-app-status-warn-bg text-app-status-warn-dot',
                  },
                ] as const
              ).map((card) => {
                const CardIcon = card.Icon;
                return (
                  <div
                    key={card.title}
                    className={`flex flex-col rounded-[20px] border-2 bg-ui-card p-6 shadow-sm ${card.border}`}
                  >
                    <div className="mb-5 flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${card.iconRing}`}
                      >
                        <CardIcon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-ui-body">
                        {card.title}
                      </p>
                    </div>
                    <p className={`text-[32px] font-bold leading-none tracking-tight ${card.valueColor}`}>
                      {card.value}
                    </p>
                    <p className="mt-3 text-[13px] font-medium text-ui-faint">{card.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regulatory Status */}
          <div className="animate-slide-up delay-200 rounded-[24px] border border-ui-border bg-ui-card p-8 shadow-sm md:p-10">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-ui-strong">Regulatory Status</h3>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ui-border bg-ui-card px-5 py-2.5 text-xs font-bold text-ui-strong shadow-sm transition-colors hover:bg-ui-muted"
              >
                <Download className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                Export Report
              </button>
            </div>

            <div className="stagger-children divide-y divide-ui-divider">
              {(
                [
                  {
                    RowIcon: CheckCircle2,
                    lineRing: 'bg-emerald-50 text-[#10B981]',
                    title: 'Reg D 506(c) Filing (Form D)',
                    status: 'Filed',
                    statusClass: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg',
                    entity: 'Peachtree Tower',
                    desc: 'Filed with SEC EDGAR — notice period active through offering.',
                    date: '03/01/2026',
                  },
                  {
                    RowIcon: Shield,
                    lineRing: 'bg-sky-50 text-sky-600',
                    title: 'MiCA Whitepaper — Summit Credit',
                    status: 'Active',
                    statusClass: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300',
                    entity: 'Summit Credit',
                    desc: 'Passport-ready disclosure pack on file with EU host distributor.',
                    date: '02/15/2026',
                  },
                  {
                    RowIcon: Clock,
                    lineRing: 'bg-amber-50 text-amber-600',
                    title: 'AML/KYC Program Review',
                    status: 'Review',
                    statusClass: 'border-amber-200 bg-amber-50 text-amber-800',
                    entity: 'All Assets',
                    desc: 'Annual independent AML program review — analyst assigned.',
                    date: '04/20/2026',
                  },
                  {
                    RowIcon: CheckCircle2,
                    lineRing: 'bg-emerald-50 text-[#10B981]',
                    title: 'Reg S Exemption — Apex Data Ctr',
                    status: 'Filed',
                    statusClass: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg',
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
                    className="stagger-item group flex flex-col gap-4 py-6 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${row.lineRing}`}
                      >
                        <RIcon className="h-5 w-5" strokeWidth={iconStroke} />
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-ui-strong">{row.title}</h4>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${row.statusClass}`}
                          >
                            {row.status}
                          </span>
                          <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-[#7C3AED]">
                            {row.entity}
                          </span>
                        </div>
                        <p className="text-xs font-medium leading-relaxed text-ui-muted-text">{row.desc}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                      <span className="text-xs font-semibold text-ui-faint">{row.date}</span>
                      <ExternalLink
                        className="h-4 w-4 text-ui-faint transition-colors group-hover:text-[#9810FA]"
                        strokeWidth={iconStroke}
                        aria-hidden
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
