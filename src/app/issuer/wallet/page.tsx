'use client';

import Link from 'next/link';
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
  ShieldCheck,
  Wallet,
  Zap,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useGetIssuerWalletSummaryQuery,
  useGetIssuerWalletsQuery,
  useGetIssuerWalletHoldingsQuery,
  useGetIssuerWalletTransactionsQuery,
  useDepositIssuerFundsMutation,
  useWithdrawIssuerFundsMutation,
  useTransferIssuerFundsMutation,
  useConnectIssuerWalletMutation,
  type IssuerWalletItem,
} from '@/store/api/issuerWalletApi';
import { formatCompactCurrency } from '@/lib/issuerDashboard';

const iconStroke = 1.75;
const SPARKLINE_POINTS = [42, 48, 44, 52, 50, 58, 55, 62, 60, 68, 72, 78];

type IssuerWalletAction = 'deposit' | 'withdraw' | 'transfer' | 'connect';

type IssuerWalletFormState = {
  amount: string;
  currency: string;
  recipientAddress: string;
  walletId: string;
  toWalletId: string;
  note: string;
  connectAddress: string;
  connectNetwork: string;
  connectName: string;
};

type WalletCard = {
  name: string;
  network: string;
  balance: string;
  address: string;
  secured?: boolean;
  icon: 'platform' | 'custody' | 'polygon';
};

type TxKind = 'deposit' | 'yield' | 'fee';

const INITIAL_FORM: IssuerWalletFormState = {
  amount: '',
  currency: 'USD',
  recipientAddress: '',
  walletId: '',
  toWalletId: '',
  note: '',
  connectAddress: '',
  connectNetwork: 'Ethereum',
  connectName: '',
};

// Keep the original wallet visual structure visible while binding the actions and card content to live APIs.

function formatSignedPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return '0.0%';
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

function formatSignedCurrency(value: number | null | undefined, currency: string) {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${formatCompactCurrency(Math.abs(value), currency)}`;
}

function buildExplorerUrl(network: string, address: string) {
  if (!address) return null;
  const normalized = network.toLowerCase();
  if (normalized.includes('polygon')) {
    return `https://polygonscan.com/address/${address}`;
  }
  if (normalized.includes('base')) {
    return `https://basescan.org/address/${address}`;
  }
  if (normalized.includes('arbitrum')) {
    return `https://arbiscan.io/address/${address}`;
  }
  return `https://etherscan.io/address/${address}`;
}

