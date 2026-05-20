'use client';

import Link from 'next/link';
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
import {
  useGetInvestorWalletInitQuery,
  useConnectInvestorWalletMutation,
  useDepositInvestorFundsMutation,
  useWithdrawInvestorFundsMutation,
  useTransferInvestorFundsMutation,
} from '@/store/api/investorWalletApi';
import { formatCompactCurrency } from '@/lib/issuerDashboard';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;
type InvestorWalletAction = 'deposit' | 'withdraw' | 'transfer' | 'connect';

type InvestorWalletFormState = {
  amount: string;
  currency: string;
  recipientAddress: string;
  address: string;
  network: string;
  name: string;
};

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

const INITIAL_FORM: InvestorWalletFormState = {
  amount: '',
  currency: 'USD',
  recipientAddress: '',
  address: '',
  network: 'Ethereum',
  name: '',
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

function WalletActionForm({
  action,
  form,
  setForm,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
  success,
}: {
  action: InvestorWalletAction;
  form: InvestorWalletFormState;
  setForm: React.Dispatch<React.SetStateAction<InvestorWalletFormState>>;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
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
          <p className="mt-1 text-sm text-ui-muted-text">
            {action === 'connect'
              ? 'Add a wallet connection using the live investor wallet API.'
              : 'Submit this action through the live investor wallet API.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-ui-border px-3 py-2 text-xs font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {action !== 'connect' ? (
          <>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, amount: event.target.value }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-sm text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="1000"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">Currency</span>
              <input
                type="text"
                value={form.currency}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-sm text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="USD"
              />
            </label>
          </>
        ) : (
          <>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">Wallet Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-sm text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="Primary Wallet"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">Network</span>
              <input
                type="text"
                value={form.network}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, network: event.target.value }))
                }
                className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-sm text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                placeholder="Ethereum"
              />
            </label>
          </>
        )}

        {action === 'transfer' ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">Recipient Address</span>
            <input
              type="text"
              value={form.recipientAddress}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, recipientAddress: event.target.value }))
              }
              className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-sm text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
              placeholder="0x..."
            />
          </label>
        ) : null}

        {action === 'connect' ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">Wallet Address</span>
            <input
              type="text"
              value={form.address}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, address: event.target.value }))
              }
              className="w-full rounded-2xl border border-ui-border bg-ui-card px-4 py-3 text-sm text-ui-strong outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
              placeholder="0x..."
            />
          </label>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void onSubmit()}
          disabled={isSubmitting}
          className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-ui-border px-5 py-3 text-sm font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function InvestorWalletPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<InvestorWalletAction | null>(null);
  const [form, setForm] = useState<InvestorWalletFormState>(INITIAL_FORM);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: initData, isLoading } = useGetInvestorWalletInitQuery();
  const [connectWallet] = useConnectInvestorWalletMutation();
  const [depositFunds] = useDepositInvestorFundsMutation();
  const [withdrawFunds] = useWithdrawInvestorFundsMutation();
  const [transferFunds] = useTransferInvestorFundsMutation();

  const summary = initData?.summary;
  const wallets = initData?.wallets ?? [];
  const holdings = initData?.holdings ?? [];
  const transactions = initData?.transactions ?? [];
  const currency = summary?.currency || form.currency || 'USD';

  const totalValueFormatted =
    summary?.totalValue != null ? formatCompactCurrency(summary.totalValue, currency) : '—';
  const monthlyChangeText =
    summary?.monthlyChangeAmount != null
      ? `${formatSignedCurrency(summary.monthlyChangeAmount, currency)} (${formatSignedPercent(summary.monthlyChangePercent)}) this month`
      : 'No monthly change data yet';

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(address);
    window.setTimeout(() => setCopied(null), 2000);
  };

  const openAction = (action: InvestorWalletAction) => {
    setActiveAction(action);
    setError(null);
    setMessage(null);
    setForm((prev) => ({
      ...INITIAL_FORM,
      currency,
      network: prev.network || INITIAL_FORM.network,
    }));
  };

  const closeAction = () => {
    setActiveAction(null);
    setError(null);
    setMessage(null);
    setForm((prev) => ({
      ...INITIAL_FORM,
      currency: prev.currency || currency,
    }));
  };

  const submitAction = async () => {
    if (!activeAction) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (activeAction === 'connect') {
        if (!form.address.trim() || !form.network.trim()) {
          throw new Error('Wallet address and network are required.');
        }
        await connectWallet({
          address: form.address.trim(),
          network: form.network.trim(),
          name: form.name.trim() || undefined,
        }).unwrap();
        setMessage('Wallet connected successfully.');
      } else {
        const amount = Number(form.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error('Enter a valid amount greater than zero.');
        }

        if (activeAction === 'deposit') {
          await depositFunds({ amount, currency: form.currency.trim() || currency }).unwrap();
          setMessage('Deposit initiated successfully.');
        } else if (activeAction === 'withdraw') {
          await withdrawFunds({ amount, currency: form.currency.trim() || currency }).unwrap();
          setMessage('Withdrawal initiated successfully.');
        } else {
          if (!form.recipientAddress.trim()) {
            throw new Error('Recipient address is required for transfers.');
          }
          await transferFunds({
            amount,
            currency: form.currency.trim() || currency,
            recipientAddress: form.recipientAddress.trim(),
          }).unwrap();
          setMessage('Transfer submitted successfully.');
        }
      }

      setForm((prev) => ({
        ...INITIAL_FORM,
        currency: prev.currency || currency,
      }));
    } catch (submitError) {
      const nextError =
        submitError instanceof Error ? submitError.message : 'Unable to complete wallet action.';
      setError(nextError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions: { label: string; primary: boolean; Icon: NavSvg; onClick: () => void }[] = [
    {
      label: 'Deposit',
      primary: true,
      Icon: WalletDepositIcon,
      onClick: () => openAction('deposit'),
    },
    {
      label: 'Withdraw',
      primary: false,
      Icon: WalletWithdrawIcon,
      onClick: () => openAction('withdraw'),
    },
    {
      label: 'Transfer',
      primary: false,
      Icon: WalletTransferIcon,
      onClick: () => openAction('transfer'),
    },
    {
      label: 'Connect Wallet',
      primary: false,
      Icon: Wallet,
      onClick: () => openAction('connect'),
    },
  ];

  const getWalletIconProps = (name: string) => {
    if (name.toLowerCase().includes('custody')) {
      return { Icon: WalletCustodyBarsIcon, bg: 'bg-slate-700', cls: 'h-[14px] w-[9px] text-white' };
    }
    if (name.toLowerCase().includes('polygon')) {
      return { Icon: WalletPolygonIcon, bg: 'bg-violet-600', cls: 'h-[14px] w-3 text-white' };
    }
    return { Icon: Wallet, bg: 'bg-blue-500', cls: 'h-5 w-5 text-white' };
  };

  return (
    <InvestorLayout pageTitle="Wallet">
      <div className="space-y-6 animate-in fade-in duration-700">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Wallet</h1>
          <p className="mt-1 text-sm font-medium text-ui-faint">
            Connected wallets, token holdings, and on-chain transaction history.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-[#0b0b16] via-[#121228] to-[#1a0f38] p-6 text-white shadow-2xl ring-1 ring-white/10 md:rounded-[32px] md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/25 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-primary/20 blur-[90px]" />
          <div className="relative z-10 flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <Wallet className="h-4 w-4 shrink-0 text-white/50" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Total Portfolio Value</p>
              </div>
              <p className="text-4xl font-bold tracking-tight md:text-6xl">{totalValueFormatted}</p>
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
              <p className="mt-3 text-[11px] font-medium text-white/45">
                {(summary?.walletCount ?? wallets.length)} connected {(summary?.walletCount ?? wallets.length) === 1 ? 'wallet' : 'wallets'} · {(summary?.holdingCount ?? holdings.length)} token {(summary?.holdingCount ?? holdings.length) === 1 ? 'position' : 'positions'}
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-[12px] font-bold text-emerald-400">
                <span aria-hidden>↗</span> {monthlyChangeText}
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:max-w-xs lg:w-56">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[13px] font-bold transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    action.primary
                      ? 'bg-white text-slate-900 shadow-lg hover:bg-white/95'
                      : 'border border-white/75 bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  <action.Icon className={`h-4 w-4 shrink-0 ${action.primary ? 'text-slate-900' : 'text-white'}`} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeAction ? (
          <WalletActionForm
            action={activeAction}
            form={form}
            setForm={setForm}
            onSubmit={submitAction}
            onCancel={closeAction}
            isSubmitting={isSubmitting}
            error={error}
            success={message}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:grid-cols-3">
          <section className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[32px]">
            <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-7">
              <h3 className="text-[14px] font-bold text-ui-strong">Connected Wallets</h3>
              <button
                type="button"
                onClick={() => openAction('connect')}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary transition-colors hover:bg-primary/15"
                aria-label="Connect wallet"
              >
                +
              </button>
            </div>
            <div className="space-y-3 p-4">
              {isLoading ? (
                <p className="rounded-2xl bg-ui-muted px-4 py-6 text-center text-sm font-medium text-ui-muted-text">
                  Loading wallets...
                </p>
              ) : wallets.length > 0 ? (
                wallets.map((wallet, index) => {
                  const icon = getWalletIconProps(wallet.name);
                  const explorerUrl = buildExplorerUrl(wallet.network, wallet.address);
                  return (
                    <div
                      key={wallet.id || wallet.address || index}
                      className="group flex items-center gap-3 rounded-2xl bg-ui-muted-deep p-3 transition-colors hover:bg-ui-muted md:p-4"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${icon.bg}`}>
                        <icon.Icon className={icon.cls} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[13px] font-bold text-ui-strong">{wallet.name}</p>
                          {wallet.connected ? <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
                        </div>
                        <p className="text-[10px] font-medium text-ui-faint">{wallet.network}</p>
                        <p className="mt-0.5 text-[11px] font-bold text-ui-body">{wallet.balance}</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <p className="truncate font-mono text-[9px] text-ui-placeholder">{wallet.address}</p>
                          <button
                            type="button"
                            onClick={() => void copyAddress(wallet.address)}
                            className="shrink-0 text-ui-faint transition-colors hover:text-primary"
                            aria-label="Copy address"
                          >
                            {copied === wallet.address ? (
                              <CheckIcon className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <CopyIcon className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      {explorerUrl ? (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-ui-placeholder transition-colors hover:text-primary"
                          aria-label="Open in explorer"
                        >
                          <ExternalIcon className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-ui-border px-4 py-8 text-center">
                  <p className="text-sm font-bold text-ui-strong">No connected wallets yet</p>
                  <p className="mt-1 text-xs font-medium text-ui-muted-text">
                    Connect an investor wallet to start using wallet actions.
                  </p>
                </div>
              )}
            </div>
            {wallets.length > 0 ? (
              <div className="mx-4 mb-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/40">
                <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">Wallets available</p>
                  <p className="text-[9px] font-medium text-emerald-700/80 dark:text-emerald-400/90">
                    Data is loaded live from the investor wallet API.
                  </p>
                </div>
              </div>
            ) : null}
          </section>

          <section id="investor-wallet-holdings" className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[32px]">
            <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-7">
              <h3 className="text-[14px] font-bold text-ui-strong">Token Holdings</h3>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-primary dark:bg-violet-950/50 dark:text-violet-300">
                {holdings.length} {holdings.length === 1 ? 'position' : 'positions'}
              </span>
            </div>
            <div className="space-y-4 p-5 md:p-6">
              {holdings.length > 0 ? (
                <>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-ui-faint">Portfolio Distribution</p>
                      <p className="text-[11px] font-bold text-ui-strong">{totalValueFormatted} total</p>
                    </div>
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                      {holdings.map((holding, index) => (
                        <div
                          key={`${holding.ticker}-${index}`}
                          className={`${holding.color || 'bg-violet-600'} h-full`}
                          style={{ width: `${holding.pct}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {holdings.map((holding, index) => (
                      <div
                        key={`${holding.ticker}-${index}`}
                        className="group flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-ui-muted-deep"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold text-white ${holding.color || 'bg-violet-600'}`}
                        >
                          {holding.ticker.slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-bold text-ui-strong">{holding.ticker}</p>
                          <p className="truncate text-[10px] font-medium text-ui-faint">{holding.name}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[13px] font-bold text-ui-strong">{holding.value}</p>
                          <p className={`text-[10px] font-bold ${holding.up ? 'text-emerald-500' : 'text-red-500'}`}>
                            {holding.up ? '↗ ' : '↙ '}
                            {holding.change}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-ui-border px-4 py-8 text-center">
                  <p className="text-sm font-bold text-ui-strong">No holdings yet</p>
                  <p className="mt-1 text-xs font-medium text-ui-muted-text">
                    Holdings will appear here once your investor wallet owns tokenized assets.
                  </p>
                </div>
              )}

              <Link
                href="/investor/portfolio"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ui-border py-3 text-[12px] font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep"
              >
                All Holdings
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          <section id="investor-wallet-transactions" className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:col-span-2 md:rounded-[32px] 2xl:col-span-1">
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
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => {
                  const positive = transaction.amount.startsWith('+');
                  const isWithdraw = transaction.variant === 'withdraw';
                  const iconWrap = isWithdraw
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    : transaction.variant === 'yield'
                      ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400';

                  return (
                    <div
                      key={transaction.id || index}
                      className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-ui-muted md:px-6"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}>
                        {transaction.variant === 'yield' ? (
                          <BoltIcon className="h-4 w-4" />
                        ) : transaction.variant === 'withdraw' ? (
                          <WalletWithdrawIcon className="h-4 w-4" />
                        ) : (
                          <WalletDepositIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-bold text-ui-strong transition-colors group-hover:text-primary">
                          {transaction.label}
                        </p>
                        <p className="text-[10px] font-medium text-ui-faint">{transaction.time}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p
                          className={`text-[13px] font-bold ${
                            isWithdraw ? 'text-ui-strong' : positive ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {transaction.amount}
                        </p>
                        {transaction.status ? (
                          <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                            {transaction.status}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="px-6 py-10 text-center text-sm font-medium text-ui-muted-text">
                  No wallet transactions yet.
                </p>
              )}
            </div>
            <div className="border-t border-ui-divider p-4 md:p-5">
              <Link
                href="/investor/hub?tab=transactions"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ui-border py-3 text-[12px] font-bold text-ui-muted-text transition-all hover:bg-ui-muted"
              >
                Full History
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </InvestorLayout>
  );
}
