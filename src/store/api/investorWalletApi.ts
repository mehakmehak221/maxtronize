import { pickNumber, pickString, unwrapList, unwrapPayload } from "@/lib/apiParse";
import { formatCompactCurrency } from "@/lib/issuerDashboard";
import { baseApi } from "./baseApi";

export interface InvestorWalletAmountDto {
  amount: number;
  currency?: string;
}

export interface InvestorWalletTransferDto {
  amount: number;
  recipientAddress: string;
  currency?: string;
}

export interface ConnectInvestorWalletDto {
  address: string;
  network: string;
  name?: string;
}

export interface InvestorWalletSummary {
  totalValue: number;
  currency: string;
  monthlyChangeAmount: number;
  monthlyChangePercent: number;
  walletCount: number;
  holdingCount: number;
}

export interface InvestorWalletItem {
  id: string;
  name: string;
  network: string;
  address: string;
  balance: string;
  connected: boolean;
}

export interface InvestorWalletHolding {
  ticker: string;
  name: string;
  value: string;
  change: string;
  up: boolean;
  color: string;
  pct: number;
}

export interface InvestorWalletTransaction {
  id: string;
  label: string;
  amount: string;
  time: string;
  variant: "deposit" | "yield" | "withdraw";
  status?: string;
}

export interface InvestorWalletInitData {
  summary: InvestorWalletSummary;
  wallets: InvestorWalletItem[];
  holdings: InvestorWalletHolding[];
  transactions: InvestorWalletTransaction[];
}

const HOLDING_COLORS = [
  "bg-violet-600",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function formatAmountLabel(value: number | null, currency = "USD", sign = "") {
  if (value == null || Number.isNaN(value)) return "—";
  return `${sign}${formatCompactCurrency(Math.abs(value), currency)}`;
}

function formatPercentLabel(value: number | null) {
  if (value == null || Number.isNaN(value)) return "0.0%";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

function getRecord(payload: unknown): Record<string, unknown> | null {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) return null;
  return root as Record<string, unknown>;
}

function parseInvestorWalletSummary(payload: unknown): InvestorWalletSummary {
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
      pickNumber(summary, ["walletCount", "connectedWallets", "walletsCount"]) ??
      0,
    holdingCount:
      pickNumber(summary, ["holdingCount", "tokenPositions", "holdingsCount"]) ??
      0,
  };
}

function parseInvestorWallets(payload: unknown): InvestorWalletItem[] {
  const root = getRecord(payload);
  const walletsRaw =
    root?.wallets ?? root?.connectedWallets ?? root?.items ?? root?.data ?? payload;
  return unwrapList(walletsRaw).map((item, index) => {
    const currency = pickString(item, ["currency"]) ?? "USD";
    const balanceAmount =
      pickNumber(item, ["balanceAmount", "balance", "value", "amount"]) ?? 0;
    const status = pickString(item, ["status"]);
    return {
      id: pickString(item, ["id", "_id", "walletId"]) ?? `wallet-${index}`,
      name:
        pickString(item, ["name", "walletName", "label"]) ??
        `Wallet ${index + 1}`,
      network: pickString(item, ["network", "chain", "blockchainNetwork"]) ?? "Ethereum",
      address: pickString(item, ["address", "walletAddress"]) ?? "",
      balance:
        pickString(item, ["balanceFormatted", "balanceLabel", "valueFormatted"]) ??
        formatCompactCurrency(balanceAmount, currency),
      connected:
        item.connected === true ||
        item.isConnected === true ||
        status === "CONNECTED" ||
        status === "ACTIVE",
    };
  });
}

function parseInvestorWalletHoldings(payload: unknown): InvestorWalletHolding[] {
  const root = getRecord(payload);
  const holdingsRaw =
    root?.holdings ?? root?.positions ?? root?.items ?? root?.data ?? payload;
  return unwrapList(holdingsRaw).map((item, index) => {
    const currency = pickString(item, ["currency"]) ?? "USD";
    const valueAmount =
      pickNumber(item, ["value", "positionValue", "marketValue", "amount"]) ?? 0;
    const changePercent =
      pickNumber(item, ["changePercent", "priceChangePercent", "performancePercent"]) ?? 0;
    const allocationPercent =
      pickNumber(item, ["allocationPercent", "weightPercent", "pct", "percent"]) ?? 0;
    return {
      ticker: pickString(item, ["ticker", "symbol", "tokenSymbol"]) ?? "TOK",
      name: pickString(item, ["name", "assetName", "tokenName"]) ?? "Token Position",
      value:
        pickString(item, ["valueFormatted", "positionValueFormatted"]) ??
        formatCompactCurrency(valueAmount, currency),
      change:
        pickString(item, ["changeLabel", "performanceLabel"]) ??
        formatPercentLabel(changePercent),
      up: changePercent >= 0,
      color: HOLDING_COLORS[index % HOLDING_COLORS.length],
      pct: allocationPercent,
    };
  });
}

