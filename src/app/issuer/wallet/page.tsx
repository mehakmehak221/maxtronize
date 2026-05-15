'use client';

import {
  Activity,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronRight,
  Copy,
  ExternalLink,
  Hexagon,
  Layers,
  Plus,
  ShieldCheck,
  Wallet,
  Zap,
} from 'lucide-react';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const iconStroke = 1.75;

const SPARKLINE_POINTS = [42, 48, 44, 52, 50, 58, 55, 62, 60, 68, 72, 78];

function PortfolioSparkline() {
  const w = 280;
  const h = 48;
  const max = Math.max(...SPARKLINE_POINTS);
  const min = Math.min(...SPARKLINE_POINTS);
  const range = max - min || 1;
  const pts = SPARKLINE_POINTS.map((v, i) => {
    const x = (i / (SPARKLINE_POINTS.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg
      className="mt-3 max-w-[280px] opacity-70"
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="walletSparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d={`${pts} L ${w} ${h} L 0 ${h} Z`}
        fill="url(#walletSparkGrad)"
        opacity="0.25"
      />
      <path d={pts} stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type WalletCard = {
  name: string;
  network: string;
  balance: string;
  address: string;
  secured?: boolean;
  icon: 'platform' | 'custody' | 'polygon';
};

const CONNECTED_WALLETS: WalletCard[] = [
  {
    name: 'Platform Wallet',
    network: 'Ethereum',
    balance: '$184,230',
    address: '0x7a3f...4e9c',
    secured: true,
    icon: 'platform',
  },
  {
    name: 'Custody Wallet',
    network: 'Ethereum',
    balance: '2.84 ETH',
    address: '0x8b1c...3d2a',
    secured: true,
    icon: 'custody',
  },
  {
    name: 'Polygon Bridge',
    network: 'Polygon',
    balance: '14,820 MATIC',
    address: '0x3f9d...7b1e',
    icon: 'polygon',
  },
];

function WalletNetworkIcon({ type }: { type: WalletCard['icon'] }) {
  if (type === 'platform') {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white">
        <Hexagon className="h-5 w-5" strokeWidth={iconStroke} fill="currentColor" fillOpacity={0.15} />
      </div>
    );
  }
  if (type === 'custody') {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#374151] text-white">
        <Layers className="h-5 w-5" strokeWidth={iconStroke} />
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED] text-white">
      <Hexagon className="h-5 w-5" strokeWidth={iconStroke} fill="currentColor" fillOpacity={0.15} />
    </div>
  );
}

const HOLDINGS = [
  {
    ticker: 'PONYC',
    initials: 'PO',
    asset: 'Prime Office Tower',
    value: '$33.3M',
    change: '+4.2%',
    iconBg: 'bg-[#9810FA]',
    barColor: 'bg-[#9810FA]',
    barPct: 35,
  },
  {
    ticker: 'HPPE',
    initials: 'HP',
    asset: 'Harbor Ports PE Fund',
    value: '$27.0M',
    change: '+6.8%',
    iconBg: 'bg-[#3B82F6]',
    barColor: 'bg-[#3B82F6]',
    barPct: 28,
  },
  {
    ticker: 'LHDE',
    initials: 'LH',
    asset: 'Logistics Hub DE',
    value: '$31.0M',
    change: '0%',
    iconBg: 'bg-[#64748B]',
    barColor: 'bg-[#14B8A6]',
    barPct: 33,
  },
  {
    ticker: 'SFATX',
    initials: 'SF',
    asset: 'Solar Farm Alpha TX',
    value: '$3.7M',
    change: '+2.1%',
    iconBg: 'bg-[#F97316]',
    barColor: 'bg-[#F97316]',
    barPct: 4,
  },
];

type TxKind = 'deposit' | 'yield' | 'fee';

const TRANSACTIONS: {
  title: string;
  date: string;
  amount: string;
  kind: TxKind;
  pending?: boolean;
}[] = [
  { title: 'Capital Raise Deposit', date: 'Today, 10:42 AM', amount: '+$1,200,000', kind: 'deposit' },
  { title: 'Q3 Yield Distribution', date: 'Oct 01, 9:15 AM', amount: '+$312,400', kind: 'yield' },
  {
    title: 'Capital Raise Deposit',
    date: 'Sep 29, 2:30 PM',
    amount: '+$850,000',
    kind: 'deposit',
    pending: true,
  },
  { title: 'Monthly Rent Distribution', date: 'Sep 15, 8:00 AM', amount: '+$2,100', kind: 'yield' },
  { title: 'Compliance Fee', date: 'Sep 10, 11:20 AM', amount: '-$4,500', kind: 'fee' },
  { title: 'Q3 Distribution', date: 'Sep 05, 9:00 AM', amount: '+$892,000', kind: 'yield' },
];

function TxIcon({ kind }: { kind: TxKind }) {
  const base = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full';
  if (kind === 'deposit') {
    return (
      <div className={`${base} bg-app-status-success-bg text-app-status-success-fg`}>
        <ArrowDownLeft className="h-4 w-4" strokeWidth={iconStroke} />
      </div>
    );
  }
  if (kind === 'yield') {
    return (
      <div className={`${base} bg-violet-50 text-[#7C3AED]`}>
        <Zap className="h-4 w-4" strokeWidth={iconStroke} />
      </div>
    );
  }
  return (
    <div className={`${base} bg-ui-muted-deep text-ui-muted-text`}>
      <ArrowUpRight className="h-4 w-4" strokeWidth={iconStroke} />
    </div>
  );
}

function SectionLinkButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-1 rounded-xl border border-ui-border bg-ui-card py-3.5 text-[12px] font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
    >
      {label}
      <ChevronRight className="h-4 w-4" strokeWidth={iconStroke} />
    </button>
  );
}

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="animate-page-enter space-y-8 md:space-y-10">
        <div className="animate-slide-up space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Wallet</h1>
          <p className="text-sm font-medium text-ui-muted-text">
            Connected wallets, token holdings, and on-chain transaction history.
          </p>
        </div>

        {/* Hero — Total Portfolio Value */}
        <div className="animate-slide-up delay-100 relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1E0A3C] via-[#2D1260] to-[#0F172A] p-8 shadow-[0_24px_60px_-16px_rgba(30,10,60,0.55)] md:rounded-[32px] md:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#9810FA]/25 blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#3B82F6]/20 blur-[80px]"
            aria-hidden
          />

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1 space-y-6">
              <div>
                <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
                  <Wallet className="h-4 w-4 text-white/70" strokeWidth={iconStroke} />
                  Total Portfolio Value
                </p>
                <p className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">$95.3M</p>
                <PortfolioSparkline />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-white/55">
                  3 connected wallets · 4 token positions
                </p>
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#34D399]">
                  <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                  +$4.2M (4.6%) this month
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-[200px] lg:w-[220px]">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white py-3.5 text-[13px] font-bold text-[#111827] shadow-lg transition-transform hover:scale-[1.02] dark:bg-[#f8fafc] dark:text-[#0d0d12]"
              >
                <ArrowDownLeft className="h-4 w-4" strokeWidth={iconStroke} />
                Deposit
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 py-3.5 text-[13px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <ArrowUpRight className="h-4 w-4" strokeWidth={iconStroke} />
                Withdraw
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 py-3.5 text-[13px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <ArrowLeftRight className="h-4 w-4" strokeWidth={iconStroke} />
                Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Three-column grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {/* Connected Wallets */}
          <div className="animate-slide-up delay-200 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-bold text-ui-strong">Connected Wallets</h2>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-[#7C3AED] transition-colors hover:bg-violet-100"
                aria-label="Add wallet"
              >
                <Plus className="h-4 w-4" strokeWidth={iconStroke} />
              </button>
            </div>

            <div className="space-y-3">
              {CONNECTED_WALLETS.map((w) => (
                <div
                  key={w.address}
                  className="rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm transition-shadow hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.12)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <WalletNetworkIcon type={w.icon} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-[13px] font-bold text-ui-strong">{w.name}</h3>
                          {w.secured && (
                            <ShieldCheck
                              className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                              strokeWidth={iconStroke}
                              aria-label="Secured"
                            />
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-ui-faint">{w.network}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-ui-faint transition-colors hover:text-[#7C3AED]"
                      aria-label={`Open ${w.name}`}
                    >
                      <ExternalLink className="h-4 w-4" strokeWidth={iconStroke} />
                    </button>
                  </div>
                  <p className="mb-2 text-xl font-bold text-ui-strong">{w.balance}</p>
                  <div className="flex items-center gap-2">
                    <code className="rounded-md bg-ui-muted-deep px-2 py-1 font-mono text-[10px] text-ui-muted-text">
                      {w.address}
                    </code>
                    <button
                      type="button"
                      className="text-ui-faint transition-colors hover:text-[#7C3AED]"
                      aria-label="Copy address"
                    >
                      <Copy className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 rounded-[16px] border border-emerald-200 bg-emerald-50/80 px-4 py-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={iconStroke} />
                <div>
                  <p className="text-[12px] font-bold text-emerald-800">All wallets secured</p>
                  <p className="text-[11px] font-medium text-emerald-700/80">
                    Multi-sig enabled · Hardware wallet verified
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Token Holdings */}
          <div className="animate-slide-up delay-300 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-bold text-ui-strong">Token Holdings</h2>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7C3AED]">
                4 positions
              </span>
            </div>

            <div className="rounded-[24px] border border-ui-border bg-ui-card p-6 shadow-sm md:p-7">
              <div className="mb-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">
                    Portfolio Distribution
                  </span>
                  <span className="text-[12px] font-bold text-ui-strong">$95.0M total</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full">
                  {HOLDINGS.map((h) => (
                    <div
                      key={h.ticker}
                      className={`${h.barColor} first:rounded-l-full last:rounded-r-full`}
                      style={{ width: `${h.barPct}%` }}
                      title={h.ticker}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {HOLDINGS.map((h) => (
                  <div key={h.ticker} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${h.iconBg}`}
                      >
                        {h.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-ui-strong">{h.ticker}</p>
                        <p className="truncate text-[11px] font-medium text-ui-faint">{h.asset}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] font-bold text-ui-strong">{h.value}</p>
                      <p
                        className={`text-[11px] font-bold ${
                          h.change.startsWith('+')
                            ? 'text-ui-success-text'
                            : h.change === '0%'
                              ? 'text-ui-faint'
                              : 'text-ui-success-text'
                        }`}
                      >
                        {h.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <SectionLinkButton label="All Holdings" />
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="animate-slide-up delay-400 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-bold text-ui-strong">Transactions</h2>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ui-faint">
                <Activity className="h-3.5 w-3.5 text-ui-faint" strokeWidth={iconStroke} />
                Live
              </span>
            </div>

            <div className="rounded-[24px] border border-ui-border bg-ui-card p-3 shadow-sm md:p-4">
              <div className="divide-y divide-ui-divider">
                {TRANSACTIONS.map((tx) => {
                  const isNegative = tx.amount.startsWith('-');
                  return (
                    <div
                      key={`${tx.title}-${tx.date}`}
                      className="flex items-center justify-between gap-3 px-3 py-4 transition-colors hover:bg-ui-muted md:px-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <TxIcon kind={tx.kind} />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold text-ui-strong">{tx.title}</p>
                          <p className="text-[11px] font-medium text-ui-faint">{tx.date}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p
                          className={`text-[13px] font-bold ${
                            isNegative ? 'text-ui-body' : 'text-ui-success-text'
                          }`}
                        >
                          {tx.amount}
                        </p>
                        {tx.pending && (
                          <span className="mt-1 inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 px-1 pb-1">
                <SectionLinkButton label="Full History" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
