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

export const investorWalletApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorWalletInit: build.query<InvestorWalletInitData, void>({
      query: () => ({ url: "/investor/wallet/init", method: "GET" }),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWalletSummary: build.query<InvestorWalletSummary, void>({
      query: () => ({ url: "/investor/wallet/summary", method: "GET" }),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWallets: build.query<InvestorWalletItem[], void>({
      query: () => ({ url: "/investor/wallet/wallets", method: "GET" }),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWalletHoldings: build.query<InvestorWalletHolding[], void>({
      query: () => ({ url: "/investor/wallet/holdings", method: "GET" }),
      providesTags: ["InvestorDashboard"],
    }),
    getInvestorWalletTransactions: build.query<InvestorWalletTransaction[], void>({
      query: () => ({ url: "/investor/wallet/transactions", method: "GET" }),
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
