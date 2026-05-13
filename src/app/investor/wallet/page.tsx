'use client';

import React, { useState, type ComponentType, type SVGProps } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import {
  Wallet,
  WalletCustodyBarsIcon,
  WalletDepositIcon,
  WalletPolygonIcon,
  WalletTransferIcon,
  WalletWithdrawIcon,
} from '@/app/VectorImages';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

export default function InvestorWalletPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 2000);
  };

  const wallets: {
    name: string;
    network: string;
    address: string;
    balance: string;
    iconBg: string;
    Icon: NavSvg;
    iconClass?: string;
    connected: boolean;
  }[] = [
    {
      name: 'Platform Wallet',
      network: 'Ethereum',
      address: '0x8f4d...4a8c',
      balance: '$184,230',
      iconBg: 'bg-blue-500',
      Icon: Wallet,
      iconClass: 'h-5 w-5 text-white',
      connected: true,
    },
    {
      name: 'Custody Wallet',
      network: 'Ethereum',
      address: '0x6e5b...6b7a',
      balance: '2.84 ETH',
      iconBg: 'bg-slate-700',
      Icon: WalletCustodyBarsIcon,
      iconClass: 'h-[14px] w-[9px] text-white',
      connected: true,
    },
    {
      name: 'Polygon Bridge',
      network: 'Polygon',
      address: '0x9c3a...1b2e',
      balance: '14,820 MATIC',
      iconBg: 'bg-violet-600',
      Icon: WalletPolygonIcon,
      iconClass: 'h-[14px] w-3 text-white',
      connected: true,
    },
  ];

  const holdings = [
    { ticker: 'PONYC', name: 'Prime Office Tower', val: '$33.3M', change: '+4.2%', up: true, color: 'bg-violet-600', pct: 35 },
    { ticker: 'HPPE', name: 'Harbor Ports PE Fund', val: '$27.0M', change: '+6.8%', up: true, color: 'bg-blue-500', pct: 28 },
    { ticker: 'LHDE', name: 'Logistics Hub DE', val: '$31.0M', change: '0%', neutral: true, color: 'bg-slate-500', pct: 32 },
    { ticker: 'SFATX', name: 'Solar Farm Alpha TX', val: '$3.7M', change: '+2.1%', up: true, color: 'bg-orange-500', pct: 4 },
  ];

  const txns: {
    label: string;
    amount: string;
    time: string;
    variant: 'deposit' | 'yield' | 'withdraw';
    status?: string;
  }[] = [
    { label: 'Capital Raise Deposit', amount: '+$1,200,000', time: 'Today, 10:42 AM', variant: 'deposit' },
    { label: 'Q3 Yield Distribution', amount: '+$312,400', time: 'Oct 01, 9:15 AM', variant: 'yield' },
    { label: 'Capital Raise Deposit', amount: '+$850,000', time: 'Sep 29, 7:30 PM', variant: 'deposit', status: 'Pending' },
    { label: 'Monthly Rent Distribution', amount: '+$2,100', time: 'Sep 15, 8:00 AM', variant: 'yield' },
    { label: 'Compliance Fee', amount: '-$4,500', time: 'Sep 13, 11:20 AM', variant: 'withdraw' },
    { label: 'Q3 Distribution', amount: '+$892,000', time: 'Sep 10, 9:00 AM', variant: 'yield' },
  ];

  const actions: { label: string; primary: boolean; Icon: NavSvg }[] = [
    { label: 'Deposit', primary: true, Icon: WalletDepositIcon },
    { label: 'Withdraw', primary: false, Icon: WalletWithdrawIcon },
    { label: 'Transfer', primary: false, Icon: WalletTransferIcon },
  ];

  return (
    <InvestorLayout pageTitle="Wallet">
      <div className="space-y-6 animate-in fade-in duration-700">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Wallet</h1>
          <p className="mt-1 text-sm font-medium text-ui-faint">Connected wallets, token holdings, and on-chain transaction history.</p>
        </div>

        {/* Hero — navy / violet gradient, wave, CTA stack */}
        <div className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-[#0b0b16] via-[#121228] to-[#1a0f38] p-6 text-white shadow-2xl ring-1 ring-white/10 md:rounded-[32px] md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/25 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-primary/20 blur-[90px]" />
          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <Wallet className="h-4 w-4 shrink-0 text-white/50" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Total Portfolio Value</p>
              </div>
              <p className="text-4xl font-bold tracking-tight md:text-6xl">$95.3M</p>
              <span className="motion-chart mt-2 block w-fit">
                <svg
                  className="h-7 w-44 text-violet-400/90 md:w-56"
                  viewBox="0 0 200 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M0 14C32 6 68 22 100 10c28-10 56-8 100 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <p className="mt-3 text-[11px] font-medium text-white/45">3 connected wallets · 4 token positions</p>
              <p className="mt-1.5 flex items-center gap-1 text-[12px] font-bold text-emerald-400">
                <span aria-hidden>↗</span> +$4.2M (4.6%) this month
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:max-w-xs lg:w-56">
              {actions.map(a => (
                <button
                  key={a.label}
                  type="button"
                  className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[13px] font-bold transition-all ${
                    a.primary
                      ? 'bg-white text-slate-900 shadow-lg hover:bg-white/95'
                      : 'border border-white/75 bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  <a.Icon className={`h-4 w-4 shrink-0 ${a.primary ? 'text-slate-900' : 'text-white'}`} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-3">
          {/* Connected Wallets */}
          <div className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[32px]">
            <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-7">
              <h3 className="text-[14px] font-bold text-ui-strong">Connected Wallets</h3>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary transition-colors hover:bg-primary/15"
                aria-label="Add wallet"
              >
                +
              </button>
            </div>
            <div className="space-y-3 p-4">
              {wallets.map((w, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 rounded-2xl bg-ui-muted-deep p-3 transition-colors hover:bg-ui-muted-deep md:p-4"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${w.iconBg}`}>
                    <w.Icon className={w.iconClass ?? 'h-5 w-5 text-white'} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-bold text-ui-strong">{w.name}</p>
                      {w.connected && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
                    </div>
                    <p className="text-[10px] font-medium text-ui-faint">{w.network}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-ui-body">{w.balance}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <p className="truncate font-mono text-[9px] text-ui-placeholder">{w.address}</p>
                      <button
                        type="button"
                        onClick={() => copyAddress(w.address)}
                        className="shrink-0 text-ui-faint transition-colors hover:text-primary"
                        aria-label="Copy address"
                      >
                        {copied === w.address ? (
                          <svg className="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button type="button" className="shrink-0 text-ui-placeholder transition-colors hover:text-primary" aria-label="Open in explorer">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mx-4 mb-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <svg className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">All wallets secured</p>
                <p className="text-[9px] font-medium text-emerald-700/80 dark:text-emerald-400/90">Multi-sig enabled · Hardware wallet verified</p>
              </div>
            </div>
          </div>

          {/* Token Holdings */}
          <div className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[32px]">
            <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-7">
              <h3 className="text-[14px] font-bold text-ui-strong">Token Holdings</h3>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-primary dark:bg-violet-950/50 dark:text-violet-300">
                {holdings.length} positions
              </span>
            </div>
            <div className="space-y-4 p-5 md:p-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-ui-faint">Portfolio Distribution</p>
                  <p className="text-[11px] font-bold text-ui-strong">$95.0M total</p>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                  {holdings.map((h, i) => (
                    <div key={i} className={`${h.color} h-full`} style={{ width: `${h.pct}%` }} />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                {holdings.map((h, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-ui-muted-deep"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold text-white ${h.color}`}
                    >
                      {h.ticker.slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-ui-strong">{h.ticker}</p>
                      <p className="truncate text-[10px] font-medium text-ui-faint">{h.name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] font-bold text-ui-strong">{h.val}</p>
                      <p
                        className={`text-[10px] font-bold ${
                          'neutral' in h && h.neutral ? 'text-ui-muted-text' : h.up ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {'neutral' in h && h.neutral ? '' : h.up ? '↗ ' : '↙ '}
                        {h.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ui-border py-3 text-[12px] font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep"
              >
                All Holdings
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[32px]">
            <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-7">
              <h3 className="text-[14px] font-bold text-ui-strong">Transactions</h3>
              <div className="flex items-center gap-2">
                <div className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-red-500/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                </div>
                <svg className="h-3.5 w-3.5 text-red-400/90" viewBox="0 0 24 12" fill="none" aria-hidden>
                  <path
                    d="M1 6h4l2-4 3 8 3-10 3 6h7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Live</span>
              </div>
            </div>
            <div className="divide-y divide-ui-divider">
              {txns.map((tx, i) => {
                const positive = tx.amount.startsWith('+');
                const isWithdraw = tx.variant === 'withdraw';
                const iconWrap = isWithdraw
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  : tx.variant === 'yield'
                    ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400';

                return (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors hover:bg-ui-muted-surface md:px-6"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}>
                      {tx.variant === 'yield' ? (
                        <BoltIcon className="h-4 w-4" />
                      ) : tx.variant === 'withdraw' ? (
                        <WalletWithdrawIcon className="h-4 w-4" />
                      ) : (
                        <WalletDepositIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-ui-strong transition-colors group-hover:text-primary">
                        {tx.label}
                      </p>
                      <p className="text-[10px] font-medium text-ui-faint">{tx.time}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-[13px] font-bold ${
                          isWithdraw ? 'text-ui-strong' : positive ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {tx.amount}
                      </p>
                      {tx.status ? (
                        <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                          {tx.status}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-ui-divider p-4 md:p-5">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ui-border py-3 text-[12px] font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep"
              >
                Full History
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}