function parseInvestorWalletTransactions(payload: unknown): InvestorWalletTransaction[] {
  const root = getRecord(payload);
  const transactionsRaw =
    root?.transactions ?? root?.items ?? root?.data ?? payload;
  return unwrapList(transactionsRaw).map((item, index) => {
    const currency = pickString(item, ["currency"]) ?? "USD";
    const amountValue = pickNumber(item, ["amount", "value"]) ?? 0;
    const direction = pickString(item, ["direction", "side", "type"])?.toLowerCase() ?? "";
    const variant =
      direction.includes("withdraw")
        ? "withdraw"
        : direction.includes("yield") || direction.includes("distribution")
          ? "yield"
          : "deposit";
    const signedAmount =
      pickString(item, ["amountFormatted", "amountLabel", "valueFormatted"]) ??
      formatAmountLabel(
        amountValue,
        currency,
        variant === "withdraw" ? "-" : "+",
      );
    return {
      id: pickString(item, ["id", "_id", "transactionId"]) ?? `txn-${index}`,
      label:
        pickString(item, ["label", "title", "description", "type"]) ??
        "Wallet transaction",
      amount: signedAmount,
      time:
        pickString(item, ["time", "dateLabel", "createdAt", "created_at", "timestamp"]) ??
        "Recently",
      variant,
      status: pickString(item, ["status"]) ?? undefined,
    };
  });
}

function parseInvestorWalletInit(payload: unknown): InvestorWalletInitData {
  const root = getRecord(payload) ?? {};
  return {
    summary: parseInvestorWalletSummary(root.summary ?? root),
    wallets: parseInvestorWallets(root.wallets ?? root.connectedWallets ?? []),
    holdings: parseInvestorWalletHoldings(root.holdings ?? root.positions ?? []),
    transactions: parseInvestorWalletTransactions(root.transactions ?? root.activity ?? []),
  };
}

export const investorWalletApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorWalletInit: build.query<InvestorWalletInitData, void>({
      query: () => ({ url: "/investor/wallet/init", method: "GET" }),
      transformResponse: (response: unknown) => parseInvestorWalletInit(response),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWalletSummary: build.query<InvestorWalletSummary, void>({
      query: () => ({ url: "/investor/wallet/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorWalletSummary(response),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWallets: build.query<InvestorWalletItem[], void>({
      query: () => ({ url: "/investor/wallet/wallets", method: "GET" }),
      transformResponse: (response: unknown) => parseInvestorWallets(response),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWalletHoldings: build.query<InvestorWalletHolding[], void>({
      query: () => ({ url: "/investor/wallet/holdings", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorWalletHoldings(response),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWalletTransactions: build.query<InvestorWalletTransaction[], void>({
      query: () => ({ url: "/investor/wallet/transactions", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseInvestorWalletTransactions(response),
      providesTags: ["InvestorDashboard"],
    }),
    connectInvestorWallet: build.mutation<{ success: boolean }, ConnectInvestorWalletDto>({
      query: (body) => ({
        url: "/investor/wallet/connect",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InvestorDashboard"],
    }),
    depositInvestorFunds: build.mutation<{ success: boolean }, InvestorWalletAmountDto>({
      query: (body) => ({
        url: "/investor/wallet/deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InvestorDashboard"],
    }),
    withdrawInvestorFunds: build.mutation<{ success: boolean }, InvestorWalletAmountDto>({
      query: (body) => ({
        url: "/investor/wallet/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InvestorDashboard"],
    }),
    transferInvestorFunds: build.mutation<{ success: boolean }, InvestorWalletTransferDto>({
      query: (body) => ({
        url: "/investor/wallet/transfer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InvestorDashboard"],
    }),
  }),
});

export const {
  useGetInvestorWalletInitQuery,
  useGetInvestorWalletSummaryQuery,
  useGetInvestorWalletsQuery,
  useGetInvestorWalletHoldingsQuery,
  useGetInvestorWalletTransactionsQuery,
  useConnectInvestorWalletMutation,
  useDepositInvestorFundsMutation,
  useWithdrawInvestorFundsMutation,
  useTransferInvestorFundsMutation,
} = investorWalletApi;
