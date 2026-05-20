import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api/baseApi";
import "./api/authApi";
import "./api/uploadApi";
import "./api/assetsApi";
import "./api/onboardingApi";
import "./api/issuerDocumentsApi";
import "./api/issuerDashboardApi";
import "./api/investorDashboardApi";
import "./api/investorDocumentsApi";
import "./api/investorHoldingsApi";
import "./api/investorHubAnalyticsApi";
import "./api/investorHubDistributionsApi";
import "./api/investorHubInvestmentDocumentsApi";
import "./api/investorHubOverviewApi";
import "./api/issuerHubApi";
import "./api/portfolioApi";
import "./api/yieldApi";
import "./api/investorMarketplaceApi";
import "./api/secondaryMarketApi";
import "./api/investorWalletApi";
import "./api/issuerWalletApi";

export function makeStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
