import { baseApi } from "./baseApi";

export interface WalletAmountDto {
  amount: number;
  currency?: string;
}

export interface WalletTransferDto {
  amount: number;
  recipientAddress: string;
  currency?: string;
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

export const issuerWalletApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getIssuerWalletSummary: build.query<IssuerWalletSummary, void>({
      query: () => ({ url: "/wallet/summary", method: "GET" }),
      providesTags: ["IssuerDashboard"],
    }),
    getIssuerWallets: build.query<IssuerWalletItem[], void>({
      query: () => ({ url: "/wallet/wallets", method: "GET" }),
      providesTags: ["IssuerDashboard"],
    }),
    getIssuerWalletHoldings: build.query<IssuerWalletHolding[], void>({
      query: () => ({ url: "/wallet/holdings", method: "GET" }),
      providesTags: ["IssuerDashboard"],
    }),
    getIssuerWalletTransactions: build.query<IssuerWalletTransaction[], void>({
      query: () => ({ url: "/wallet/transactions", method: "GET" }),
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
} = issuerWalletApi;