function PortfolioSparkline() {
  const w = 280;
  const h = 48;
  const max = Math.max(...SPARKLINE_POINTS);
  const min = Math.min(...SPARKLINE_POINTS);
  const range = max - min || 1;
  const pts = SPARKLINE_POINTS.map((value, index) => {
    const x = (index / (SPARKLINE_POINTS.length - 1)) * w;
    const y = h - ((value - min) / range) * (h - 8) - 4;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg className="mt-3 h-12 w-full max-w-[280px] opacity-70" viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
      <defs>
        <linearGradient id="walletSparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d={`${pts} L ${w} ${h} L 0 ${h} Z`} fill="url(#walletSparkGrad)" opacity="0.25" />
      <path d={pts} stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function WalletActionForm({
  action,
  form,
  setForm,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
  success,
  wallets,
}: {
  action: IssuerWalletAction;
  form: IssuerWalletFormState;
  setForm: React.Dispatch<React.SetStateAction<IssuerWalletFormState>>;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  wallets: IssuerWalletItem[];
}) {
  const title =
    action === 'deposit'
      ? 'Deposit Funds'
      : action === 'withdraw'
        ? 'Withdraw Funds'
        : action === 'transfer'
          ? 'Transfer Funds'
          : 'Connect Wallet';

  const submitLabel =
    action === 'deposit'
      ? 'Start Deposit'
      : action === 'withdraw'
        ? 'Start Withdrawal'
        : action === 'transfer'
          ? 'Transfer Funds'
          : 'Connect Wallet';

  return (
    <div className="rounded-[24px] border border-ui-border bg-ui-card p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ui-strong">{title}</h2>
          <p className="mt-1 text-base text-ui-muted-text">
            Submit this action through the live issuer wallet API.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-ui-border px-3 py-2 text-base font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
        >
          Close
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-medium text-emerald-700">
          {success}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {action === 'connect' ? (
          <>
            <label className="space-y-2 md:col-span-2">
              <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Wallet Name</span>
              <input
                type="text"
                value={form.connectName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, connectName: event.target.value }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="e.g., Platform Treasury Wallet"
              />
            </label>
            <label className="space-y-2">
              <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Network</span>
              <select
                value={form.connectNetwork}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, connectNetwork: event.target.value }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10 bg-white"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="Base">Base</option>
                <option value="Arbitrum">Arbitrum</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Wallet Address</span>
              <input
                type="text"
                value={form.connectAddress}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, connectAddress: event.target.value }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="0x..."
              />
            </label>
          </>
        ) : (
          <>
            {action === 'transfer' ? (
              <>
                {wallets.length > 0 ? (
                  <>
                    <label className="space-y-2">
                      <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Source Wallet (From)</span>
                      <select
                        value={form.walletId}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, walletId: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10 opacity-100 bg-white"
                      >
                        <option value="">-- Choose Source Wallet --</option>
                        {wallets.map((w, index) => (
                          <option key={w.id || w.address || index} value={w.id}>
                            {w.name} ({w.network}) - {w.address.slice(0, 6)}...{w.address.slice(-4)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Destination Wallet (To)</span>
                      <select
                        value={form.toWalletId}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, toWalletId: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10 opacity-100 bg-white"
                      >
                        <option value="">-- Choose Destination Wallet --</option>
                        {wallets.map((w, index) => (
                          <option key={w.id || w.address || index} value={w.id}>
                            {w.name} ({w.network}) - {w.address.slice(0, 6)}...{w.address.slice(-4)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <label className="space-y-2">
                      <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Source Wallet ID (UUID)</span>
                      <input
                        type="text"
                        value={form.walletId}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, walletId: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                        placeholder="e.g., 16221174-8ba5-43a2-b523-4cfee56633fc"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Destination Wallet ID (UUID)</span>
                      <input
                        type="text"
                        value={form.toWalletId}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, toWalletId: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                        placeholder="e.g., d5c5c1a8-8f81-42d8-bf96-b09e865f123a"
                      />
                    </label>
                    <p className="text-xs font-medium text-amber-600/90 dark:text-amber-400/90 md:col-span-2">
                      No active wallets are connected. Please enter valid UUIDs manually for both source and destination.
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                {wallets.length > 0 ? (
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Select Wallet</span>
                    <select
                      value={form.walletId}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, walletId: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10 opacity-100 bg-white"
                    >
                      <option value="">-- Choose a Wallet --</option>
                      {wallets.map((w, index) => (
                        <option key={w.id || w.address || index} value={w.id}>
                          {w.name} ({w.network}) - {w.address.slice(0, 6)}...{w.address.slice(-4)}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Wallet ID (UUID)</span>
                    <input
                      type="text"
                      value={form.walletId}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, walletId: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                      placeholder="e.g., 16221174-8ba5-43a2-b523-4cfee56633fc"
                    />
                    <p className="text-xs font-medium text-amber-600/90 dark:text-amber-400/90">
                      No active wallets are connected. Please enter a valid UUID manually.
                    </p>
                  </label>
                )}
              </>
            )}

            <label className="space-y-2">
              <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, amount: event.target.value }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="1000"
              />
            </label>
            <label className="space-y-2">
              <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Currency</span>
              <input
                type="text"
                value={form.currency}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="USD"
              />
            </label>
            {action === 'deposit' ? (
              <label className="space-y-2 md:col-span-2">
                <span className="text-base font-bold uppercase tracking-widest text-ui-faint">Treasury Note</span>
                <input
                  type="text"
                  value={form.note}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, note: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-base text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                  placeholder="Platform treasury deposit"
                />
              </label>
            ) : null}
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void onSubmit()}
          disabled={isSubmitting}
          className="rounded-2xl bg-primary px-5 py-3 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-ui-border px-5 py-3 text-base font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function SectionLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex w-full items-center justify-center gap-1 rounded-xl border border-ui-border bg-ui-card py-3.5 text-sm font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
    >
      {label}
      <ChevronRight className="h-4 w-4" strokeWidth={iconStroke} />
    </Link>
  );
}

export default function WalletPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<IssuerWalletAction | null>(null);
  const [form, setForm] = useState<IssuerWalletFormState>(INITIAL_FORM);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const { data: summary } = useGetIssuerWalletSummaryQuery();
  const { data: walletsRaw, isLoading: walletsLoading } = useGetIssuerWalletsQuery();
  const { data: holdingsRaw, isLoading: holdingsLoading } = useGetIssuerWalletHoldingsQuery();
  const { data: transactionsRaw, isLoading: transactionsLoading } = useGetIssuerWalletTransactionsQuery();

  const [depositFunds] = useDepositIssuerFundsMutation();
  const [withdrawFunds] = useWithdrawIssuerFundsMutation();
  const [transferFunds] = useTransferIssuerFundsMutation();
  const [connectWallet] = useConnectIssuerWalletMutation();

  const wallets = walletsRaw ?? [];
  const holdings = holdingsRaw ?? [];
  const transactions = transactionsRaw ?? [];
  const currency = summary?.currency || form.currency || 'USD';

  const totalValueFormatted =
    summary?.totalValue != null ? formatCompactCurrency(summary.totalValue, currency) : '—';
  const monthlyChangeText =
    summary?.monthlyChangeAmount != null
      ? `${formatSignedCurrency(summary.monthlyChangeAmount, currency)} (${formatSignedPercent(summary.monthlyChangePercent)}) this month`
      : 'No monthly change data yet';

  const openAction = (action: IssuerWalletAction) => {
    setActiveAction(action);
    setError(null);
    setMessage(null);
    const defaultWalletId = wallets[0]?.id || '';
    const destinationWalletId = wallets[1]?.id || wallets[0]?.id || '';
    setForm({
      ...INITIAL_FORM,
      currency,
      walletId: defaultWalletId,
      toWalletId: destinationWalletId,
      note: action === 'deposit' ? 'Platform treasury deposit' : '',
    });
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const closeAction = () => {
    setActiveAction(null);
    setError(null);
    setMessage(null);
    setForm({ ...INITIAL_FORM, currency });
  };

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(address);
    window.setTimeout(() => setCopied(null), 2000);
  };

  const submitAction = async () => {
    if (!activeAction) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (activeAction === 'connect') {
        const address = form.connectAddress.trim();
        const network = form.connectNetwork.trim();
        const name = form.connectName.trim();

        if (!address) {
          throw new Error('Wallet address is required.');
        }
        if (!network) {
          throw new Error('Network is required.');
        }

        await connectWallet({
          address,
          network,
          name: name || undefined,
        }).unwrap();
        setMessage('Wallet connected successfully.');
      } else {
        const amount = Number(form.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error('Enter a valid amount greater than zero.');
        }

        if (activeAction === 'transfer') {
          const fromWalletId = form.walletId.trim();
          const toWalletId = form.toWalletId.trim();

          if (!fromWalletId) {
            throw new Error('Source Wallet (From) is required.');
          }
          if (!toWalletId) {
            throw new Error('Destination Wallet (To) is required.');
          }
          if (fromWalletId === toWalletId) {
            throw new Error('Source and destination wallets must be different.');
          }

          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(fromWalletId)) {
            throw new Error('Source Wallet ID must be a valid UUID.');
          }
          if (!uuidRegex.test(toWalletId)) {
            throw new Error('Destination Wallet ID must be a valid UUID.');
          }

          await transferFunds({
            amount,
            fromWalletId,
            toWalletId,
            currency: form.currency.trim() || currency,
          }).unwrap();
          setMessage('Transfer submitted successfully.');
        } else {
          const walletId = form.walletId.trim();
          if (!walletId) {
            throw new Error('Wallet ID is required. Please select or enter a valid Wallet UUID.');
          }

          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(walletId)) {
            throw new Error('Wallet ID must be a valid UUID.');
          }

          if (activeAction === 'deposit') {
            await depositFunds({
              amount,
              currency: form.currency.trim() || currency,
              walletId,
              note: form.note.trim() || undefined,
            }).unwrap();
            setMessage('Deposit initiated successfully.');
          } else {
            await withdrawFunds({
              amount,
              currency: form.currency.trim() || currency,
              walletId,
            }).unwrap();
            setMessage('Withdrawal initiated successfully.');
          }
        }
      }

      setForm({
        ...INITIAL_FORM,
        currency,
        walletId: wallets[0]?.id || '',
        toWalletId: wallets[1]?.id || wallets[0]?.id || '',
      });
    } catch (submitError: any) {
      const nextError =
        submitError?.data?.message?.[0] ||
        submitError?.message ||
        'Unable to complete wallet action.';
      setError(nextError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allWalletsSecured = wallets.length > 0 && wallets.every((wallet) => wallet.secured);

  return (
    <DashboardLayout>
      <div className="animate-page-enter mx-auto w-full max-w-7xl min-w-0 space-y-6 sm:space-y-8 xl:space-y-10">
        <div className="animate-slide-up space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong sm:text-3xl xl:text-4xl">Wallet</h1>
          <p className="text-base font-medium text-ui-muted-text">
            Connected wallets, token holdings, and on-chain transaction history.
          </p>
        </div>

        <div className="animate-slide-up delay-100 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E0A3C] via-[#2D1260] to-[#0F172A] p-5 shadow-[0_24px_60px_-16px_rgba(30,10,60,0.55)] sm:rounded-3xl sm:p-8 md:p-10 xl:rounded-[32px] xl:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#9810FA]/25 blur-[100px]" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#3B82F6]/20 blur-[80px]" aria-hidden />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
            <div className="min-w-0 flex-1 space-y-5 sm:space-y-6">
              <div>
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/55">
                  <Wallet className="h-4 w-4 shrink-0 text-white/70" strokeWidth={iconStroke} />
                  Total Portfolio Value
                </p>
                <p className="text-3xl font-bold tracking-tight tabular-nums text-white sm:text-4xl md:text-5xl xl:text-7xl">
                  {totalValueFormatted}
                </p>
                <PortfolioSparkline />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <p className="text-base font-medium text-white/55">
                  {(summary?.walletCount ?? wallets.length)} connected {(summary?.walletCount ?? wallets.length) === 1 ? 'wallet' : 'wallets'} · {(summary?.holdingCount ?? holdings.length)} token {(summary?.holdingCount ?? holdings.length) === 1 ? 'position' : 'positions'}
                </p>
                <p className="flex flex-wrap items-center gap-1.5 text-base font-bold text-[#34D399]">
                  <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                  {monthlyChangeText}
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap xl:w-[220px] xl:flex-col">
              <button
                type="button"
                onClick={() => openAction('deposit')}
                className="flex w-full flex-1 items-center justify-center gap-2.5 rounded-2xl bg-white py-3.5 text-base font-bold text-[#111827] shadow-lg transition-transform hover:scale-[1.02] sm:min-w-[140px] xl:min-w-0 dark:bg-[#f8fafc] dark:text-[#0d0d12]"
              >
                <ArrowDownLeft className="h-4 w-4" strokeWidth={iconStroke} />
                Deposit
              </button>
              <button
                type="button"
                onClick={() => openAction('withdraw')}
                className="flex w-full flex-1 items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:min-w-[140px] xl:min-w-0"
              >
                <ArrowUpRight className="h-4 w-4" strokeWidth={iconStroke} />
                Withdraw
              </button>
              <button
                type="button"
                onClick={() => openAction('transfer')}
                className="flex w-full flex-1 items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:min-w-[140px] xl:min-w-0"
              >
                <ArrowLeftRight className="h-4 w-4" strokeWidth={iconStroke} />
                Transfer
              </button>
            </div>
          </div>
        </div>

        {activeAction ? (
          <div ref={formRef}>
            <WalletActionForm
              action={activeAction}
              form={form}
              setForm={setForm}
              onSubmit={submitAction}
              onCancel={closeAction}
              isSubmitting={isSubmitting}
              error={error}
              success={message}
              wallets={wallets}
            />
          </div>
        ) : null}

        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3 2xl:gap-8">
          <section className="animate-slide-up delay-200 flex min-w-0 flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-ui-strong">Connected Wallets</h2>
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-[#7C3AED]">
                  {wallets.length}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-7">
              <div className="flex-1 space-y-3">
                {walletsLoading ? (
                  <p className="py-10 text-center text-base font-medium text-ui-muted-text">
                    Loading wallets...
                  </p>
                ) : wallets.length > 0 ? (
                  wallets.map((wallet, index) => {
                    const explorerUrl = buildExplorerUrl(wallet.network, wallet.address);
                    return (
                      <div
                        key={wallet.address || index}
                        className="rounded-2xl border border-ui-border bg-ui-muted-deep p-4 transition-shadow hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.12)] sm:p-5"
                      >
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <WalletNetworkIcon type={wallet.icon} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="truncate text-base font-bold text-ui-strong">{wallet.name}</h3>
                                {wallet.secured ? (
                                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={iconStroke} aria-label="Secured" />
                                ) : null}
                              </div>
                              <p className="text-xs font-medium text-ui-faint">{wallet.network}</p>
                            </div>
                          </div>
                          {explorerUrl ? (
                            <a
                              href={explorerUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 text-ui-faint transition-colors hover:text-[#7C3AED]"
                              aria-label={`Open ${wallet.name}`}
                            >
                              <ExternalLink className="h-4 w-4" strokeWidth={iconStroke} />
                            </a>
                          ) : null}
                        </div>
                        <p className="mb-2 text-xl font-bold text-ui-strong">{wallet.balance}</p>
                        <div className="flex items-center gap-2">
                          <code className="rounded-md bg-ui-muted-deep px-2 py-1 font-mono text-xs text-ui-muted-text">
                            {wallet.address}
                          </code>
                          <button
                            type="button"
                            onClick={() => void copyAddress(wallet.address)}
                            className="text-ui-faint transition-colors hover:text-[#7C3AED]"
                            aria-label="Copy address"
                          >
                            {copied === wallet.address ? (
                              <span className="text-xs font-bold text-emerald-500">Copied!</span>
                            ) : (
                              <Copy className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ui-border px-4 py-10 text-center">
                    <p className="text-base font-bold text-ui-strong">No managed wallets yet</p>
                    <p className="mt-1 text-base font-medium text-ui-muted-text">
                      Wallets will appear here once they are provisioned on the backend.
                    </p>
                  </div>
                )}

                {allWalletsSecured ? (
                  <div className="flex items-start gap-3 rounded-[16px] border border-emerald-200 bg-emerald-50/80 px-4 py-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={iconStroke} />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">All wallets secured</p>
                      <p className="text-xs font-medium text-emerald-700/80">
                        Live wallet records show secure custody coverage.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section id="issuer-wallet-holdings" className="animate-slide-up delay-300 flex min-w-0 flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-bold text-ui-strong">Token Holdings</h2>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#7C3AED]">
                {holdings.length} {holdings.length === 1 ? 'position' : 'positions'}
              </span>
            </div>

            <div className="flex flex-1 flex-col rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-7">
              {holdingsLoading ? (
                <p className="py-10 text-center text-base font-medium text-ui-muted-text">Loading holdings...</p>
              ) : holdings.length > 0 ? (
                <>
                  <div className="mb-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">
                        Portfolio Distribution
                      </span>
                      <span className="text-sm font-bold text-ui-strong">{totalValueFormatted} total</span>
                    </div>
                    <div className="flex h-3 overflow-hidden rounded-full">
                      {holdings.map((holding) => (
                        <div
                          key={holding.ticker}
                          className={`${holding.barColor} first:rounded-l-full last:rounded-r-full`}
                          style={{ width: `${holding.barPct}%` }}
                          title={holding.ticker}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    {holdings.map((holding) => (
                      <div key={holding.ticker} className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${holding.iconBg}`}
                          >
                            {holding.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-ui-strong">{holding.ticker}</p>
                            <p className="truncate text-xs font-medium text-ui-faint">{holding.asset}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-base font-bold text-ui-strong">{holding.value}</p>
                          <p className={`text-xs font-bold ${holding.change.startsWith('+') ? 'text-ui-success-text' : holding.change === '0%' ? 'text-ui-faint' : 'text-ui-body'}`}>
                            {holding.change}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-ui-border px-4 py-8 text-center">
                  <p className="text-base font-bold text-ui-strong">No holdings yet</p>
                  <p className="mt-1 text-base font-medium text-ui-muted-text">
                    Token positions will appear here after assets move through onboarding and issuance.
                  </p>
                </div>
              )}

              <div className="mt-8">
                <SectionLinkButton href="/issuer/portfolio" label="All Holdings" />
              </div>
            </div>
          </section>

          <section id="issuer-wallet-transactions" className="animate-slide-up delay-400 flex min-w-0 flex-col space-y-4 md:col-span-2 2xl:col-span-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-bold text-ui-strong">Transactions</h2>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ui-faint">
                <Activity className="h-3.5 w-3.5 text-ui-faint" strokeWidth={iconStroke} />
                Live
              </span>
            </div>

            <div className="flex flex-1 flex-col rounded-[24px] border border-ui-border bg-ui-card p-3 shadow-sm md:p-4">
              <div className="divide-y divide-ui-divider">
                {transactionsLoading ? (
                  <p className="px-4 py-10 text-center text-base font-medium text-ui-muted-text">Loading transactions...</p>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => {
                    const isNegative = transaction.amount.startsWith('-');
                    return (
                      <div
                        key={`${transaction.title}-${index}`}
                        className="flex items-center justify-between gap-3 px-3 py-4 transition-colors hover:bg-ui-muted md:px-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <TxIcon kind={transaction.kind} />
                          <div className="min-w-0">
                            <p className="truncate text-base font-bold text-ui-strong">{transaction.title}</p>
                            <p className="text-xs font-medium text-ui-faint">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className={`text-base font-bold ${isNegative ? 'text-ui-body' : 'text-ui-success-text'}`}>
                            {transaction.amount}
                          </p>
                          {transaction.pending ? (
                            <span className="mt-1 inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                              Pending
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="px-4 py-10 text-center text-base font-medium text-ui-muted-text">
                    No issuer wallet transactions yet.
                  </p>
                )}
              </div>
              <div className="mt-2 px-1 pb-1">
                <SectionLinkButton href="/issuer/wallet#issuer-wallet-transactions" label="Full History" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
