import { pickNumber, pickString } from "@/lib/apiParse";

// ── Types ─────────────────────────────────────────────────────────────────────

export type InvestorHubTab = {
  key: string;
  label: string;
  count: number | null;
  badge: string | null;
};

export type InvestorHubTabsMeta = {
  paidDistributions: number;
  activeInvestments: number;
};

export type InvestorHubTabsResult = {
  tabs: InvestorHubTab[];
  meta: InvestorHubTabsMeta;
};

// ── Parser ────────────────────────────────────────────────────────────────────

export function parseInvestorHubTabs(payload: unknown): InvestorHubTabsResult {
  if (!payload || typeof payload !== "object") {
    return {
      tabs: [],
      meta: { paidDistributions: 0, activeInvestments: 0 },
    };
  }

  const root = payload as Record<string, unknown>;

  const tabs: InvestorHubTab[] = Array.isArray(root.tabs)
    ? root.tabs
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        )
        .map((item) => ({
          key: pickString(item, ["key"]) ?? "",
          label: pickString(item, ["label"]) ?? "",
          count: pickNumber(item, ["count"]) ?? null,
          badge: pickString(item, ["badge"]) ?? null,
        }))
        .filter((t) => t.key)
    : [];

  const metaRaw =
    root.meta && typeof root.meta === "object"
      ? (root.meta as Record<string, unknown>)
      : {};

  return {
    tabs,
    meta: {
      paidDistributions:
        pickNumber(metaRaw, ["paidDistributions", "paid_distributions"]) ?? 0,
      activeInvestments:
        pickNumber(metaRaw, ["activeInvestments", "active_investments"]) ?? 0,
    },
  };
}
