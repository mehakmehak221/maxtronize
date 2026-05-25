import { pickNumber, pickString, unwrapList, unwrapPayload } from "@/lib/apiParse";
import { formatCompactCurrency } from "@/lib/issuerDashboard";
import { baseApi } from "./baseApi";

export interface WalletAmountDto {
  amount: number;
  currency?: string;
  walletId?: string;
  note?: string;
}

export interface WalletTransferDto {
  amount: number;
  fromWalletId: string;
  toWalletId: string;
  currency: string;
}

export interface ConnectIssuerWalletDto {
  address: string;
  network: string;
  name?: string;
}

export interface IssuerWalletSummary {
  totalValue: number;
  currency: string;
  monthlyChangeAmount: number;
  monthlyChangePercent: number;
  walletCount: number;
  holdingCount: number;
}

export interface IssuerWalletItem {
  id?: string;
  name: string;
  network: string;
  balance: string;
  address: string;
  secured?: boolean;
  icon: "platform" | "custody" | "polygon";
}

export interface IssuerWalletHolding {
  ticker: string;
  initials: string;
  asset: string;
  value: string;
  change: string;
  iconBg: string;
  barColor: string;
  barPct: number;
}

export interface IssuerWalletTransaction {
  title: string;
  date: string;
  amount: string;
  kind: "deposit" | "yield" | "fee";
  pending?: boolean;
}

const HOLDING_COLORS = [
  "bg-violet-600",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

const HOLDING_ICON_BGS = [
  "bg-violet-600",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function formatPercentLabel(value: number | null) {
  if (value == null || Number.isNaN(value)) return "0%";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

function formatAmountLabel(value: number | null, currency = "USD", sign = "") {
  if (value == null || Number.isNaN(value)) return "—";
  return `${sign}${formatCompactCurrency(Math.abs(value), currency)}`;
}

function getRecord(payload: unknown): Record<string, unknown> | null {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) return null;
  return root as Record<string, unknown>;
}

function parseIssuerWalletSummary(payload: unknown): IssuerWalletSummary {
  const root = getRecord(payload) ?? {};
  const summary =
    root.summary && typeof root.summary === "object" && !Array.isArray(root.summary)
      ? (root.summary as Record<string, unknown>)
      : root;
  const portfolioValue =
    summary.portfolioValue &&
    typeof summary.portfolioValue === "object" &&
    !Array.isArray(summary.portfolioValue)
      ? (summary.portfolioValue as Record<string, unknown>)
      : null;
  const monthlyChange =
    summary.monthlyChange &&
    typeof summary.monthlyChange === "object" &&
    !Array.isArray(summary.monthlyChange)
      ? (summary.monthlyChange as Record<string, unknown>)
      : null;

  return {
    totalValue:
      pickNumber(summary, ["totalValue", "totalPortfolioValue", "balance"]) ??
      pickNumber(portfolioValue ?? {}, ["amount", "value"]) ??
      0,
    currency:
      pickString(summary, ["currency"]) ??
      pickString(portfolioValue ?? {}, ["currency"]) ??
      "USD",
    monthlyChangeAmount:
      pickNumber(summary, ["monthlyChangeAmount"]) ??
      pickNumber(monthlyChange ?? {}, ["amount", "value"]) ??
      0,
    monthlyChangePercent:
      pickNumber(summary, ["monthlyChangePercent"]) ??
      pickNumber(monthlyChange ?? {}, ["percent", "changePercent", "value"]) ??
      0,
    walletCount:
      pickNumber(summary, ["walletCount", "connectedWalletsCount", "connectedWallets"]) ??
      0,
    holdingCount:
      pickNumber(summary, ["holdingCount", "tokenPositionsCount", "tokenPositions"]) ??
      0,
  };
}

function parseIssuerWallets(payload: unknown): IssuerWalletItem[] {
  const root = getRecord(payload);
  const walletsRaw =
    root?.wallets ?? root?.connectedWallets ?? root?.items ?? root?.data ?? payload;
  return unwrapList(walletsRaw).map((item, index) => {
    const currency = pickString(item, ["currency"]) ?? "USD";
    const balanceAmount =
      pickNumber(item, ["balanceAmount", "balance", "value", "amount"]) ?? 0;
    const secured =
      item.secured === true ||
      item.isSecured === true ||
      item.securityScheme === "MULTI_SIG" ||
      item.multiSig === true;
    const type = pickString(item, ["icon", "type"])?.toLowerCase() ?? "";
    const icon = type.includes("custody")
      ? "custody"
      : type.includes("polygon")
        ? "polygon"
        : "platform";

    return {
      id: pickString(item, ["id", "_id", "walletId"]) ?? `wallet-${index}`,
      name:
        pickString(item, ["name", "walletName", "label"]) ??
        `Wallet ${index + 1}`,
      network: pickString(item, ["network", "chain", "blockchainNetwork"]) ?? "Polygon",
      address: pickString(item, ["address", "walletAddress"]) ?? "",
      balance:
        pickString(item, ["balanceFormatted", "balanceLabel", "valueFormatted"]) ??
        formatCompactCurrency(balanceAmount, currency),
      secured,
      icon: icon as "platform" | "custody" | "polygon",
    };
  });
}

function parseIssuerWalletHoldings(payload: unknown): IssuerWalletHolding[] {
  const root = getRecord(payload);
  const holdingsRaw =
    root?.holdings ?? root?.positions ?? root?.items ?? root?.data ?? payload;
  return unwrapList(holdingsRaw).map((item, index) => {
    const currency = pickString(item, ["currency"]) ?? "USD";
    const valueAmount =
      pickNumber(item, ["valueUsd", "value", "amount"]) ?? 0;
    const changePercent =
      pickNumber(item, ["changePercent", "performancePercent"]) ?? 0;
    const allocationPercent =
      pickNumber(item, ["allocationPercent", "weightPercent", "pct", "percent"]) ?? 0;
    const ticker = pickString(item, ["symbol", "ticker"]) ?? "TOK";
    const name = pickString(item, ["name", "assetName"]) ?? "Token Position";

    return {
      ticker,
      initials: ticker.slice(0, 2),
      asset: name,
      value: formatCompactCurrency(valueAmount, currency),
      change: formatPercentLabel(changePercent),
      iconBg: HOLDING_ICON_BGS[index % HOLDING_ICON_BGS.length],
      barColor: HOLDING_COLORS[index % HOLDING_COLORS.length],
      barPct: allocationPercent,
    };
  });
}

function parseIssuerWalletTransactions(payload: unknown): IssuerWalletTransaction[] {
  const root = getRecord(payload);
  const transactionsRaw =
    root?.transactions ?? root?.items ?? root?.data ?? payload;
  return unwrapList(transactionsRaw).map((item, index) => {
    const currency = pickString(item, ["currency"]) ?? "USD";
    const amountValue = pickNumber(item, ["amount", "value"]) ?? 0;
    const direction =
      pickString(item, ["direction", "side", "type", "kind"])?.toLowerCase() ?? "";
    const kind =
      direction.includes("yield") || direction.includes("distribution")
        ? "yield"
        : direction.includes("fee") ||
            direction.includes("withdrawal") ||
            direction.includes("withdraw")
          ? "fee"
          : "deposit";

    const signedAmount =
      pickString(item, ["amountFormatted", "amountLabel", "valueFormatted"]) ??
      formatAmountLabel(amountValue, currency, kind === "fee" ? "-" : "+");
    const status = pickString(item, ["status"])?.toUpperCase();
    const pending = status === "PENDING" || item.pending === true;

    return {
      title:
        pickString(item, ["title", "label", "description", "note", "type"]) ??
        "Transaction",
      date:
        pickString(item, [
          "date",
          "time",
          "dateLabel",
          "createdAt",
          "created_at",
          "timestamp",
        ]) ?? "Recently",
      amount: signedAmount,
      kind: kind as "deposit" | "yield" | "fee",
      pending,
    };
  });
}

export const issuerWalletApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getIssuerWalletSummary: build.query<IssuerWalletSummary, void>({
      query: () => ({ url: "/wallet/summary", method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerWalletSummary(response),
      providesTags: ["IssuerDashboard"],
    }),
    getIssuerWallets: build.query<IssuerWalletItem[], void>({
      query: () => ({ url: "/wallet/wallets", method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerWallets(response),
      providesTags: ["IssuerDashboard"],
    }),
    getIssuerWalletHoldings: build.query<IssuerWalletHolding[], void>({
      query: () => ({ url: "/wallet/holdings", method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerWalletHoldings(response),
      providesTags: ["IssuerDashboard"],
    }),
    getIssuerWalletTransactions: build.query<IssuerWalletTransaction[], void>({
      query: () => ({ url: "/wallet/transactions", method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerWalletTransactions(response),
      providesTags: ["IssuerDashboard"],
    }),
    depositIssuerFunds: build.mutation<{ success: boolean }, WalletAmountDto>({
      query: (body) => ({
        url: "/wallet/deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IssuerDashboard"],
    }),
    withdrawIssuerFunds: build.mutation<{ success: boolean }, WalletAmountDto>({
      query: (body) => ({
        url: "/wallet/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IssuerDashboard"],
    }),
    transferIssuerFunds: build.mutation<{ success: boolean }, WalletTransferDto>({
      query: (body) => ({
        url: "/wallet/transfer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IssuerDashboard"],
    }),
    connectIssuerWallet: build.mutation<{ success: boolean }, ConnectIssuerWalletDto>({
      query: (body) => ({
        url: "/investor/wallet/connect",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IssuerDashboard"],
    }),
  }),
});

export const {
  useGetIssuerWalletSummaryQuery,
  useGetIssuerWalletsQuery,
  useGetIssuerWalletHoldingsQuery,
  useGetIssuerWalletTransactionsQuery,
  useDepositIssuerFundsMutation,
  useWithdrawIssuerFundsMutation,
  useTransferIssuerFundsMutation,
  useConnectIssuerWalletMutation,
} = issuerWalletApi;
